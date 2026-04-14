import { useAppStore } from '@/store/useAppStore';
import { ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { VACATION_CALENDAR_WEEKS, DOW_LABELS, MONTHS, EMPLOYEES } from '@/data/mockData';
import { cn } from '@/utils';

const CW  = 38;   // cell width
const RH  = 36;   // row height
const NW  = 220;  // name column width

export function AbsenceCalendarView() {
  const {
    vacancyYear, vacancyMonth,
    setVacancyYear, setVacancyMonth, navigateVacancyMonth,
    employeeSearch, setEmployeeSearch,
  } = useAppStore();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        <div className="relative">
          <select value={String(vacancyYear)} onChange={e => setVacancyYear(Number(e.target.value))}
            className="border border-gray-200 rounded px-2.5 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6 w-20">
            {['2024','2025','2026','2027'].map(y => <option key={y}>{y}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select value={vacancyMonth} onChange={e => setVacancyMonth(e.target.value)}
            className="border border-gray-200 rounded px-2.5 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6 min-w-[90px]">
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <button onClick={() => navigateVacancyMonth('prev')} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors">
          <ChevronLeft size={13} />
        </button>
        <button onClick={() => navigateVacancyMonth('next')} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors">
          <ChevronRight size={13} />
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          + Entitlement
        </button>
        <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          Vacation requests
        </button>

        <div className="flex-1" />

        <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">School Holidays</button>
        <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">Vacation Bans</button>

        <div className="relative">
          <select className="border border-gray-200 rounded px-2.5 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6 min-w-[110px]">
            {['Monthly view','Weekly view'].map(v => <option key={v}>{v}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto bg-white">

        {/* ── STICKY HEADER (employee search + CW/day labels) ── */}
        <div className="flex sticky top-0 z-20 bg-white border-b border-gray-200">

          {/* Top-left: employee search + URLAUB */}
          <div className="shrink-0 sticky left-0 z-30 bg-white border-r border-gray-200 flex flex-col" style={{ width: NW }}>
            {/* Search row */}
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100" style={{ height: RH }}>
              <div className="relative flex-1">
                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input value={employeeSearch} onChange={e => setEmployeeSearch(e.target.value)} placeholder="Employee"
                  className="w-full pl-6 pr-1 py-[3px] text-[11px] border border-gray-200 rounded outline-none focus:border-[#2196F3] bg-white placeholder:text-gray-400 text-[#2196F3]" />
              </div>
            </div>
            {/* URLAUB label */}
            <div className="flex items-center px-3 bg-gray-50 border-b border-gray-200" style={{ height: RH }}>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">URLAUB</span>
            </div>
          </div>

          {/* CW + day-of-week columns */}
          <div className="flex">
            {VACATION_CALENDAR_WEEKS.map(wk => (
              <div key={wk.cw} className="flex flex-col border-r border-gray-200">
                {/* CW label */}
                <div className="flex items-center justify-center text-[11px] font-bold text-[#2196F3] border-b border-gray-100"
                  style={{ height: RH, width: wk.days.length * CW }}>
                  {wk.cw}
                </div>
                {/* Day cells */}
                <div className="flex">
                  {wk.days.map(({ day, dow }) => {
                    const isWknd  = dow === 0 || dow === 6;
                    const isToday = day === 27;
                    return (
                      <div key={day} className={cn('flex flex-col items-center justify-center text-[10px] border-r border-gray-100 last:border-r-0',
                          isWknd  && 'bg-gray-50',
                          isToday && 'bg-blue-50')}
                        style={{ width: CW, height: RH }}>
                        <span className="text-gray-400">{DOW_LABELS[dow]}</span>
                        <span className="font-semibold text-gray-600 text-[11px]">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EMPLOYEE ROWS ── */}
        {EMPLOYEES.map(emp => (
          <div key={emp.id} className="flex border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
            {/* Sticky name + urlaub count */}
            <div className="shrink-0 sticky left-0 z-10 bg-white border-r border-gray-200 flex items-center justify-between px-3"
              style={{ width: NW, height: RH }}>
              <span className="text-[12px] text-gray-700 truncate flex-1">{emp.name}</span>
              <span className="text-[11px] text-gray-400 font-mono ml-2 shrink-0">0</span>
            </div>

            {/* Day cells */}
            {VACATION_CALENDAR_WEEKS.map(wk =>
              wk.days.map(({ day, dow }) => {
                const isWknd  = dow === 0 || dow === 6;
                const isToday = day === 27;
                return (
                  <div key={`${emp.id}-${day}`}
                    className={cn('border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-blue-100/40 transition-colors',
                      isWknd  && 'bg-gray-50',
                      isToday && 'bg-blue-50/50')}
                    style={{ width: CW, height: RH }} />
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
