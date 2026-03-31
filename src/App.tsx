import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/Students/StudentList';
import StudentDetail from './pages/Students/StudentDetail';
import TutorList from './pages/Tutors/TutorList';
import LessonCalendar from './pages/Lessons/LessonCalendar';
import LessonList from './pages/Lessons/LessonList';
import Packages from './pages/Packages';
import InvoiceList from './pages/Invoices/InvoiceList';
import InvoiceDetail from './pages/Invoices/InvoiceDetail';
import ParentPortal from './pages/ParentPortal';
import TutorPortal from './pages/TutorPortal';
import Reports from './pages/Reports';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Chat from './components/Chat';
import Solver from './components/Solver';
import Quiz from './components/Quiz';
import Footer from './components/Footer';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function HomeApp() {
  const [view, setView] = useState<'home' | 'chat' | 'solver' | 'quiz' | 'dashboard'>('home');
  const navigate = useNavigate();

  const handleSetView = (v: 'home' | 'chat' | 'solver' | 'quiz' | 'dashboard') => {
    if (v === 'dashboard') {
      navigate('/portal');
    } else {
      setView(v);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'chat': return <Chat />;
      case 'solver': return <Solver />;
      case 'quiz': return <Quiz />;
      default: return (
        <>
          <Hero setView={handleSetView} />
          <Features setView={handleSetView} />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col selection:bg-violet-500/30 selection:text-white">
      <Header setView={handleSetView} currentView={view} />
      <main className="flex-grow">
        <div className="animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={
          currentUser?.role === 'parent' ? <Navigate to="/portal/parent" replace /> :
          currentUser?.role === 'tutor' ? <Navigate to="/portal/my-lessons" replace /> :
          <Dashboard />
        } />
        <Route path="students" element={<StudentList />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="tutors" element={<TutorList />} />
        <Route path="lessons" element={<LessonCalendar />} />
        <Route path="lessons/list" element={<LessonList />} />
        <Route path="packages" element={<Packages />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="parent" element={<ParentPortal />} />
        <Route path="my-lessons" element={<TutorPortal />} />
        <Route path="tools" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">KI-Tools</h1>
            <p className="text-slate-400">Besuchen Sie die <a href="/" className="text-violet-400 hover:underline">Startseite</a> für KI-Tools.</p>
          </div>
        } />
      </Route>
      <Route path="/" element={<HomeApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
