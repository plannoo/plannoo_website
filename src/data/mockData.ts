import type { Employee, Shift, TimesheetEntry, EmployeeOvertimeBalance, EmployeeAvailability, VacationEntitlement, Announcement, DashboardStats } from '@/types';

export const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Ralf Bertelt',       email: 'ralf@aplano.com',   role: 'ADMIN',   color: '#22c55e', weeklyHours: 40, quotaHours: 0   },
  { id: 2, name: 'Adan Mohamed',       email: 'adan@aplano.com',   role: 'ADMIN',   color: '#22c55e', weeklyHours: 40, quotaHours: 0   },
  { id: 3, name: 'Ahmed Yassin Osman', email: 'ahmed@aplano.com',  role: 'ADMIN',   color: '#22c55e', weeklyHours: 40, quotaHours: 11  },
  { id: 4, name: 'Ali Abdi Kosar',     email: 'ali@aplano.com',    role: 'MANAGER', color: '#f97316', weeklyHours: 40, quotaHours: 5.8 },
  { id: 5, name: 'nacima Mohamed',     email: 'nacima@aplano.com', role: 'MANAGER', color: '#f97316', weeklyHours: 40, quotaHours: 5.8 },
];

export const ROLE_OPTIONS = ['ADMIN','MANAGER','OBJEKTVERANTWORTLICHER','EMPLOYEE'] as const;

// Sample shifts matching screenshot
export const MOCK_SHIFTS: Shift[] = [
  {
    id: 's1', employeeId: 5, date: '2026-03-01',
    startHour: 8, startMin: 0, endHour: 20, endMin: 0,
    role: 'Manager/ Objektverantwortlicher', roleColor: '#f97316',
    hashtags: ['Sachkunde'], comment: 'testing', label: '',
    address: '', breakMinutes: 60,
  },
  {
    id: 's2', employeeId: 1, date: '2026-03-01',
    startHour: 0, startMin: 0, endHour: 24, endMin: 0,
    role: '', roleColor: '#22c55e',
    hashtags: [], comment: '', label: '',
    address: '', breakMinutes: 0, isWholeDay: true,
  },
  {
    id: 's3', employeeId: 2, date: '2026-03-01',
    startHour: 0, startMin: 0, endHour: 24, endMin: 0,
    role: '', roleColor: '#22c55e',
    hashtags: [], comment: '', label: '',
    address: '', breakMinutes: 0, isWholeDay: true,
  },
];

export const TIMESHEET_ENTRIES: TimesheetEntry[] = [
  { date: 'Mo 23.Mar', isoDate: '2026-03-23', quota: '5:42', credited: '', overtime: '- 5:42', hasTimeAccount: true },
  { date: 'Tu 24.Mar', isoDate: '2026-03-24', quota: '5:42', credited: '', overtime: '- 5:42', hasTimeAccount: true },
  { date: 'We 25.Mar', isoDate: '2026-03-25', quota: '5:42', credited: '', overtime: '- 5:42', hasTimeAccount: true },
  { date: 'Th 26.Mar', isoDate: '2026-03-26', quota: '5:42', credited: '', overtime: '- 5:42', hasTimeAccount: true },
  { date: 'Fr 27.Mar', isoDate: '2026-03-27', quota: '5:42', credited: '', overtime: '- 5:42', hasTimeAccount: true },
  { date: 'Sa 28.Mar', isoDate: '2026-03-28', quota: '5:42', credited: '', overtime: '- 5:42', hasTimeAccount: true },
  { date: 'Su 29.Mar', isoDate: '2026-03-29', quota: '5:48', credited: '', overtime: '- 5:48', hasTimeAccount: true },
];

export const OVERTIME_BALANCES: EmployeeOvertimeBalance[] = [
  { employeeId: 1, balance: '- 1552 h', isNegative: true  },
  { employeeId: 2, balance: '',          isNegative: false },
  { employeeId: 3, balance: '- 376 h',  isNegative: true  },
  { employeeId: 4, balance: '',          isNegative: false },
  { employeeId: 5, balance: '',          isNegative: false },
];

export const MOCK_AVAILABILITIES: EmployeeAvailability[] = EMPLOYEES.map(e => ({
  employeeId: e.id,
  weeklyTemplate: (['Mo','Tu','We','Th','Fr','Sa','Su'] as const).map(day => ({
    day, slots: [], isAllDay: false, isUnavailable: day === 'Sa' || day === 'Su',
  })),
}));

export const VACATION_ENTITLEMENTS: VacationEntitlement[] = EMPLOYEES.map(e => ({
  employeeId: e.id, year: 2026,
  entitlement: null, entitlementCorrected: null,
  requested: 0, accepted: 0, remaining: 0,
}));

export const MOCK_ANNOUNCEMENTS: Announcement[] = [];
export const DASHBOARD_STATS: DashboardStats = { clockedIn: 0, late: 0, openShifts: 0, pendingApplications: 0 };

export const SCHEDULE_HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6–22
export const AVAILABILITY_DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'] as const;
export const ABSENCE_TYPES    = ['Vacation','Sick Leave','Training','Personal Day'] as const;
export const ABSENCE_STATUSES = ['Pending','Approved','Rejected'] as const;
export const TASK_STATUSES    = ['All','Open','In Progress','Done'] as const;

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;

export const DOW_LABELS = ['So','Mo','Di','Mi','Do','Fr','Sa'];

export const VACATION_CALENDAR_WEEKS = [
  { cw: 'CW 10', days: [{ day:1,dow:0 },{ day:2,dow:1 },{ day:3,dow:2 },{ day:4,dow:3 },{ day:5,dow:4 },{ day:6,dow:5 },{ day:7,dow:6 }] },
  { cw: 'CW 11', days: [{ day:8,dow:0 },{ day:9,dow:1 },{ day:10,dow:2 },{ day:11,dow:3 },{ day:12,dow:4 },{ day:13,dow:5 },{ day:14,dow:6 }] },
  { cw: 'CW 12', days: [{ day:15,dow:0 },{ day:16,dow:1 },{ day:17,dow:2 },{ day:18,dow:3 },{ day:19,dow:4 },{ day:20,dow:5 },{ day:21,dow:6 }] },
  { cw: 'CW 13', days: [{ day:22,dow:0 },{ day:23,dow:1 },{ day:24,dow:2 },{ day:25,dow:3 },{ day:26,dow:4 },{ day:27,dow:5 },{ day:28,dow:6 }] },
  { cw: 'CW 14', days: [{ day:29,dow:0 },{ day:30,dow:1 },{ day:31,dow:2 }] },
];