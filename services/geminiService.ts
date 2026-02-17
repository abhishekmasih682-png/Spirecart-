import { GoogleGenAI, Type } from "@google/genai";
import { Product, CategoryType } from "../types";
import { MOCK_PRODUCTS } from "../constants";

// Helper to find actual product objects from IDs returned by AI
const findProductsByIds = (ids: string[]): Product[] => {
  return MOCK_PRODUCTS.filter(p => ids.includes(p.id));
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getShoppingRecommendations = async (userQuery: string): Promise<{ text: string, products: Product[], groundingLinks?: {title: string, uri: string}[] }> => {
  try {
    const productCatalog = MOCK_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description
    }));

    const systemPrompt = `
      You are an expert shopping assistant for Spirecart, a super-app in India that sells everything from food to electronics.
      You have access to a catalog of products and Google Maps data.
      
      1. If the user asks about products, recommend from the catalog.
      2. If the user asks about location (e.g., "restaurants near me", "pharmacy nearby"), use the googleMaps tool to provide real-world suggestions.
      
      Return a helpful message explaining your choices, and a list of product IDs from the catalog if relevant.
      
      Catalog Summary: ${JSON.stringify(productCatalog)}
    `;

    // We use gemini-2.5-flash for Maps Grounding support
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleMaps: {} }], // Enable Maps Grounding
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "A helpful, friendly response to the user. If using maps, summarize the locations found.",
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of product IDs from the catalog that are relevant to the query.",
            },
          },
          required: ["message", "recommendedProductIds"],
        },
      },
    });

    const jsonText = response.text || "{}";
    let data;
    try {
        data = JSON.parse(jsonText);
    } catch(e) {
        data = { message: response.text, recommendedProductIds: [] };
    }

    // Extract grounding chunks for Maps if available
    let groundingLinks: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        chunks.forEach(chunk => {
            if (chunk.web?.uri && chunk.web?.title) {
                 groundingLinks.push({ title: chunk.web.title, uri: chunk.web.uri });
            }
        });
    }

    return {
      text: data.message,
      products: findProductsByIds(data.recommendedProductIds || []),
      groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined
    };

  } catch (error) {
    console.error("AI Error:", error);
    return {
      text: "I can help you browse our products or find stores nearby. Try asking for 'Biryani' or 'Pharmacies near me'.",
      products: []
    };
  }
};

// New function using Flash Lite for low latency
export const getFastProductSummary = async (productName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `Write a 1-sentence catchy sales summary for: ${productName}. Keep it under 15 words.`,
            config: {
                maxOutputTokens: 50,
                temperature: 0.7
            }
        });
        return response.text || "Check out this amazing product!";
    } catch (e) {
        return "Top quality product available now.";
    }
}
