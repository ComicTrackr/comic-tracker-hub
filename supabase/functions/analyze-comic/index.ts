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
      prompt = `You are a comic book expert specializing in eBay market analysis. For this comic cover image, provide a detailed analysis focusing EXCLUSIVELY on eBay's recently sold listings from the last 30 days:

      1. The exact title and issue number
      2. Current market values based ONLY on eBay completed sales from the last 30 days:
         - For CGC 9.8 copies: Calculate the average price from the last 3-5 actual CGC 9.8 sales on eBay. If no 9.8 sales exist, use 9.6 and add 20% to estimate 9.8 value
         - For ungraded Near Mint copies: Calculate the average price from the last 3-5 actual raw copy sales on eBay in NM condition
      3. List the 3 most recent graded sales with their grades and prices
      4. List the 3 most recent ungraded sales with their stated conditions and prices
      
      IMPORTANT GUIDELINES:
      - Only use actual eBay completed sales from the last 30 days
      - For CGC 9.8: If insufficient recent 9.8 sales exist, use next highest grade and add 20-30% premium
      - For raw copies, only consider listings that specifically mention Near Mint or NM condition
      - Exclude outlier prices that are significantly higher or lower than the average
      - CGC 9.8 values should typically be 2-3x higher than raw NM copies
      - For modern comics (last 5 years), focus on the most recent sales as prices can fluctuate rapidly
      
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      GradedValue: [Average price of recent CGC 9.8 sales on eBay, should be 2-3x higher than ungraded]
      UngradedValue: [Average price of recent NM raw copy sales on eBay]
      RecentGradedSales: [List 3 most recent graded sales with date, grade, and price]
      RecentUngradedSales: [List 3 most recent ungraded sales with date, condition, and price]
      Analysis: [Market trends and value justification]`

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
      prompt = `You are a comic book expert specializing in eBay market analysis. For the comic "${searchQuery}", provide a detailed analysis focusing EXCLUSIVELY on eBay's recently sold listings from the last 30 days:

      1. The exact title and issue number
      2. Current market values based ONLY on eBay completed sales from the last 30 days:
         - For CGC 9.8 copies: Calculate the average price from the last 3-5 actual CGC 9.8 sales on eBay. If no 9.8 sales exist, use 9.6 and add 20% to estimate 9.8 value
         - For ungraded Near Mint copies: Calculate the average price from the last 3-5 actual raw copy sales on eBay in NM condition
      3. List the 3 most recent graded sales with their grades and prices
      4. List the 3 most recent ungraded sales with their stated conditions and prices
      
      IMPORTANT GUIDELINES:
      - Only use actual eBay completed sales from the last 30 days
      - For CGC 9.8: If insufficient recent 9.8 sales exist, use next highest grade and add 20-30% premium
      - For raw copies, only consider listings that specifically mention Near Mint or NM condition
      - Exclude outlier prices that are significantly higher or lower than the average
      - CGC 9.8 values should typically be 2-3x higher than raw NM copies
      - For modern comics (last 5 years), focus on the most recent sales as prices can fluctuate rapidly
      
      Format your response exactly like this:
      Title: [Comic Title and Issue Number]
      GradedValue: [Average price of recent CGC 9.8 sales on eBay, should be 2-3x higher than ungraded]
      UngradedValue: [Average price of recent NM raw copy sales on eBay]
      RecentGradedSales: [List 3 most recent graded sales with date, grade, and price]
      RecentUngradedSales: [List 3 most recent ungraded sales with date, condition, and price]
      Analysis: [Market trends and value justification]`

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
    const recentGradedSalesMatch = text.match(/RecentGradedSales:\s*(.+?)(?=\n(?:[A-Za-z]+:|$))/is)
    const recentUngradedSalesMatch = text.match(/RecentUngradedSales:\s*(.+?)(?=\n(?:[A-Za-z]+:|$))/is)
    const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/is)

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
      graded_value: finalGradedValue,
      ungraded_value: ungradedValue,
      recent_graded_sales: recentGradedSalesMatch ? recentGradedSalesMatch[1].trim() : '',
      recent_ungraded_sales: recentUngradedSalesMatch ? recentUngradedSalesMatch[1].trim() : '',
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