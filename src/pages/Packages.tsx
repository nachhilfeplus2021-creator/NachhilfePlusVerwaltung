import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search } from 'lucide-react';
import { formatCurrency, statusLabel, statusColor } from '../utils/helpers';
import type { Package } from '../types';

interface PackageFormData {
  studentId: string;
  name: string;
  hoursTotal: number;
  hoursUsed: number;
  pricePerHour: number;
  status: Package['status'];
}

function PackageModal({ pkg, onClose }: { pkg?: Package; onClose: () => void }) {
  const { addPackage, updatePackage, students } = useData();

  const [form, setForm] = useState<PackageFormData>({
    studentId: pkg?.studentId ?? '',
    name: pkg?.name ?? '',
    hoursTotal: pkg?.hoursTotal ?? 10,
    hoursUsed: pkg?.hoursUsed ?? 0,
    pricePerHour: pkg?.pricePerHour ?? 35,
    status: pkg?.status ?? 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentId) e.studentId = 'Schüler ist erforderlich';
    if (!form.name.trim()) e.name = 'Name ist erforderlich';
    if (form.hoursTotal <= 0) e.hoursTotal = 'Stunden müssen > 0 sein';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (pkg) {
      updatePackage(pkg.id, form);
    } else {
      addPackage(form);
    }
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full bg-slate-800/50 border ${errors[field] ? 'border-red-500' : 'border-white/10'} rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500`;

  const activeStudents = students.filter(s => s.status !== 'archived');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{pkg ? 'Paket bearbeiten' : 'Neues Paket erstellen'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Schüler *</label>
            <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} className={inputCls('studentId')}>
              <option value="">Schüler wählen...</option>
              {activeStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.studentId && <p className="text-red-400 text-xs mt-1">{errors.studentId}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Paketname *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls('name')} placeholder="Mathe Paket 10h" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Gesamtstunden *</label>
              <input type="number" min="1" value={form.hoursTotal} onChange={e => setForm(f => ({ ...f, hoursTotal: Number(e.target.value) }))} className={inputCls('hoursTotal')} />
              {errors.hoursTotal && <p className="text-red-400 text-xs mt-1">{errors.hoursTotal}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Preis/Stunde (€) *</label>
              <input type="number" min="0" step="0.5" value={form.pricePerHour} onChange={e => setForm(f => ({ ...f, pricePerHour: Number(e.target.value) }))} className={inputCls('pricePerHour')} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Package['status'] }))} className={inputCls('status')}>
              <option value="active">Aktiv</option>
              <option value="depleted">Aufgebraucht</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors">Abbrechen</button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">{pkg ? 'Speichern' : 'Erstellen'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Packages() {
  const { packages, students } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState<Package | undefined>();

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';

  const filtered = packages.filter(p => {
    const name = getStudentName(p.studentId).toLowerCase();
    return !search || name.includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pakete</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} Pakete</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Neues Paket
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suche..." className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Schüler</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Paketname</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Stunden</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Preis/Std.</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">Keine Pakete gefunden</td></tr>
              ) : filtered.map(pkg => {
                const pct = Math.min(100, (pkg.hoursUsed / pkg.hoursTotal) * 100);
                return (
                  <tr key={pkg.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 text-sm text-white">{getStudentName(pkg.studentId)}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{pkg.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{pkg.hoursUsed}/{pkg.hoursTotal}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-300 hidden sm:table-cell">{formatCurrency(pkg.pricePerHour)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor(pkg.status)}`}>{statusLabel(pkg.status)}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => { setEditPkg(pkg); setShowForm(true); }} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors text-xs">Bearbeiten</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <PackageModal pkg={editPkg} onClose={() => { setShowForm(false); setEditPkg(undefined); }} />}
    </div>
  );
}
