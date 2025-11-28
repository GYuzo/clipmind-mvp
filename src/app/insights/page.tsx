"use client";

import { useState } from "react";
import { Youtube, Instagram, Music, Loader2, Sparkles, AlertCircle } from "lucide-react";

type Platform = "youtube" | "reels" | "tiktok";

interface InsightResult {
  resumo: string;
  principaisIdeias?: string[];
  estrutura?: string;
  ganchos?: string[];
  tendencias?: string[];
  ideiasDerivadas?: string[];
  estiloVisual?: string;
  porqueFuncionou?: string;
  elementosAtencao?: string[];
  ritmo?: string;
  padroes?: string[];
  estrategias?: string[];
  emocoes?: string[];
  insightsPraticos?: string[];
}

export default function InsightsPage() {
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [url, setUrl] = useState("");
  const [transcricao, setTranscricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<InsightResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch("/api/gerar-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url, transcricao }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar insights. Tente novamente.");
      }

      const data = await response.json();
      
      // Validar estrutura dos dados
      if (!data || !data.resumo) {
        throw new Error("Dados incompletos recebidos da API");
      }

      setResultado(data);
    } catch (error) {
      console.error("Erro ao gerar insights:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar insights");
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    {
      id: "youtube" as Platform,
      name: "YouTube",
      icon: Youtube,
      color: "from-red-500 to-red-600",
    },
    {
      id: "reels" as Platform,
      name: "Reels",
      icon: Instagram,
      color: "from-pink-500 to-purple-600",
    },
    {
      id: "tiktok" as Platform,
      name: "TikTok",
      icon: Music,
      color: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Insights Automáticos com IA
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Analise vídeos e descubra estratégias de sucesso
          </p>
        </div>

        {/* Seleção de Plataforma */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Escolha a Plataforma
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    platform === p.id
                      ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${p.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                </button>
              );
            })}
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                URL do Vídeo
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={`Cole a URL do ${platforms.find(p => p.id === platform)?.name}`}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">ou</div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Transcrição / Legenda Manual
              </label>
              <textarea
                value={transcricao}
                onChange={(e) => setTranscricao(e.target.value)}
                placeholder="Cole a transcrição ou legenda do vídeo aqui..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!url && !transcricao)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-4 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Insights
                </>
              )}
            </button>
          </form>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                Erro ao gerar insights
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Resultados */}
        {resultado && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Análise Completa
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Resumo Inteligente
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.resumo}</p>
              </div>

              {resultado.principaisIdeias && resultado.principaisIdeias.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Principais Ideias
                  </h3>
                  <ul className="space-y-2">
                    {resultado.principaisIdeias.map((ideia, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{ideia}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resultado.estrutura && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Estrutura do Conteúdo
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.estrutura}</p>
                </div>
              )}

              {resultado.ganchos && resultado.ganchos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Ganchos Usados
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resultado.ganchos.map((gancho, index) => (
                      <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{gancho}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultado.estiloVisual && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Estilo Visual
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.estiloVisual}</p>
                </div>
              )}

              {resultado.porqueFuncionou && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Por Que Funcionou
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.porqueFuncionou}</p>
                </div>
              )}

              {resultado.elementosAtencao && resultado.elementosAtencao.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Elementos que Chamam Atenção
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.elementosAtencao.map((elemento, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium"
                      >
                        {elemento}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resultado.ritmo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Ritmo do Vídeo
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.ritmo}</p>
                </div>
              )}

              {resultado.padroes && resultado.padroes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Padrões de Edição
                  </h3>
                  <ul className="space-y-2">
                    {resultado.padroes.map((padrao, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{padrao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resultado.estrategias && resultado.estrategias.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Estratégias Usadas
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {resultado.estrategias.map((estrategia, index) => (
                      <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-gray-700 dark:text-gray-300">{estrategia}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultado.emocoes && resultado.emocoes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Emoções Transmitidas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.emocoes.map((emocao, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium"
                      >
                        {emocao}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resultado.insightsPraticos && resultado.insightsPraticos.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Insights Práticos
                  </h3>
                  <ul className="space-y-2">
                    {resultado.insightsPraticos.map((insight, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <span className="text-purple-600 dark:text-purple-400 font-bold mt-1">→</span>
                        <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resultado.ideiasDerivadas && resultado.ideiasDerivadas.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Ideias Derivadas para Outros Formatos
                  </h3>
                  <ul className="space-y-3">
                    {resultado.ideiasDerivadas.map((ideia, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{ideia}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
