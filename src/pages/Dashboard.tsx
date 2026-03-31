import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Users, Clock, FileText, UserCheck, Plus } from 'lucide-react';
import { formatDate, formatCurrency, statusLabel, statusColor } from '../utils/helpers';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';

export default function Dashboard() {
  const { students, tutors, lessons, invoices } = useData();
  const navigate = useNavigate();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const activeStudents = students.filter(s => s.status === 'active').length;
  const activeTutors = tutors.filter(t => t.status === 'active').length;

  const hoursThisWeek = lessons
    .filter(l => l.status === 'completed' && isWithinInterval(parseISO(l.startTime), { start: weekStart, end: weekEnd }))
    .reduce((sum, l) => {
      const start = parseISO(l.startTime);
      const end = parseISO(l.endTime);
      return sum + (end.getTime() - start.getTime()) / 3600000;
    }, 0);

  const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length;

  const recentLessons = [...lessons]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';
  const getTutorName = (id: string) => tutors.find(t => t.id === id)?.name ?? '–';

  const stats = [
    { label: 'Aktive Schüler', value: activeStudents, icon: <Users size={20} className="text-violet-400" />, color: 'from-violet-600/20 to-violet-500/10' },
    { label: 'Stunden diese Woche', value: hoursThisWeek.toFixed(1) + ' h', icon: <Clock size={20} className="text-blue-400" />, color: 'from-blue-600/20 to-blue-500/10' },
    { label: 'Ausstehende Rechnungen', value: pendingInvoices, icon: <FileText size={20} className="text-orange-400" />, color: 'from-orange-600/20 to-orange-500/10' },
    { label: 'Aktive Lehrkräfte', value: activeTutors, icon: <UserCheck size={20} className="text-green-400" />, color: 'from-green-600/20 to-green-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Willkommen im Nachhilfe+ Verwaltungsportal</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} bg-slate-900/60 border border-white/10 rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-slate-800/60">
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/portal/lessons')}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Neue Stunde
        </button>
        <button
          onClick={() => navigate('/portal/students')}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Neuer Schüler
        </button>
        <button
          onClick={() => navigate('/portal/invoices')}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Neue Rechnung
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Lessons */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white">Letzte Termine</h2>
          </div>
          <div className="divide-y divide-white/5">
            {recentLessons.length === 0 ? (
              <p className="px-5 py-4 text-slate-500 text-sm">Keine Termine vorhanden</p>
            ) : recentLessons.map(lesson => (
              <div key={lesson.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{getStudentName(lesson.studentId)}</p>
                  <p className="text-xs text-slate-400">{getTutorName(lesson.tutorId)} · {formatDate(lesson.startTime)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(lesson.status)}`}>
                  {statusLabel(lesson.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white">Letzte Rechnungen</h2>
          </div>
          <div className="divide-y divide-white/5">
            {recentInvoices.length === 0 ? (
              <p className="px-5 py-4 text-slate-500 text-sm">Keine Rechnungen vorhanden</p>
            ) : recentInvoices.map(inv => (
              <div key={inv.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{inv.invoiceNumber}</p>
                  <p className="text-xs text-slate-400">{getStudentName(inv.studentId)} · {formatCurrency(inv.totalAmount)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(inv.status)}`}>
                  {statusLabel(inv.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
