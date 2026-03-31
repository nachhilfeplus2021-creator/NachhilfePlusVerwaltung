import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User, Student, Parent, Tutor, Location, Room, Subject,
  Package, HourTransaction, Lesson, Invoice, SepaMandate,
  PayrollGroup, TutorPayout, Reminder, AuditLog
} from '../types';
import { getInitialData } from '../data/initialData';

interface DataContextType {
  users: User[];
  students: Student[];
  parents: Parent[];
  tutors: Tutor[];
  locations: Location[];
  rooms: Room[];
  subjects: Subject[];
  packages: Package[];
  hourTransactions: HourTransaction[];
  lessons: Lesson[];
  invoices: Invoice[];
  sepaMandates: SepaMandate[];
  payrollGroups: PayrollGroup[];
  tutorPayouts: TutorPayout[];
  reminders: Reminder[];
  auditLogs: AuditLog[];

  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, u: Partial<User>) => void;
  deleteUser: (id: string) => void;

  addStudent: (s: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addParent: (p: Omit<Parent, 'id' | 'createdAt'>) => void;
  updateParent: (id: string, p: Partial<Parent>) => void;
  deleteParent: (id: string) => void;

  addTutor: (t: Omit<Tutor, 'id' | 'createdAt'>) => void;
  updateTutor: (id: string, t: Partial<Tutor>) => void;
  deleteTutor: (id: string) => void;

  addLocation: (l: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, l: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  addRoom: (r: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, r: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  addSubject: (s: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, s: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addPackage: (p: Omit<Package, 'id' | 'createdAt'>) => void;
  updatePackage: (id: string, p: Partial<Package>) => void;
  deletePackage: (id: string) => void;

  addHourTransaction: (h: Omit<HourTransaction, 'id' | 'createdAt'>) => void;
  updateHourTransaction: (id: string, h: Partial<HourTransaction>) => void;
  deleteHourTransaction: (id: string) => void;

  addLesson: (l: Omit<Lesson, 'id' | 'createdAt'>) => void;
  updateLesson: (id: string, l: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;

  addInvoice: (i: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, i: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  addSepaMandate: (s: Omit<SepaMandate, 'id'>) => void;
  updateSepaMandate: (id: string, s: Partial<SepaMandate>) => void;
  deleteSepaMandate: (id: string) => void;

  addPayrollGroup: (p: Omit<PayrollGroup, 'id'>) => void;
  updatePayrollGroup: (id: string, p: Partial<PayrollGroup>) => void;
  deletePayrollGroup: (id: string) => void;

  addTutorPayout: (p: Omit<TutorPayout, 'id' | 'createdAt'>) => void;
  updateTutorPayout: (id: string, p: Partial<TutorPayout>) => void;
  deleteTutorPayout: (id: string) => void;

  addReminder: (r: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, r: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;

  addAuditLog: (a: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

function makeId() {
  return crypto.randomUUID();
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const initial = (() => {
    const stored = localStorage.getItem('nachhilfe_data');
    return stored ? JSON.parse(stored) : getInitialData();
  })();

  const [users, setUsers] = useState<User[]>(initial.users ?? []);
  const [students, setStudents] = useState<Student[]>(initial.students ?? []);
  const [parents, setParents] = useState<Parent[]>(initial.parents ?? []);
  const [tutors, setTutors] = useState<Tutor[]>(initial.tutors ?? []);
  const [locations, setLocations] = useState<Location[]>(initial.locations ?? []);
  const [rooms, setRooms] = useState<Room[]>(initial.rooms ?? []);
  const [subjects, setSubjects] = useState<Subject[]>(initial.subjects ?? []);
  const [packages, setPackages] = useState<Package[]>(initial.packages ?? []);
  const [hourTransactions, setHourTransactions] = useState<HourTransaction[]>(initial.hourTransactions ?? []);
  const [lessons, setLessons] = useState<Lesson[]>(initial.lessons ?? []);
  const [invoices, setInvoices] = useState<Invoice[]>(initial.invoices ?? []);
  const [sepaMandates, setSepaMandates] = useState<SepaMandate[]>(initial.sepaMandates ?? []);
  const [payrollGroups, setPayrollGroups] = useState<PayrollGroup[]>(initial.payrollGroups ?? []);
  const [tutorPayouts, setTutorPayouts] = useState<TutorPayout[]>(initial.tutorPayouts ?? []);
  const [reminders, setReminders] = useState<Reminder[]>(initial.reminders ?? []);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initial.auditLogs ?? []);

  useEffect(() => {
    const data = { users, students, parents, tutors, locations, rooms, subjects, packages, hourTransactions, lessons, invoices, sepaMandates, payrollGroups, tutorPayouts, reminders, auditLogs };
    localStorage.setItem('nachhilfe_data', JSON.stringify(data));
  }, [users, students, parents, tutors, locations, rooms, subjects, packages, hourTransactions, lessons, invoices, sepaMandates, payrollGroups, tutorPayouts, reminders, auditLogs]);

  // Users
  const addUser = (u: Omit<User, 'id' | 'createdAt'>) => setUsers(p => [...p, { ...u, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateUser = (id: string, u: Partial<User>) => setUsers(p => p.map(x => x.id === id ? { ...x, ...u } : x));
  const deleteUser = (id: string) => setUsers(p => p.filter(x => x.id !== id));

  // Students
  const addStudent = (s: Omit<Student, 'id' | 'createdAt'>) => setStudents(p => [...p, { ...s, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateStudent = (id: string, s: Partial<Student>) => setStudents(p => p.map(x => x.id === id ? { ...x, ...s } : x));
  const deleteStudent = (id: string) => setStudents(p => p.filter(x => x.id !== id));

  // Parents
  const addParent = (par: Omit<Parent, 'id' | 'createdAt'>) => setParents(p => [...p, { ...par, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateParent = (id: string, par: Partial<Parent>) => setParents(p => p.map(x => x.id === id ? { ...x, ...par } : x));
  const deleteParent = (id: string) => setParents(p => p.filter(x => x.id !== id));

  // Tutors
  const addTutor = (t: Omit<Tutor, 'id' | 'createdAt'>) => setTutors(p => [...p, { ...t, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateTutor = (id: string, t: Partial<Tutor>) => setTutors(p => p.map(x => x.id === id ? { ...x, ...t } : x));
  const deleteTutor = (id: string) => setTutors(p => p.filter(x => x.id !== id));

  // Locations
  const addLocation = (l: Omit<Location, 'id'>) => setLocations(p => [...p, { ...l, id: makeId() }]);
  const updateLocation = (id: string, l: Partial<Location>) => setLocations(p => p.map(x => x.id === id ? { ...x, ...l } : x));
  const deleteLocation = (id: string) => setLocations(p => p.filter(x => x.id !== id));

  // Rooms
  const addRoom = (r: Omit<Room, 'id'>) => setRooms(p => [...p, { ...r, id: makeId() }]);
  const updateRoom = (id: string, r: Partial<Room>) => setRooms(p => p.map(x => x.id === id ? { ...x, ...r } : x));
  const deleteRoom = (id: string) => setRooms(p => p.filter(x => x.id !== id));

  // Subjects
  const addSubject = (s: Omit<Subject, 'id'>) => setSubjects(p => [...p, { ...s, id: makeId() }]);
  const updateSubject = (id: string, s: Partial<Subject>) => setSubjects(p => p.map(x => x.id === id ? { ...x, ...s } : x));
  const deleteSubject = (id: string) => setSubjects(p => p.filter(x => x.id !== id));

  // Packages
  const addPackage = (pkg: Omit<Package, 'id' | 'createdAt'>) => setPackages(p => [...p, { ...pkg, id: makeId(), createdAt: new Date().toISOString() }]);
  const updatePackage = (id: string, pkg: Partial<Package>) => setPackages(p => p.map(x => x.id === id ? { ...x, ...pkg } : x));
  const deletePackage = (id: string) => setPackages(p => p.filter(x => x.id !== id));

  // Hour Transactions
  const addHourTransaction = (h: Omit<HourTransaction, 'id' | 'createdAt'>) => setHourTransactions(p => [...p, { ...h, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateHourTransaction = (id: string, h: Partial<HourTransaction>) => setHourTransactions(p => p.map(x => x.id === id ? { ...x, ...h } : x));
  const deleteHourTransaction = (id: string) => setHourTransactions(p => p.filter(x => x.id !== id));

  // Lessons
  const addLesson = (l: Omit<Lesson, 'id' | 'createdAt'>) => setLessons(p => [...p, { ...l, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateLesson = (id: string, l: Partial<Lesson>) => setLessons(p => p.map(x => x.id === id ? { ...x, ...l } : x));
  const deleteLesson = (id: string) => setLessons(p => p.filter(x => x.id !== id));

  // Invoices
  const addInvoice = (i: Omit<Invoice, 'id' | 'createdAt'>) => setInvoices(p => [...p, { ...i, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateInvoice = (id: string, i: Partial<Invoice>) => setInvoices(p => p.map(x => x.id === id ? { ...x, ...i } : x));
  const deleteInvoice = (id: string) => setInvoices(p => p.filter(x => x.id !== id));

  // SEPA
  const addSepaMandate = (s: Omit<SepaMandate, 'id'>) => setSepaMandates(p => [...p, { ...s, id: makeId() }]);
  const updateSepaMandate = (id: string, s: Partial<SepaMandate>) => setSepaMandates(p => p.map(x => x.id === id ? { ...x, ...s } : x));
  const deleteSepaMandate = (id: string) => setSepaMandates(p => p.filter(x => x.id !== id));

  // Payroll Groups
  const addPayrollGroup = (pg: Omit<PayrollGroup, 'id'>) => setPayrollGroups(p => [...p, { ...pg, id: makeId() }]);
  const updatePayrollGroup = (id: string, pg: Partial<PayrollGroup>) => setPayrollGroups(p => p.map(x => x.id === id ? { ...x, ...pg } : x));
  const deletePayrollGroup = (id: string) => setPayrollGroups(p => p.filter(x => x.id !== id));

  // Tutor Payouts
  const addTutorPayout = (tp: Omit<TutorPayout, 'id' | 'createdAt'>) => setTutorPayouts(p => [...p, { ...tp, id: makeId(), createdAt: new Date().toISOString() }]);
  const updateTutorPayout = (id: string, tp: Partial<TutorPayout>) => setTutorPayouts(p => p.map(x => x.id === id ? { ...x, ...tp } : x));
  const deleteTutorPayout = (id: string) => setTutorPayouts(p => p.filter(x => x.id !== id));

  // Reminders
  const addReminder = (r: Omit<Reminder, 'id'>) => setReminders(p => [...p, { ...r, id: makeId() }]);
  const updateReminder = (id: string, r: Partial<Reminder>) => setReminders(p => p.map(x => x.id === id ? { ...x, ...r } : x));
  const deleteReminder = (id: string) => setReminders(p => p.filter(x => x.id !== id));

  // Audit Logs
  const addAuditLog = (a: Omit<AuditLog, 'id' | 'timestamp'>) => setAuditLogs(p => [...p, { ...a, id: makeId(), timestamp: new Date().toISOString() }]);

  const value: DataContextType = {
    users, students, parents, tutors, locations, rooms, subjects, packages, hourTransactions, lessons, invoices, sepaMandates, payrollGroups, tutorPayouts, reminders, auditLogs,
    addUser, updateUser, deleteUser,
    addStudent, updateStudent, deleteStudent,
    addParent, updateParent, deleteParent,
    addTutor, updateTutor, deleteTutor,
    addLocation, updateLocation, deleteLocation,
    addRoom, updateRoom, deleteRoom,
    addSubject, updateSubject, deleteSubject,
    addPackage, updatePackage, deletePackage,
    addHourTransaction, updateHourTransaction, deleteHourTransaction,
    addLesson, updateLesson, deleteLesson,
    addInvoice, updateInvoice, deleteInvoice,
    addSepaMandate, updateSepaMandate, deleteSepaMandate,
    addPayrollGroup, updatePayrollGroup, deletePayrollGroup,
    addTutorPayout, updateTutorPayout, deleteTutorPayout,
    addReminder, updateReminder, deleteReminder,
    addAuditLog,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
