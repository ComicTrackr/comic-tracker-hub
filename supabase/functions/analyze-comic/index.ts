import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

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
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    let prompt, result

    if (image) {
      prompt = `You are a comic book expert and market analyst. For this comic cover image, provide:
      1. The exact title and issue number
      2. Recent market value data (average selling price in USD)
      3. Key issue information or significant details about this specific issue
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      BaseValue: [USD amount based on recent sales]
      Analysis: [Key issue status, significant events, or notable features of this specific issue]`

      try {
        console.log('Processing image...');
        const processedImage = processBase64Image(image);
        console.log('Image processed, attempting analysis...');
        
        result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: processedImage
                }
              }
            ]
          }]
        });
        
        console.log('Analysis completed successfully');
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        throw new Error('Failed to process image: ' + imageError.message);
      }
    } else if (searchQuery) {
      prompt = `You are a comic book expert and market analyst. For the comic "${searchQuery}", provide:
      1. The exact title and issue number
      2. Recent market value data (average selling price in USD)
      3. Key issue information or significant details about this specific issue
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      BaseValue: [USD amount based on recent sales]
      Analysis: [Key issue status, significant events, or notable features of this specific issue]`

      result = await model.generateContent(prompt)
    } else {
      throw new Error('Either image or searchQuery must be provided')
    }

    const response = await result.response
    const text = response.text()

    // Parse the structured response
    const titleMatch = text.match(/Title:\s*(.+?)(?=\n|$)/i)
    const baseValueMatch = text.match(/BaseValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/i)

    const baseValue = baseValueMatch ? 
      parseFloat(baseValueMatch[1].replace(/,/g, '')) : 
      100

    const analysis = {
      comic_title: titleMatch ? titleMatch[1].trim() : searchQuery,
      condition_rating: "N/A", // We're no longer providing condition ratings
      estimated_value: baseValue,
      analysis_text: analysisMatch ? analysisMatch[1].trim() : text
    }

    console.log('Analysis completed:', analysis)

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