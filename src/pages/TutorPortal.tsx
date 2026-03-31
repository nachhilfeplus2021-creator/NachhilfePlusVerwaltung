import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { formatDate, formatCurrency, statusLabel, statusColor, formatTime } from '../utils/helpers';
import { parseISO, startOfMonth, endOfMonth } from 'date-fns';

function CompleteModal({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const { updateLesson } = useData();
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLesson(lessonId, { status: 'completed', documentationNote: note || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Stunde abschließen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Dokumentationsnotiz</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
              rows={4}
              placeholder="Themen, Fortschritte, Hausaufgaben..."
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors">Abbrechen</button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">Abschließen</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TutorPortal() {
  const { currentUser } = useAuth();
  const { tutors, students, lessons, subjects, payrollGroups } = useData();
  const [completeLesson, setCompleteLesson] = useState<string | undefined>();

  const tutor = tutors.find(t => t.userId === currentUser?.id);
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const myLessons = tutor ? lessons.filter(l => l.tutorId === tutor.id) : [];

  const upcoming = myLessons
    .filter(l => l.status === 'scheduled' && parseISO(l.startTime) >= now && parseISO(l.startTime) <= in7Days)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  const past = myLessons
    .filter(l => parseISO(l.startTime) < now && parseISO(l.startTime) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const monthLessons = myLessons.filter(l =>
    l.status === 'completed' &&
    parseISO(l.startTime) >= monthStart &&
    parseISO(l.startTime) <= monthEnd
  );

  const hoursThisMonth = monthLessons.reduce((sum, l) => {
    const h = (new Date(l.endTime).getTime() - new Date(l.startTime).getTime()) / 3600000;
    return sum + h;
  }, 0);

  const payrollGroup = tutor?.payrollGroupId ? payrollGroups.find(g => g.id === tutor.payrollGroupId) : undefined;
  const expectedPayout = hoursThisMonth * (payrollGroup?.hourlyRate ?? 15);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Meine Stunden</h1>
        {tutor && <p className="text-slate-400 text-sm mt-1">Willkommen, {tutor.name}!</p>}
      </div>

      {!tutor ? (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <p className="text-slate-400">Kein Lehrkraft-Profil gefunden. Bitte wenden Sie sich an das Büro.</p>
        </div>
      ) : (
        <>
          {/* Monthly Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-600/20 border border-violet-500/30 rounded-2xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Stunden diesen Monat</p>
              <p className="text-3xl font-bold text-white">{hoursThisMonth.toFixed(1)}</p>
              <p className="text-slate-400 text-sm mt-1">{monthLessons.length} abgeschlossene Stunden</p>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Erwartete Vergütung</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(expectedPayout)}</p>
              <p className="text-slate-400 text-sm mt-1">{payrollGroup ? `${payrollGroup.name} (${payrollGroup.hourlyRate}€/Std.)` : '–'}</p>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="font-semibold text-white">Nächste 7 Tage</h2>
            </div>
            {upcoming.length === 0 ? (
              <p className="px-5 py-4 text-slate-500 text-sm">Keine bevorstehenden Termine</p>
            ) : upcoming.map(l => (
              <div key={l.id} className="px-5 py-3 border-b border-white/5 last:border-0 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white">{getStudentName(l.studentId)} · {getSubjectName(l.subjectId)}</p>
                  <p className="text-xs text-slate-400">{formatDate(l.startTime)}, {formatTime(l.startTime)}–{formatTime(l.endTime)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(l.status)}`}>{statusLabel(l.status)}</span>
              </div>
            ))}
          </div>

          {/* Past Lessons */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="font-semibold text-white">Letzte 30 Tage</h2>
            </div>
            {past.length === 0 ? (
              <p className="px-5 py-4 text-slate-500 text-sm">Keine vergangenen Termine</p>
            ) : past.map(l => (
              <div key={l.id} className="px-5 py-3 border-b border-white/5 last:border-0 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white">{getStudentName(l.studentId)} · {getSubjectName(l.subjectId)}</p>
                  <p className="text-xs text-slate-400">{formatDate(l.startTime)}, {formatTime(l.startTime)}–{formatTime(l.endTime)}</p>
                  {l.documentationNote && <p className="text-xs text-slate-500 mt-0.5 italic">{l.documentationNote}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor(l.status)}`}>{statusLabel(l.status)}</span>
                  {l.status === 'scheduled' && (
                    <button
                      onClick={() => setCompleteLesson(l.id)}
                      className="text-xs bg-green-600/40 hover:bg-green-500/50 text-green-300 rounded-lg px-2 py-1 transition-colors"
                    >
                      Abschließen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {completeLesson && (
        <CompleteModal lessonId={completeLesson} onClose={() => setCompleteLesson(undefined)} />
      )}
    </div>
  );
}
