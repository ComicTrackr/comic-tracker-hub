import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function processBase64Image(base64Image: string): string {
  return base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
}

function calculateValue(condition: number, rarity: string, baseValue: number): number {
  // Condition multiplier (1-10 scale)
  const conditionMultiplier = condition / 5;

  // Rarity multiplier
  const rarityMultipliers: { [key: string]: number } = {
    'common': 1,
    'uncommon': 1.5,
    'rare': 3,
    'very rare': 5,
    'ultra rare': 10,
    'grail': 20
  };

  const rarityMultiplier = rarityMultipliers[rarity.toLowerCase()] || 1;

  // Calculate final value
  let finalValue = baseValue * conditionMultiplier * rarityMultiplier;

  // Round to nearest dollar
  return Math.round(finalValue);
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
      prompt = `You are a comic book expert and appraiser. Analyze this comic book cover image and provide:
      1. The exact title and issue number of the comic book
      2. A condition rating on a scale of 1-10 (be very critical and precise)
      3. The rarity level (common, uncommon, rare, very rare, ultra rare, or grail)
      4. A base market value in USD for this issue in average condition
      5. A brief analysis of notable features, significance, or historical context
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      Condition: [1-10]
      Rarity: [Rarity Level]
      BaseValue: [USD amount]
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
      1. The exact title and issue number
      2. A condition rating of 9 (assuming near mint)
      3. The rarity level (common, uncommon, rare, very rare, ultra rare, or grail)
      4. A base market value in USD for this issue in average condition
      5. A brief analysis of notable features, significance, or historical context
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      Condition: [9]
      Rarity: [Rarity Level]
      BaseValue: [USD amount]
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
    const rarityMatch = text.match(/Rarity:\s*(.+?)(?=\n|$)/i)
    const baseValueMatch = text.match(/BaseValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/i)

    // Extract values
    const condition = conditionMatch ? parseInt(conditionMatch[1]) : 9
    const rarity = rarityMatch ? rarityMatch[1].trim() : 'common'
    const baseValue = baseValueMatch ? 
      parseFloat(baseValueMatch[1].replace(/,/g, '')) : 
      100

    // Calculate final estimated value
    const estimatedValue = calculateValue(condition, rarity, baseValue)

    const analysis = {
      comic_title: titleMatch ? titleMatch[1].trim() : searchQuery,
      condition_rating: condition.toString(),
      estimated_value: estimatedValue,
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