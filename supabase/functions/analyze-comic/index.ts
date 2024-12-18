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
    const { image, title } = await req.json()

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    const prompt = `Analyze this comic book cover image. Please provide:
    1. A brief description of the cover
    2. An estimated condition rating (from 1-10)
    3. An estimated market value range in USD based on the visible condition
    4. Any notable features or details that could affect its value
    Title of the comic: ${title}`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(',')[1]
        }
      }
    ])

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