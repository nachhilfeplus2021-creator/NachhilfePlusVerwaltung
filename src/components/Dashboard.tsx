import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
  Phone
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  subject: string;
  grade: string;
  status: 'Aktiv' | 'Pause';
  lastLesson: string;
  email: string;
}

interface Teacher {
  id: number;
  name: string;
  subjects: string[];
  rating: number;
  students: number;
  status: 'Verfügbar' | 'Beschäftigt';
  image?: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedule' | 'teachers'>('overview');
  const [showAddStudent, setShowAddStudent] = useState(false);
  
  // Students State
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Lukas Müller', subject: 'Mathematik', grade: '10. Klasse', status: 'Aktiv', lastLesson: 'Gestern', email: 'lukas@example.com' },
    { id: 2, name: 'Sophie Schmidt', subject: 'Englisch', grade: '8. Klasse', status: 'Aktiv', lastLesson: 'Vor 2 Tagen', email: 'sophie@example.com' },
    { id: 3, name: 'Maximilian Weber', subject: 'Physik', grade: '12. Klasse', status: 'Pause', lastLesson: 'Vor 1 Woche', email: 'max@example.com' },
    { id: 4, name: 'Emma Fischer', subject: 'Deutsch', grade: '6. Klasse', status: 'Aktiv', lastLesson: 'Heute', email: 'emma@example.com' },
  ]);

  // Teachers Data
  const teachers: Teacher[] = [
    { id: 1, name: 'Dr. Thomas Wagner', subjects: ['Mathematik', 'Physik'], rating: 4.9, students: 15, status: 'Verfügbar' },
    { id: 2, name: 'Sarah Becker', subjects: ['Deutsch', 'Latein'], rating: 4.8, students: 12, status: 'Beschäftigt' },
    { id: 3, name: 'Michael Meyer', subjects: ['Englisch', 'Spanisch'], rating: 4.7, students: 10, status: 'Verfügbar' },
    { id: 4, name: 'Julia Klein', subjects: ['Biologie', 'Chemie'], rating: 5.0, students: 8, status: 'Verfügbar' },
  ];

  const schedule = [
    { id: 1, time: '14:30 - 16:00', student: 'Lukas Müller', subject: 'Mathematik', teacher: 'Dr. Wagner', day: 'Montag' },
    { id: 2, time: '16:15 - 17:45', student: 'Emma Fischer', subject: 'Deutsch', teacher: 'Frau Becker', day: 'Montag' },
    { id: 3, time: '18:00 - 19:30', student: 'Sophie Schmidt', subject: 'Englisch', teacher: 'Herr Meyer', day: 'Dienstag' },
    { id: 4, time: '15:00 - 16:30', student: 'Maximilian Weber', subject: 'Physik', teacher: 'Dr. Wagner', day: 'Mittwoch' },
  ];

  const stats = [
    { label: 'Aktive Schüler', value: students.length.toString(), icon: Users, color: 'text-blue-500' },
    { label: 'Stunden diese Woche', value: '48', icon: Calendar, color: 'text-violet-500' },
    { label: 'Erfolgsquote', value: '98%', icon: TrendingUp, color: 'text-pink-500' },
    { label: 'Verfügbare Lehrer', value: teachers.filter(t => t.status === 'Verfügbar').length.toString(), icon: GraduationCap, color: 'text-emerald-500' },
  ];

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#020617]">
      {/* Background Glows */}
      <div className="bg-glow w-[500px] h-[500px] bg-violet-500 -top-48 -left-48" />
      <div className="bg-glow w-[400px] h-[400px] bg-blue-500 bottom-0 -right-24" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Verwaltungs<span className="text-gradient">Zentrale</span>
            </h1>
            <p className="text-slate-400">Willkommen zurück, Administrator. Hier ist die Übersicht für heute.</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab('students');
              setShowAddStudent(true);
            }}
            className="btn-glow bg-violet-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 w-fit"
          >
            <Plus size={20} />
            Neuer Schüler
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: 'Übersicht', icon: TrendingUp },
            { id: 'students', label: 'Schüler', icon: Users },
            { id: 'schedule', label: 'Stundenplan', icon: Calendar },
            { id: 'teachers', label: 'Lehrkräfte', icon: GraduationCap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">+12%</span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Aktuelle Schüler</h2>
                  <button onClick={() => setActiveTab('students')} className="text-violet-400 hover:text-violet-300 text-sm font-medium">Alle ansehen</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 text-sm border-b border-white/5">
                        <th className="pb-4 font-medium">Name</th>
                        <th className="pb-4 font-medium">Fach</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium text-right">Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {students.slice(0, 4).map((student) => (
                        <tr key={student.id} className="border-b border-white/5 last:border-0 group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-primary p-[1px]">
                                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-xs font-bold">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              </div>
                              <div>
                                <p className="font-bold text-white">{student.name}</p>
                                <p className="text-xs text-slate-500">{student.grade}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm">{student.subject}</td>
                          <td className="py-4">
                            <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                              student.status === 'Aktiv' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="glass-card">
                <h2 className="text-xl font-bold text-white mb-6">Heute anstehend</h2>
                <div className="space-y-6">
                  {schedule.filter(s => s.day === 'Montag').map((item) => (
                    <div key={item.id} className="relative pl-6 border-l-2 border-violet-500/30 group">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                      <p className="text-xs font-bold text-violet-400 mb-1">{item.time}</p>
                      <p className="font-bold text-white group-hover:text-violet-400 transition-colors">{item.student}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <BookOpen size={12} />
                        <span>{item.subject}</span>
                        <span className="mx-1">•</span>
                        <Users size={12} />
                        <span>{item.teacher}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab('schedule')} className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all mt-4">
                    Vollständiger Kalender
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Schüler suchen..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="btn-glow bg-violet-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
              >
                <Plus size={20} />
                Schüler hinzufügen
              </button>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-sm border-b border-white/5">
                      <th className="p-6 font-medium">Name</th>
                      <th className="p-6 font-medium">Fach & Klasse</th>
                      <th className="p-6 font-medium">Kontakt</th>
                      <th className="p-6 font-medium">Status</th>
                      <th className="p-6 font-medium text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary p-[1px]">
                              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-xs font-bold">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            <p className="font-bold text-white">{student.name}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-white font-medium">{student.subject}</p>
                          <p className="text-xs text-slate-500">{student.grade}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-sm text-slate-400">{student.email}</p>
                        </td>
                        <td className="p-6">
                          <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                            student.status === 'Aktiv' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(student.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab (Calendar View) */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">März 2026</h2>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white/10 text-white">Woche</button>
                <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white">Monat</button>
              </div>
            </div>

            <div className="glass-card p-0 overflow-hidden">
              <div className="grid grid-cols-6 border-b border-white/10">
                {['Zeit', 'Mo', 'Di', 'Mi', 'Do', 'Fr'].map((day) => (
                  <div key={day} className="p-4 text-center text-sm font-bold text-slate-500 border-r border-white/10 last:border-0">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-6 h-[600px]">
                {/* Time Column */}
                <div className="border-r border-white/10 bg-white/[0.01]">
                  {['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((time) => (
                    <div key={time} className="h-24 p-2 text-[10px] font-bold text-slate-600 border-b border-white/5">
                      {time}
                    </div>
                  ))}
                </div>
                {/* Days Columns */}
                {[1, 2, 3, 4, 5].map((dayIndex) => (
                  <div key={dayIndex} className="relative border-r border-white/10 last:border-0 bg-white/[0.01]">
                    {schedule
                      .filter(s => {
                        const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
                        return s.day === days[dayIndex - 1];
                      })
                      .map((item) => {
                        const startHour = parseInt(item.time.split(':')[0]);
                        const top = (startHour - 14) * 96 + 20;
                        return (
                          <div 
                            key={item.id}
                            className="absolute left-2 right-2 p-3 rounded-xl bg-violet-500/20 border border-violet-500/30 group cursor-pointer hover:bg-violet-500/30 transition-all"
                            style={{ top: `${top}px`, height: '80px' }}
                          >
                            <p className="text-[10px] font-bold text-violet-400 mb-1">{item.time}</p>
                            <p className="text-xs font-bold text-white truncate">{item.student}</p>
                            <p className="text-[10px] text-slate-400 truncate">{item.subject}</p>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="glass-card group hover:border-violet-500/30 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary p-[1px]">
                        <div className="w-full h-full rounded-2xl bg-[#0f172a] flex items-center justify-center text-xl font-bold">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{teacher.name}</h3>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-bold">{teacher.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${
                      teacher.status === 'Verfügbar' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                    }`}>
                      {teacher.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Fachbereiche</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.subjects.map((s, i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Schüler</p>
                        <p className="text-lg font-bold text-white">{teacher.students}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Erfahrung</p>
                        <p className="text-lg font-bold text-white">5+ Jahre</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button className="flex-1 py-2 rounded-xl bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Mail size={16} />
                        Kontakt
                      </button>
                      <button className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Teacher Card */}
              <button className="glass-card border-dashed border-2 border-white/10 hover:border-violet-500/30 flex flex-col items-center justify-center gap-4 group transition-all min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-all">
                  <Plus size={32} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">Lehrkraft hinzufügen</p>
                  <p className="text-sm text-slate-500">Erweitere dein Team</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm" onClick={() => setShowAddStudent(false)} />
          <div className="glass-card w-full max-w-lg relative z-10 animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Neuer Schüler</h2>
              <button onClick={() => setShowAddStudent(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              setShowAddStudent(false);
            }}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Vollständiger Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500" placeholder="z.B. Max Mustermann" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Fach</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500">
                    <option>Mathematik</option>
                    <option>Englisch</option>
                    <option>Deutsch</option>
                    <option>Physik</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Klasse</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500" placeholder="z.B. 10. Klasse" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">E-Mail Adresse</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500" placeholder="max@beispiel.de" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddStudent(false)} className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                  Abbrechen
                </button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-violet-500 text-white font-bold btn-glow">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;