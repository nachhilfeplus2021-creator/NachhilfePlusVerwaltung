import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft, Pencil } from 'lucide-react';
import { formatDate, formatCurrency, statusLabel, statusColor } from '../../utils/helpers';
import StudentForm from './StudentForm';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, parents, tutors, subjects, packages, lessons, invoices } = useData();
  const [showEdit, setShowEdit] = useState(false);

  const student = students.find(s => s.id === id);
  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Schüler nicht gefunden</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-violet-400 hover:underline">Zurück</button>
      </div>
    );
  }

  const studentParents = parents.filter(p => student.parentIds.includes(p.id));
  const studentSubjects = student.subjects.map(id => subjects.find(s => s.id === id)?.name ?? id);
  const studentPackages = packages.filter(p => p.studentId === student.id);
  const studentLessons = lessons
    .filter(l => l.studentId === student.id)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 10);
  const studentInvoices = invoices
    .filter(i => i.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getTutorName = (tutorId: string) => tutors.find(t => t.id === tutorId)?.name ?? '–';
  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name ?? subjectId;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors mt-1"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{student.name}</h1>
            <span className={`text-sm px-2.5 py-1 rounded-full ${statusColor(student.status)}`}>
              {statusLabel(student.status)}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">{student.email}</p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-3 py-2 text-sm transition-colors"
        >
          <Pencil size={15} />
          Bearbeiten
        </button>
      </div>

      {/* Info Grid */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4">Informationen</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'E-Mail', value: student.email },
            { label: 'Telefon', value: student.phone ?? '–' },
            { label: 'Geburtsdatum', value: student.birthDate ? formatDate(student.birthDate) : '–' },
            { label: 'Schule', value: student.school ?? '–' },
            { label: 'Klasse', value: student.grade ? `Klasse ${student.grade}` : '–' },
            { label: 'Fächer', value: studentSubjects.join(', ') || '–' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-white text-sm mt-1">{item.value}</p>
            </div>
          ))}
        </div>
        {student.notes && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Notizen</p>
            <p className="text-slate-300 text-sm mt-1">{student.notes}</p>
          </div>
        )}
      </div>

      {/* Parents */}
      {studentParents.length > 0 && (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Eltern / Erziehungsberechtigte</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {studentParents.map(p => (
              <div key={p.id} className="bg-slate-800/40 rounded-xl p-3">
                <p className="text-white text-sm font-medium">{p.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{p.email}</p>
                {p.phone && <p className="text-slate-400 text-xs">{p.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packages */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4">Pakete</h2>
        {studentPackages.length === 0 ? (
          <p className="text-slate-500 text-sm">Keine Pakete vorhanden</p>
        ) : (
          <div className="space-y-3">
            {studentPackages.map(pkg => {
              const pct = Math.min(100, (pkg.hoursUsed / pkg.hoursTotal) * 100);
              return (
                <div key={pkg.id} className="bg-slate-800/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-sm font-medium">{pkg.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(pkg.status)}`}>
                      {statusLabel(pkg.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs whitespace-nowrap">
                      {pkg.hoursUsed} / {pkg.hoursTotal} Std.
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{formatCurrency(pkg.pricePerHour)} / Std.</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Lessons */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Letzte Termine</h2>
        </div>
        {studentLessons.length === 0 ? (
          <p className="px-5 py-4 text-slate-500 text-sm">Keine Termine vorhanden</p>
        ) : (
          <div className="divide-y divide-white/5">
            {studentLessons.map(l => (
              <div key={l.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white">{formatDate(l.startTime)} · {getSubjectName(l.subjectId)}</p>
                  <p className="text-xs text-slate-400">{getTutorName(l.tutorId)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(l.status)}`}>
                  {statusLabel(l.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Rechnungen</h2>
        </div>
        {studentInvoices.length === 0 ? (
          <p className="px-5 py-4 text-slate-500 text-sm">Keine Rechnungen vorhanden</p>
        ) : (
          <div className="divide-y divide-white/5">
            {studentInvoices.map(inv => (
              <div key={inv.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white">{inv.invoiceNumber}</p>
                  <p className="text-xs text-slate-400">{formatDate(inv.createdAt)} · fällig: {formatDate(inv.dueDate)}</p>
                </div>
                <span className="text-sm font-medium text-white">{formatCurrency(inv.totalAmount)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(inv.status)}`}>
                  {statusLabel(inv.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEdit && <StudentForm student={student} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
