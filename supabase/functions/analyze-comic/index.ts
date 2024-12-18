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
      prompt = `You are a comic book expert specializing in eBay market analysis. For this comic cover image, provide a detailed analysis focusing EXCLUSIVELY on eBay's recently sold listings from the last 30 days.

      Format your response EXACTLY like this, including the exact labels and maintaining the structure:

      Title: [Comic Title and Issue Number]
      GradedValue: [Numeric value only, e.g. 150]
      UngradedValue: [Numeric value only, e.g. 50]
      RecentGradedSales: Highest: [Grade] $[Price] | Lowest: [Grade] $[Price]
      RecentUngradedSales: Highest: [Condition] $[Price] | Lowest: [Condition] $[Price]
      Analysis: [2-3 sentences about market trends]

      Guidelines:
      - For GradedValue: Use average CGC 9.8 price. If no 9.8s, use 9.6 price + 20%
      - For UngradedValue: Use average NM raw copy price
      - Only use actual eBay completed sales from last 30 days
      - Values must be numbers only, no text or symbols
      - Sales ranges must follow the exact format shown above
      - If no sales data available, use "No recent sales data" for that category`

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
      prompt = `You are a comic book expert specializing in eBay market analysis. For the comic "${searchQuery}", provide a detailed analysis focusing EXCLUSIVELY on eBay's recently sold listings from the last 30 days.

      Format your response EXACTLY like this, including the exact labels and maintaining the structure:

      Title: [Comic Title and Issue Number]
      GradedValue: [Numeric value only, e.g. 150]
      UngradedValue: [Numeric value only, e.g. 50]
      RecentGradedSales: Highest: [Grade] $[Price] | Lowest: [Grade] $[Price]
      RecentUngradedSales: Highest: [Condition] $[Price] | Lowest: [Condition] $[Price]
      Analysis: [2-3 sentences about market trends]

      Guidelines:
      - For GradedValue: Use average CGC 9.8 price. If no 9.8s, use 9.6 price + 20%
      - For UngradedValue: Use average NM raw copy price
      - Only use actual eBay completed sales from last 30 days
      - Values must be numbers only, no text or symbols
      - Sales ranges must follow the exact format shown above
      - If no sales data available, use "No recent sales data" for that category`

      result = await model.generateContent(prompt)
    } else {
      throw new Error('Either image or searchQuery must be provided')
    }

    const response = await result.response
    const text = response.text()
    console.log('Raw Gemini response:', text);

    // Parse the structured response with more robust regex patterns
    const titleMatch = text.match(/Title:\s*(.+?)(?=\n|$)/i)
    const gradedValueMatch = text.match(/GradedValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const ungradedValueMatch = text.match(/UngradedValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    const recentGradedSalesMatch = text.match(/RecentGradedSales:\s*(.+?)(?=\n(?:[A-Za-z]+:|$))/is)
    const recentUngradedSalesMatch = text.match(/RecentUngradedSales:\s*(.+?)(?=\n(?:[A-Za-z]+:|$))/is)
    const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/is)

    console.log('Parsed matches:', {
      titleMatch,
      gradedValueMatch,
      ungradedValueMatch,
      recentGradedSalesMatch,
      recentUngradedSalesMatch,
      analysisMatch
    });

    // Parse numeric values with fallbacks
    const gradedValue = gradedValueMatch ? 
      parseFloat(gradedValueMatch[1].replace(/,/g, '')) : 
      0

    const ungradedValue = ungradedValueMatch ? 
      parseFloat(ungradedValueMatch[1].replace(/,/g, '')) : 
      0

    // Ensure graded value is at least 2x the ungraded value
    const finalGradedValue = Math.max(gradedValue, ungradedValue * 2);

    const analysis = {
      comic_title: titleMatch ? titleMatch[1].trim() : searchQuery,
      graded_value: finalGradedValue || 0,
      ungraded_value: ungradedValue || 0,
      recent_graded_sales: recentGradedSalesMatch ? 
        recentGradedSalesMatch[1].trim() : 
        'No recent graded sales data',
      recent_ungraded_sales: recentUngradedSalesMatch ? 
        recentUngradedSalesMatch[1].trim() : 
        'No recent ungraded sales data',
      analysis_text: analysisMatch ? 
        analysisMatch[1].trim() : 
        'Analysis not available'
    }

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