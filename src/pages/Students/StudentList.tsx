import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Plus, Search, Eye, Pencil, Archive } from 'lucide-react';
import { statusLabel, statusColor } from '../../utils/helpers';
import StudentForm from './StudentForm';
import type { Student } from '../../types';

export default function StudentList() {
  const { students, updateStudent, subjects } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | undefined>();

  const getSubjectNames = (ids: string[]) =>
    ids.map(id => subjects.find(s => s.id === id)?.name ?? id).join(', ');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleArchive = (student: Student) => {
    if (window.confirm(`Schüler "${student.name}" archivieren?`)) {
      updateStudent(student.id, { status: 'archived', archivedAt: new Date().toISOString() });
    }
  };

  const openEdit = (student: Student) => {
    setEditStudent(student);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditStudent(undefined);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Schüler</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} Schüler gefunden</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Schüler hinzufügen
        </button>
      </div>

      {/* Filters */}
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
          <option value="all">Alle Status</option>
          <option value="active">Aktiv</option>
          <option value="paused">Pausiert</option>
          <option value="archived">Archiviert</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">E-Mail</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Klasse</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Fächer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">Keine Schüler gefunden</td>
                </tr>
              ) : filtered.map(student => (
                <tr key={student.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{student.name}</p>
                      <p className="text-slate-500 text-xs md:hidden">{student.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-300 text-sm hidden md:table-cell">{student.email}</td>
                  <td className="px-5 py-3 text-slate-300 text-sm hidden sm:table-cell">{student.grade ? `Klasse ${student.grade}` : '–'}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className="text-slate-400 text-xs">
                      {getSubjectNames(student.subjects) || '–'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(student.status)}`}>
                      {statusLabel(student.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/portal/students/${student.id}`)}
                        title="Anzeigen"
                        className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => openEdit(student)}
                        title="Bearbeiten"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      {student.status !== 'archived' && (
                        <button
                          onClick={() => handleArchive(student)}
                          title="Archivieren"
                          className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Archive size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <StudentForm student={editStudent} onClose={closeForm} />}
    </div>
  );
}
