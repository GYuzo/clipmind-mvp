import Link from "next/link";
import { Video, Lightbulb, Calendar, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Roteiros + Storyboard",
      subtitle: "Crie roteiros completos com storyboard visual",
      icon: Video,
      href: "/roteiros",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Insights Automáticos",
      subtitle: "Analise vídeos do YouTube, Reels e TikTok com IA",
      icon: Lightbulb,
      href: "/insights",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Planejamento de Conteúdo",
      subtitle: "Organize suas ideias e programe sua produção",
      icon: Calendar,
      href: "/planner",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            ClipMind – Simplifique sua
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Criação de Conteúdo com IA
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Ferramenta completa para influencers, criadores de conteúdo e filmmakers
            planejarem e criarem conteúdo de forma profissional
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.href}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.subtitle}
                  </p>
                  
                  <Link
                    href={feature.href}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${feature.gradient} text-white font-medium hover:scale-105 transition-transform duration-300 shadow-md`}
                  >
                    Acessar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm">
            Sem necessidade de login • Interface simples • Resultados instantâneos
          </p>
        </div>
      </div>
    </div>
  );
}
