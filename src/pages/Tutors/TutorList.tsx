import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Search, Pencil, Archive, ArchiveRestore } from 'lucide-react';
import { statusLabel, statusColor } from '../../utils/helpers';
import TutorForm from './TutorForm';
import type { Tutor } from '../../types';

export default function TutorList() {
  const { tutors, subjects, payrollGroups, updateTutor } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [showForm, setShowForm] = useState(false);
  const [editTutor, setEditTutor] = useState<Tutor | undefined>();

  const getSubjectNames = (ids: string[]) =>
    ids.map(id => subjects.find(s => s.id === id)?.name ?? id).join(', ');
  const getGroupName = (id?: string) =>
    id ? payrollGroups.find(g => g.id === id)?.name ?? '–' : '–';

  const filtered = tutors.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openEdit = (t: Tutor) => { setEditTutor(t); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTutor(undefined); };

  const toggleArchive = (t: Tutor) => {
    if (t.status === 'archived') {
      updateTutor(t.id, { status: 'active', });
    } else {
      if (window.confirm(`Lehrkraft "${t.name}" archivieren?`)) {
        updateTutor(t.id, { status: 'archived' });
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lehrkräfte</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} Lehrkräfte</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Lehrkraft hinzufügen
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Suche nach Name oder E-Mail..."
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">Alle</option>
          <option value="active">Aktiv</option>
          <option value="archived">Archiviert</option>
        </select>
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">E-Mail</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Fächer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Gruppe</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">Keine Lehrkräfte gefunden</td>
                </tr>
              ) : filtered.map(t => (
                <tr key={t.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-slate-500 text-xs md:hidden">{t.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-300 text-sm hidden md:table-cell">{t.email}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs hidden lg:table-cell">{getSubjectNames(t.subjects) || '–'}</td>
                  <td className="px-5 py-3 text-slate-300 text-sm hidden sm:table-cell">{getGroupName(t.payrollGroupId)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(t.status)}`}>
                      {statusLabel(t.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(t)} title="Bearbeiten" className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => toggleArchive(t)} title={t.status === 'archived' ? 'Wiederherstellen' : 'Archivieren'} className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-white/5 rounded-lg transition-colors">
                        {t.status === 'archived' ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <TutorForm tutor={editTutor} onClose={closeForm} />}
    </div>
  );
}
