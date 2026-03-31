import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Lesson } from '../../types';

interface Props {
  lesson?: Lesson;
  defaultDate?: string;
  defaultHour?: number;
  onClose: () => void;
}

export default function LessonForm({ lesson, defaultDate, defaultHour, onClose }: Props) {
  const { addLesson, updateLesson, students, tutors, rooms, subjects, packages, lessons } = useData();

  const toDateTimeLocal = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const defaultStart = (() => {
    if (lesson) return toDateTimeLocal(lesson.startTime);
    if (defaultDate) {
      const h = defaultHour ?? 10;
      return `${defaultDate}T${String(h).padStart(2, '0')}:00`;
    }
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return toDateTimeLocal(now.toISOString());
  })();

  const defaultEnd = (() => {
    if (lesson) return toDateTimeLocal(lesson.endTime);
    const d = new Date(defaultStart);
    d.setHours(d.getHours() + 1);
    return toDateTimeLocal(d.toISOString());
  })();

  const [form, setForm] = useState({
    studentId: lesson?.studentId ?? '',
    tutorId: lesson?.tutorId ?? '',
    roomId: lesson?.roomId ?? '',
    subjectId: lesson?.subjectId ?? '',
    startTime: defaultStart,
    endTime: defaultEnd,
    packageId: lesson?.packageId ?? '',
    status: (lesson?.status ?? 'scheduled') as Lesson['status'],
    documentationNote: lesson?.documentationNote ?? '',
    cancellationReason: lesson?.cancellationReason ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflict, setConflict] = useState('');

  const activeStudents = students.filter(s => s.status === 'active');
  const activeTutors = tutors.filter(t => t.status === 'active');
  const studentPackages = packages.filter(p => p.studentId === form.studentId && p.status === 'active');

  const checkConflict = (tutorId: string, start: string, end: string) => {
    if (!tutorId || !start || !end) return;
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    const conflict = lessons.find(l =>
      l.id !== lesson?.id &&
      l.tutorId === tutorId &&
      l.status !== 'cancelled' &&
      new Date(l.startTime).getTime() < endMs &&
      new Date(l.endTime).getTime() > startMs
    );
    setConflict(conflict ? `Konflikt: ${students.find(s => s.id === conflict.studentId)?.name ?? 'Schüler'} hat zur gleichen Zeit eine Stunde` : '');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentId) e.studentId = 'Schüler ist erforderlich';
    if (!form.tutorId) e.tutorId = 'Lehrkraft ist erforderlich';
    if (!form.subjectId) e.subjectId = 'Fach ist erforderlich';
    if (!form.startTime) e.startTime = 'Startzeit ist erforderlich';
    if (!form.endTime) e.endTime = 'Endzeit ist erforderlich';
    if (form.startTime && form.endTime && new Date(form.endTime) <= new Date(form.startTime))
      e.endTime = 'Endzeit muss nach Startzeit liegen';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      studentId: form.studentId,
      tutorId: form.tutorId,
      roomId: form.roomId || undefined,
      subjectId: form.subjectId,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      packageId: form.packageId || undefined,
      status: form.status,
      documentationNote: form.documentationNote || undefined,
      cancellationReason: form.cancellationReason || undefined,
    };

    if (lesson) {
      updateLesson(lesson.id, payload);
    } else {
      addLesson(payload);
    }
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full bg-slate-800/50 border ${errors[field] ? 'border-red-500' : 'border-white/10'} rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {lesson ? 'Termin bearbeiten' : 'Neuen Termin erstellen'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Schüler *</label>
            <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value, packageId: '' }))} className={inputCls('studentId')}>
              <option value="">Schüler wählen...</option>
              {activeStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.studentId && <p className="text-red-400 text-xs mt-1">{errors.studentId}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Lehrkraft *</label>
            <select value={form.tutorId} onChange={e => { setForm(f => ({ ...f, tutorId: e.target.value })); checkConflict(e.target.value, form.startTime, form.endTime); }} className={inputCls('tutorId')}>
              <option value="">Lehrkraft wählen...</option>
              {activeTutors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {errors.tutorId && <p className="text-red-400 text-xs mt-1">{errors.tutorId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Fach *</label>
              <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} className={inputCls('subjectId')}>
                <option value="">Fach wählen...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.subjectId && <p className="text-red-400 text-xs mt-1">{errors.subjectId}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Raum</label>
              <select value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))} className={inputCls('roomId')}>
                <option value="">Kein Raum</option>
                {rooms.filter(r => r.status === 'active').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Startzeit *</label>
              <input type="datetime-local" value={form.startTime} onChange={e => { setForm(f => ({ ...f, startTime: e.target.value })); checkConflict(form.tutorId, e.target.value, form.endTime); }} className={inputCls('startTime')} />
              {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Endzeit *</label>
              <input type="datetime-local" value={form.endTime} onChange={e => { setForm(f => ({ ...f, endTime: e.target.value })); checkConflict(form.tutorId, form.startTime, e.target.value); }} className={inputCls('endTime')} />
              {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {conflict && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
              <p className="text-orange-400 text-xs">⚠️ {conflict}</p>
            </div>
          )}

          {form.studentId && studentPackages.length > 0 && (
            <div>
              <label className="block text-sm text-slate-400 mb-1">Paket</label>
              <select value={form.packageId} onChange={e => setForm(f => ({ ...f, packageId: e.target.value }))} className={inputCls('packageId')}>
                <option value="">Kein Paket</option>
                {studentPackages.map(p => <option key={p.id} value={p.id}>{p.name} ({p.hoursTotal - p.hoursUsed} Std. verbleibend)</option>)}
              </select>
            </div>
          )}

          {lesson && (
            <>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Lesson['status'] }))} className={inputCls('status')}>
                  <option value="scheduled">Geplant</option>
                  <option value="completed">Abgeschlossen</option>
                  <option value="cancelled">Abgesagt</option>
                  <option value="substituted">Vertreten</option>
                </select>
              </div>
              {(form.status === 'cancelled') && (
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Absagegrund</label>
                  <input value={form.cancellationReason} onChange={e => setForm(f => ({ ...f, cancellationReason: e.target.value }))} className={inputCls('cancellationReason')} placeholder="Schüler krank..." />
                </div>
              )}
              {form.status === 'completed' && (
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Dokumentationsnotiz</label>
                  <textarea value={form.documentationNote} onChange={e => setForm(f => ({ ...f, documentationNote: e.target.value }))} className={`${inputCls('documentationNote')} resize-none`} rows={2} placeholder="Themen, Fortschritte..." />
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors">
              Abbrechen
            </button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">
              {lesson ? 'Speichern' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
