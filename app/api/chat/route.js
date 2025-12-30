import { createClient } from "@supabase/supabase-js";
import { askCareerBot } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: resources } = await supabase
      .from('resources')
      .select('title, description, category, type');

    const result = await askCareerBot(messages, resources || []);
    
    return new Response(JSON.stringify(result), { status: 200 });

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ 
      error: "AI_CONNECT_ERROR",
      text: "SYSTEM ERROR! 💀 I've lost connection to the main vault. Try again shortly." 
    }), { status: 500 });
  }
}
