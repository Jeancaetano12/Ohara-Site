import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-10 md:pt-20">
        
        {/* Efeito de brilho de fundo (Glow) - Muda de cor com o tema */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-ohara-pink dark:bg-ohara-blue/20 blur-[200px] rounded-full -z-10" />

        {/* Logo Grande Animada */}
        <div className="relative w-40 h-40 md:w-56 md:h-56 mb-8 hover:scale-105 transition-transform duration-500">
          <Image 
            src="/OharaDiscordLogo.png" 
            alt="Árvore de Ohara" 
            fill 
            className="object-contain drop-shadow-2xl rounded-4xl border-2 border-ohara-pink/20 dark:border-ohara-white/10"
            priority
          />
        </div>

        {/* Títulos com troca de cor inteligente */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="text-ohara-dark dark:text-ohara-white transition-colors">
            Bem-vindo à 
          </span>{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-ohara-pink to-ohara-orange">
            Ohara
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-700 dark:text-gray-300 transition-colors">
          Uma comunidade focada na interação e no entretenimento. 
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="https://discord.gg/3v2KFqySgt" 
            className="px-8 py-3 rounded-full bg-ohara-pink text-white font-bold text-lg shadow-lg shadow-ohara-pink/30 hover:shadow-ohara-pink/50 hover:scale-105 transition-all"
          >
            Entrar no Discord
          </Link>
          <Link className="cursor-pointer px-8 py-3 rounded-full border-2 border-ohara-dark/10 dark:border-ohara-white/20 hover:bg-ohara-dark/5 dark:hover:bg-ohara-white/10 transition-all font-semibold"
            href="/pages/comunidade"
          >
            Saiba Mais
          </Link>
        </div>
      </section>

      {/* --- FEATURE GRID (Teste de Contraste) --- */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-ohara-blue dark:text-ohara-orange uppercase tracking-widest">
          O que você encontra aqui
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <FeatureCard 
            title="Gente como a gente" 
            emoji="🙋‍♀️" 
            desc="Ache pessoas pra fechar aquele squad, ou jogar papo fora."
          />
          {/* Card 2 */}
          <FeatureCard 
            title="Interação" 
            emoji="💬" 
            desc="Um espaço seguro para trocar ideias e fazer networking com outros membros."
          />
          {/* Card 3 */}
          <FeatureCard 
            title="Eventos" 
            emoji="🚀" 
            desc="Showcase de projetos desenvolvidos pela comunidade."
          />
        </div>
      </section>
    </div>
  );
}

// Componente auxiliar para os Cards (Para não repetir código)
function FeatureCard({ title, emoji, desc }: { title: string, emoji: string, desc: string }) {
  return (
    <div className="
      p-8 rounded-2xl border transition-all duration-300
      /* Estilos Light Mode */
      bg-white border-ohara-pink/10 shadow-xl shadow-ohara-dark/5
      /* Estilos Dark Mode */
      dark:bg-white/5 dark:border-ohara-white/10 dark:hover:bg-white/10
    ">
      <div className="text-4xl mb-4 bg-ohara-white dark:bg-ohara-dark w-16 h-16 flex items-center justify-center rounded-xl shadow-inner">
        {emoji}
      </div>
      <h3 className="text-xl font-bold mb-2 text-ohara-dark dark:text-ohara-pink">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}