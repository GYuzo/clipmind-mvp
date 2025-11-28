"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface FormData {
  tema: string;
  plataforma: "YouTube" | "Reels" | "TikTok";
  publicoAlvo: string;
  duracao: string;
  tom: string;
}

interface Cena {
  numero: number;
  acontecimento: string;
  visual: string;
  ilustracao: string;
}

interface Resultado {
  roteiro: {
    titulo: string;
    gancho: string;
    desenvolvimento: string[];
    cta: string;
    versaoAlternativa?: string;
  };
  storyboard: Cena[];
}

export default function RoteirosPage() {
  const [formData, setFormData] = useState<FormData>({
    tema: "",
    plataforma: "YouTube",
    publicoAlvo: "",
    duracao: "",
    tom: "",
  });
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch("/api/gerar-roteiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar roteiro. Tente novamente.");
      }

      const data = await response.json();
      
      // Validar estrutura dos dados
      if (!data || !data.roteiro || !data.storyboard) {
        throw new Error("Dados incompletos recebidos da API");
      }

      setResultado(data);
    } catch (error) {
      console.error("Erro ao gerar roteiro:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar roteiro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Gerador de Roteiros + Storyboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Crie roteiros completos com storyboard visual para suas produções
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tema do Vídeo
              </label>
              <input
                type="text"
                value={formData.tema}
                onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                placeholder="Ex: Como criar conteúdo viral no TikTok"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Plataforma
                </label>
                <select
                  value={formData.plataforma}
                  onChange={(e) => setFormData({ ...formData, plataforma: e.target.value as FormData["plataforma"] })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Reels">Reels (Instagram)</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Duração Aproximada
                </label>
                <input
                  type="text"
                  value={formData.duracao}
                  onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  placeholder="Ex: 3 minutos, 30 segundos"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Público-Alvo
              </label>
              <input
                type="text"
                value={formData.publicoAlvo}
                onChange={(e) => setFormData({ ...formData, publicoAlvo: e.target.value })}
                placeholder="Ex: Criadores de conteúdo iniciantes, 18-35 anos"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tom Desejado
              </label>
              <input
                type="text"
                value={formData.tom}
                onChange={(e) => setFormData({ ...formData, tom: e.target.value })}
                placeholder="Ex: Descontraído, educativo, motivacional"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Roteiro + Storyboard
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
                Erro ao gerar roteiro
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Resultados */}
        {resultado && resultado.roteiro && (
          <div className="space-y-8">
            {/* Roteiro */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Roteiro Completo
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Título Sugerido
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{resultado.roteiro.titulo}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Gancho Inicial
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.roteiro.gancho}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Desenvolvimento
                  </h3>
                  <ul className="space-y-3">
                    {resultado.roteiro.desenvolvimento?.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    CTA Final
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resultado.roteiro.cta}</p>
                </div>

                {resultado.roteiro.versaoAlternativa && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Versão Alternativa
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {resultado.roteiro.versaoAlternativa}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Storyboard */}
            {resultado.storyboard && resultado.storyboard.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Storyboard Visual
                </h2>

                <div className="space-y-6">
                  {resultado.storyboard.map((cena) => (
                    <div
                      key={cena.numero}
                      className="border-l-4 border-indigo-600 pl-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg"
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Cena {cena.numero}
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Acontecimento:</span>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{cena.acontecimento}</p>
                        </div>

                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Visual:</span>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{cena.visual}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <span className="font-semibold text-gray-900 dark:text-white">Ilustração:</span>
                          <p className="text-gray-700 dark:text-gray-300 mt-1 italic">{cena.ilustracao}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
