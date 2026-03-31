import React from 'react';
import { GraduationCap, Github, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="bg-glow w-[400px] h-[400px] bg-blue-500 -bottom-48 -left-48 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-primary p-2 rounded-xl mr-3">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Nachhilfe <span className="text-gradient">Plus</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Die Zukunft der Nachhilfe. Wir kombinieren menschliche Expertise mit modernster KI-Technologie für deinen Erfolg.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Lösungen</h4>
            <ul className="space-y-4">
              {['KI-Tutor', 'Mathe-Löser', 'Übungs-Quizzes', 'Verwaltung'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-violet-400 text-sm font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Unternehmen</h4>
            <ul className="space-y-4">
              {['Über uns', 'Blog', 'Karriere', 'Partnerprogramm'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-violet-400 text-sm font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={16} className="text-violet-400" />
                hallo@nachhilfe-plus.de
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={16} className="text-violet-400" />
                +49 (0) 551 123456
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin size={16} className="text-violet-400" />
                Göttingen, Deutschland
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 Nachhilfe Plus. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Datenschutz</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Impressum</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;