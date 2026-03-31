import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Pencil, CheckCircle, XCircle, Search } from 'lucide-react';
import { formatDate, formatTime, statusLabel, statusColor } from '../../utils/helpers';
import LessonForm from './LessonForm';
import type { Lesson } from '../../types';

export default function LessonList() {
  const { lessons, students, tutors, subjects, updateLesson } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | undefined>();

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';
  const getTutorName = (id: string) => tutors.find(t => t.id === id)?.name ?? '–';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  const filtered = lessons
    .filter(l => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const studentName = getStudentName(l.studentId).toLowerCase();
      const tutorName = getTutorName(l.tutorId).toLowerCase();
      const matchSearch = !search || studentName.includes(search.toLowerCase()) || tutorName.includes(search.toLowerCase());
      const lessonDate = new Date(l.startTime);
      const matchFrom = !dateFrom || lessonDate >= new Date(dateFrom);
      const matchTo = !dateTo || lessonDate <= new Date(dateTo + 'T23:59:59');
      return matchStatus && matchSearch && matchFrom && matchTo;
    })
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const handleComplete = (l: Lesson) => updateLesson(l.id, { status: 'completed' });
  const handleCancel = (l: Lesson) => {
    const reason = window.prompt('Absagegrund:') ?? '';
    updateLesson(l.id, { status: 'cancelled', cancellationReason: reason });
  };

  const openEdit = (l: Lesson) => { setEditLesson(l); setShowForm(true); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Terminliste</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} Termine</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Neue Stunde
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Schüler oder Lehrkraft..." className="bg-slate-800/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 w-48" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500">
          <option value="all">Alle Status</option>
          <option value="scheduled">Geplant</option>
          <option value="completed">Abgeschlossen</option>
          <option value="cancelled">Abgesagt</option>
          <option value="substituted">Vertreten</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Datum</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Schüler</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Lehrkraft</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Fach</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">Keine Termine gefunden</td></tr>
              ) : filtered.map(l => (
                <tr key={l.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3 text-sm text-white whitespace-nowrap">
                    {formatDate(l.startTime)}<br />
                    <span className="text-slate-400 text-xs">{formatTime(l.startTime)}–{formatTime(l.endTime)}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-white">{getStudentName(l.studentId)}</td>
                  <td className="px-5 py-3 text-sm text-slate-300 hidden md:table-cell">{getTutorName(l.tutorId)}</td>
                  <td className="px-5 py-3 text-sm text-slate-300 hidden sm:table-cell">{getSubjectName(l.subjectId)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(l.status)}`}>{statusLabel(l.status)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {l.status === 'scheduled' && (
                        <>
                          <button onClick={() => handleComplete(l)} title="Abschließen" className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-white/5 rounded-lg transition-colors"><CheckCircle size={15} /></button>
                          <button onClick={() => handleCancel(l)} title="Absagen" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"><XCircle size={15} /></button>
                        </>
                      )}
                      <button onClick={() => openEdit(l)} title="Bearbeiten" className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"><Pencil size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <LessonForm lesson={editLesson} onClose={() => { setShowForm(false); setEditLesson(undefined); }} />}
    </div>
  );
}
