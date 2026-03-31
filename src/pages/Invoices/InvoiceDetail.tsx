import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft } from 'lucide-react';
import { formatDate, formatCurrency, statusLabel, statusColor } from '../../utils/helpers';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, students, parents, updateInvoice } = useData();

  const invoice = invoices.find(i => i.id === id);
  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Rechnung nicht gefunden</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-violet-400 hover:underline">Zurück</button>
      </div>
    );
  }

  const student = students.find(s => s.id === invoice.studentId);
  const parent = invoice.parentId ? parents.find(p => p.id === invoice.parentId) : undefined;

  const markPaid = () => updateInvoice(invoice.id, { status: 'paid', paidAt: new Date().toISOString() });
  const markSent = () => updateInvoice(invoice.id, { status: 'sent', sentAt: new Date().toISOString() });

  const paymentMethodLabel = (m: string) => {
    if (m === 'sepa') return 'SEPA-Lastschrift';
    if (m === 'transfer') return 'Überweisung';
    return 'Bar';
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white font-mono">{invoice.invoiceNumber}</h1>
            <span className={`text-sm px-2.5 py-1 rounded-full ${statusColor(invoice.status)}`}>
              {statusLabel(invoice.status)}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Erstellt am {formatDate(invoice.createdAt)}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Schüler</p>
            <p className="text-white font-medium">{student?.name ?? '–'}</p>
            <p className="text-slate-400 text-sm">{student?.email ?? ''}</p>
          </div>
          {parent && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Rechnungsempfänger</p>
              <p className="text-white font-medium">{parent.name}</p>
              <p className="text-slate-400 text-sm">{parent.email}</p>
              {parent.address && <p className="text-slate-400 text-sm">{parent.address}</p>}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
          <div>
            <p className="text-xs text-slate-500 mb-1">Fälligkeitsdatum</p>
            <p className="text-white">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Zahlungsmethode</p>
            <p className="text-white">{paymentMethodLabel(invoice.paymentMethod)}</p>
          </div>
          {invoice.paidAt && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Bezahlt am</p>
              <p className="text-white">{formatDate(invoice.paidAt)}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="pb-2 text-xs text-slate-500 font-medium">Beschreibung</th>
              <th className="pb-2 text-xs text-slate-500 font-medium text-right">Menge</th>
              <th className="pb-2 text-xs text-slate-500 font-medium text-right">Einzelpreis</th>
              <th className="pb-2 text-xs text-slate-500 font-medium text-right">Gesamt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 text-sm text-white">{item.description}</td>
                <td className="py-3 text-sm text-slate-300 text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-slate-300 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-sm text-white font-medium text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10">
              <td colSpan={3} className="pt-3 text-right text-sm font-semibold text-white pr-4">Gesamtbetrag</td>
              <td className="pt-3 text-right text-lg font-bold text-white">{formatCurrency(invoice.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {invoice.status === 'draft' && (
          <button onClick={markSent} className="bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
            Versenden
          </button>
        )}
        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
          <button onClick={markPaid} className="bg-green-600/80 hover:bg-green-500/80 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
            Als bezahlt markieren
          </button>
        )}
        <button
          onClick={() => alert('PDF wird generiert...')}
          className="bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          PDF herunterladen
        </button>
      </div>
    </div>
  );
}
