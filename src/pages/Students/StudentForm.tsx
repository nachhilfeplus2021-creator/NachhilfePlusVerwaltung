import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Student } from '../../types';
import { statusLabel, statusColor } from '../../utils/helpers';

interface Props {
  student?: Student;
  onClose: () => void;
}

const ALL_SUBJECTS = ['Mathematik', 'Englisch', 'Deutsch', 'Physik', 'Chemie', 'Biologie', 'Geschichte'];

export default function StudentForm({ student, onClose }: Props) {
  const { addStudent, updateStudent, parents, subjects } = useData();

  const subjectNames = subjects.map(s => s.name);
  const allSubjects = subjectNames.length > 0 ? subjectNames : ALL_SUBJECTS;

  const [form, setForm] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    phone: student?.phone ?? '',
    birthDate: student?.birthDate ?? '',
    school: student?.school ?? '',
    grade: student?.grade ?? '',
    subjects: student?.subjects ?? ([] as string[]),
    parentIds: student?.parentIds ?? ([] as string[]),
    notes: student?.notes ?? '',
    status: (student?.status ?? 'active') as Student['status'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name ist erforderlich';
    if (!form.email.trim()) e.email = 'E-Mail ist erforderlich';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    const subjectIds = form.subjects.map(name => {
      const found = subjects.find(s => s.name === name);
      return found?.id ?? name;
    });

    if (student) {
      updateStudent(student.id, { ...form, subjects: subjectIds });
    } else {
      addStudent({ ...form, subjects: subjectIds });
    }
    onClose();
  };

  const toggleSubject = (name: string) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(name)
        ? f.subjects.filter(s => s !== name)
        : [...f.subjects, name],
    }));
  };

  const toggleParent = (id: string) => {
    setForm(f => ({
      ...f,
      parentIds: f.parentIds.includes(id)
        ? f.parentIds.filter(p => p !== id)
        : [...f.parentIds, id],
    }));
  };

  const inputCls = (field: string) =>
    `w-full bg-slate-800/50 border ${errors[field] ? 'border-red-500' : 'border-white/10'} rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {student ? 'Schüler bearbeiten' : 'Neuen Schüler hinzufügen'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls('name')} placeholder="Max Mustermann" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">E-Mail *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls('email')} placeholder="max@schule.de" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Telefon</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls('phone')} placeholder="017012345678" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Geburtsdatum</label>
              <input type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} className={inputCls('birthDate')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Schule</label>
              <input value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} className={inputCls('school')} placeholder="Gymnasium..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Klasse</label>
              <input value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} className={inputCls('grade')} placeholder="8" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Fächer</label>
            <div className="flex flex-wrap gap-2">
              {allSubjects.map(subj => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => toggleSubject(subj)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    form.subjects.includes(subj)
                      ? 'bg-violet-600/80 border-violet-500 text-white'
                      : 'bg-slate-800/50 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Eltern</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {parents.map(p => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.parentIds.includes(p.id)}
                    onChange={() => toggleParent(p.id)}
                    className="accent-violet-600"
                  />
                  <span className="text-sm text-slate-300">{p.name} ({p.email})</span>
                </label>
              ))}
              {parents.length === 0 && <p className="text-slate-500 text-xs">Keine Eltern vorhanden</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Student['status'] }))} className={inputCls('status')}>
              <option value="active">Aktiv</option>
              <option value="paused">Pausiert</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Notizen</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={`${inputCls('notes')} resize-none`} rows={3} placeholder="Interne Notizen..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors">
              Abbrechen
            </button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">
              {student ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { statusLabel, statusColor };
