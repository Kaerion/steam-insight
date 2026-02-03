
import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GAME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    currentPlayers: { type: Type.NUMBER },
    peakPlayers24h: { type: Type.NUMBER },
    allTimePeak: { type: Type.NUMBER },
    totalSales: { 
      type: Type.STRING, 
      description: "Estimated total copies sold to date (e.g., '1.2M', '500k-1M', '25M+')" 
    },
    currentPrice: { type: Type.STRING },
    discountPercentage: { type: Type.NUMBER },
    releaseDate: { type: Type.STRING },
    developer: { type: Type.STRING },
    publisher: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    description: { type: Type.STRING },
    rating: { type: Type.STRING },
    headerImage: { type: Type.STRING },
    lastUpdated: { type: Type.STRING }
  },
  required: ["id", "name", "currentPlayers", "currentPrice", "description", "totalSales"]
};

export const fetchSteamData = async (query: string): Promise<{ data: GameStats[], sources: GroundingSource[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Fetch detailed real-time Steam data for the following: ${query}. 
      Focus on:
      1. Player counts (current, 24h peak).
      2. Accurate current pricing and discounts.
      3. ESTIMATED TOTAL COPIES SOLD (lifetime sales). Use sources like SteamSpy, VGInsights, or financial reports to get the most accurate current estimate.
      Use SteamDB or official Steam sources via Google Search for accuracy. 
      Return the data in a structured format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: GAME_SCHEMA
        }
      },
    });

    const text = response.text || "[]";
    const data: GameStats[] = JSON.parse(text);
    
    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Steam Source",
      uri: chunk.web?.uri || "#"
    })) || [];

    return { data, sources };
  } catch (error) {
    console.error("Error fetching steam data:", error);
    throw error;
  }
};

export const fetchTrendingGames = async (): Promise<{ data: GameStats[], sources: GroundingSource[] }> => {
  return fetchSteamData("Top 5 currently most played and trending games on Steam right now with exact player numbers and lifetime sales estimates");
};
