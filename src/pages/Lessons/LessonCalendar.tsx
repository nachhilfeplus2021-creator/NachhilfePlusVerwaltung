import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatTime, statusColor } from '../../utils/helpers';
import LessonForm from './LessonForm';
import type { Lesson } from '../../types';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00

export default function LessonCalendar() {
  const { lessons, students, tutors, subjects, updateLesson } = useData();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | undefined>();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const [newSlot, setNewSlot] = useState<{ date: string; hour: number } | undefined>();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getLessonsForDay = (day: Date) =>
    lessons.filter(l => {
      const d = parseISO(l.startTime);
      return d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate();
    });

  const lessonColorClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500/40 text-green-300';
      case 'scheduled': return 'bg-blue-500/20 border-blue-500/40 text-blue-300';
      case 'cancelled': return 'bg-red-500/20 border-red-500/40 text-red-300';
      case 'substituted': return 'bg-orange-500/20 border-orange-500/40 text-orange-300';
      default: return 'bg-slate-500/20 border-slate-500/40 text-slate-300';
    }
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? '–';
  const getTutorName = (id: string) => tutors.find(t => t.id === id)?.name ?? '–';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  const openSlot = (day: Date, hour: number) => {
    setNewSlot({ date: format(day, 'yyyy-MM-dd'), hour });
    setShowForm(true);
  };

  const openEdit = (l: Lesson) => {
    setSelectedLesson(undefined);
    setEditLesson(l);
    setShowForm(true);
  };

  const handleComplete = (l: Lesson) => {
    updateLesson(l.id, { status: 'completed' });
    setSelectedLesson(undefined);
  };

  const handleCancel = (l: Lesson) => {
    const reason = window.prompt('Absagegrund:') ?? '';
    updateLesson(l.id, { status: 'cancelled', cancellationReason: reason });
    setSelectedLesson(undefined);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditLesson(undefined);
    setNewSlot(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Terminkalender</h1>
          <p className="text-slate-400 text-sm">
            {format(weekStart, 'dd. MMMM', { locale: de })} – {format(addDays(weekStart, 6), 'dd. MMMM yyyy', { locale: de })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(w => subWeeks(w, 1))} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            Heute
          </button>
          <button onClick={() => setWeekStart(w => addWeeks(w, 1))} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all ml-2"
          >
            <Plus size={16} />
            Neue Stunde
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { label: 'Geplant', cls: 'bg-blue-500/20 text-blue-300' },
          { label: 'Abgeschlossen', cls: 'bg-green-500/20 text-green-300' },
          { label: 'Abgesagt', cls: 'bg-red-500/20 text-red-300' },
          { label: 'Vertreten', cls: 'bg-orange-500/20 text-orange-300' },
        ].map(l => (
          <span key={l.label} className={`text-xs px-2 py-1 rounded-full ${l.cls}`}>{l.label}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-white/10">
              <div className="px-2 py-3 text-xs text-slate-500 text-center">Zeit</div>
              {days.map(day => {
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <div key={day.toISOString()} className={`px-2 py-3 text-center border-l border-white/5 ${isToday ? 'bg-violet-600/10' : ''}`}>
                    <p className={`text-xs font-medium ${isToday ? 'text-violet-400' : 'text-slate-400'}`}>
                      {format(day, 'EEE', { locale: de })}
                    </p>
                    <p className={`text-sm font-bold ${isToday ? 'text-violet-300' : 'text-white'}`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Hour rows */}
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-white/5 min-h-[60px]">
                <div className="px-2 py-1 text-xs text-slate-600 text-right pt-1 pr-3">
                  {String(hour).padStart(2, '0')}:00
                </div>
                {days.map(day => {
                  const dayLessons = getLessonsForDay(day).filter(l => {
                    const h = parseISO(l.startTime).getHours();
                    return h === hour;
                  });
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => openSlot(day, hour)}
                      className={`border-l border-white/5 p-1 cursor-pointer hover:bg-white/2 transition-colors relative ${isToday ? 'bg-violet-600/5' : ''}`}
                    >
                      {dayLessons.map(l => (
                        <button
                          key={l.id}
                          onClick={e => { e.stopPropagation(); setSelectedLesson(l); }}
                          className={`w-full text-left text-xs p-1 rounded border mb-0.5 ${lessonColorClass(l.status)} hover:opacity-80 transition-opacity`}
                        >
                          <p className="font-medium truncate">{getStudentName(l.studentId)}</p>
                          <p className="opacity-70 truncate">{formatTime(l.startTime)}-{formatTime(l.endTime)}</p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Detail Popup */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Termindetails</h3>
              <button onClick={() => setSelectedLesson(undefined)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 mb-5">
              <p className="text-slate-300"><span className="text-slate-500">Schüler:</span> {getStudentName(selectedLesson.studentId)}</p>
              <p className="text-slate-300"><span className="text-slate-500">Lehrkraft:</span> {getTutorName(selectedLesson.tutorId)}</p>
              <p className="text-slate-300"><span className="text-slate-500">Fach:</span> {getSubjectName(selectedLesson.subjectId)}</p>
              <p className="text-slate-300"><span className="text-slate-500">Zeit:</span> {formatTime(selectedLesson.startTime)} – {formatTime(selectedLesson.endTime)}</p>
              <p className="text-slate-300"><span className="text-slate-500">Datum:</span> {format(parseISO(selectedLesson.startTime), 'dd.MM.yyyy')}</p>
              <span className={`inline-block text-xs px-2 py-1 rounded-full ${statusColor(selectedLesson.status)}`}>
                {selectedLesson.status === 'scheduled' ? 'Geplant' : selectedLesson.status === 'completed' ? 'Abgeschlossen' : selectedLesson.status === 'cancelled' ? 'Abgesagt' : 'Vertreten'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {selectedLesson.status === 'scheduled' && (
                <>
                  <button onClick={() => handleComplete(selectedLesson)} className="bg-green-600/80 hover:bg-green-500/80 text-white rounded-xl px-4 py-2 text-sm transition-colors">
                    ✓ Abgeschlossen markieren
                  </button>
                  <button onClick={() => handleCancel(selectedLesson)} className="bg-red-600/30 hover:bg-red-500/40 text-red-300 rounded-xl px-4 py-2 text-sm transition-colors">
                    ✕ Absagen
                  </button>
                </>
              )}
              <button onClick={() => openEdit(selectedLesson)} className="bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl px-4 py-2 text-sm transition-colors">
                Bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <LessonForm
          lesson={editLesson}
          defaultDate={newSlot?.date}
          defaultHour={newSlot?.hour}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
