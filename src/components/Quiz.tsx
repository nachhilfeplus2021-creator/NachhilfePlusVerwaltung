import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, Sparkles, AlertCircle, Trophy, Timer } from 'lucide-react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const questions = [
    {
      question: 'Was ist die Ableitung von f(x) = x²?',
      options: ['f\'(x) = 2x', 'f\'(x) = x', 'f\'(x) = 2', 'f\'(x) = x²'],
      answer: 0,
    },
    {
      question: 'Wie lautet der Satz des Pythagoras?',
      options: ['a + b = c', 'a² + b² = c²', 'a² - b² = c²', 'a * b = c'],
      answer: 1,
    },
    {
      question: 'Was ist die Wurzel aus 144?',
      options: ['10', '11', '12', '14'],
      answer: 2,
    },
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-12 min-h-screen relative">
      {/* Background Glow */}
      <div className="bg-glow w-[500px] h-[500px] bg-pink-500 -top-24 -left-24 opacity-10" />

      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 text-pink-400 mb-6">
          <BrainCircuit className="w-4 h-4 mr-2" />
          <span>Interaktives Lern-Quiz</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl mb-4">
          Teste dein <span className="text-gradient">Wissen.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Wähle ein Thema und beantworte die Fragen, um Punkte zu sammeln und dein Level zu steigern.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {showScore ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-gradient-primary p-[1px] mx-auto mb-8">
              <div className="w-full h-full rounded-3xl bg-[#0f172a] flex items-center justify-center text-white">
                <Trophy size={48} className="text-violet-400" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">Quiz beendet!</h2>
            <p className="text-slate-400 text-lg mb-8">
              Du hast <span className="text-white font-bold">{score}</span> von <span className="text-white font-bold">{questions.length}</span> Fragen richtig beantwortet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowScore(false);
                  setCurrentQuestion(0);
                  setScore(0);
                }}
                className="btn-glow bg-violet-500 text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Nochmal versuchen
              </button>
              <button className="px-8 py-4 rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold">
                Anderes Thema wählen
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 md:p-12 animate-fade-in">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-pink-400 border border-white/10">
                  <Timer size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Frage</p>
                  <p className="text-white font-bold">{currentQuestion + 1} von {questions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Punkte</p>
                  <p className="text-white font-bold">{score * 100}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                  <Star size={24} />
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {questions[currentQuestion].question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectedAnswer === null && handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-6 rounded-2xl text-left font-bold transition-all flex items-center justify-between group ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : selectedAnswer !== null && index === questions[currentQuestion].answer
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  } border-2`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                      selectedAnswer === index ? 'bg-white/10' : 'bg-white/5'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                  {selectedAnswer === index && (
                    isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <AlertCircle size={12} />
              Wähle die richtige Antwort aus, um fortzufahren.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Star = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default Quiz;