"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, Plus, Trash2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Ideia {
  id: string;
  nome: string;
  plataforma: "YouTube" | "Reels" | "TikTok" | "Shorts";
  data: string;
  status: "Ideia" | "Produção" | "Gravado" | "Editado" | "Pronto";
}

export default function PlannerPage() {
  const [tema, setTema] = useState("");
  const [loadingIdeias, setLoadingIdeias] = useState(false);
  const [ideiasGeradas, setIdeiasGeradas] = useState<string[]>([]);
  const [conteudos, setConteudos] = useState<Ideia[]>([]);
  const [loadingConteudos, setLoadingConteudos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [novaIdeia, setNovaIdeia] = useState({
    nome: "",
    plataforma: "YouTube" as Ideia["plataforma"],
    data: "",
    status: "Ideia" as Ideia["status"],
  });

  useEffect(() => {
    loadConteudos();
  }, []);

  const loadConteudos = async () => {
    try {
      const { data, error } = await supabase
        .from('ideias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConteudos(data || []);
    } catch (error) {
      console.error("Erro ao carregar conteúdos:", error);
      setError("Erro ao carregar conteúdos do banco de dados");
    } finally {
      setLoadingConteudos(false);
    }
  };

  const gerarIdeias = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingIdeias(true);
    setError(null);

    try {
      const response = await fetch("/api/gerar-ideias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar ideias. Tente novamente.");
      }

      const data = await response.json();
      
      if (!data || !data.ideias || !Array.isArray(data.ideias)) {
        throw new Error("Dados inválidos recebidos da API");
      }

      setIdeiasGeradas(data.ideias);
    } catch (error) {
      console.error("Erro ao gerar ideias:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar ideias");
    } finally {
      setLoadingIdeias(false);
    }
  };

  const adicionarConteudo = async () => {
    if (!novaIdeia.nome) return;

    try {
      const { data, error } = await supabase
        .from('ideias')
        .insert([{
          nome: novaIdeia.nome,
          plataforma: novaIdeia.plataforma,
          data: novaIdeia.data || null,
          status: novaIdeia.status,
        }])
        .select()
        .single();

      if (error) throw error;

      setConteudos([data, ...conteudos]);
      setNovaIdeia({
        nome: "",
        plataforma: "YouTube",
        data: "",
        status: "Ideia",
      });
      setError(null);
    } catch (error) {
      console.error("Erro ao adicionar conteúdo:", error);
      setError("Erro ao adicionar conteúdo ao banco de dados");
    }
  };

  const removerConteudo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ideias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConteudos(conteudos.filter((c) => c.id !== id));
      setError(null);
    } catch (error) {
      console.error("Erro ao remover conteúdo:", error);
      setError("Erro ao remover conteúdo do banco de dados");
    }
  };

  const atualizarStatus = async (id: string, novoStatus: Ideia["status"]) => {
    try {
      const { error } = await supabase
        .from('ideias')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) throw error;

      setConteudos(
        conteudos.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
      );
      setError(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setError("Erro ao atualizar status no banco de dados");
    }
  };

  const statusColors = {
    Ideia: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    Produção: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Gravado: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    Editado: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    Pronto: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  };

  const plataformaColors = {
    YouTube: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    Reels: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    TikTok: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    Shorts: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Planejamento de Conteúdo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Organize suas ideias e programe sua produção
          </p>
        </div>

        {/* Mensagem de Erro Global */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                Erro
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gerador de Ideias */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Gerador de Ideias com IA
            </h2>

            <form onSubmit={gerarIdeias} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Tema / Nicho
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex: Fitness, Culinária, Tecnologia"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingIdeias}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loadingIdeias ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Ideias
                  </>
                )}
              </button>
            </form>

            {ideiasGeradas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Ideias Geradas
                </h3>
                <ul className="space-y-2">
                  {ideiasGeradas.map((ideia, index) => (
                    <li
                      key={index}
                      className="flex gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                      onClick={() => setNovaIdeia({ ...novaIdeia, nome: ideia })}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{ideia}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Clique em uma ideia para adicioná-la ao planejamento
                </p>
              </div>
            )}
          </div>

          {/* Adicionar Conteúdo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Adicionar ao Planejamento
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Nome da Ideia
                </label>
                <input
                  type="text"
                  value={novaIdeia.nome}
                  onChange={(e) =>
                    setNovaIdeia({ ...novaIdeia, nome: e.target.value })
                  }
                  placeholder="Digite ou selecione uma ideia gerada"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Plataforma
                  </label>
                  <select
                    value={novaIdeia.plataforma}
                    onChange={(e) =>
                      setNovaIdeia({
                        ...novaIdeia,
                        plataforma: e.target.value as Ideia["plataforma"],
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Reels">Reels</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Shorts">Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    value={novaIdeia.status}
                    onChange={(e) =>
                      setNovaIdeia({
                        ...novaIdeia,
                        status: e.target.value as Ideia["status"],
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Ideia">Ideia</option>
                    <option value="Produção">Produção</option>
                    <option value="Gravado">Gravado</option>
                    <option value="Editado">Editado</option>
                    <option value="Pronto">Pronto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={novaIdeia.data}
                  onChange={(e) =>
                    setNovaIdeia({ ...novaIdeia, data: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={adicionarConteudo}
                disabled={!novaIdeia.nome}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Conteúdo
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Conteúdos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Conteúdos Planejados ({conteudos.length})
          </h2>

          {loadingConteudos ? (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Carregando conteúdos...</p>
            </div>
          ) : conteudos.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum conteúdo planejado ainda. Adicione suas ideias acima!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Ideia
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Plataforma
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Data
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conteudos.map((conteudo) => (
                    <tr
                      key={conteudo.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{conteudo.nome}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            plataformaColors[conteudo.plataforma]
                          }`}
                        >
                          {conteudo.plataforma}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700 dark:text-gray-300">
                          {conteudo.data
                            ? new Date(conteudo.data).toLocaleDateString("pt-BR")
                            : "-"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={conteudo.status}
                          onChange={(e) =>
                            atualizarStatus(
                              conteudo.id,
                              e.target.value as Ideia["status"]
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            statusColors[conteudo.status]
                          }`}
                        >
                          <option value="Ideia">Ideia</option>
                          <option value="Produção">Produção</option>
                          <option value="Gravado">Gravado</option>
                          <option value="Editado">Editado</option>
                          <option value="Pronto">Pronto</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => removerConteudo(conteudo.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
