import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function resizeImage(base64Image: string): Promise<Uint8Array> {
  // Create an image element
  const img = new Image()
  img.src = base64Image
  
  await new Promise((resolve) => {
    img.onload = resolve
  })

  // Create a canvas and get its context
  const canvas = new OffscreenCanvas(800, 800)
  const ctx = canvas.getContext('2d')

  // Calculate new dimensions maintaining aspect ratio
  let width = img.width
  let height = img.height
  const maxDimension = 800

  if (width > height && width > maxDimension) {
    height = (height * maxDimension) / width
    width = maxDimension
  } else if (height > maxDimension) {
    width = (width * maxDimension) / height
    height = maxDimension
  }

  // Set canvas dimensions and draw resized image
  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)

  // Convert to blob and then to Uint8Array
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
  const arrayBuffer = await blob.arrayBuffer()
  return new Uint8Array(arrayBuffer)
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
        // Resize the image before processing
        const resizedImageData = await resizeImage(image)
        console.log('Image resized successfully, size:', resizedImageData.length)

        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: resizedImageData
            }
          }
        ])
      } catch (imageError) {
        console.error('Error processing image:', imageError)
        throw new Error('Failed to process image: ' + imageError.message)
      }
    } else if (searchQuery) {
      // Text-based search
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