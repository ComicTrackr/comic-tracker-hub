import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, title, searchQuery } = await req.json()

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })
    const textModel = genAI.getGenerativeModel({ model: "gemini-pro" })

    let prompt, result

    if (image) {
      // Handle image-based analysis
      prompt = `Analyze this comic book cover image. Please provide:
      1. A brief description of the cover
      2. An estimated condition rating (from 1-10)
      3. Research and provide the current market value range in USD. Be specific about different conditions and editions if relevant.
      4. Any notable features or details that could affect its value
      Title of the comic: ${title}`

      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image.split(',')[1]
          }
        }
      ])
    } else if (searchQuery) {
      // Handle text-based search
      prompt = `Research the following comic book and provide:
      1. Title and key publication details
      2. Current market value ranges in USD for different conditions
      3. Any notable features or variants that affect value
      4. Recent sales data or trends if available
      Comic to research: ${searchQuery}`

      result = await textModel.generateContent(prompt)
    } else {
      throw new Error('Either image or searchQuery must be provided')
    }

    const response = await result.response
    const text = response.text()

    // Parse the response to extract structured data
    const conditionMatch = text.match(/rating.*?(\d+)/i)
    const valueMatch = text.match(/\$\s*(\d+(?:,\d+)?(?:\.\d+)?)/g)

    const analysis = {
      text: text,
      condition_rating: conditionMatch ? conditionMatch[1] : null,
      estimated_value: valueMatch ? parseFloat(valueMatch[0].replace(/[$,]/g, '')) : null
    }

    console.log('Analysis completed:', analysis)

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})