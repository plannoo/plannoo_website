import { useState } from 'react';
import { X, LayoutGrid, Download, Settings, FileText, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { EMPLOYEES } from '@/data/mockData';
import { cn } from '@/utils';

/* ══════════════════════════════════════════════════════════
   COLUMN DEFINITIONS
══════════════════════════════════════════════════════════ */

// Detailed report — left checkbox column (Image 2)
const DET_LEFT = [
  { key: 'date',         label: 'Date',         default: true  },
  { key: 'employee',     label: 'Employee',     default: true  },
  { key: 'role',         label: 'Role',         default: true  },
  { key: 'location',     label: 'Location',     default: true  },
  { key: 'label',        label: 'Label',        default: false },
  { key: 'plannedTime',  label: 'Planned time', default: true  },
  { key: 'timeTracking', label: 'Time Tracking',default: true  },
  { key: 'duration',     label: 'Duration',     default: true  },
];
// Detailed report — right checkbox column (Image 2)
const DET_RIGHT = [
  { key: 'id',                 label: 'Id',                default: true  },
  { key: 'address',            label: 'Address',           default: true  },
  { key: 'hashtags',           label: 'Hashtags',          default: true  },
  { key: 'comment',            label: 'Comment',           default: true  },
  { key: 'breakInterval',      label: 'Break intervall',   default: true  },
  { key: 'nachtzuschlag',      label: 'Nachtzuschlag',     default: true  },
  { key: 'sonntagszuschlag',   label: 'Sonntagszuschlag',  default: true  },
  { key: 'nachtzuschlag2',     label: 'Nachtzuschlag2',    default: true  },
  { key: 'sonntagszuschlag2',  label: 'Sonntagszuschlag2', default: true  },
  { key: 'feiertagszuschlag',  label: 'Feiertagszuschlag', default: true  },
];
// Data types accordion (Image 2 bottom section)
const DATA_TYPE_LEFT = [
  { key: 'dt_shifts',     label: 'Shifts',      default: true  },
  { key: 'dt_correction', label: 'Correction',  default: true  },
  { key: 'dt_holidays',   label: 'Holidays',    default: true  },
];
const DATA_TYPE_RIGHT = [
  { key: 'dt_urlaub',              label: 'Urlaub',               default: false },
  { key: 'dt_unentschuldigte',     label: 'Unentschuldigte\nAbwesenheit', default: false },
  { key: 'dt_standBy',             label: 'Stand by/ frei',       default: false },
  { key: 'dt_überstunden',         label: 'Überstundenausgleich', default: false },
  { key: 'dt_krankheit',           label: 'Krankheit',            default: false },
  { key: 'dt_qualifikation',       label: 'Qualifikation',        default: false },
  { key: 'dt_wunschfrei',          label: 'Wunschfrei',           default: false },
];

// Summed report columns
const SUM_LEFT = [
  { key: 'shifts',      label: 'Shifts',       default: true  },
  { key: 'correction',  label: 'Correction',   default: true  },
  { key: 'holidays',    label: 'Holidays',     default: true  },
  { key: 'quota',       label: 'Quota',        default: false },
  { key: 'overtime',    label: 'Overtime',     default: false },
  { key: 'timeAccount', label: 'Time account', default: false },
];
const SUM_RIGHT = [
  { key: 'nachtzuschlag',        label: 'Nachtzuschlag',        default: false },
  { key: 'sonntagszuschlag',     label: 'Sonntagszuschlag',     default: false },
  { key: 'nachtzuschlag2',       label: 'Nachtzuschlag2',       default: false },
  { key: 'sonntagszuschlag2',    label: 'Sonntagszuschlag2',    default: false },
  { key: 'feiertagszuschlag',    label: 'Feiertagszuschlag',    default: false },
  { key: 'urlaub',               label: 'Urlaub',               default: false },
  { key: 'unentschuldigte',      label: 'Unentschuldigte\nAbwesenheit', default: false },
  { key: 'standByFrei',          label: 'Stand by/ frei',      default: false },
  { key: 'überstundenausgleich', label: 'Überstundenausgleich', default: false },
  { key: 'krankheit',            label: 'Krankheit',            default: false },
  { key: 'qualifikation',        label: 'Qualifikation',        default: false },
  { key: 'wunschfrei',           label: 'Wunschfrei',           default: false },
  { key: 'late',                 label: 'Late',                 default: true  },
];

const DET_DEFAULT  = new Set([...DET_LEFT, ...DET_RIGHT].filter(c => c.default).map(c => c.key));
const DT_DEFAULT   = new Set([...DATA_TYPE_LEFT, ...DATA_TYPE_RIGHT].filter(c => c.default).map(c => c.key));
const SUM_DEFAULT  = new Set([...SUM_LEFT, ...SUM_RIGHT].filter(c => c.default).map(c => c.key));
const DOW_LABELS   = ['Mo','Tu','We','Th','Fr','Sa','Su'];

/* ══════════════════════════════════════════════════════════
   MOCK DATA FOR TABLES
══════════════════════════════════════════════════════════ */
const DET_ROWS = [
  { id:'d1',  date:'01.11.25 Sa', employee:'Zahir Zahirullah',     role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'12:00', duration:'11:00' },
  { id:'d2',  date:'01.11.25 Sa', employee:'Abdurahman Hussein',   role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'12:00', duration:'11:00' },
  { id:'d3',  date:'01.11.25 Sa', employee:'Mohamed Osman',        role:'Sachkun...', location:'Inno PArk Kitzin...',  address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'12:00', duration:'11:00' },
  { id:'d4',  date:'01.11.25 Sa', employee:'Mahomed Anbul Jamal',  role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'12:00', duration:'11:00' },
  { id:'d5',  date:'01.11.25 Sa', employee:'Rustam Mudaev',        role:'Sachkun...', location:'Inno PArk Kitzin...',  address:'', hashtags:'', comment:'', label:'', plannedTime:'19:30 - 07:30 / 60', timeTracking:'19:30 - 07:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'7:30', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'4:30', duration:'11:00' },
  { id:'d6',  date:'01.11.25 Sa', employee:'Zaki Abdale',          role:'Schichtl...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'19:30 - 07:30 / 60', timeTracking:'19:30 - 07:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'7:30', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'4:30', duration:'11:00' },
  { id:'d7',  date:'01.11.25 Sa', employee:'Abdalle Adan Jama',    role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'19:30 - 07:30 / 60', timeTracking:'19:30 - 07:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'7:30', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'4:30', duration:'11:00' },
  { id:'d8',  date:'02.11.25 So', employee:'Abdurahman Hussein',   role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'12:00', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'', duration:'11:00' },
  { id:'d9',  date:'02.11.25 So', employee:'Mohamed Osman',        role:'Sachkun...', location:'Inno PArk Kitzin...',  address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'12:00', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'', duration:'11:00' },
  { id:'d10', date:'02.11.25 So', employee:'Rustam Mudaev',        role:'Sachkun...', location:'Inno PArk Kitzin...',  address:'', hashtags:'', comment:'', label:'', plannedTime:'19:30 - 07:30 / 60', timeTracking:'19:30 - 07:30 / 0', breakInterval:'', nachtzuschlag:'6:00', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'4:30', duration:'11:00' },
  { id:'d11', date:'03.11.25 Mo', employee:'Geral Male',           role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'', duration:'11:00' },
  { id:'d12', date:'03.11.25 Mo', employee:'Kamberi Evlan',        role:'Sicherhe...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'', duration:'11:00' },
  { id:'d13', date:'03.11.25 Mo', employee:'Zaki Abdale',          role:'Schichtl...', location:'Inno PArk Kitzin...', address:'', hashtags:'', comment:'', label:'', plannedTime:'07:30 - 19:30 / 60', timeTracking:'07:30 - 19:30 / 0', breakInterval:'', nachtzuschlag:'', sonntagszuschlag:'', nachtzuschlag2:'', sonntagszuschlag2:'', feiertagszuschlag:'', duration:'11:00' },
];

const SUM_ROWS = [
  { id:2, name:'Adan Mohamed',       shifts:'0:00', holidays:'0:00', correction:'0:00', late:0, total:'0:00', nz:'0:00', sz:'0:00', nz2:'0:00', sz2:'0:00', fz:'0:00' },
  { id:3, name:'Ahmed Yassin Osman', shifts:'0:00', holidays:'0:00', correction:'0:00', late:0, total:'0:00', nz:'0:00', sz:'0:00', nz2:'0:00', sz2:'0:00', fz:'0:00' },
  { id:4, name:'Ali Abdi Kosar',     shifts:'0:00', holidays:'0:00', correction:'0:00', late:0, total:'0:00', nz:'0:00', sz:'0:00', nz2:'0:00', sz2:'0:00', fz:'0:00' },
  { id:1, name:'Ralf Bertelt',       shifts:'0:00', holidays:'0:00', correction:'0:00', late:0, total:'0:00', nz:'0:00', sz:'0:00', nz2:'0:00', sz2:'0:00', fz:'0:00' },
  { id:5, name:'nacima Mohamed',     shifts:'0:00', holidays:'0:00', correction:'0:00', late:0, total:'0:00', nz:'0:00', sz:'0:00', nz2:'0:00', sz2:'0:00', fz:'0:00' },
];

/* ══════════════════════════════════════════════════════════
   DETAILED VIEW MODAL  (Image 2) — columns + data types accordion
══════════════════════════════════════════════════════════ */
function DetailedViewModal({ visible, dataTypes, onApply, close }: {
  visible: Set<string>; dataTypes: Set<string>;
  onApply: (cols: Set<string>, dt: Set<string>) => void;
  close: () => void;
}) {
  const [cols, setCols]   = useState(new Set(visible));
  const [dt,   setDt]     = useState(new Set(dataTypes));
  const [dtOpen, setDtOpen] = useState(true);
  const [fmt, setFmt]     = useState<'decimal'|'hmin'>('hmin');
  const [activeDow, setActiveDow] = useState(new Set(DOW_LABELS));

  const toggle    = (k: string, s: Set<string>, set: (x: Set<string>) => void) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); set(n); };
  const toggleDow = (d: string) => setActiveDow(p => { const n = new Set(p); n.has(d) ? n.delete(d) : n.add(d); return n; });
  const apply     = () => { onApply(cols, dt); close(); };

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) apply(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[520px] max-h-[90vh] overflow-auto fade-in">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-[15px] font-medium text-gray-800">Displayed columns:</h3>
          <button onClick={apply} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
        </div>

        {/* Column checkboxes */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-x-8">
            <div className="space-y-0.5">
              {DET_LEFT.map(col => (
                <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input type="checkbox" checked={cols.has(col.key)} onChange={() => toggle(col.key, cols, setCols)}
                    className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                  <span className="text-[13px] text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
            <div className="space-y-0.5">
              {DET_RIGHT.map(col => (
                <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input type="checkbox" checked={cols.has(col.key)} onChange={() => toggle(col.key, cols, setCols)}
                    className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                  <span className="text-[13px] text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Data types accordion */}
        <div className="mx-5 mt-4 mb-2 border border-gray-200 rounded overflow-hidden">
          <button onClick={() => setDtOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#2196F3] hover:bg-[#1976D2] transition-colors">
            <span className="text-[13px] font-semibold text-white">Data types</span>
            <span className="text-white text-lg leading-none">{dtOpen ? '▲' : '▼'}</span>
          </button>
          {dtOpen && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="space-y-0.5">
                  {DATA_TYPE_LEFT.map(col => (
                    <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                      <input type="checkbox" checked={dt.has(col.key)} onChange={() => toggle(col.key, dt, setDt)}
                        className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                      <span className="text-[13px] text-gray-700">{col.label}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-0.5">
                  {DATA_TYPE_RIGHT.map(col => (
                    <label key={col.key} className="flex items-start gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                      <input type="checkbox" checked={dt.has(col.key)} onChange={() => toggle(col.key, dt, setDt)}
                        className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer mt-0.5" />
                      <span className="text-[13px] text-gray-700 whitespace-pre-line leading-tight">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time format + Days of week */}
        <div className="px-5 pb-4 space-y-3">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-medium text-[#2196F3] w-24 shrink-0">Time format</span>
            {(['decimal','hmin'] as const).map(f => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="detfmt" checked={fmt === f} onChange={() => setFmt(f)} className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                <span className="text-[13px] text-gray-600">{f === 'decimal' ? 'hours decimal' : 'h:min'}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-gray-500 shrink-0">Days of week:</span>
            {DOW_LABELS.map(d => (
              <button key={d} onClick={() => toggleDow(d)}
                className={cn('text-[13px] font-medium transition-colors', activeDow.has(d) ? 'text-[#2196F3]' : 'text-gray-300 hover:text-gray-400')}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SUMMED VIEW MODAL
══════════════════════════════════════════════════════════ */
function SummedViewModal({ visible, onApply, close }: {
  visible: Set<string>;
  onApply: (cols: Set<string>) => void;
  close: () => void;
}) {
  const [local,    setLocal]    = useState(new Set(visible));
  const [fmt,      setFmt]      = useState<'decimal'|'hmin'>('hmin');
  const [activeDow, setActiveDow] = useState(new Set(DOW_LABELS));

  const toggle    = (k: string) => setLocal(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleDow = (d: string) => setActiveDow(p => { const n = new Set(p); n.has(d) ? n.delete(d) : n.add(d); return n; });
  const apply     = () => { onApply(local); close(); };

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) apply(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[520px] max-h-[90vh] overflow-auto fade-in">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-[15px] font-medium text-gray-800">Displayed columns:</h3>
          <button onClick={apply} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
        </div>
        <div className="px-5 py-4">
          <div className="grid grid-cols-2 gap-x-8 mb-5">
            <div className="space-y-0.5">
              {SUM_LEFT.map(col => (
                <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input type="checkbox" checked={local.has(col.key)} onChange={() => toggle(col.key)} className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                  <span className="text-[13px] text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
            <div className="space-y-0.5">
              {SUM_RIGHT.map(col => (
                <label key={col.key} className="flex items-start gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input type="checkbox" checked={local.has(col.key)} onChange={() => toggle(col.key)} className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer mt-0.5" />
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-700 whitespace-pre-line leading-tight">{col.label}</span>
                    {col.key === 'late' && local.has('late') && (
                      <span className="text-[11px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 hover:bg-gray-200 cursor-pointer">&gt; 1 min</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-gray-100 mb-4" />
          <div className="flex items-center gap-6 mb-3">
            <span className="text-[13px] font-medium text-[#2196F3] w-24 shrink-0">Time format</span>
            {(['decimal','hmin'] as const).map(f => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sumfmt" checked={fmt === f} onChange={() => setFmt(f)} className="w-3.5 h-3.5 accent-[#2196F3] cursor-pointer" />
                <span className="text-[13px] text-gray-600">{f === 'decimal' ? 'hours decimal' : 'h:min'}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-gray-500 shrink-0">Days of week:</span>
            {DOW_LABELS.map(d => (
              <button key={d} onClick={() => toggleDow(d)}
                className={cn('text-[13px] font-medium transition-colors', activeDow.has(d) ? 'text-[#2196F3]' : 'text-gray-300 hover:text-gray-400')}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EXPORT DROPDOWN
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   EXPORT HELPERS — CSV / Excel / PDF
══════════════════════════════════════════════════════════ */
import { downloadDetailedPDF, downloadSummedPDF } from './ReportPDF';
import type { SumRow } from './ReportPDF';

function toCSV(headers: string[], rows: string[][]): string {
  const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
  return [headers.map(esc).join(','), ...rows.map((r: string[]) => r.map(esc).join(','))].join('\n');
}
function toTSV(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((r: string[]) => r.join('\t')).join('\n');
}
function blobDown(content: string, name: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  Object.assign(document.createElement('a'), { href: url, download: name }).click();
  URL.revokeObjectURL(url);
}

function sumTimesArr(vals: string[]): string {
  const t = vals.reduce((acc, v) => {
    const [h, m] = (v || '0:00').split(':').map(Number);
    return acc + (isNaN(h) ? 0 : h * 60) + (isNaN(m) ? 0 : m);
  }, 0);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

// ── Detailed exports ──────────────────────────────────
const DET_HDR = ['Datum','Mitarbeiter','Rolle','Standort','Planzeit','Zeiterfassung','Pausenintervall','Nacht...','Sonntag...','Feiertag...','Dauer'];
function getDetRows(): string[][] {
  return DET_ROWS.map((r: DetRow) => [r.date, r.employee, r.role, r.location, r.plannedTime, r.timeTracking, r.breakInterval, r.nachtzuschlag, r.sonntagszuschlag, r.feiertagszuschlag, r.duration]);
}
function getDetSumRow(rows: string[][]): string[] {
  const timeIdx = [6, 7, 8, 9, 10]; // Pause, Nacht, Sonntag, Feiertag, Dauer
  return DET_HDR.map((h, i) => {
    if (i === 0) return 'Summe:';
    if (timeIdx.includes(i)) return sumTimesArr(rows.map((r: string[]) => r[i]));
    return '';
  });
}

function exportDetailed(format: 'csv' | 'excel' | 'pdf', dateFrom: string, dateTo: string, company: string) {
  const rows   = getDetRows();
  const sumRow = getDetSumRow(rows);
  if (format === 'csv') {
    blobDown(toCSV(DET_HDR, [...rows, sumRow]), `Auswertung_${dateFrom}_${dateTo}.csv`, 'text/csv;charset=utf-8');
  } else if (format === 'excel') {
    blobDown(toTSV(DET_HDR, [...rows, sumRow]), `Auswertung_${dateFrom}_${dateTo}.xls`, 'application/vnd.ms-excel');
  } else {
    downloadDetailedPDF(DET_ROWS, dateFrom, dateTo, company);
  }
}

// ── Summed exports ────────────────────────────────────
const SUM_HDR = ['Mitarbeiter','Schichten','Feiertage','Korrektur','Gesamt','Spät','NZ%','SZ%','NZ2%','SZ2%','FZ%'];
function getSumDataRows(): string[][] {
  return SUM_ROWS.map((r: SumRow) => [r.name, r.shifts, r.holidays, r.correction, r.total, String(r.late), r.nz, r.sz, r.nz2, r.sz2, r.fz]);
}
function getSumSumRow(rows: string[][]): string[] {
  const timeIdx = [1, 2, 3, 4, 6, 7, 8, 9, 10];
  return SUM_HDR.map((h, i) => {
    if (i === 0) return 'Summe:';
    if (i === 5)  return String(SUM_ROWS.reduce((a, r) => a + r.late, 0)); // Late count
    if (timeIdx.includes(i)) return sumTimesArr(rows.map(r => r[i]));
    return '';
  });
}

function exportSummed(format: 'csv' | 'excel' | 'pdf', dateFrom: string, dateTo: string, company: string) {
  const rows   = getSumDataRows();
  const sumRow = getSumSumRow(rows);
  if (format === 'csv') {
    blobDown(toCSV(SUM_HDR, [...rows, sumRow]), `Zusammenfassung_${dateFrom}_${dateTo}.csv`, 'text/csv;charset=utf-8');
  } else if (format === 'excel') {
    blobDown(toTSV(SUM_HDR, [...rows, sumRow]), `Zusammenfassung_${dateFrom}_${dateTo}.xls`, 'application/vnd.ms-excel');
  } else {
    downloadSummedPDF(SUM_ROWS, dateFrom, dateTo, company);
  }
}

/* ══════════════════════════════════════════════════════════
   COMPANY NAME MODAL
══════════════════════════════════════════════════════════ */
function CompanyNameModal({ current, onSave, close }: { current: string; onSave: (n: string) => void; close: () => void }) {
  const [val, setVal] = useState(current);
  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[380px] fade-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-[15px] font-medium text-gray-800">Company name</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
        </div>
        <div className="px-5 py-4">
          <p className="text-[12px] text-gray-500 mb-2">This name appears in PDF report headers.</p>
          <input autoFocus value={val} onChange={e => setVal(e.target.value)}
            placeholder="e.g. Square Security GmbH"
            className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2196F3] placeholder:text-gray-300" />
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button onClick={close} className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave(val.trim() || 'Aplano'); close(); }}
            className="px-5 py-1.5 bg-[#2196F3] hover:bg-[#1976D2] text-white text-[13px] font-medium rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EXPORT DROPDOWN
══════════════════════════════════════════════════════════ */
function ExportDropdown({ close, isSummed, dateFrom, dateTo, company, onCompanyName }: {
  close: () => void; isSummed: boolean;
  dateFrom: string; dateTo: string; company: string;
  onCompanyName: () => void;
}) {
  const handle = (format: 'csv' | 'excel' | 'pdf') => {
    if (isSummed) exportSummed(format, dateFrom, dateTo, company);
    else          exportDetailed(format, dateFrom, dateTo, company);
    close();
  };
  return (
    <>
      <div className="fixed inset-0 z-[190]" onClick={close} />
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-[200] w-48 py-1 fade-in">
        <button onClick={() => handle('csv')}   className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#2196F3] hover:bg-gray-50 text-left transition-colors"><FileText size={13} />CSV Export</button>
        <button onClick={() => handle('excel')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#2196F3] hover:bg-gray-50 text-left transition-colors"><FileText size={13} />Excel Export</button>
        <button onClick={() => handle('pdf')}   className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#2196F3] hover:bg-gray-50 text-left transition-colors"><FileText size={13} />PDF Export</button>
        <div className="my-1 border-t border-gray-100" />
        <button onClick={() => { close(); onCompanyName(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-500 hover:bg-gray-50 text-left transition-colors"><Settings size={13} />Company name</button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPLOYEE RULE MODAL
══════════════════════════════════════════════════════════ */
function EmployeeRuleModal({ empCount, close }: { empCount: number; close: () => void }) {
  const [sel, setSel] = useState(0);
  const opts = ['All users:','Only selected employees:','Except for selected employees:','Only employees of the role:','Only employees of the locations:','Only employees with rights:'];
  return (
    <div className="fixed inset-0 bg-black/30 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[560px] fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[16px] font-medium text-gray-800">This rule applies to:</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="divide-y divide-gray-100">
          {opts.map((opt, i) => (
            <label key={opt} className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50">
              <input type="checkbox" checked={sel === i} onChange={() => setSel(i)} className="w-4 h-4 accent-[#2196F3] cursor-pointer" />
              <span className="text-[14px] text-gray-600">{opt}</span>
            </label>
          ))}
        </div>
        <div className="bg-blue-50 px-6 py-3 text-center">
          <span className="text-[14px] text-[#2196F3] font-medium">{empCount} / {empCount}&nbsp;&nbsp;Employees</span>
        </div>
        <div className="flex justify-end px-6 py-4">
          <button onClick={close} className="bg-[#2196F3] hover:bg-[#1976D2] text-white text-[13px] font-semibold rounded px-6 py-1.5">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DETAILED TABLE  — columns driven by visible set
══════════════════════════════════════════════════════════ */
type DetRow = {
  id: string; date: string; employee: string; role: string; location: string;
  address: string; hashtags: string; comment: string; label: string;
  plannedTime: string; timeTracking: string; breakInterval: string;
  nachtzuschlag: string; sonntagszuschlag: string; nachtzuschlag2: string;
  sonntagszuschlag2: string; feiertagszuschlag: string; duration: string;
};

function DetailedTable({ visible }: { visible: Set<string> }) {
  // Map key → label and accessor
  const COL_MAP: { key: string; label: string; get: (r: DetRow) => string }[] = [
    { key:'id',               label:'Id',             get:(r: DetRow) => r.id },
    { key:'date',             label:'Date',           get:(r: DetRow) => r.date },
    { key:'employee',         label:'Employee',       get:(r: DetRow) => r.employee },
    { key:'role',             label:'Role',           get:(r: DetRow) => r.role },
    { key:'location',         label:'Location',       get:(r: DetRow) => r.location },
    { key:'address',          label:'Address',        get:(r: DetRow) => r.address },
    { key:'hashtags',         label:'Hashtags',       get:(r: DetRow) => r.hashtags },
    { key:'comment',          label:'Comment',        get:(r: DetRow) => r.comment },
    { key:'label',            label:'Label',          get:(r: DetRow) => r.label },
    { key:'plannedTime',      label:'Planned t...',   get:(r: DetRow) => r.plannedTime },
    { key:'timeTracking',     label:'Time Tracking',  get:(r: DetRow) => r.timeTracking },
    { key:'breakInterval',    label:'Break intervall',get:(r: DetRow) => r.breakInterval },
    { key:'nachtzuschlag',    label:'NZ%',            get:(r: DetRow) => r.nachtzuschlag },
    { key:'sonntagszuschlag', label:'SZ%',            get:(r: DetRow) => r.sonntagszuschlag },
    { key:'nachtzuschlag2',   label:'NZ%',            get:(r: DetRow) => r.nachtzuschlag2 },
    { key:'sonntagszuschlag2',label:'SZ%',            get:(r: DetRow) => r.sonntagszuschlag2 },
    { key:'feiertagszuschlag',label:'FZ%',            get:(r: DetRow) => r.feiertagszuschlag },
    { key:'duration',         label:'Duration',       get:(r: DetRow) => r.duration },
  ].filter(c => visible.has(c.key));

  return (
    <>
      <div className="flex-1 overflow-auto bg-white">
        {DET_ROWS.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[13px] text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse text-[12px]">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <tr>
                {COL_MAP.map(col => (
                  <th key={col.key} className="px-3 py-2.5 text-left font-semibold text-[#2196F3] whitespace-nowrap border-r border-gray-100 last:border-r-0">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DET_ROWS.map((row, ri) => (
                <tr key={row.id} className={cn('border-b border-gray-100 hover:bg-blue-50/20 transition-colors', ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/20')}>
                  {COL_MAP.map(col => {
                    const val = col.get(row);
                    return (
                      <td key={col.key} className={cn('px-3 py-1.5 whitespace-nowrap border-r border-gray-100 last:border-r-0',
                        val ? 'text-gray-800' : 'text-gray-300')}>
                        {val || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Sum footer — one row per visible column showing count/total */}
      <div className="bg-white border-t border-gray-200 shrink-0">
        <table className="w-full border-collapse text-[12px]">
          <tbody>
            <tr>
              {COL_MAP.map((col, i) => {
                // For time columns show total; for first col show "Sum:"
                const timeKeys = ['nachtzuschlag','sonntagszuschlag','nachtzuschlag2','sonntagszuschlag2','feiertagszuschlag'];
                if (i === 0) return (
                  <td key={col.key} className="px-3 py-2 font-semibold text-[#2196F3] border-r border-gray-100 whitespace-nowrap">Sum:</td>
                );
                if (timeKeys.includes(col.key)) {
                  const total = DET_ROWS.reduce((acc, row) => {
                    const v = col.get(row);
                    if (!v) return acc;
                    const [h, m] = v.split(':').map(Number);
                    return acc + (isNaN(h) ? 0 : h * 60) + (isNaN(m) ? 0 : m);
                  }, 0);
                  const display = total > 0 ? `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}` : '';
                  return <td key={col.key} className="px-3 py-2 text-gray-800 font-semibold border-r border-gray-100 whitespace-nowrap">{display}</td>;
                }
                if (col.key === 'duration') {
                  const total = DET_ROWS.reduce((acc, row) => {
                    const v = col.get(row);
                    const [h, m] = (v || '0:00').split(':').map(Number);
                    return acc + (isNaN(h) ? 0 : h * 60) + (isNaN(m) ? 0 : m);
                  }, 0);
                  return <td key={col.key} className="px-3 py-2 text-gray-800 font-semibold border-r border-gray-100 whitespace-nowrap">{`${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`}</td>;
                }
                return <td key={col.key} className="px-3 py-2 border-r border-gray-100" />;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   SUMMED TABLE — columns driven by visible set
══════════════════════════════════════════════════════════ */
type SumCol = { key: string; label: string; get: (r: SumRow) => string };

function SummedTable({ visible }: { visible: Set<string> }) {
  const isZ = (v: string | number) => v === '0:00' || v === 0;

  const dataCols: SumCol[] = [
    { key:'shifts',     label:'Shifts',       get:(r: SumRow) => r.shifts },
    { key:'holidays',   label:'Holidays',     get:(r: SumRow) => r.holidays },
    { key:'correction', label:'Correction',   get:(r: SumRow) => r.correction },
    { key:'quota',      label:'Quota',        get:() => '0:00' },
    { key:'overtime',   label:'Overtime',     get:() => '0:00' },
    { key:'timeAccount',label:'Time account', get:() => '0:00' },
  ].filter(c => visible.has(c.key));

  const optCols: SumCol[] = [
    { key:'nachtzuschlag',        label:'Nachtzuschlag',     get:(r: SumRow) => r.nz },
    { key:'sonntagszuschlag',     label:'Sonntagszuschlag',  get:(r: SumRow) => r.sz },
    { key:'nachtzuschlag2',       label:'Nachtzuschlag2',    get:(r: SumRow) => r.nz2 },
    { key:'sonntagszuschlag2',    label:'Sonntagszuschlag2', get:(r: SumRow) => r.sz2 },
    { key:'feiertagszuschlag',    label:'Feiertagszuschlag', get:(r: SumRow) => r.fz },
    { key:'urlaub',               label:'Urlaub',            get:() => '0:00' },
    { key:'unentschuldigte',      label:'Unentschuldigte',   get:() => '0:00' },
    { key:'standByFrei',          label:'Stand by/ frei',   get:() => '0:00' },
    { key:'überstundenausgleich', label:'Überstunden',       get:() => '0:00' },
    { key:'krankheit',            label:'Krankheit',         get:() => '0:00' },
    { key:'qualifikation',        label:'Qualifikation',     get:() => '0:00' },
    { key:'wunschfrei',           label:'Wunschfrei',        get:() => '0:00' },
  ].filter(c => visible.has(c.key));

  const showLate = visible.has('late');
  const allCols  = [...dataCols, ...optCols];

  const sumTime = (vals: string[]) => {
    const t = vals.reduce((acc, v) => { const [h,m] = v.split(':').map(Number); return acc + (isNaN(h)?0:h*60) + (isNaN(m)?0:m); }, 0);
    return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <tr>
              <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-[#2196F3] whitespace-nowrap w-44">Employee</th>
              {allCols.map(c => <th key={c.key} className="px-4 py-2.5 text-left text-[13px] font-semibold text-[#2196F3] whitespace-nowrap">{c.label}</th>)}
              <th className="px-4 py-2.5 text-right text-[13px] font-semibold text-[#2196F3] whitespace-nowrap w-20">Total</th>
              {showLate && <th className="px-3 py-2.5 text-right text-[13px] font-semibold text-[#2196F3] whitespace-nowrap w-14">Late</th>}
              {['NZ%','SZ%','NZ%','SZ%','FZ%'].map((l,i) => <th key={`${l}${i}`} className="px-3 py-2.5 text-right text-[12px] font-semibold text-[#2196F3] whitespace-nowrap w-16">{l}</th>)}
              <th className="w-5" />
            </tr>
          </thead>
          <tbody>
            {SUM_ROWS.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 text-[13px] text-gray-800 font-medium whitespace-nowrap">{row.name}</td>
                {allCols.map(c => { const v = c.get(row); return <td key={c.key} className={cn('px-4 py-2.5 text-[13px] whitespace-nowrap', isZ(v) ? 'text-gray-400' : 'text-gray-800')}>{v}</td>; })}
                <td className="px-4 py-2.5 text-[13px] font-bold text-gray-800 text-right whitespace-nowrap">{row.total}</td>
                {showLate && <td className="px-3 py-2.5 text-[13px] text-gray-800 text-right whitespace-nowrap">{row.late}</td>}
                {[row.nz,row.sz,row.nz2,row.sz2,row.fz].map((v,i) => <td key={i} className={cn('px-3 py-2.5 text-[12px] text-right whitespace-nowrap', isZ(v) ? 'text-gray-400' : 'text-gray-800')}>{v}</td>)}
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Sum footer */}
      <div className="bg-white border-t border-gray-200 shrink-0">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="px-4 py-2.5 text-[13px] font-semibold text-[#2196F3] w-44 whitespace-nowrap">Sum:</td>
              {allCols.map(c => { const v = sumTime(SUM_ROWS.map(r => c.get(r))); return <td key={c.key} className={cn('px-4 py-2.5 text-[13px] whitespace-nowrap', isZ(v) ? 'text-gray-400' : 'text-gray-800 font-semibold')}>{v}</td>; })}
              <td className="px-4 py-2.5 text-[13px] font-bold text-gray-800 text-right w-20 whitespace-nowrap">{sumTime(SUM_ROWS.map(r => r.total))}</td>
              {showLate && <td className="px-3 py-2.5 text-[13px] text-gray-800 text-right w-14 whitespace-nowrap">{SUM_ROWS.reduce((a,r)=>a+r.late,0)}</td>}
              {[sumTime(SUM_ROWS.map(r=>r.nz)),sumTime(SUM_ROWS.map(r=>r.sz)),sumTime(SUM_ROWS.map(r=>r.nz2)),sumTime(SUM_ROWS.map(r=>r.sz2)),sumTime(SUM_ROWS.map(r=>r.fz))].map((v,i)=><td key={i} className={cn('px-3 py-2.5 text-[12px] text-right whitespace-nowrap',isZ(v)?'text-gray-400':'text-gray-800 font-semibold')}>{v}</td>)}
              <td className="w-5" />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT REPORTING VIEW
══════════════════════════════════════════════════════════ */
export function ReportingView() {
  const { reportingSubTab, setReportingSubTab, reportingStartDate, reportingEndDate, reportingEmployee, reportingRole, reportingAddress, reportingHashtag, setReportingFilter } = useAppStore();

  const [detVisible,   setDetVisible]   = useState<Set<string>>(new Set(DET_DEFAULT));
  const [detDataTypes, setDetDataTypes] = useState<Set<string>>(new Set(DT_DEFAULT));
  const [sumVisible,   setSumVisible]   = useState<Set<string>>(new Set(SUM_DEFAULT));

  const [viewOpen,     setViewOpen]     = useState(false);
  const [exportOpen,   setExportOpen]   = useState(false);
  const [ruleOpen,     setRuleOpen]     = useState(false);
  const [companyOpen,  setCompanyOpen]  = useState(false);
  const [companyName,  setCompanyName]  = useState('Aplano');

  const isSummed = reportingSubTab === 'Summed report';

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>

      {/* ── Tertiary tabs ── */}
      <div className="flex px-4 pt-3 bg-white border-b border-gray-200 shrink-0">
        {(['Detailed report','Summed report'] as const).map(tab => (
          <button key={tab} onClick={() => setReportingSubTab(tab)}
            className={cn('px-1 py-1.5 text-[13px] mr-5 -mb-px border-b-2 transition-all',
              reportingSubTab === tab
                ? 'border-transparent text-[#2196F3] font-semibold underline underline-offset-4 decoration-2 decoration-[#2196F3]'
                : 'border-transparent text-gray-500 hover:text-[#2196F3]')}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        {isSummed ? (
          /* Summed: employee badge */
          <button onClick={() => setRuleOpen(true)}
            className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-700 bg-white hover:border-[#2196F3] hover:text-[#2196F3]">
            <span className="text-[#2196F3] font-semibold">{EMPLOYEES.length}</span>
            Employee
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        ) : (
          /* Detailed: Employee / Role / Address / Hashtag dropdowns */
          <>
            <div className="relative">
              <select value={reportingEmployee} onChange={e => setReportingFilter('reportingEmployee', e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[160px]">
                <option value="">Employee</option>
                {EMPLOYEES.map(e => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={reportingRole} onChange={e => setReportingFilter('reportingRole', e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[120px]">
                <option value="">Role</option>
                {['ADMIN','MANAGER','OBJEKTVERANTWORTLICHER','EMPLOYEE'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={reportingAddress} onChange={e => setReportingFilter('reportingAddress', e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[120px]">
                <option value="">Address</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={reportingHashtag} onChange={e => setReportingFilter('reportingHashtag', e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[120px]">
                <option value="">Hashtag</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </>
        )}

        {/* Date range — shared */}
        <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1.5 bg-white">
          <input type="date" value={reportingStartDate} onChange={e => setReportingFilter('reportingStartDate', e.target.value)} className="text-[12px] text-gray-600 outline-none bg-transparent" />
          <span className="text-gray-400 text-xs mx-0.5">~</span>
          <input type="date" value={reportingEndDate} onChange={e => setReportingFilter('reportingEndDate', e.target.value)} className="text-[12px] text-gray-600 outline-none bg-transparent" />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 ml-0.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        <div className="flex-1" />

        {/* View button — opens appropriate column modal */}
        <button onClick={() => setViewOpen(true)}
          className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white">
          <LayoutGrid size={13} />View
        </button>

        {/* Download */}
        <div className="relative">
          <button onClick={() => setExportOpen(v => !v)}
            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] bg-white">
            <Download size={13} />
          </button>
          {exportOpen && <ExportDropdown close={() => setExportOpen(false)} isSummed={isSummed} dateFrom={reportingStartDate} dateTo={reportingEndDate} company={companyName} onCompanyName={() => setCompanyOpen(true)} />}
        </div>
      </div>

      {/* ── Table ── */}
      {isSummed
        ? <SummedTable  visible={sumVisible} />
        : <DetailedTable visible={detVisible} />
      }

      {/* ── Modals ── */}
      {viewOpen && !isSummed && (
        <DetailedViewModal
          visible={detVisible}
          dataTypes={detDataTypes}
          onApply={(cols, dt) => { setDetVisible(cols); setDetDataTypes(dt); }}
          close={() => setViewOpen(false)}
        />
      )}
      {viewOpen && isSummed && (
        <SummedViewModal
          visible={sumVisible}
          onApply={cols => setSumVisible(cols)}
          close={() => setViewOpen(false)}
        />
      )}
      {ruleOpen && (
        <EmployeeRuleModal empCount={EMPLOYEES.length} close={() => setRuleOpen(false)} />
      )}
      {companyOpen && (
        <CompanyNameModal current={companyName} onSave={setCompanyName} close={() => setCompanyOpen(false)} />
      )}
    </div>
  );
}