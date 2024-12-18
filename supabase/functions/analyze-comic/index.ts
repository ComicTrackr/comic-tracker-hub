import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function processBase64Image(base64Image: string): string {
  // Remove data URL prefix if present
  const base64Data = base64Image.includes(',') ? 
    base64Image.split(',')[1] : 
    base64Image;
  
  return base64Data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, searchQuery } = await req.json()
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    let prompt, result

    if (image) {
      // Image-based analysis
      prompt = `You are a comic book expert and appraiser. Analyze this comic book cover image and provide:
      1. The exact title of the comic book
      2. A condition rating on a scale of 1-10
      3. An estimated market value in USD based on current market data
      4. A brief analysis of notable features or details that affect its value
      Format your response like this:
      Title: [Comic Title]
      Condition: [1-10]
      Value: [USD amount]
      Analysis: [Your detailed analysis]`

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
      prompt = `You are a comic book expert and appraiser. For the comic "${searchQuery}", provide:
      1. The exact title of the comic book
      2. A condition rating on a scale of 1-10 (assume near mint condition)
      3. An estimated market value in USD based on current market data
      4. A brief analysis of notable features or details that affect its value
      Format your response like this:
      Title: [Comic Title]
      Condition: [1-10]
      Value: [USD amount]
      Analysis: [Your detailed analysis]`

      result = await model.generateContent(prompt)
    } else {
      throw new Error('Either image or searchQuery must be provided')
    }

    const response = await result.response
    const text = response.text()

    // Parse the structured response
    const titleMatch = text.match(/Title:\s*(.+?)(?=\n|$)/i)
    const conditionMatch = text.match(/Condition:\s*(\d+)/i)
    const valueMatch = text.match(/Value:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/i)

    const analysis = {
      comic_title: titleMatch ? titleMatch[1].trim() : searchQuery,
      condition_rating: conditionMatch ? conditionMatch[1] : "9",
      estimated_value: valueMatch 
        ? parseFloat(valueMatch[1].replace(/,/g, ''))
        : 100,
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