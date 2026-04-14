import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Employee, Shift, TimesheetEntry, EmployeeOvertimeBalance,
  EmployeeAvailability, VacationEntitlement, Announcement, DashboardStats,
  MainTab, ScheduleSubTab, AbsenceSubTab, TimesheetViewType, TaskStatus,
} from '@/types';
import {
  EMPLOYEES, MOCK_SHIFTS, TIMESHEET_ENTRIES, OVERTIME_BALANCES,
  MOCK_AVAILABILITIES, VACATION_ENTITLEMENTS, MOCK_ANNOUNCEMENTS, DASHBOARD_STATS,
} from '@/data/mockData';

interface State {
  mainTab: MainTab;
  scheduleSubTab: ScheduleSubTab;
  absenceSubTab: AbsenceSubTab;
  scheduleDate: Date;
  scheduleStartHour: number;
  scheduleEndHour: number;
  employeeSearch: string;
  showAddShiftModal: boolean;
  timesheetView: TimesheetViewType;
  timesheetWeek: string;
  timesheetYear: number;
  selectedTimesheetEmployeeId: number;
  reportingSubTab: 'Detailed report' | 'Summed report';
  reportingStartDate: string;
  reportingEndDate: string;
  reportingEmployee: string;
  reportingRole: string;
  vacancyYear: number;
  vacancyMonth: string;
  listSubTab: 'Detailed' | 'Summed days';
  listAbsenceType: string;
  listEmployee: string;
  listRole: string;
  listStatus: string;
  listStartDate: string;
  listEndDate: string;
  entitlementYear: number;
  entitlementType: string;
  taskSubTab: 'Task Reporting' | 'Task Templates';
  taskStartDate: string;
  taskEndDate: string;
  taskEmployee: string;
  taskStatus: TaskStatus;
  employees: Employee[];
  shifts: Shift[];
  timesheetEntries: TimesheetEntry[];
  overtimeBalances: EmployeeOvertimeBalance[];
  availabilities: EmployeeAvailability[];
  vacationEntitlements: VacationEntitlement[];
  announcements: Announcement[];
  dashboardStats: DashboardStats;
  // actions
  setMainTab: (t: MainTab) => void;
  setScheduleSubTab: (t: ScheduleSubTab) => void;
  setAbsenceSubTab: (t: AbsenceSubTab) => void;
  setScheduleDate: (d: Date) => void;
  navigateScheduleDate: (dir: 'prev' | 'next') => void;
  setScheduleHours: (start: number, end: number) => void;
  setEmployeeSearch: (q: string) => void;
  toggleAddShiftModal: () => void;
  setTimesheetView: (v: TimesheetViewType) => void;
  setTimesheetWeek: (w: string) => void;
  setTimesheetYear: (y: number) => void;
  setSelectedTimesheetEmployee: (id: number) => void;
  setReportingSubTab: (t: 'Detailed report' | 'Summed report') => void;
  setReportingFilter: (k: 'reportingEmployee'|'reportingRole'|'reportingStartDate'|'reportingEndDate', v: string) => void;
  setVacancyYear: (y: number) => void;
  setVacancyMonth: (m: string) => void;
  navigateVacancyMonth: (dir: 'prev' | 'next') => void;
  setListSubTab: (t: 'Detailed' | 'Summed days') => void;
  setListFilter: (k: 'listAbsenceType'|'listEmployee'|'listRole'|'listStatus'|'listStartDate'|'listEndDate', v: string) => void;
  setEntitlementYear: (y: number) => void;
  navigateEntitlementYear: (dir: 'prev' | 'next') => void;
  setEntitlementType: (t: string) => void;
  setTaskSubTab: (t: 'Task Reporting' | 'Task Templates') => void;
  setTaskFilter: (k: 'taskStartDate'|'taskEndDate'|'taskEmployee'|'taskStatus', v: string) => void;
  addShift: (s: Shift) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  addAnnouncement: (a: Announcement) => void;
  updateEntitlement: (empId: number, field: 'entitlement'|'entitlementCorrected', val: number|null) => void;
  addAvailabilitySlot: (empId: number, dayIndex: number) => void;
  removeAvailabilitySlot: (empId: number, dayIndex: number, slotIndex: number) => void;
}

const MONTHS_ARR = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const useAppStore = create<State>()(devtools((set, get) => ({
  mainTab: 'dashboard',
  scheduleSubTab: 'SCHEDULE',
  absenceSubTab: 'CALENDAR',
  scheduleDate: new Date(2026, 2, 1),  // March 1 — matches screenshot
  scheduleStartHour: 6,
  scheduleEndHour: 22,
  employeeSearch: '',
  showAddShiftModal: false,
  timesheetView: 'Week',
  timesheetWeek: 'CW 13',
  timesheetYear: 2026,
  selectedTimesheetEmployeeId: 5,
  reportingSubTab: 'Detailed report',
  reportingStartDate: '2026-03-27',
  reportingEndDate: '2026-03-27',
  reportingEmployee: '',
  reportingRole: '',
  vacancyYear: 2026,
  vacancyMonth: 'March',
  listSubTab: 'Detailed',
  listAbsenceType: '',
  listEmployee: '',
  listRole: '',
  listStatus: '',
  listStartDate: '2026-01-01',
  listEndDate: '2026-12-31',
  entitlementYear: 2026,
  entitlementType: 'Urlaub',
  taskSubTab: 'Task Reporting',
  taskStartDate: '2026-03-27',
  taskEndDate: '2026-03-27',
  taskEmployee: '',
  taskStatus: 'All',
  employees: EMPLOYEES,
  shifts: MOCK_SHIFTS,
  timesheetEntries: TIMESHEET_ENTRIES,
  overtimeBalances: OVERTIME_BALANCES,
  availabilities: MOCK_AVAILABILITIES,
  vacationEntitlements: VACATION_ENTITLEMENTS,
  announcements: MOCK_ANNOUNCEMENTS,
  dashboardStats: DASHBOARD_STATS,

  setMainTab: t => set({ mainTab: t }),
  setScheduleSubTab: t => set({ scheduleSubTab: t }),
  setAbsenceSubTab: t => set({ absenceSubTab: t }),
  setScheduleDate: d => set({ scheduleDate: d }),
  navigateScheduleDate: dir => {
    const d = new Date(get().scheduleDate);
    d.setDate(d.getDate() + (dir === 'next' ? 1 : -1));
    set({ scheduleDate: d });
  },
  setScheduleHours: (start, end) => set({ scheduleStartHour: start, scheduleEndHour: end }),
  setEmployeeSearch: q => set({ employeeSearch: q }),
  toggleAddShiftModal: () => set(s => ({ showAddShiftModal: !s.showAddShiftModal })),
  setTimesheetView: v => set({ timesheetView: v }),
  setTimesheetWeek: w => set({ timesheetWeek: w }),
  setTimesheetYear: y => set({ timesheetYear: y }),
  setSelectedTimesheetEmployee: id => set({ selectedTimesheetEmployeeId: id }),
  setReportingSubTab: t => set({ reportingSubTab: t }),
  setReportingFilter: (k, v) => set({ [k]: v } as any),
  setVacancyYear: y => set({ vacancyYear: y }),
  setVacancyMonth: m => set({ vacancyMonth: m }),
  navigateVacancyMonth: dir => {
    const idx = MONTHS_ARR.indexOf(get().vacancyMonth);
    set({ vacancyMonth: MONTHS_ARR[(idx + (dir === 'next' ? 1 : -1) + 12) % 12] });
  },
  setListSubTab: t => set({ listSubTab: t }),
  setListFilter: (k, v) => set({ [k]: v } as any),
  setEntitlementYear: y => set({ entitlementYear: y }),
  navigateEntitlementYear: dir => set(s => ({ entitlementYear: s.entitlementYear + (dir === 'next' ? 1 : -1) })),
  setEntitlementType: t => set({ entitlementType: t }),
  setTaskSubTab: t => set({ taskSubTab: t }),
  setTaskFilter: (k, v) => set({ [k]: v } as any),
  addShift: s => set(st => ({ shifts: [...st.shifts, s] })),
  updateShift: (id, updates) => set(st => ({
    shifts: st.shifts.map(s => s.id === id ? { ...s, ...updates } : s),
  })),
  deleteShift: id => set(st => ({ shifts: st.shifts.filter(s => s.id !== id) })),
  addAnnouncement: a => set(st => ({ announcements: [a, ...st.announcements] })),
  updateEntitlement: (empId, field, val) => set(s => ({
    vacationEntitlements: s.vacationEntitlements.map(e => e.employeeId === empId ? { ...e, [field]: val } : e),
  })),
  addAvailabilitySlot: (empId, dayIndex) => set(s => ({
    availabilities: s.availabilities.map(av => av.employeeId !== empId ? av : {
      ...av,
      weeklyTemplate: av.weeklyTemplate.map((d, i) =>
        i !== dayIndex ? d : { ...d, slots: [...d.slots, { start: '09:00', end: '17:00' }] }
      ),
    }),
  })),
  removeAvailabilitySlot: (empId, dayIndex, slotIndex) => set(s => ({
    availabilities: s.availabilities.map(av => av.employeeId !== empId ? av : {
      ...av,
      weeklyTemplate: av.weeklyTemplate.map((d, i) =>
        i !== dayIndex ? d : { ...d, slots: d.slots.filter((_, si) => si !== slotIndex) }
      ),
    }),
  })),
}), { name: 'AplanoStore' }));