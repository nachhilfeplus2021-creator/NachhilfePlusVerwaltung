import React from 'react';
import { 
  Calculator, 
  MessageSquare, 
  BrainCircuit, 
  GraduationCap, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  setView: (view: 'home' | 'chat' | 'solver' | 'quiz' | 'dashboard') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ setView, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'chat', label: 'KI-Tutor', icon: MessageSquare },
    { id: 'solver', label: 'Löser', icon: Calculator },
    { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
    { id: 'dashboard', label: 'Verwaltung', icon: LayoutDashboard },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl px-6 py-3 flex justify-between items-center border border-white/10">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className="bg-gradient-primary p-2 rounded-xl mr-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Nachhilfe <span className="text-gradient">Plus</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentView === item.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('chat')}
              className="hidden sm:block btn-glow bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
            >
              Jetzt starten
            </button>
            
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass rounded-3xl p-4 border border-white/10 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    setView(item.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    currentView === item.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => {
                  setView('chat');
                  setIsMenuOpen(false);
                }}
                className="w-full btn-glow bg-violet-500 text-white py-3 rounded-xl text-sm font-bold mt-2"
              >
                Jetzt starten
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;