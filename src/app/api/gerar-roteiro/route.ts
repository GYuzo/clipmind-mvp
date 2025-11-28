import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { tema, plataforma, publicoAlvo, duracao, tom } = await request.json();

    const prompt = `Você é um especialista em criação de conteúdo para ${plataforma}.

Crie um roteiro completo e um storyboard textual detalhado para um vídeo com as seguintes características:

- Tema: ${tema}
- Plataforma: ${plataforma}
- Público-alvo: ${publicoAlvo}
- Duração: ${duracao}
- Tom: ${tom}

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`json) no seguinte formato:

{
  "roteiro": {
    "titulo": "Título criativo e chamativo",
    "gancho": "Gancho inicial poderoso (primeiros 3-5 segundos)",
    "desenvolvimento": [
      "Tópico 1 do desenvolvimento",
      "Tópico 2 do desenvolvimento",
      "Tópico 3 do desenvolvimento"
    ],
    "cta": "Call to action final",
    "versaoAlternativa": "Versão alternativa do gancho ou título (opcional)"
  },
  "storyboard": [
    {
      "numero": 1,
      "acontecimento": "O que acontece nesta cena",
      "visual": "Descrição visual: movimentos de câmera, expressão do apresentador, cenário, estilo visual",
      "ilustracao": "Ilustração textual detalhada: 'Apresentador em plano médio, fundo minimalista com luz suave, expressão confiante, câmera estática'"
    },
    {
      "numero": 2,
      "acontecimento": "...",
      "visual": "...",
      "ilustracao": "..."
    }
  ]
}

Crie entre 4-6 cenas para o storyboard, dependendo da duração do vídeo.
Seja específico, criativo e profissional.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em criação de roteiros e storyboards para conteúdo digital. Sempre retorne JSON válido sem markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const resultado = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    return NextResponse.json(
      { error: "Erro ao gerar roteiro" },
      { status: 500 }
    );
  }
}
