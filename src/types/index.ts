export type UserRole = 'admin' | 'office' | 'tutor' | 'parent';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  createdAt: string;
  archivedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  school?: string;
  grade?: string;
  parentIds: string[];
  subjects: string[];
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
  archivedAt?: string;
  notes?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  studentIds: string[];
  userId?: string;
  createdAt: string;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subjects: string[];
  payrollGroupId?: string;
  status: 'active' | 'archived';
  userId?: string;
  createdAt: string;
  qualifications?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'archived';
}

export interface Room {
  id: string;
  locationId: string;
  name: string;
  capacity?: number;
  status: 'active' | 'archived';
}

export interface Subject {
  id: string;
  name: string;
}

export interface Package {
  id: string;
  studentId: string;
  name: string;
  hoursTotal: number;
  hoursUsed: number;
  pricePerHour: number;
  status: 'active' | 'depleted' | 'archived';
  createdAt: string;
}

export interface HourTransaction {
  id: string;
  packageId: string;
  lessonId?: string;
  hours: number;
  note?: string;
  createdAt: string;
}

export type LessonStatus = 'scheduled' | 'completed' | 'cancelled' | 'substituted';

export interface Lesson {
  id: string;
  studentId: string;
  tutorId: string;
  roomId?: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  status: LessonStatus;
  cancellationReason?: string;
  substituteTutorId?: string;
  packageId?: string;
  documentationNote?: string;
  createdAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  parentId?: string;
  items: InvoiceItem[];
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod: 'sepa' | 'transfer' | 'cash';
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
}

export interface SepaMandate {
  id: string;
  parentId: string;
  iban: string;
  bic: string;
  accountHolder: string;
  mandateReference: string;
  signedAt: string;
  status: 'active' | 'revoked';
}

export interface PayrollGroup {
  id: string;
  name: string;
  hourlyRate: number;
}

export interface TutorPayout {
  id: string;
  tutorId: string;
  month: string;
  hours: number;
  amount: number;
  status: 'pending' | 'paid';
  createdAt: string;
}

export interface Reminder {
  id: string;
  invoiceId: string;
  level: 1 | 2 | 3;
  sentAt: string;
  fee: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: string;
}
