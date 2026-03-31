import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@nachhilfe.de', password: 'admin123' },
  { role: 'Office', email: 'office@nachhilfe.de', password: 'office123' },
  { role: 'Lehrkraft', email: 'tutor@nachhilfe.de', password: 'tutor123' },
  { role: 'Eltern', email: 'eltern@nachhilfe.de', password: 'eltern123' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(email, password);
    if (ok) {
      navigate('/portal');
    } else {
      setError('E-Mail oder Passwort ist falsch.');
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Nachhilfe+
          </h1>
          <p className="text-slate-400 mt-2">Verwaltungsportal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Anmelden</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                placeholder="name@beispiel.de"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2.5 font-medium transition-all duration-200"
            >
              Anmelden
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-3">Demo-Zugänge (zum Ausfüllen klicken):</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                className="text-left bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-xl p-3 transition-colors"
              >
                <p className="text-violet-400 text-xs font-medium">{acc.role}</p>
                <p className="text-slate-300 text-xs mt-0.5 truncate">{acc.email}</p>
                <p className="text-slate-500 text-xs">{acc.password}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
