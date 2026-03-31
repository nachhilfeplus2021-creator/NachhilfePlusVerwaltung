import React from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/helpers';
import { format, startOfMonth, subMonths, parseISO, isWithinInterval, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Reports() {
  const { invoices, lessons, students, tutors } = useData();

  // Last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return {
      key: format(d, 'yyyy-MM'),
      label: format(d, 'MMM yy', { locale: de }),
      start: startOfMonth(d),
      end: endOfMonth(d),
    };
  });

  const revenueData = months.map(m => {
    const total = invoices
      .filter(i => i.status === 'paid' && i.paidAt && isWithinInterval(parseISO(i.paidAt), { start: m.start, end: m.end }))
      .reduce((sum, i) => sum + i.totalAmount, 0);
    return { month: m.label, Umsatz: Math.round(total) };
  });

  const lessonsData = months.map(m => {
    const count = lessons.filter(l =>
      l.status === 'completed' &&
      isWithinInterval(parseISO(l.startTime), { start: m.start, end: m.end })
    ).length;
    return { month: m.label, Stunden: count };
  });

  // Top students by hours
  const studentHours = students.map(s => {
    const hours = lessons
      .filter(l => l.studentId === s.id && l.status === 'completed')
      .reduce((sum, l) => sum + (new Date(l.endTime).getTime() - new Date(l.startTime).getTime()) / 3600000, 0);
    return { name: s.name, hours: Math.round(hours * 10) / 10 };
  }).sort((a, b) => b.hours - a.hours).slice(0, 5);

  // Top tutors by hours
  const tutorHours = tutors.map(t => {
    const hours = lessons
      .filter(l => l.tutorId === t.id && l.status === 'completed')
      .reduce((sum, l) => sum + (new Date(l.endTime).getTime() - new Date(l.startTime).getTime()) / 3600000, 0);
    return { name: t.name, hours: Math.round(hours * 10) / 10 };
  }).sort((a, b) => b.hours - a.hours).slice(0, 5);

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e2e8f0',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Berichte</h1>
          <p className="text-slate-400 text-sm mt-1">Übersicht der letzten 6 Monate</p>
        </div>
        <button
          onClick={() => alert('Export wird vorbereitet...')}
          className="bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors"
        >
          Exportieren
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Monatlicher Umsatz (bezahlte Rechnungen)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), 'Umsatz']} />
              <Bar dataKey="Umsatz" fill="url(#gradientViolet)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="gradientViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lessons Chart */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Abgeschlossene Stunden pro Monat</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={lessonsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Stunden" fill="url(#gradientBlue)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white">Top Schüler nach Stunden</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">#</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Name</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase">Stunden</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {studentHours.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-4 text-slate-500 text-sm text-center">Keine Daten</td></tr>
              ) : studentHours.map((s, idx) => (
                <tr key={s.name}>
                  <td className="px-5 py-3 text-slate-500 text-sm">{idx + 1}</td>
                  <td className="px-5 py-3 text-white text-sm">{s.name}</td>
                  <td className="px-5 py-3 text-slate-300 text-sm text-right">{s.hours} h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Tutors */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white">Top Lehrkräfte nach Stunden</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">#</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Name</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase">Stunden</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tutorHours.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-4 text-slate-500 text-sm text-center">Keine Daten</td></tr>
              ) : tutorHours.map((t, idx) => (
                <tr key={t.name}>
                  <td className="px-5 py-3 text-slate-500 text-sm">{idx + 1}</td>
                  <td className="px-5 py-3 text-white text-sm">{t.name}</td>
                  <td className="px-5 py-3 text-slate-300 text-sm text-right">{t.hours} h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
