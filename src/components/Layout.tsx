import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, UserCheck, Calendar, Package,
  FileText, BarChart2, Wand2, Clock, Wallet, Home,
  CreditCard, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/portal', icon: <LayoutDashboard size={18} />, roles: ['admin', 'office'] },
  { label: 'Schüler', path: '/portal/students', icon: <Users size={18} />, roles: ['admin', 'office'] },
  { label: 'Lehrkräfte', path: '/portal/tutors', icon: <UserCheck size={18} />, roles: ['admin', 'office'] },
  { label: 'Termine', path: '/portal/lessons', icon: <Calendar size={18} />, roles: ['admin', 'office'] },
  { label: 'Pakete', path: '/portal/packages', icon: <Package size={18} />, roles: ['admin', 'office'] },
  { label: 'Rechnungen', path: '/portal/invoices', icon: <FileText size={18} />, roles: ['admin', 'office'] },
  { label: 'Berichte', path: '/portal/reports', icon: <BarChart2 size={18} />, roles: ['admin', 'office'] },
  { label: 'KI-Tools', path: '/portal/tools', icon: <Wand2 size={18} />, roles: ['admin', 'office'] },
  { label: 'Meine Stunden', path: '/portal/my-lessons', icon: <Clock size={18} />, roles: ['tutor'] },
  { label: 'Meine Abrechnung', path: '/portal/my-payouts', icon: <Wallet size={18} />, roles: ['tutor'] },
  { label: 'Übersicht', path: '/portal/parent', icon: <Home size={18} />, roles: ['parent'] },
  { label: 'Termine', path: '/portal/parent-lessons', icon: <Calendar size={18} />, roles: ['parent'] },
  { label: 'Rechnungen', path: '/portal/parent-invoices', icon: <FileText size={18} />, roles: ['parent'] },
  { label: 'Bankdaten', path: '/portal/sepa', icon: <CreditCard size={18} />, roles: ['parent'] },
];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  office: 'Büro',
  tutor: 'Lehrkraft',
  parent: 'Elternteil',
};

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = currentUser?.role ?? 'admin';
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          Nachhilfe+
        </h1>
        <p className="text-slate-500 text-xs mt-1">Verwaltung</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/portal'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/80 to-blue-600/80 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {currentUser?.name?.charAt(0) ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentUser?.name}</p>
            <span className="text-xs text-violet-400">{ROLE_LABELS[role] ?? role}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Abmelden
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900/80 backdrop-blur border-r border-white/10 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 w-64 flex flex-col bg-slate-900 border-r border-white/10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-white/10 px-4 lg:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium">{currentUser?.name}</p>
              <p className="text-slate-400 text-xs">{ROLE_LABELS[role] ?? role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {currentUser?.name?.charAt(0) ?? '?'}
            </div>
            <button
              onClick={handleLogout}
              title="Abmelden"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
