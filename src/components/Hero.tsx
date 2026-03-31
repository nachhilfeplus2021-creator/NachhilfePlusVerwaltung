import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Play } from 'lucide-react';

interface HeroProps {
  setView: (view: 'home' | 'chat' | 'solver' | 'quiz' | 'dashboard') => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow w-[600px] h-[600px] bg-violet-500 -top-48 -left-48 opacity-20" />
      <div className="bg-glow w-[500px] h-[500px] bg-blue-500 top-1/2 -right-24 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 text-violet-400 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Nachhilfe in Göttingen & Online</span>
            </div>
            
            <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl leading-[1.1]">
              Bessere Noten, <br />
              <span className="text-gradient">weniger Stress.</span>
            </h1>
            
            <p className="mt-8 text-lg text-slate-400 sm:text-xl max-w-xl leading-relaxed">
              Dein persönlicher KI-Tutor erklärt dir komplexe Aufgaben Schritt für Schritt. 
              Egal ob Hausaufgaben, Klausurvorbereitung oder einfach nur Neugier.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <button
                onClick={() => setView('chat')}
                className="btn-glow flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-violet-500 transition-all"
              >
                Jetzt kostenlos starten
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => setView('dashboard')}
                className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Verwaltung öffnen
              </button>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-6 sm:justify-center lg:justify-start">
              {['24/7 Verfügbar', 'Alle Klassenstufen', 'Schritt-für-Schritt'].map((item) => (
                <div key={item} className="flex items-center text-sm font-bold text-slate-500">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-5 relative">
            <div className="relative glass-card p-2 transform rotate-3 hover:rotate-0 transition-all duration-700 group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                  alt="Student studying"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Play className="text-white fill-current" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Wie es funktioniert</p>
                      <p className="text-slate-400 text-xs">Video ansehen (2 Min)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-primary rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;