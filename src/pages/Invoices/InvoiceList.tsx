import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Plus, Eye, CheckCircle, Send, X } from 'lucide-react';
import { formatDate, formatCurrency, statusLabel, statusColor } from '../../utils/helpers';
import type { Invoice, InvoiceItem } from '../../types';

type StatusTab = 'all' | Invoice['status'];

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'draft', label: 'Entwurf' },
  { key: 'sent', label: 'Versendet' },
  { key: 'paid', label: 'Bezahlt' },
  { key: 'overdue', label: 'Überfällig' },
  { key: 'cancelled', label: 'Storniert' },
];

function InvoiceModal({ onClose }: { onClose: () => void }) {
  const { addInvoice, students, parents } = useData();

  const [form, setForm] = useState({
    studentId: '',
    parentId: '',
    paymentMethod: 'sepa' as Invoice['paymentMethod'],
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 35, total: 35 }] as InvoiceItem[],
  });

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setForm(f => {
      const items = f.items.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      });
      return { ...f, items };
    });
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', quantity: 1, unitPrice: 35, total: 35 }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const totalAmount = form.items.reduce((s, i) => s + i.total, 0);

  const nextNumber = () => {
    return `RE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.dueDate) return;
    addInvoice({
      invoiceNumber: nextNumber(),
      studentId: form.studentId,
      parentId: form.parentId || undefined,
      items: form.items,
      totalAmount,
      dueDate: new Date(form.dueDate).toISOString(),
      status: 'draft',
      paymentMethod: form.paymentMethod,
    });
    onClose();
  };

  const inputCls = 'w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500';
  const activeStudents = students.filter(s => s.status !== 'archived');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Neue Rechnung erstellen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Schüler *</label>
              <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} className={inputCls} required>
                <option value="">Wählen...</option>
                {activeStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Elternteil</label>
              <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))} className={inputCls}>
                <option value="">Keiner</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Zahlungsmethode</label>
              <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as Invoice['paymentMethod'] }))} className={inputCls}>
                <option value="sepa">SEPA-Lastschrift</option>
                <option value="transfer">Überweisung</option>
                <option value="cash">Bar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Fälligkeitsdatum *</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={inputCls} required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-400">Positionen</label>
              <button type="button" onClick={addItem} className="text-xs text-violet-400 hover:text-violet-300">+ Hinzufügen</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Beschreibung" className="col-span-5 bg-slate-800/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500" />
                  <input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="col-span-2 bg-slate-800/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-violet-500" min="1" />
                  <input type="number" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} className="col-span-3 bg-slate-800/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-violet-500" min="0" step="0.5" />
                  <span className="col-span-1 text-slate-400 text-xs text-right">{formatCurrency(item.total)}</span>
                  <button type="button" onClick={() => removeItem(idx)} className="col-span-1 text-slate-600 hover:text-red-400 flex justify-center">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="text-right mt-2">
              <span className="text-white font-semibold">Gesamt: {formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm transition-colors">Abbrechen</button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">Erstellen</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvoiceList() {
  const { invoices, students, updateInvoice } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [showForm, setShowForm] = useState(false);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';

  const filtered = invoices
    .filter(i => activeTab === 'all' || i.status === activeTab)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const markPaid = (inv: Invoice) => updateInvoice(inv.id, { status: 'paid', paidAt: new Date().toISOString() });
  const markSent = (inv: Invoice) => updateInvoice(inv.id, { status: 'sent', sentAt: new Date().toISOString() });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rechnungen</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} Rechnungen</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Neue Rechnung
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-violet-600/80 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Nummer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Schüler</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Betrag</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Fällig</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">Keine Rechnungen gefunden</td></tr>
              ) : filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3 text-sm font-mono text-violet-400">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3 text-sm text-white">{getStudentName(inv.studentId)}</td>
                  <td className="px-5 py-3 text-sm text-white hidden sm:table-cell">{formatCurrency(inv.totalAmount)}</td>
                  <td className="px-5 py-3 text-sm text-slate-400 hidden md:table-cell">{formatDate(inv.dueDate)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(inv.status)}`}>{statusLabel(inv.status)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/portal/invoices/${inv.id}`)} title="Anzeigen" className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-white/5 rounded-lg transition-colors"><Eye size={15} /></button>
                      {inv.status === 'draft' && (
                        <button onClick={() => markSent(inv)} title="Versenden" className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"><Send size={15} /></button>
                      )}
                      {(inv.status === 'sent' || inv.status === 'overdue') && (
                        <button onClick={() => markPaid(inv)} title="Als bezahlt markieren" className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-white/5 rounded-lg transition-colors"><CheckCircle size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <InvoiceModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
