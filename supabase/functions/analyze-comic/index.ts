import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { initializeGemini, getAnalysisPrompt, getCoverImagePrompt } from "./geminiService.ts"
import { parseGeminiResponse } from "./responseParser.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function processBase64Image(base64Image: string): string {
  return base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, searchQuery } = await req.json()
    const model = initializeGemini()

    let result, coverImageResult;

    if (image) {
      console.log('Processing image...');
      const processedImage = processBase64Image(image);
      console.log('Image processed, attempting analysis...');
      
      result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: getAnalysisPrompt() },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: processedImage
              }
            }
          ]
        }]
      });

      if (searchQuery) {
        coverImageResult = await model.generateContent(getCoverImagePrompt(searchQuery));
      }
      
      console.log('Analysis completed successfully');
    } else {
      throw new Error('Image must be provided')
    }

    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini response:', text);

    const coverImageUrl = coverImageResult ? 
      coverImageResult.response.text().trim() : 
      null;

    const analysis = parseGeminiResponse(text, coverImageUrl);
    console.log('Final analysis object:', analysis);

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})