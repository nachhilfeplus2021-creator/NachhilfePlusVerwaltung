import React, { useState } from 'react';
import { Calculator, Send, Sparkles, AlertCircle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

const Solver = () => {
  const [input, setInput] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [result, setResult] = useState<null | { steps: string[], final: string }>(null);

  const handleSolve = () => {
    if (!input.trim()) return;
    setIsSolving(true);
    setResult(null);

    setTimeout(() => {
      setResult({
        steps: [
          'Gleichung aufstellen: x² + 4x + 4 = 0',
          'p = 4, q = 4 identifizieren',
          'In pq-Formel einsetzen: x = -(4/2) ± √((4/2)² - 4)',
          'Vereinfachen: x = -2 ± √(4 - 4)',
          'Ergebnis berechnen: x = -2 ± 0'
        ],
        final: 'x = -2'
      });
      setIsSolving(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-12 min-h-screen relative">
      {/* Background Glow */}
      <div className="bg-glow w-[500px] h-[500px] bg-blue-500 -top-24 -right-24 opacity-10" />

      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 text-blue-400 mb-6">
          <Calculator className="w-4 h-4 mr-2" />
          <span>Intelligenter Aufgaben-Löser</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl mb-4">
          Löse Aufgaben in <span className="text-gradient">Sekunden.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Gib deine Mathe-Aufgabe ein und erhalte einen detaillierten, schrittweisen Lösungsweg.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-400" size={20} />
            Deine Aufgabe
          </h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="z.B. Löse x² + 4x + 4 = 0"
            className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none mb-6"
          />
          <button
            onClick={handleSolve}
            disabled={!input.trim() || isSolving}
            className="w-full btn-glow bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSolving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Lösung wird berechnet...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Aufgabe lösen
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <AlertCircle size={12} />
            Schritt-für-Schritt Erklärungen inklusive
          </div>
        </div>

        {/* Result Section */}
        <div className="glass-card p-8 relative overflow-hidden">
          {!result && !isSolving && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600 mb-6">
                <Calculator size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bereit zum Lösen</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                Gib links eine Aufgabe ein, um den Lösungsweg hier zu sehen.
              </p>
            </div>
          )}

          {isSolving && (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mb-6" />
              <p className="text-slate-400 font-bold animate-pulse">KI analysiert Aufgabe...</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={20} />
                Lösungsweg
              </h2>
              <div className="space-y-6 mb-8">
                {result.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-sm pt-1.5 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-2xl bg-gradient-primary/10 border border-white/10">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Endergebnis</p>
                <p className="text-2xl font-extrabold text-white">{result.final}</p>
              </div>
              <button className="w-full mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Erklärung anfordern
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solver;