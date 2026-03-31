export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Aktiv',
    paused: 'Pausiert',
    archived: 'Archiviert',
    scheduled: 'Geplant',
    completed: 'Abgeschlossen',
    cancelled: 'Abgesagt',
    substituted: 'Vertreten',
    draft: 'Entwurf',
    sent: 'Versendet',
    paid: 'Bezahlt',
    overdue: 'Überfällig',
    depleted: 'Aufgebraucht',
    pending: 'Ausstehend',
    revoked: 'Widerrufen',
  };
  return map[status] ?? status;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    archived: 'bg-slate-500/20 text-slate-400',
    scheduled: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    substituted: 'bg-orange-500/20 text-orange-400',
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-green-500/20 text-green-400',
    overdue: 'bg-red-500/20 text-red-400',
    depleted: 'bg-orange-500/20 text-orange-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    revoked: 'bg-red-500/20 text-red-400',
  };
  return map[status] ?? 'bg-slate-500/20 text-slate-400';
}
