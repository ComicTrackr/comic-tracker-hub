import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

export const initializeGemini = () => {
  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
};

export const getAnalysisPrompt = () => {
  return `You are a comic book expert specializing in eBay market analysis. For this comic cover image, provide a detailed analysis focusing EXCLUSIVELY on eBay's recently sold listings from the last 30 days.

  Format your response EXACTLY like this, including the exact labels and maintaining the structure:

  Title: [Comic Title and Issue Number]
  GradedValue: [Numeric value only, e.g. 150]
  UngradedValue: [Numeric value only, e.g. 50]
  RecentGradedSales: Highest: [Grade] $[Price] | Lowest: [Grade] $[Price]
  RecentUngradedSales: Highest: [Condition] $[Price] | Lowest: [Condition] $[Price]
  Analysis: [2-3 sentences about market trends]
  CoverImage: [Direct URL to high-quality comic cover image, must end with .jpg, .jpeg, .png, or .webp]

  Guidelines:
  - For GradedValue: Use average CGC 9.8 price. If no 9.8s, use 9.6 price + 20%
  - For UngradedValue: Use average NM raw copy price
  - Only use actual eBay completed sales from last 30 days
  - Values must be numbers only, no text or symbols
  - Sales ranges must follow the exact format shown above
  - CoverImage must be a direct URL to the comic cover image
  - If no sales data available, use "No recent sales data" for that category`;
};

export const getCoverImagePrompt = (searchQuery: string) => {
  return `You are a comic book expert. For the comic "${searchQuery}", provide ONLY a direct URL to a high-quality cover image of this exact comic book issue. The URL must end with .jpg, .jpeg, .png, or .webp and must be from a reputable comic book website or image hosting service. The image should clearly show the cover of this specific comic issue. Respond with ONLY the URL, nothing else. If you cannot find a specific URL for this exact comic issue, respond with "No image found".`;
};