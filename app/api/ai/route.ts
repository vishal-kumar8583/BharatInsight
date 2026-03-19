import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return new Response(
        "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.",
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are BharatInsight AI, an expert data analyst specializing in Indian government public data from data.gov.in. 
You provide concise, insightful analysis of Indian public sector data including health, agriculture, finance, and education metrics.
Always reference specific states, districts, or metrics when relevant. Use Indian number formatting (lakhs, crores).
Keep responses focused and actionable. Current data context: ${context}`;

    const chatHistory = (history || []).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I'm ready to analyze Indian public data with the provided context." }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessageStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[AI Route Error]", message);
    const isQuota = message.includes("429") || message.includes("quota") || message.includes("Too Many Requests");
    const userMessage = isQuota
      ? "Rate limit reached. Please wait a moment and try again."
      : "Something went wrong. Please try again.";
    return new Response(JSON.stringify({ error: userMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
