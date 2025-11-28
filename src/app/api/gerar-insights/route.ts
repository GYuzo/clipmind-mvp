import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { platform, url, transcricao } = await request.json();

    const conteudo = transcricao || `URL fornecida: ${url}`;

    let prompt = "";
    let estruturaJSON = {};

    if (platform === "youtube") {
      prompt = `Analise este conteúdo de vídeo do YouTube e forneça insights detalhados:

${conteudo}

Retorne APENAS um JSON válido (sem markdown) com:
{
  "resumo": "Resumo inteligente do vídeo",
  "principaisIdeias": ["ideia 1", "ideia 2", "ideia 3"],
  "estrutura": "Como o conteúdo está estruturado",
  "ganchos": ["gancho 1", "gancho 2"],
  "tendencias": ["tendência 1", "tendência 2"],
  "ideiasDerivadas": ["ideia para short 1", "ideia para reel 1", "ideia para tiktok 1"]
}`;
    } else if (platform === "reels") {
      prompt = `Analise este Reel do Instagram e forneça insights detalhados:

${conteudo}

Retorne APENAS um JSON válido (sem markdown) com:
{
  "resumo": "Resumo do reel",
  "estrutura": "Estrutura (hook → conteúdo → CTA)",
  "estiloVisual": "Descrição do estilo visual",
  "porqueFuncionou": "Análise do por que funcionou",
  "elementosAtencao": ["elemento 1", "elemento 2"],
  "ideiasDerivadas": ["ideia derivada 1", "ideia derivada 2"]
}`;
    } else if (platform === "tiktok") {
      prompt = `Analise este vídeo do TikTok e forneça insights detalhados:

${conteudo}

Retorne APENAS um JSON válido (sem markdown) com:
{
  "resumo": "Resumo do vídeo",
  "ritmo": "Análise do ritmo do vídeo",
  "padroes": ["padrão de edição 1", "padrão 2"],
  "estrategias": ["estratégia 1", "estratégia 2"],
  "emocoes": ["emoção 1", "emoção 2"],
  "insightsPraticos": ["insight 1", "insight 2"],
  "ideiasDerivadas": ["ideia derivada 1", "ideia derivada 2"]
}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de conteúdo digital e estratégias de redes sociais. Sempre retorne JSON válido sem markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const resultado = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    return NextResponse.json(
      { error: "Erro ao gerar insights" },
      { status: 500 }
    );
  }
}
