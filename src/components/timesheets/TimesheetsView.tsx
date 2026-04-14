import { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Search, Filter, X, FileText, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSelectedTimesheetEmployee } from '@/hooks';
import { OVERTIME_BALANCES } from '@/data/mockData';
import { cn } from '@/utils';
import type { Employee } from '@/types';

const CWS   = ['CW 10', 'CW 11', 'CW 12', 'CW 13', 'CW 14', 'CW 15'];
const YEARS  = ['2024', '2025', '2026'];
const ROW_H  = 48;

/* ── Hour Account Start Value modal (clicking "?" button) ─ */
function HourAccountModal({ date, close }: { date: string; close: () => void }) {
  const [h,   setH]   = useState('');
  const [m,   setM]   = useState('');
  const [sig, setSig] = useState<'+' | '-'>('+');
  const canSave = h !== '' || m !== '';

  const DAY_MAP: Record<string, string> = {
    Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday',
    Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
  };
  const [dayCode, rest] = date.split(' ');
  const [dayNum, mon]   = (rest ?? '').split('.');
  const longDate = `${DAY_MAP[dayCode] ?? dayCode} / ${dayNum} ${mon} 2026`;

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[440px] fade-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-[15px] font-medium text-gray-800">Hour account start value</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
        </div>
        <div className="px-5 py-5 space-y-5">
          <p className="text-[14px] font-semibold text-[#2196F3]">{longDate}</p>
          <hr className="border-gray-100" />
          <div className="flex items-center gap-2">
            {(['+', '-'] as const).map(s => (
              <button key={s} onClick={() => setSig(s)}
                className={cn('w-10 h-10 rounded font-bold text-[16px] border transition-colors',
                  sig === s ? 'bg-[#2196F3] text-white border-[#2196F3]' : 'border-gray-200 text-gray-500 hover:border-[#2196F3]')}>
                {s}
              </button>
            ))}
            <input type="number" placeholder="h" value={h} onChange={e => setH(e.target.value)} min="0"
              className="w-20 border border-gray-200 rounded px-3 py-2 text-[13px] text-center outline-none focus:border-[#2196F3] font-mono placeholder:text-gray-300" />
            <input type="number" placeholder="min" value={m} onChange={e => setM(e.target.value)} min="0" max="59"
              className="w-20 border border-gray-200 rounded px-3 py-2 text-[13px] text-center outline-none focus:border-[#2196F3] font-mono placeholder:text-gray-300" />
          </div>
          <hr className="border-gray-100" />
          <p className="text-[12px] text-gray-500 leading-relaxed">
            By entering a start value, starting from the selected date, a running hourly account is calculated.
          </p>
        </div>
        <div className="flex justify-end px-5 py-3 border-t border-gray-100">
          <button disabled={!canSave}
            className={cn('px-5 py-1.5 rounded text-[13px] font-medium transition-colors',
              canSave ? 'bg-[#2196F3] hover:bg-[#1976D2] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Export dropdown (PDF / CSV / Excel) ─────────────────── */
function ExportMenu({ close }: { close: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[190]" onClick={close} />
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-[200] w-44 py-1 fade-in">
        {['PDF Export', 'CSV Export', 'Excel Export'].map(item => (
          <button key={item} className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-[#2196F3] hover:bg-gray-50 text-left transition-colors">
            <FileText size={12} className="shrink-0" />{item}
          </button>
        ))}
      </div>
    </>
  );
}

/* ── Employee list row ───────────────────────────────────── */
interface RD { employees: Employee[]; sel: number; onSel: (id: number) => void; }

function EmpRow({ index, style, data }: { index: number; style: React.CSSProperties; data: RD }) {
  const e      = data.employees[index];
  const bal    = OVERTIME_BALANCES.find(b => b.employeeId === e.id);
  const active = e.id === data.sel;
  return (
    <div style={style} onClick={() => data.onSel(e.id)}
      className={cn('flex items-center justify-between px-3.5 border-b border-gray-100 cursor-pointer transition-colors select-none',
        active ? 'bg-blue-50 border-l-2 border-l-[#2196F3]' : 'hover:bg-gray-50')}>
      <span className={cn('text-[13px] font-medium', active ? 'text-[#2196F3]' : 'text-gray-700')}>{e.name}</span>
      {bal?.balance && (
        <span className={cn('text-[11px] font-mono shrink-0 ml-2', bal.isNegative ? 'text-red-500' : 'text-green-600')}>
          {bal.balance}
        </span>
      )}
    </div>
  );
}

/* ── Main Timesheets View ────────────────────────────────── */
export function TimesheetsView() {
  const {
    employees, timesheetView, timesheetWeek, timesheetYear,
    selectedTimesheetEmployeeId, setTimesheetView, setTimesheetWeek,
    setTimesheetYear, setSelectedTimesheetEmployee, timesheetEntries,
  } = useAppStore();

  const selEmp          = useSelectedTimesheetEmployee();
  const [exportOpen, setExportOpen] = useState(false);
  const [hourAcc,    setHourAcc]    = useState<string | null>(null);

  const SUMMARY = [
    { label: 'Quota',    value: '40:00 h',   cls: 'text-gray-800' },
    { label: 'Credited', value: '0:00 h',    cls: 'text-gray-800' },
    { label: 'Overtime', value: '- 40:00 h', cls: 'text-red-500 font-semibold' },
  ];

  return (
    <div className="flex" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>

      {/* ── Left sidebar ─────────────────────────────── */}
      <div className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-1 px-2 py-2 border-b border-gray-200 shrink-0" style={{ height: 44 }}>
          <div className="relative flex-1">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input placeholder="Employee"
              className="w-full pl-6 pr-1 py-[4px] text-[12px] border border-gray-200 rounded outline-none focus:border-[#2196F3] bg-white placeholder:text-gray-400 text-[#2196F3]" />
          </div>
          <button className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
            <Filter size={12} />
          </button>
        </div>
        <List height={700} itemCount={employees.length} itemSize={ROW_H}
          itemData={{ employees, sel: selectedTimesheetEmployeeId, onSel: setSelectedTimesheetEmployee }}
          width="100%">
          {EmpRow}
        </List>
      </div>

      {/* ── Right content ────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0">
          {/* View type */}
          <div className="relative">
            <select value={timesheetView} onChange={e => setTimesheetView(e.target.value as any)}
              className="border border-gray-200 rounded px-2.5 py-1.5 text-[13px] text-[#2196F3] font-medium bg-white outline-none cursor-pointer appearance-none pr-6">
              {['Day','Week','Month'].map(v => <option key={v}>{v}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* CW */}
          <div className="relative">
            <select value={timesheetWeek} onChange={e => setTimesheetWeek(e.target.value)}
              className="border border-gray-200 rounded px-2.5 py-1.5 text-[13px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6">
              {CWS.map(w => <option key={w}>{w}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Blue prev / next */}
          <div className="flex">
            <button className="w-7 h-7 bg-[#2196F3] hover:bg-[#1976D2] text-white flex items-center justify-center rounded-l border border-[#2196F3] transition-colors">
              <ChevronLeft size={13} />
            </button>
            <button className="w-7 h-7 bg-[#2196F3] hover:bg-[#1976D2] text-white flex items-center justify-center rounded-r border border-[#2196F3] transition-colors border-l-0">
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Year */}
          <div className="relative">
            <select value={String(timesheetYear)} onChange={e => setTimesheetYear(Number(e.target.value))}
              className="border border-gray-200 rounded px-2.5 py-1.5 text-[13px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6">
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex-1" />

          <button className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors" title="Overtime clock">
            <Clock size={14} />
          </button>

          {/* Export with dropdown */}
          <div className="relative">
            <button onClick={() => setExportOpen(v => !v)} title="Export"
              className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
              <FileText size={14} />
            </button>
            {exportOpen && <ExportMenu close={() => setExportOpen(false)} />}
          </div>
        </div>

        {/* Employee header */}
        <div className="flex items-start justify-between px-5 py-4 bg-white border-b border-gray-200 shrink-0">
          <h2 className="text-[18px] font-medium text-gray-800">{selEmp?.name}</h2>
          <div className="space-y-0.5">
            {SUMMARY.map(({ label, value, cls }) => (
              <div key={label} className="flex items-center justify-end gap-10">
                <span className="text-[13px] text-gray-500">{label}</span>
                <span className={cn('text-[13px] font-bold font-mono w-20 text-right', cls)}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-200">
                {['Date', 'Quota', 'Credited', '', 'Overtime', 'Time account'].map(col => (
                  <th key={col} className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#2196F3] whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timesheetEntries.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-[13px] font-medium text-gray-700">{row.date}</td>
                  <td className="px-4 py-2.5 text-[13px] font-mono text-gray-700">{row.quota}</td>
                  <td className="px-4 py-2.5 text-[13px] text-gray-500">{row.credited}</td>
                  <td className="px-4 py-2.5" />
                  <td className="px-4 py-2.5 text-[13px] font-mono font-medium text-gray-500">{row.overtime}</td>
                  <td className="px-4 py-2.5">
                    {row.hasTimeAccount && (
                      <button onClick={() => setHourAcc(row.date)}
                        className="bg-[#2196F3] hover:bg-[#1976D2] text-white text-[12px] font-bold px-4 py-1 rounded transition-colors min-w-[64px] text-center">
                        ?
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hourAcc !== null && <HourAccountModal date={hourAcc} close={() => setHourAcc(null)} />}
    </div>
  );
}
