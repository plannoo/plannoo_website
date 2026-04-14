import { useState, useRef } from 'react';
import { X, ChevronDown, LayoutGrid, Download, Settings, FileText, Sheet, File } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { EMPLOYEES } from '@/data/mockData';
import { cn } from '@/utils';

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type TimeFormat = 'decimal' | 'hmin';

interface SummedRow {
  employeeId: number;
  name: string;
  shifts: string;
  holidays: string;
  correction: string;
  quota?: string;
  overtime?: string;
  timeAccount?: string;
  nachtzuschlag?: string;
  sonntagszuschlag?: string;
  nachtzuschlag2?: string;
  sonntagszuschlag2?: string;
  feiertagszuschlag?: string;
  urlaub?: string;
  unentschuldigte?: string;
  standByFrei?: string;
  überstundenausgleich?: string;
  krankheit?: string;
  qualifikation?: string;
  wunschfrei?: string;
  late: number;
  total: string;
}

/* ─────────────────────────────────────────────────────────
   MOCK DATA  (matches screenshot — Ralf Bertelt has 2:00 holiday)
───────────────────────────────────────────────────────── */
const SUMMED_DATA: SummedRow[] = [
  { employeeId: 2, name: 'Adan Mohamed',       shifts: '0:00', holidays: '0:00', correction: '0:00', late: 0, total: '0:00' },
  { employeeId: 3, name: 'Ahmed Yassin Osman', shifts: '0:00', holidays: '0:00', correction: '0:00', late: 0, total: '0:00' },
  { employeeId: 4, name: 'Ali Abdi Kosar',     shifts: '0:00', holidays: '0:00', correction: '0:00', late: 0, total: '0:00' },
  { employeeId: 1, name: 'Ralf Bertelt',       shifts: '0:00', holidays: '2:00', correction: '0:00', late: 0, total: '2:00' },
  { employeeId: 5, name: 'nacima Mohamed',     shifts: '0:00', holidays: '0:00', correction: '0:00', late: 0, total: '0:00' },
];

/* ─────────────────────────────────────────────────────────
   DISPLAYED COLUMNS CONFIG MODAL  (Image 2)
───────────────────────────────────────────────────────── */
const LEFT_COLS = [
  { key: 'shifts',      label: 'Shifts',        default: true  },
  { key: 'correction',  label: 'Correction',    default: true  },
  { key: 'holidays',    label: 'Holidays',      default: true  },
  { key: 'quota',       label: 'Quota',         default: false },
  { key: 'overtime',    label: 'Overtime',      default: false },
  { key: 'timeAccount', label: 'Time account',  default: false },
];

const RIGHT_COLS = [
  { key: 'nachtzuschlag',       label: 'Nachtzuschlag',       default: false },
  { key: 'sonntagszuschlag',    label: 'Sonntagszuschlag',    default: false },
  { key: 'nachtzuschlag2',      label: 'Nachtzuschlag2',      default: false },
  { key: 'sonntagszuschlag2',   label: 'Sonntagszuschlag2',   default: false },
  { key: 'feiertagszuschlag',   label: 'Feiertagszuschlag',   default: false },
  { key: 'urlaub',              label: 'Urlaub',              default: false },
  { key: 'unentschuldigte',     label: 'Unentschuldigte\nAbwesenheit', default: false },
  { key: 'standByFrei',         label: 'Stand by/ frei',     default: false },
  { key: 'überstundenausgleich',label: 'Überstundenausgleich',default: false },
  { key: 'krankheit',           label: 'Krankheit',           default: false },
  { key: 'qualifikation',       label: 'Qualifikation',       default: false },
  { key: 'wunschfrei',          label: 'Wunschfrei',          default: false },
  { key: 'late',                label: 'Late',                default: true  },
];

const DEFAULT_VISIBLE = new Set(
  [...LEFT_COLS, ...RIGHT_COLS].filter(c => c.default).map(c => c.key)
);

const DOW_LABELS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function ColumnsModal({ visible, setVisible, fmt, setFmt, activeDow, setActiveDow, close }: {
  visible: Set<string>;
  setVisible: (s: Set<string>) => void;
  fmt: TimeFormat;
  setFmt: (f: TimeFormat) => void;
  activeDow: Set<string>;
  setActiveDow: (s: Set<string>) => void;
  close: () => void;
}) {
  const [local,   setLocal]   = useState(new Set(visible));
  const [localFmt, setLocalFmt] = useState(fmt);
  const [localDow, setLocalDow] = useState(new Set(activeDow));

  const toggle    = (k: string) => setLocal(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleDow = (d: string) => setLocalDow(p => { const n = new Set(p); n.has(d) ? n.delete(d) : n.add(d); return n; });

  const apply = () => {
    setVisible(local);
    setFmt(localFmt);
    setActiveDow(localDow);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) apply(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[520px] fade-in">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-[15px] font-medium text-gray-800">Displayed columns:</h3>
          <button onClick={apply} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={17} /></button>
        </div>

        <div className="px-5 py-4">
          {/* Two-column checkbox list */}
          <div className="grid grid-cols-2 gap-x-8 mb-5">
            {/* Left column */}
            <div className="space-y-0.5">
              {LEFT_COLS.map(col => (
                <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input type="checkbox" checked={local.has(col.key)} onChange={() => toggle(col.key)}
                    className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                  <span className="text-[13px] text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
            {/* Right column */}
            <div className="space-y-0.5">
              {RIGHT_COLS.map(col => (
                <label key={col.key} className="flex items-start gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input type="checkbox" checked={local.has(col.key)} onChange={() => toggle(col.key)}
                    className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer mt-0.5" />
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-700 whitespace-pre-line leading-tight">{col.label}</span>
                    {/* Late threshold badge */}
                    {col.key === 'late' && local.has('late') && (
                      <span className="text-[11px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 cursor-pointer hover:bg-gray-200 transition-colors">
                        &gt; 1 min
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100 mb-4" />

          {/* Time format */}
          <div className="flex items-center gap-6 mb-3">
            <span className="text-[13px] font-medium text-[#2196F3] w-24 shrink-0">Time format</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="fmt" checked={localFmt === 'decimal'} onChange={() => setLocalFmt('decimal')}
                className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
              <span className="text-[13px] text-gray-600">hours decimal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="fmt" checked={localFmt === 'hmin'} onChange={() => setLocalFmt('hmin')}
                className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
              <span className="text-[13px] text-gray-600">h:min</span>
            </label>
          </div>

          {/* Days of week */}
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-gray-500 shrink-0">Days of week:</span>
            {DOW_LABELS.map(d => (
              <button key={d} onClick={() => toggleDow(d)}
                className={cn('text-[13px] font-medium transition-colors',
                  localDow.has(d) ? 'text-[#2196F3]' : 'text-gray-300 hover:text-gray-400')}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EXPORT DROPDOWN  (Image 3 — CSV / Excel / PDF / Company name)
───────────────────────────────────────────────────────── */
function ExportDropdown({ close }: { close: () => void }) {
  const items = [
    { icon: <FileText size={13} />, label: 'CSV Export' },
    { icon: <Sheet size={13} />,    label: 'Excel Export' },
    { icon: <File size={13} />,     label: 'PDF Export' },
    { icon: <Settings size={13} />, label: 'Company name' },
  ];
  return (
    <>
      <div className="fixed inset-0 z-[190]" onClick={close} />
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-[200] w-44 py-1 fade-in">
        {items.map(({ icon, label }) => (
          <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#2196F3] hover:bg-gray-50 text-left transition-colors">
            {icon}{label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   FILTER DROPDOWN  (Image 4 — Role / Label / Address / Hashtag)
───────────────────────────────────────────────────────── */
function FilterDropdown({ close }: { close: () => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setChecked(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <>
      <div className="fixed inset-0 z-[190]" onClick={close} />
      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-[200] w-44 py-1 fade-in">
        <div className="px-4 py-2 border-b border-gray-100">
          <span className="text-[13px] font-semibold text-gray-700">Filter</span>
        </div>
        {['Role','Label','Address','Hashtag'].map(item => (
          <label key={item} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={checked.has(item)} onChange={() => toggle(item)}
              className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
            <span className="text-[13px] text-gray-600">{item}</span>
          </label>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   EMPLOYEE FILTER MODAL  (Image 5 — "This rule applies to:")
───────────────────────────────────────────────────────── */
function EmployeeRuleModal({ empCount, close }: { empCount: number; close: () => void }) {
  const options = [
    'All users:',
    'Only selected employees:',
    'Except for selected employees:',
    'Only employees of the role:',
    'Only employees of the locations:',
    'Only employees with rights:',
  ];
  const [selected, setSelected] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/30 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[560px] max-w-full fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[16px] font-medium text-gray-800">This rule applies to:</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
        </div>

        <div className="divide-y divide-gray-100">
          {options.map((opt, i) => (
            <label key={opt} className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={selected === i} onChange={() => setSelected(i)}
                className="w-4 h-4 accent-[#2196F3] cursor-pointer" />
              <span className="text-[14px] text-gray-600">{opt}</span>
            </label>
          ))}
        </div>

        {/* Footer count bar */}
        <div className="bg-blue-50 px-6 py-3 text-center">
          <span className="text-[14px] text-[#2196F3] font-medium">
            {empCount} / {empCount}&nbsp;&nbsp;Employees
          </span>
        </div>

        <div className="flex justify-end px-6 py-4">
          <button onClick={close}
            className="bg-[#2196F3] hover:bg-[#1976D2] text-white text-[13px] font-semibold rounded px-6 py-1.5 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN REPORTING VIEW
───────────────────────────────────────────────────────── */
export function ReportingView() {
  const { reportingSubTab, setReportingSubTab, reportingStartDate, reportingEndDate, setReportingFilter } = useAppStore();

  // Column visibility state
  const [visible,    setVisible]   = useState<Set<string>>(new Set(DEFAULT_VISIBLE));
  const [fmt,        setFmt]       = useState<TimeFormat>('hmin');
  const [activeDow,  setActiveDow] = useState<Set<string>>(new Set(DOW_LABELS));

  // Modal / dropdown state
  const [colsOpen,    setColsOpen]   = useState(false);
  const [exportOpen,  setExportOpen] = useState(false);
  const [filterOpen,  setFilterOpen] = useState(false);
  const [ruleOpen,    setRuleOpen]   = useState(false);

  // Determine which columns to show (in order)
  const orderedCols = [
    { key: 'shifts',             label: 'Shifts' },
    { key: 'holidays',           label: 'Holidays' },
    { key: 'correction',         label: 'Correction' },
    { key: 'quota',              label: 'Quota' },
    { key: 'overtime',           label: 'Overtime' },
    { key: 'timeAccount',        label: 'Time account' },
    { key: 'nachtzuschlag',      label: 'Nachtzuschlag' },
    { key: 'sonntagszuschlag',   label: 'Sonntagszuschlag' },
    { key: 'nachtzuschlag2',     label: 'Nachtzuschlag2' },
    { key: 'sonntagszuschlag2',  label: 'Sonntagszuschlag2' },
    { key: 'feiertagszuschlag',  label: 'Feiertagszuschlag' },
    { key: 'urlaub',             label: 'Urlaub' },
    { key: 'unentschuldigte',    label: 'Unentschuldigte Abwesenheit' },
    { key: 'standByFrei',        label: 'Stand by/ frei' },
    { key: 'überstundenausgleich', label: 'Überstundenausgleich' },
    { key: 'krankheit',          label: 'Krankheit' },
    { key: 'qualifikation',      label: 'Qualifikation' },
    { key: 'wunschfrei',         label: 'Wunschfrei' },
    { key: 'late',               label: 'Late' },
  ].filter(c => visible.has(c.key));

  // Get cell value for a row + col key
  const getCellValue = (row: SummedRow, key: string): string => {
    switch (key) {
      case 'shifts':             return row.shifts;
      case 'holidays':           return row.holidays;
      case 'correction':         return row.correction;
      case 'quota':              return row.quota ?? '0:00';
      case 'overtime':           return row.overtime ?? '0:00';
      case 'timeAccount':        return row.timeAccount ?? '0:00';
      case 'nachtzuschlag':      return row.nachtzuschlag ?? '0:00';
      case 'sonntagszuschlag':   return row.sonntagszuschlag ?? '0:00';
      case 'nachtzuschlag2':     return row.nachtzuschlag2 ?? '0:00';
      case 'sonntagszuschlag2':  return row.sonntagszuschlag2 ?? '0:00';
      case 'feiertagszuschlag':  return row.feiertagszuschlag ?? '0:00';
      case 'urlaub':             return row.urlaub ?? '0:00';
      case 'unentschuldigte':    return row.unentschuldigte ?? '0:00';
      case 'standByFrei':        return row.standByFrei ?? '0:00';
      case 'überstundenausgleich': return row.überstundenausgleich ?? '0:00';
      case 'krankheit':          return row.krankheit ?? '0:00';
      case 'qualifikation':      return row.qualifikation ?? '0:00';
      case 'wunschfrei':         return row.wunschfrei ?? '0:00';
      case 'late':               return String(row.late);
      default:                   return '0:00';
    }
  };

  // Compute sum row
  const sumRow = (key: string): string => {
    if (key === 'late') {
      const total = SUMMED_DATA.reduce((a, r) => a + r.late, 0);
      return String(total);
    }
    // For time values: parse "h:mm" and sum
    const total = SUMMED_DATA.reduce((acc, row) => {
      const val = getCellValue(row, key);
      const [h, m] = val.split(':').map(Number);
      return acc + (isNaN(h) ? 0 : h * 60 + (isNaN(m) ? 0 : m));
    }, 0);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h}:${String(m).padStart(2, '0')}`;
  };

  // Is a non-zero value?
  const isZero = (v: string) => v === '0:00' || v === '0' || v === '0.00';

  return (
    <div
      className="flex flex-col bg-gray-50"
      style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}
    >
      {/* ── Tertiary tabs ── */}
      <div className="flex gap-0 px-4 pt-3 bg-white border-b border-gray-200 shrink-0">
        {(['Detailed report', 'Summed report'] as const).map(tab => (
          <button key={tab} onClick={() => setReportingSubTab(tab)}
            className={cn('px-1 py-1.5 text-[13px] mr-5 -mb-px transition-all border-b-2',
              reportingSubTab === tab
                ? 'border-transparent text-[#2196F3] font-semibold underline underline-offset-4 decoration-2'
                : 'border-transparent text-gray-500 hover:text-[#2196F3]')}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">

        {/* Employee count filter — opens rule modal */}
        <button
          onClick={() => setRuleOpen(true)}
          className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-700 bg-white hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"
        >
          <span className="text-[#2196F3] font-semibold mr-0.5">{EMPLOYEES.length}</span>
          Employee
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </button>

        {/* Date range */}
        <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1.5 bg-white">
          <input
            type="date"
            value={reportingStartDate}
            onChange={e => setReportingFilter('reportingStartDate', e.target.value)}
            className="text-[12px] text-gray-600 outline-none bg-transparent"
          />
          <span className="text-gray-400 text-xs mx-0.5">~</span>
          <input
            type="date"
            value={reportingEndDate}
            onChange={e => setReportingFilter('reportingEndDate', e.target.value)}
            className="text-[12px] text-gray-600 outline-none bg-transparent"
          />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 ml-0.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        {/* Column settings (gear icon) */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(v => !v)}
            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors"
            title="Column settings"
          >
            <Settings size={14} />
          </button>
          {filterOpen && <FilterDropdown close={() => setFilterOpen(false)} />}
        </div>
        <div className="flex-1" />

        {/* View button — opens filter dropdown */}
        <div className="relative">
          <button
             onClick={() => setColsOpen(true)}
            className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors"
          >
            <LayoutGrid size={13} />View
          </button>
         
        </div>

        {/* Download — opens export dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(v => !v)}
            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors"
            title="Export"
          >
            <Download size={13} />
          </button>
          {exportOpen && <ExportDropdown close={() => setExportOpen(false)} />}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-gray-200">
              {/* Employee column */}
              <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-[#2196F3] whitespace-nowrap w-40">
                Employee
              </th>
              {/* Dynamic columns */}
              {orderedCols.map(col => (
                <th key={col.key} className="px-4 py-2.5 text-left text-[13px] font-semibold text-[#2196F3] whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {/* Total + Late always shown on right */}
              <th className="px-4 py-2.5 text-right text-[13px] font-semibold text-[#2196F3] whitespace-nowrap w-24">
                Total
              </th>
              <th className="px-4 py-2.5 text-right text-[13px] font-semibold text-[#2196F3] whitespace-nowrap w-16 pr-6">
                Late
              </th>
              {/* Scroll indicator column */}
              <th className="w-5 border-l border-gray-100" />
            </tr>
          </thead>

          <tbody>
            {SUMMED_DATA.map(row => (
              <tr key={row.employeeId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* Employee name */}
                <td className="px-4 py-2.5 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                  {row.name}
                </td>

                {/* Dynamic columns */}
                {orderedCols.map(col => {
                  const val = getCellValue(row, col.key);
                  return (
                    <td key={col.key} className={cn('px-4 py-2.5 text-[13px] whitespace-nowrap', isZero(val) ? 'text-gray-400' : 'text-gray-800')}>
                      {val}
                    </td>
                  );
                })}

                {/* Total */}
                <td className="px-4 py-2.5 text-[13px] font-bold text-gray-800 text-right whitespace-nowrap">
                  {row.total}
                </td>
                {/* Late */}
                <td className="px-4 py-2.5 text-[13px] text-gray-800 text-right whitespace-nowrap pr-6">
                  {row.late}
                </td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Sum row (sticky bottom) ── */}
      <div className="bg-white border-t border-gray-200 shrink-0">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="px-4 py-2.5 text-[13px] font-semibold text-[#2196F3] w-40 whitespace-nowrap">Sum:</td>
              {orderedCols.map(col => {
                const val = sumRow(col.key);
                return (
                  <td key={col.key} className={cn('px-4 py-2.5 text-[13px] whitespace-nowrap', isZero(val) ? 'text-gray-400' : 'text-gray-800 font-semibold')}>
                    {val}
                  </td>
                );
              })}
              {/* Total sum */}
              <td className="px-4 py-2.5 text-[13px] font-bold text-gray-800 text-right w-24 whitespace-nowrap">
                {(() => {
                  const total = SUMMED_DATA.reduce((acc, r) => {
                    const [h, m] = r.total.split(':').map(Number);
                    return acc + h * 60 + m;
                  }, 0);
                  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2,'0')}`;
                })()}
              </td>
              <td className="px-4 py-2.5 text-[13px] text-gray-800 text-right w-16 pr-6">
                {SUMMED_DATA.reduce((a, r) => a + r.late, 0)}
              </td>
              <td className="w-5" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Modals ── */}
      {colsOpen && (
        <ColumnsModal
          visible={visible} setVisible={setVisible}
          fmt={fmt} setFmt={setFmt}
          activeDow={activeDow} setActiveDow={setActiveDow}
          close={() => setColsOpen(false)}
        />
      )}
      {ruleOpen && (
        <EmployeeRuleModal empCount={EMPLOYEES.length} close={() => setRuleOpen(false)} />
      )}
    </div>
  );
}