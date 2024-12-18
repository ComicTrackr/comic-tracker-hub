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
      prompt = `You are a comic book expert and market analyst with access to current market data. For this comic cover image, provide:
      1. The exact title and issue number
      2. Current market value data based on recent eBay sales and market trends:
         - For CGC 9.8 copies: Use actual recent sales data, focusing on the last 3-6 months
         - For ungraded Near Mint copies: Use actual raw copy sales data from the last 3-6 months
      3. Key issue information or significant details about this specific issue
      
      Be conservative with valuations and base them strictly on verifiable recent sales data.
      If this is a modern comic (published in the last 5 years), be especially careful not to overvalue it.
      
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      GradedValue: [USD amount for CGC 9.8 based on recent sales]
      UngradedValue: [USD amount for raw Near Mint based on recent sales]
      Analysis: [Key issue status, significant events, market trends, and price justification based on recent sales data]`

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
      prompt = `You are a comic book expert and market analyst with access to current market data. For the comic "${searchQuery}", provide:
      1. The exact title and issue number
      2. Current market value data based on recent eBay sales and market trends:
         - For CGC 9.8 copies: Use actual recent sales data, focusing on the last 3-6 months
         - For ungraded Near Mint copies: Use actual raw copy sales data from the last 3-6 months
      3. Key issue information or significant details about this specific issue
      
      Be conservative with valuations and base them strictly on verifiable recent sales data.
      If this is a modern comic (published in the last 5 years), be especially careful not to overvalue it.
      
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      GradedValue: [USD amount for CGC 9.8 based on recent sales]
      UngradedValue: [USD amount for raw Near Mint based on recent sales]
      Analysis: [Key issue status, significant events, market trends, and price justification based on recent sales data]`

      result = await model.generateContent(prompt)
    } else {
      throw new Error('Either image or searchQuery must be provided')
    }

    const response = await result.response
    const text = response.text()

    // Parse the structured response
    const titleMatch = text.match(/Title:\s*(.+?)(?=\n|$)/i)
    const gradedValueMatch = text.match(/GradedValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const ungradedValueMatch = text.match(/UngradedValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/i)

    const gradedValue = gradedValueMatch ? 
      parseFloat(gradedValueMatch[1].replace(/,/g, '')) : 
      0

    const ungradedValue = ungradedValueMatch ? 
      parseFloat(ungradedValueMatch[1].replace(/,/g, '')) : 
      0

    const analysis = {
      comic_title: titleMatch ? titleMatch[1].trim() : searchQuery,
      graded_value: gradedValue,
      ungraded_value: ungradedValue,
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