import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function askCareerBot(prompt) {
  if (!apiKey) {
    return "Gemini API key is missing. Please add it to your environment variables.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const systemInstruction = `
    You are CareerBot, a specialized assistant for PlaceVault.
    Your goal is to help students with placement preparation:
    - Technical explanations (DSA, System Design).
    - Behavioral interview tips (HR scripts).
    - Navigating placement materials.
    Keep your answers concise, professional, and encouraging.
    Use Markdown for formatting.
  `;

  try {
    const result = await model.generateContent([systemInstruction, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
}
