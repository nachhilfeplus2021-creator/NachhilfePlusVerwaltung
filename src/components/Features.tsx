import React from 'react';
import { 
  MessageSquare, 
  Calculator, 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  Users,
  ArrowRight
} from 'lucide-react';

interface FeaturesProps {
  setView: (view: 'home' | 'chat' | 'solver' | 'quiz' | 'dashboard') => void;
}

const Features: React.FC<FeaturesProps> = ({ setView }) => {
  const features = [
    {
      id: 'chat',
      title: 'KI-Mathe-Tutor',
      description: 'Stelle Fragen in natürlicher Sprache und erhalte verständliche Erklärungen.',
      icon: MessageSquare,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      id: 'solver',
      title: 'Aufgaben-Löser',
      description: 'Scanne oder tippe deine Aufgabe ein und erhalte den kompletten Lösungsweg.',
      icon: Calculator,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'quiz',
      title: 'Interaktive Quizzes',
      description: 'Teste dein Wissen mit spielerischen Quizzes zu allen Schulfächern.',
      icon: BrainCircuit,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
    },
    {
      id: 'dashboard',
      title: 'Verwaltung',
      description: 'Behalte den Überblick über deine Stunden, Schüler und Fortschritte.',
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-400/10',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl mb-4">
            Alles was du für <span className="text-gradient">deinen Erfolg</span> brauchst
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Unsere Plattform kombiniert modernste KI-Technologie mit bewährten Lernmethoden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="glass-card group cursor-pointer hover:scale-105 transition-all duration-500"
              onClick={() => setView(feature.id as any)}
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="flex items-center text-sm font-bold text-violet-400 group-hover:translate-x-2 transition-transform">
                Mehr erfahren
                <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-24 glass-card p-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Zufriedene Schüler', value: '500+' },
              { label: 'Erfolgsquote', value: '98%' },
              { label: 'Verfügbare Fächer', value: '15+' },
              { label: 'KI-Antworten', value: '10k+' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-extrabold text-white mb-2">{stat.value}</p>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;