import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function askCareerBot(userMessages, vaultResources = []) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  // Stabilizing on gemini-1.5-flash for reliability
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: `
      You are CareerBot for PlaceVault, a specialized Career & Placement Assistant.
      
      CORE FOCUS:
      - Placement material, DSA, HR interviews, Career paths, and Academic studies.
      
      GUARDRAILS:
      - If the user asks about ANYTHING off-topic (e.g., movies, sports, politics, recipes, general non-career news), you MUST politely refuse.
      - Response for off-topic: "I am specialized in placements and career prep only. Let's get back to the vault!"
      
      BEHAVIOR:
      1. MUST suggest 1 relevant resources if available from the list below if the user asks about placements, DSA, HR interviews, Career paths, or Academic studies.
      2. Provide detailed advice and explanations; do not artificially truncate your response.
      3. FORMAT: Use bold for titles: "**[Title]**".
      4. CONCISE: Max 5 sentences
      
      VAULT RESOURCES:
      ${vaultResources.map(r => `- [${r.category}] "${r.title}"`).join("\n")}
    `
  });

  // Gemini history MUST start with a 'user' role. 
  const historyData = userMessages.slice(0, -1);
  const firstUserIndex = historyData.findIndex(m => m.role === 'user');
  
  const formattedHistory = firstUserIndex !== -1 
    ? historyData.slice(firstUserIndex).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }))
    : [];

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: { temperature: 0.7 },
  });

  try {
    const lastMessage = userMessages[userMessages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    return { text: response.text() };
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return { 
        text: "CHEST BREACH! 🚨 My neural tokens have hit their limit for today. Try again in a while!",
        isQuotaExceeded: true 
      };
    }
    throw error;
  }
}
