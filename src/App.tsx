import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Chat from './components/Chat';
import Solver from './components/Solver';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [view, setView] = useState<'home' | 'chat' | 'solver' | 'quiz' | 'dashboard'>('home');

  const renderView = () => {
    switch (view) {
      case 'chat': return <Chat />;
      case 'solver': return <Solver />;
      case 'quiz': return <Quiz />;
      case 'dashboard': return <Dashboard />;
      default: return (
        <>
          <Hero setView={setView} />
          <Features setView={setView} />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col selection:bg-violet-500/30 selection:text-white">
      <Header setView={setView} currentView={view} />
      
      <main className="flex-grow">
        <div className="animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;