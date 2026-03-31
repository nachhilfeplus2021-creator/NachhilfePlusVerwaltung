import type {
  User, Student, Parent, Tutor, Location, Room, Subject,
  Package, HourTransaction, Lesson, Invoice, SepaMandate,
  PayrollGroup, TutorPayout, Reminder, AuditLog
} from '../types';

export function getInitialData() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  // Helper to build ISO date strings relative to today
  const dt = (daysOffset: number, hour = 10, minute = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  // Static past month dates
  const past = (monthOffset: number, day: number) =>
    new Date(y, m - monthOffset, day).toISOString();

  const users: User[] = [
    { id: 'user-admin', email: 'admin@nachhilfe.de', passwordHash: 'admin123', role: 'admin', name: 'Admin Mustermann', createdAt: past(6, 1) },
    { id: 'user-office', email: 'office@nachhilfe.de', passwordHash: 'office123', role: 'office', name: 'Sandra Büro', createdAt: past(6, 1) },
    { id: 'user-tutor', email: 'tutor@nachhilfe.de', passwordHash: 'tutor123', role: 'tutor', name: 'Michael Lehrer', createdAt: past(5, 15) },
    { id: 'user-parent', email: 'eltern@nachhilfe.de', passwordHash: 'eltern123', role: 'parent', name: 'Familie Müller', createdAt: past(5, 10) },
  ];

  const payrollGroups: PayrollGroup[] = [
    { id: 'pg-standard', name: 'Standard', hourlyRate: 15 },
    { id: 'pg-senior', name: 'Senior', hourlyRate: 20 },
  ];

  const subjects: Subject[] = [
    { id: 'subj-math', name: 'Mathematik' },
    { id: 'subj-eng', name: 'Englisch' },
    { id: 'subj-de', name: 'Deutsch' },
    { id: 'subj-phy', name: 'Physik' },
    { id: 'subj-chem', name: 'Chemie' },
    { id: 'subj-bio', name: 'Biologie' },
    { id: 'subj-hist', name: 'Geschichte' },
  ];

  const locations: Location[] = [
    { id: 'loc-1', name: 'Hauptstandort', address: 'Hauptstraße 1, 10115 Berlin', status: 'active' },
    { id: 'loc-2', name: 'Filiale Nord', address: 'Nordring 42, 10435 Berlin', status: 'active' },
  ];

  const rooms: Room[] = [
    { id: 'room-1', locationId: 'loc-1', name: 'Raum 1', capacity: 4, status: 'active' },
    { id: 'room-2', locationId: 'loc-1', name: 'Raum 2', capacity: 6, status: 'active' },
    { id: 'room-3', locationId: 'loc-2', name: 'Raum A', capacity: 3, status: 'active' },
    { id: 'room-4', locationId: 'loc-2', name: 'Raum B', capacity: 4, status: 'active' },
  ];

  const parents: Parent[] = [
    { id: 'par-1', name: 'Klaus Müller', email: 'k.mueller@email.de', phone: '0301234567', address: 'Musterstraße 5, 10115 Berlin', studentIds: ['stu-1'], userId: 'user-parent', createdAt: past(5, 10) },
    { id: 'par-2', name: 'Sabine Schmidt', email: 's.schmidt@email.de', phone: '0309876543', address: 'Birkenweg 3, 10435 Berlin', studentIds: ['stu-2', 'stu-3'], createdAt: past(4, 5) },
    { id: 'par-3', name: 'Thomas Weber', email: 't.weber@email.de', phone: '0302345678', address: 'Eichenallee 12, 12345 Berlin', studentIds: ['stu-4'], createdAt: past(3, 20) },
    { id: 'par-4', name: 'Maria Fischer', email: 'm.fischer@email.de', phone: '0307654321', address: 'Rosenweg 8, 13355 Berlin', studentIds: ['stu-5', 'stu-6'], createdAt: past(2, 10) },
  ];

  const students: Student[] = [
    { id: 'stu-1', name: 'Max Müller', email: 'max.mueller@schule.de', phone: '01701234567', birthDate: '2010-03-15', school: 'Gymnasium Mitte', grade: '8', parentIds: ['par-1'], subjects: ['subj-math', 'subj-phy'], status: 'active', createdAt: past(5, 10), notes: 'Sehr motiviert' },
    { id: 'stu-2', name: 'Anna Schmidt', email: 'anna.schmidt@schule.de', phone: '01709876543', birthDate: '2009-07-22', school: 'Realschule Nord', grade: '9', parentIds: ['par-2'], subjects: ['subj-eng', 'subj-de'], status: 'active', createdAt: past(4, 5) },
    { id: 'stu-3', name: 'Leon Schmidt', email: 'leon.schmidt@schule.de', phone: '01702345678', birthDate: '2012-01-10', school: 'Grundschule Nord', grade: '5', parentIds: ['par-2'], subjects: ['subj-math', 'subj-de'], status: 'active', createdAt: past(4, 5) },
    { id: 'stu-4', name: 'Sophie Weber', email: 'sophie.weber@schule.de', phone: '01703456789', birthDate: '2008-09-05', school: 'Gymnasium West', grade: '10', parentIds: ['par-3'], subjects: ['subj-math', 'subj-chem', 'subj-bio'], status: 'active', createdAt: past(3, 20) },
    { id: 'stu-5', name: 'Tim Fischer', email: 'tim.fischer@schule.de', birthDate: '2011-11-30', school: 'Gesamtschule Süd', grade: '7', parentIds: ['par-4'], subjects: ['subj-eng', 'subj-hist'], status: 'paused', createdAt: past(2, 10) },
    { id: 'stu-6', name: 'Lena Fischer', email: 'lena.fischer@schule.de', birthDate: '2007-04-18', school: 'Gymnasium Süd', grade: '11', parentIds: ['par-4'], subjects: ['subj-math', 'subj-phy', 'subj-chem'], status: 'active', createdAt: past(2, 10) },
  ];

  const tutors: Tutor[] = [
    { id: 'tut-1', name: 'Michael Lehrer', email: 'tutor@nachhilfe.de', phone: '01701111111', subjects: ['subj-math', 'subj-phy'], payrollGroupId: 'pg-senior', status: 'active', userId: 'user-tutor', createdAt: past(5, 15), qualifications: 'Diplom Mathematik, TU Berlin' },
    { id: 'tut-2', name: 'Julia Hoffmann', email: 'j.hoffmann@nachhilfe.de', phone: '01702222222', subjects: ['subj-eng', 'subj-de'], payrollGroupId: 'pg-standard', status: 'active', createdAt: past(4, 1), qualifications: 'B.A. Anglistik' },
    { id: 'tut-3', name: 'David Braun', email: 'd.braun@nachhilfe.de', phone: '01703333333', subjects: ['subj-chem', 'subj-bio', 'subj-math'], payrollGroupId: 'pg-standard', status: 'active', createdAt: past(3, 10), qualifications: 'M.Sc. Chemie' },
    { id: 'tut-4', name: 'Sarah Klein', email: 's.klein@nachhilfe.de', phone: '01704444444', subjects: ['subj-hist', 'subj-de'], payrollGroupId: 'pg-standard', status: 'archived', createdAt: past(6, 1) },
  ];

  const packages: Package[] = [
    { id: 'pkg-1', studentId: 'stu-1', name: 'Mathe Paket 10h', hoursTotal: 10, hoursUsed: 6, pricePerHour: 35, status: 'active', createdAt: past(3, 1) },
    { id: 'pkg-2', studentId: 'stu-1', name: 'Physik Paket 5h', hoursTotal: 5, hoursUsed: 5, pricePerHour: 35, status: 'depleted', createdAt: past(5, 1) },
    { id: 'pkg-3', studentId: 'stu-2', name: 'Englisch Paket 8h', hoursTotal: 8, hoursUsed: 3, pricePerHour: 32, status: 'active', createdAt: past(2, 15) },
    { id: 'pkg-4', studentId: 'stu-4', name: 'Mathe & Chemie 12h', hoursTotal: 12, hoursUsed: 8, pricePerHour: 38, status: 'active', createdAt: past(3, 5) },
    { id: 'pkg-5', studentId: 'stu-6', name: 'Abi-Vorbereitung 20h', hoursTotal: 20, hoursUsed: 4, pricePerHour: 40, status: 'active', createdAt: past(1, 1) },
    { id: 'pkg-6', studentId: 'stu-3', name: 'Mathe Grundschule 6h', hoursTotal: 6, hoursUsed: 2, pricePerHour: 28, status: 'active', createdAt: past(1, 10) },
  ];

  const hourTransactions: HourTransaction[] = [
    { id: 'ht-1', packageId: 'pkg-1', lessonId: 'les-1', hours: 1, createdAt: past(2, 10) },
    { id: 'ht-2', packageId: 'pkg-1', lessonId: 'les-2', hours: 1, createdAt: past(1, 15) },
    { id: 'ht-3', packageId: 'pkg-3', lessonId: 'les-3', hours: 1, createdAt: past(1, 20) },
    { id: 'ht-4', packageId: 'pkg-4', lessonId: 'les-4', hours: 2, createdAt: past(0, 5) },
  ];

  const lessons: Lesson[] = [
    { id: 'les-1', studentId: 'stu-1', tutorId: 'tut-1', roomId: 'room-1', subjectId: 'subj-math', startTime: dt(-14, 10, 0), endTime: dt(-14, 11, 0), status: 'completed', packageId: 'pkg-1', documentationNote: 'Quadratische Gleichungen geübt', createdAt: past(3, 1) },
    { id: 'les-2', studentId: 'stu-1', tutorId: 'tut-1', roomId: 'room-1', subjectId: 'subj-math', startTime: dt(-7, 10, 0), endTime: dt(-7, 11, 0), status: 'completed', packageId: 'pkg-1', documentationNote: 'Trigonometrie Grundlagen', createdAt: past(2, 1) },
    { id: 'les-3', studentId: 'stu-2', tutorId: 'tut-2', roomId: 'room-2', subjectId: 'subj-eng', startTime: dt(-7, 14, 0), endTime: dt(-7, 15, 0), status: 'completed', packageId: 'pkg-3', createdAt: past(2, 1) },
    { id: 'les-4', studentId: 'stu-4', tutorId: 'tut-3', roomId: 'room-3', subjectId: 'subj-chem', startTime: dt(-3, 16, 0), endTime: dt(-3, 18, 0), status: 'completed', packageId: 'pkg-4', documentationNote: 'Organische Chemie Einführung', createdAt: past(1, 1) },
    { id: 'les-5', studentId: 'stu-1', tutorId: 'tut-1', roomId: 'room-1', subjectId: 'subj-math', startTime: dt(1, 10, 0), endTime: dt(1, 11, 0), status: 'scheduled', packageId: 'pkg-1', createdAt: past(0, 1) },
    { id: 'les-6', studentId: 'stu-2', tutorId: 'tut-2', roomId: 'room-2', subjectId: 'subj-de', startTime: dt(2, 14, 0), endTime: dt(2, 15, 0), status: 'scheduled', createdAt: past(0, 1) },
    { id: 'les-7', studentId: 'stu-4', tutorId: 'tut-3', roomId: 'room-3', subjectId: 'subj-math', startTime: dt(3, 16, 0), endTime: dt(3, 17, 0), status: 'scheduled', packageId: 'pkg-4', createdAt: past(0, 1) },
    { id: 'les-8', studentId: 'stu-6', tutorId: 'tut-1', roomId: 'room-1', subjectId: 'subj-phy', startTime: dt(4, 10, 0), endTime: dt(4, 11, 0), status: 'scheduled', packageId: 'pkg-5', createdAt: past(0, 1) },
    { id: 'les-9', studentId: 'stu-3', tutorId: 'tut-2', roomId: 'room-2', subjectId: 'subj-math', startTime: dt(-5, 15, 0), endTime: dt(-5, 16, 0), status: 'cancelled', cancellationReason: 'Schüler krank', createdAt: past(1, 1) },
    { id: 'les-10', studentId: 'stu-5', tutorId: 'tut-2', roomId: 'room-3', subjectId: 'subj-eng', startTime: dt(-2, 11, 0), endTime: dt(-2, 12, 0), status: 'substituted', substituteTutorId: 'tut-1', createdAt: past(0, 1) },
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv-1',
      invoiceNumber: 'RE-2024-001',
      studentId: 'stu-1',
      parentId: 'par-1',
      items: [{ description: 'Nachhilfe Mathematik (10 Std.)', quantity: 10, unitPrice: 35, total: 350 }],
      totalAmount: 350,
      dueDate: past(1, 15),
      status: 'paid',
      paymentMethod: 'sepa',
      createdAt: past(3, 1),
      sentAt: past(3, 2),
      paidAt: past(2, 10),
    },
    {
      id: 'inv-2',
      invoiceNumber: 'RE-2024-002',
      studentId: 'stu-2',
      parentId: 'par-2',
      items: [{ description: 'Nachhilfe Englisch (8 Std.)', quantity: 8, unitPrice: 32, total: 256 }],
      totalAmount: 256,
      dueDate: new Date(y, m, 20).toISOString(),
      status: 'sent',
      paymentMethod: 'transfer',
      createdAt: past(1, 1),
      sentAt: past(1, 2),
    },
    {
      id: 'inv-3',
      invoiceNumber: 'RE-2024-003',
      studentId: 'stu-4',
      parentId: 'par-3',
      items: [
        { description: 'Nachhilfe Mathematik (6 Std.)', quantity: 6, unitPrice: 38, total: 228 },
        { description: 'Nachhilfe Chemie (6 Std.)', quantity: 6, unitPrice: 38, total: 228 },
      ],
      totalAmount: 456,
      dueDate: past(0, 5),
      status: 'overdue',
      paymentMethod: 'sepa',
      createdAt: past(2, 1),
      sentAt: past(2, 2),
    },
    {
      id: 'inv-4',
      invoiceNumber: 'RE-2024-004',
      studentId: 'stu-6',
      parentId: 'par-4',
      items: [{ description: 'Abi-Vorbereitung Paket (20 Std.)', quantity: 20, unitPrice: 40, total: 800 }],
      totalAmount: 800,
      dueDate: new Date(y, m + 1, 15).toISOString(),
      status: 'draft',
      paymentMethod: 'sepa',
      createdAt: past(0, 1),
    },
    {
      id: 'inv-5',
      invoiceNumber: 'RE-2024-005',
      studentId: 'stu-3',
      parentId: 'par-2',
      items: [{ description: 'Nachhilfe Mathematik Grundschule (6 Std.)', quantity: 6, unitPrice: 28, total: 168 }],
      totalAmount: 168,
      dueDate: new Date(y, m, 28).toISOString(),
      status: 'sent',
      paymentMethod: 'transfer',
      createdAt: past(0, 5),
      sentAt: past(0, 6),
    },
  ];

  const sepaMandates: SepaMandate[] = [
    { id: 'sepa-1', parentId: 'par-1', iban: 'DE89370400440532013000', bic: 'COBADEFFXXX', accountHolder: 'Klaus Müller', mandateReference: 'MNDT-2024-001', signedAt: past(5, 10), status: 'active' },
    { id: 'sepa-2', parentId: 'par-4', iban: 'DE75512108001245126199', bic: 'SSKMDEMM', accountHolder: 'Maria Fischer', mandateReference: 'MNDT-2024-002', signedAt: past(2, 10), status: 'active' },
  ];

  const tutorPayouts: TutorPayout[] = [
    { id: 'pay-1', tutorId: 'tut-1', month: new Date(y, m - 1, 1).toISOString().slice(0, 7), hours: 24, amount: 480, status: 'paid', createdAt: past(1, 5) },
    { id: 'pay-2', tutorId: 'tut-2', month: new Date(y, m - 1, 1).toISOString().slice(0, 7), hours: 18, amount: 270, status: 'paid', createdAt: past(1, 5) },
    { id: 'pay-3', tutorId: 'tut-3', month: new Date(y, m - 1, 1).toISOString().slice(0, 7), hours: 16, amount: 240, status: 'pending', createdAt: past(1, 5) },
    { id: 'pay-4', tutorId: 'tut-1', month: new Date(y, m, 1).toISOString().slice(0, 7), hours: 8, amount: 160, status: 'pending', createdAt: past(0, 1) },
  ];

  const reminders: Reminder[] = [
    { id: 'rem-1', invoiceId: 'inv-3', level: 1, sentAt: past(0, 1), fee: 5 },
  ];

  const auditLogs: AuditLog[] = [
    { id: 'al-1', userId: 'user-admin', action: 'CREATE', entityType: 'Student', entityId: 'stu-1', timestamp: past(5, 10), details: 'Schüler angelegt' },
    { id: 'al-2', userId: 'user-office', action: 'CREATE', entityType: 'Invoice', entityId: 'inv-1', timestamp: past(3, 1), details: 'Rechnung erstellt' },
  ];

  return {
    users,
    students,
    parents,
    tutors,
    locations,
    rooms,
    subjects,
    packages,
    hourTransactions,
    lessons,
    invoices,
    sepaMandates,
    payrollGroups,
    tutorPayouts,
    reminders,
    auditLogs,
  };
}
