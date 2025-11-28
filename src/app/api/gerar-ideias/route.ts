import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { tema } = await request.json();

    const prompt = `Você é um especialista em criação de conteúdo digital.

Gere 8 ideias criativas e específicas de conteúdo para o tema/nicho: "${tema}"

As ideias devem ser:
- Específicas e acionáveis
- Variadas (diferentes formatos e abordagens)
- Adequadas para YouTube, Reels, TikTok ou Shorts
- Criativas e com potencial viral

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`json) no formato:
{
  "ideias": [
    "Ideia 1 específica e detalhada",
    "Ideia 2 específica e detalhada",
    "Ideia 3 específica e detalhada",
    "Ideia 4 específica e detalhada",
    "Ideia 5 específica e detalhada",
    "Ideia 6 específica e detalhada",
    "Ideia 7 específica e detalhada",
    "Ideia 8 específica e detalhada"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em brainstorming de conteúdo digital. Sempre retorne JSON válido sem markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const resultado = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao gerar ideias:", error);
    return NextResponse.json(
      { error: "Erro ao gerar ideias" },
      { status: 500 }
    );
  }
}
