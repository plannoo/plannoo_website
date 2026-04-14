export type RoleType = 'ADMIN' | 'MANAGER' | 'OBJEKTVERANTWORTLICHER' | 'EMPLOYEE';
export type MainTab = 'dashboard' | 'schedule' | 'absences';
export type ScheduleSubTab = 'SCHEDULE' | 'TIMESHEETS' | 'REPORTING' | 'AVAILABILITIES' | 'TASKS';
export type AbsenceSubTab = 'CALENDAR' | 'LIST' | 'ENTITLEMENT';
export type TimesheetViewType = 'Day' | 'Week' | 'Month';
export type AbsenceType = 'Vacation' | 'Sick Leave' | 'Training' | 'Personal Day' | 'Urlaub';
export type AbsenceStatus = 'Pending' | 'Approved' | 'Rejected';
export type TaskStatus = 'All' | 'Open' | 'In Progress' | 'Done';
export type DayOfWeek = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

export interface Employee {
  id: number; name: string; email: string;
  role: RoleType; color: string;
  weeklyHours: number; quotaHours: number;
}

export interface Shift {
  id: string;
  employeeId: number;
  date: string;           // ISO date string "2026-03-01"
  startHour: number;      // 0-23
  startMin: number;       // 0-59
  endHour: number;
  endMin: number;
  role: string;
  roleColor: string;      // hex color for the role badge
  hashtags: string[];
  comment: string;
  label: string;
  address: string;
  breakMinutes: number;   // break in minutes
  isWholeDay?: boolean;   // for day-off / whole day entries
  wholeDay?: boolean;
}

export interface TimesheetEntry {
  date: string; isoDate: string;
  quota: string; credited: string; overtime: string;
  hasTimeAccount: boolean;
}

export interface EmployeeOvertimeBalance {
  employeeId: number; balance: string; isNegative: boolean;
}

export interface TimeSlot { start: string; end: string; }

export interface DayAvailability {
  day: DayOfWeek; slots: TimeSlot[];
  isAllDay: boolean; isUnavailable: boolean;
}

export interface EmployeeAvailability {
  employeeId: number; weeklyTemplate: DayAvailability[];
}

export interface VacationEntitlement {
  employeeId: number; year: number;
  entitlement: number | null; entitlementCorrected: number | null;
  requested: number; accepted: number; remaining: number;
}

export interface Announcement {
  id: string; title: string; message: string;
  createdAt: string; createdBy: number; isRead: boolean;
}

export interface DashboardStats {
  clockedIn: number; late: number;
  openShifts: number; pendingApplications: number;
}