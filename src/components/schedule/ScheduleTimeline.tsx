import { useRef } from 'react';
import { Info, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SCHEDULE_HOURS } from '@/data/mockData';
import { hourToPixels, durationToPixels } from '@/utils';
import type { Employee, Shift } from '@/types';

const SLOT_WIDTH = 80;
const ROW_HEIGHT = 52;
const HEADCOUNT_H = 32;
const HEADER_H = 36;

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#22c55e',
  MANAGER: '#f97316',
  OBJEKTVERANTWORTLICHER: '#8b5cf6',
  EMPLOYEE: '#3b82f6',
};

function TimeHeader() {
  return (
    <div
      className="flex sticky top-0 bg-white z-10 border-b border-slate-200"
      style={{ minWidth: SCHEDULE_HOURS.length * SLOT_WIDTH }}
    >
      {SCHEDULE_HOURS.map((h) => (
        <div
          key={h}
          className="shrink-0 flex items-center justify-center text-[11px] text-slate-400 font-medium border-r border-slate-100"
          style={{ width: SLOT_WIDTH, height: HEADER_H }}
        >
          {String(h).padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
}

function HeadcountRow() {
  return (
    <div
      className="flex bg-white border-b border-slate-200"
      style={{ minWidth: SCHEDULE_HOURS.length * SLOT_WIDTH, height: HEADCOUNT_H }}
    >
      {SCHEDULE_HOURS.map((h) => (
        <div
          key={h}
          className="shrink-0 flex items-center justify-center text-[11px] text-slate-400 border-r border-slate-100"
          style={{ width: SLOT_WIDTH }}
        >
          0
        </div>
      ))}
    </div>
  );
}

function OpenShiftsRow() {
  return (
    <div
      className="flex bg-white border-b border-slate-100"
      style={{ minWidth: SCHEDULE_HOURS.length * SLOT_WIDTH, height: ROW_HEIGHT }}
    >
      {SCHEDULE_HOURS.map((h) => (
        <div
          key={h}
          className="shrink-0 border-r border-slate-100"
          style={{ width: SLOT_WIDTH, height: ROW_HEIGHT }}
        />
      ))}
    </div>
  );
}

function ShiftBlock({ shift }: { shift: Shift }) {
  const baseHour = SCHEDULE_HOURS[0];
  const left = hourToPixels(shift.startHour, baseHour, SLOT_WIDTH);
  const width = durationToPixels(shift.startHour, shift.endHour, SLOT_WIDTH);

  return (
    <div
      title={`${shift.label} — ${shift.startHour}:00–${shift.endHour}:00`}
      className="absolute flex items-center px-2 rounded text-white text-[11px] font-semibold cursor-pointer overflow-hidden whitespace-nowrap hover:brightness-90 select-none transition-all"
      style={{ left, width, top: 6, height: ROW_HEIGHT - 12, background: shift.color }}
    >
      {shift.label}
    </div>
  );
}

function EmployeeRow({ employee, shifts }: { employee: Employee; shifts: Shift[] }) {
  return (
    <div
      className="flex relative border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
      style={{ height: ROW_HEIGHT, minWidth: SCHEDULE_HOURS.length * SLOT_WIDTH }}
    >
      {SCHEDULE_HOURS.map((h) => (
        <div key={h} className="shrink-0 border-r border-slate-100" style={{ width: SLOT_WIDTH, height: ROW_HEIGHT }} />
      ))}
      {shifts.map((s) => <ShiftBlock key={s.id} shift={s} />)}
    </div>
  );
}

export function ScheduleTimeline() {
  const { employees, shifts, scheduleDate } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateStr = scheduleDate.toISOString().split('T')[0];

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto bg-white">
      <TimeHeader />
      <HeadcountRow />
      <OpenShiftsRow />
      {employees.map((emp) => (
        <EmployeeRow
          key={emp.id}
          employee={emp}
          shifts={shifts.filter((s) => s.employeeId === emp.id && s.date === dateStr)}
        />
      ))}
    </div>
  );
}
