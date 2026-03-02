import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";

export default function Home() {

  return (
    <div className="flex flex-col">

      {/* ─────────────────────────────────────────
          HERO
      ───────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 overflow-hidden"
      >
        {/* Background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ohara-pink/10 dark:bg-ohara-pink/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-ohara-blue/10 dark:bg-ohara-blue/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(217,70,239,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo */}
        <div className="relative w-36 h-36 md:w-52 md:h-52 mb-8 hover:scale-105 transition-transform duration-500">
          <Image
            src="/ohara-icon.png"
            alt="Árvore de Ohara"
            fill
            className="object-contain drop-shadow-2xl rounded-3xl border-2 border-ohara-pink/20 dark:border-ohara-white/10"
            priority
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none">
          <span className="text-ohara-dark dark:text-ohara-white">
            Bem-vindo à{" "}
          </span>
          <span className="bg-clip-text text-transparent bg-ohara-pink">
            Ohara
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-gray-600 dark:text-gray-300">
          Uma comunidade brasileira construída para quem ama jogos, conexões e entretenimento de verdade.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="https://discord.gg/3v2KFqySgt"
            target="_blank"
            className="px-8 py-3 rounded-full bg-ohara-pink text-white font-bold text-lg shadow-lg shadow-ohara-pink/30 hover:shadow-ohara-pink/50 hover:scale-105 transition-all"
          >
            Entrar no Discord
          </Link>
          <a
            href="#quem-somos"
            className="px-8 py-3 rounded-full border-2 border-ohara-dark/10 dark:border-ohara-white/20 hover:bg-ohara-dark/5 dark:hover:bg-ohara-white/10 transition-all font-semibold text-ohara-dark dark:text-ohara-white"
          >
            Saiba Mais ↓
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2  animate-bounce">
          <FaArrowDownLong className="text-ohara-blue dark:text-ohara-blue" size={48} />
        </div>
      </section>

      {/* ─────────────────────────────────────────
          QUEM SOMOS
      ───────────────────────────────────────── */}
      <section
        id="quem-somos"
        className="relative py-32 px-4 overflow-hidden"
      >
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-ohara-pink/0 via-ohara-pink/60 to-ohara-pink/0" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-ohara-pink dark:text-ohara-blue mb-4">
              Quem Somos
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-ohara-dark dark:text-ohara-white">
              Uma ilha onde{" "}
              <span className="text-ohara-pink">tudo existe.</span>{" "}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
              Ohara é mais que um servidor — é um ponto de encontro para pessoas que gostam de jogar, conversar e criar juntas. Com temática inspirada em One Piece, um lugar livre.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Somos uma comunidade em crescimento constante, com squads para jogos, canais de papo livre, eventos semanais e uma galera que realmente curte interagir. Aqui você sempre acha alguém pra jogar, debater ou só rir junto.
            </p>
          </div>

          {/* Cards de stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Membros ativos", value: "100+", color: "ohara-pink" },
              { label: "Bots próprios", value: "1", color: "ohara-blue" },
              { label: "Eventos realizados", value: "∞", color: "ohara-orange" },
              { label: "Papos rolados", value: "🔥", color: "ohara-pink" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-ohara-pink/10 dark:border-ohara-white/10 shadow-lg"
              >
                <div className={`text-4xl font-extrabold text-${s.color} mb-1`}>
                  {s.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          NOSSA COMUNIDADE
      ───────────────────────────────────────── */}
      <section
        id="comunidade"
        className="relative py-32 px-4 bg-ohara-dark/[0.02] dark:bg-ohara-white/[0.02] overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-ohara-orange/0 via-ohara-orange/60 to-ohara-orange/0" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-ohara-orange mb-4">
              Nossa Comunidade
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-ohara-dark dark:text-ohara-white mb-4">
              Um espaço feito por vocês,{" "}
              <span className="text-ohara-orange">para vocês</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Em breve, nossa área de comunidade vai centralizar tudo que você precisa para se conectar e participar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <CommunityCard
              icon="🪪"
              title="Perfis de Membros"
              desc="Personalize seu perfil dentro da comunidade Ohara. Adicione seus jogos favoritos, bio e muito mais. Seu cartão de visita aqui dentro."
              accent="ohara-pink"
            />
            <CommunityCard
              icon="📅"
              title="Gerência de Eventos"
              desc="Organize e participe de eventos da comunidade. De torneios a watch parties, tudo em um só lugar. Sua agenda, nossa comunidade."
              accent="ohara-orange"
            />
          </div>

          <div className="text-center">
            <Link
              href="/pages/comunidade"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-ohara-pink to-ohara-orange text-white font-bold text-lg shadow-lg hover:scale-105 transition-all"
            >
              Explorar Comunidade →
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          INTEGRAÇÃO / BOTS
      ───────────────────────────────────────── */}
      <section
        id="integracao"
        className="relative py-32 px-4 overflow-hidden"
      >
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-ohara-blue/0 via-ohara-blue/60 to-ohara-blue/0" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-ohara-blue/5 dark:bg-ohara-blue/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-ohara-blue mb-4">
              Integração
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-ohara-dark dark:text-ohara-white mb-4">
              Tecnologia a serviço{" "}
              <span className="text-ohara-blue">da comunidade</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Nossos bots trabalham 24/7 para deixar tudo mais divertido e organizado dentro do servidor.
            </p>
          </div>

          {/* OharaBot em destaque */}
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-ohara-dark to-ohara-dark/90 dark:from-white/5 dark:to-white/[0.02] border border-ohara-blue/30 shadow-2xl shadow-ohara-blue/10 mb-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ohara-blue/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ohara-pink/10 blur-[60px] rounded-full" />

            <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-ohara-blue to-ohara-pink flex items-center justify-center text-4xl shadow-lg shadow-ohara-blue/30">
                🤖
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                    OharaBot
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-ohara-blue/20 border border-ohara-blue/40 text-ohara-blue text-xs font-bold uppercase tracking-wider">
                    100% Proprietário
                  </span>
                  <span className="px-3 py-1 rounded-full bg-ohara-pink/20 border border-ohara-pink/40 text-ohara-pink text-xs font-bold uppercase tracking-wider">
                    Em crescimento
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  Nosso bot exclusivo, desenvolvido do zero para a Ohara. Ele é o coração tecnológico da comunidade: gerencia os perfis dos membros deste site, toca músicas no canal de voz e está em constante evolução com novas funcionalidades chegando toda hora.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Gerência de Perfis", "Player de Música", "Integração com o Site", "Em Expansão"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Outros bots */}
          <div className="grid md:grid-cols-2 gap-6">
            <BotCard
              icon="🎮"
              title="Bot de Jogos Gratuitos"
              desc="Nunca perca um jogo gratuito! Nosso bot monitora as melhores plataformas e avisa automaticamente no servidor quando um jogo estiver de graça para resgate."
              tags={["Epic Games", "Steam", "GOG", "Prime Gaming"]}
            />
            <BotCard
              icon="⚡"
              title="Mais por vir..."
              desc="A Ohara está sempre evoluindo. Novos bots e integrações estão sendo desenvolvidos para tornar a experiência ainda melhor para todos os membros."
              tags={["Em breve", "WIP", "Stay tuned"]}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          JUNTE-SE
      ───────────────────────────────────────── */}
      <section
        id="junte-se"
        className="relative py-32 px-4 overflow-hidden"
      >
        {/* Background dramático */}
        <div className="absolute inset-0 bg-gradient-to-br from-ohara-pink/5 via-transparent to-ohara-blue/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ohara-pink/10 dark:bg-ohara-pink/5 blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-ohara-pink mb-6">
            Junte-se a nós
          </span>

          <h2 className="text-5xl md:text-7xl font-extrabold leading-none mb-8 text-ohara-dark dark:text-ohara-white">
            Falta só{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ohara-pink to-ohara-orange">
              você
            </span>
            .
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            A Ohara é gratuita, acolhedora e está esperando você. Clique no botão, entre no servidor e vem fazer parte dessa história com a gente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://discord.gg/3v2KFqySgt"
              target="_blank"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-ohara-pink text-white font-extrabold text-xl shadow-2xl shadow-ohara-pink/40 hover:shadow-ohara-pink/60 hover:scale-105 transition-all"
            >
              <FaDiscord size={24} />
              Entrar no Discord
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
            Já somos mais de 100 membros. Entrada gratuita, sem compromisso.
          </p>
        </div>
      </section>

    </div>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function CommunityCard({
  icon,
  title,
  desc,
  accent,
}: {
  icon: string;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <div className="p-8 rounded-2xl border bg-white dark:bg-white/5 border-ohara-pink/10 dark:border-ohara-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className={`w-16 h-16 rounded-2xl bg-${accent}/10 border border-${accent}/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 text-ohara-pink dark:text-${accent}`}>
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function BotCard({
  icon,
  title,
  desc,
  tags,
}: {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}) {
  return (
    <div className="p-8 rounded-2xl border bg-white dark:bg-white/5 border-ohara-blue/10 dark:border-ohara-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-ohara-dark dark:text-ohara-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full bg-ohara-blue/10 dark:bg-ohara-blue/10 border border-ohara-blue/20 text-ohara-blue dark:text-ohara-blue text-xs font-medium"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}