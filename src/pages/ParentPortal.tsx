import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { formatDate, formatCurrency, statusLabel, statusColor, formatTime } from '../utils/helpers';
import { parseISO } from 'date-fns';

function SepaModal({ parentId, existing, onClose }: { parentId: string; existing?: { iban: string; bic: string; accountHolder: string } | null; onClose: () => void }) {
  const { addSepaMandate, updateSepaMandate, sepaMandates } = useData();
  const [form, setForm] = useState({
    iban: existing?.iban ?? '',
    bic: existing?.bic ?? '',
    accountHolder: existing?.accountHolder ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingMandate = sepaMandates.find(s => s.parentId === parentId && s.status === 'active');
    if (existingMandate) {
      updateSepaMandate(existingMandate.id, { iban: form.iban, bic: form.bic, accountHolder: form.accountHolder });
    } else {
      addSepaMandate({
        parentId,
        iban: form.iban,
        bic: form.bic,
        accountHolder: form.accountHolder,
        mandateReference: `MNDT-${Date.now()}`,
        signedAt: new Date().toISOString(),
        status: 'active',
      });
    }
    onClose();
  };

  const inputCls = 'w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">SEPA-Lastschriftmandat</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">IBAN *</label>
            <input value={form.iban} onChange={e => setForm(f => ({ ...f, iban: e.target.value }))} className={inputCls} placeholder="DE89..." required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">BIC *</label>
            <input value={form.bic} onChange={e => setForm(f => ({ ...f, bic: e.target.value }))} className={inputCls} placeholder="COBADEFFXXX" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Kontoinhaber *</label>
            <input value={form.accountHolder} onChange={e => setForm(f => ({ ...f, accountHolder: e.target.value }))} className={inputCls} placeholder="Max Mustermann" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors">Abbrechen</button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ParentPortal() {
  const { currentUser } = useAuth();
  const { parents, students, lessons, packages, invoices, subjects, tutors, sepaMandates } = useData();
  const [showSepa, setShowSepa] = useState(false);

  const parent = parents.find(p => p.userId === currentUser?.id);
  const myStudents = parent ? students.filter(s => parent.studentIds.includes(s.id)) : [];
  const mandate = parent ? sepaMandates.find(s => s.parentId === parent.id && s.status === 'active') : undefined;

  const now = new Date();
  const upcomingLessons = lessons
    .filter(l =>
      myStudents.some(s => s.id === l.studentId) &&
      l.status === 'scheduled' &&
      parseISO(l.startTime) > now
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 10);

  const myInvoices = invoices
    .filter(i => myStudents.some(s => s.id === i.studentId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';
  const getTutorName = (id: string) => tutors.find(t => t.id === id)?.name ?? '–';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Willkommen, {currentUser?.name}!</h1>
        <p className="text-slate-400 text-sm mt-1">Elternportal – Übersicht</p>
      </div>

      {!parent ? (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <p className="text-slate-400">Kein Elternprofil gefunden. Bitte wenden Sie sich an das Büro.</p>
        </div>
      ) : (
        <>
          {/* Children & Packages */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4">Meine Kinder</h2>
            {myStudents.map(student => {
              const studentPackages = packages.filter(p => p.studentId === student.id && p.status === 'active');
              return (
                <div key={student.id} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-medium">{student.name}</p>
                    <span className="text-slate-500 text-sm">– {student.school ?? ''} {student.grade ? `Klasse ${student.grade}` : ''}</span>
                  </div>
                  {studentPackages.length === 0 ? (
                    <p className="text-slate-500 text-xs">Keine aktiven Pakete</p>
                  ) : studentPackages.map(pkg => {
                    const remaining = pkg.hoursTotal - pkg.hoursUsed;
                    const pct = Math.min(100, (pkg.hoursUsed / pkg.hoursTotal) * 100);
                    return (
                      <div key={pkg.id} className="bg-slate-800/40 rounded-xl p-3 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-white">{pkg.name}</p>
                          <p className="text-sm text-slate-300">{remaining} Std. verbleibend</p>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="font-semibold text-white">Nächste Termine</h2>
            </div>
            {upcomingLessons.length === 0 ? (
              <p className="px-5 py-4 text-slate-500 text-sm">Keine bevorstehenden Termine</p>
            ) : upcomingLessons.map(l => (
              <div key={l.id} className="px-5 py-3 border-b border-white/5 last:border-0 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white">{getStudentName(l.studentId)} · {getSubjectName(l.subjectId)}</p>
                  <p className="text-xs text-slate-400">{formatDate(l.startTime)}, {formatTime(l.startTime)}–{formatTime(l.endTime)} · {getTutorName(l.tutorId)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Invoices */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="font-semibold text-white">Letzte Rechnungen</h2>
            </div>
            {myInvoices.length === 0 ? (
              <p className="px-5 py-4 text-slate-500 text-sm">Keine Rechnungen vorhanden</p>
            ) : myInvoices.map(inv => (
              <div key={inv.id} className="px-5 py-3 border-b border-white/5 last:border-0 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white">{inv.invoiceNumber} – {formatCurrency(inv.totalAmount)}</p>
                  <p className="text-xs text-slate-400">Fällig: {formatDate(inv.dueDate)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(inv.status)}`}>{statusLabel(inv.status)}</span>
              </div>
            ))}
          </div>

          {/* SEPA */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">SEPA-Lastschriftmandat</h2>
              <button onClick={() => setShowSepa(true)} className="text-sm text-violet-400 hover:text-violet-300">
                {mandate ? 'Bearbeiten' : 'Hinzufügen'}
              </button>
            </div>
            {mandate ? (
              <div className="space-y-2">
                <p className="text-slate-300 text-sm"><span className="text-slate-500">IBAN:</span> {mandate.iban.slice(0, 4)}...{mandate.iban.slice(-4)}</p>
                <p className="text-slate-300 text-sm"><span className="text-slate-500">BIC:</span> {mandate.bic}</p>
                <p className="text-slate-300 text-sm"><span className="text-slate-500">Kontoinhaber:</span> {mandate.accountHolder}</p>
                <p className="text-slate-300 text-sm"><span className="text-slate-500">Unterschrieben am:</span> {formatDate(mandate.signedAt)}</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Aktiv</span>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Kein SEPA-Mandat hinterlegt</p>
            )}
          </div>
        </>
      )}

      {showSepa && parent && (
        <SepaModal
          parentId={parent.id}
          existing={mandate ? { iban: mandate.iban, bic: mandate.bic, accountHolder: mandate.accountHolder } : null}
          onClose={() => setShowSepa(false)}
        />
      )}
    </div>
  );
}
