import { useState, useCallback } from 'react';
import {
  Search, Shield, Info, Plus, ChevronLeft, ChevronRight, ChevronDown,
  EyeOff, Copy, Filter, List as ListIcon, Square, Columns2,
  TableProperties, LayoutGrid, MoreHorizontal, X, Trash2,
  Clock, Percent, CheckSquare, Paperclip,
  Coffee,
  Calendar,
  Move,
  Umbrella, ShieldCheck, CalendarPlus,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn, generateId } from '@/utils';
import type { Shift, Employee } from '@/types';

const SLOT_W  = 80;
const ROW_H   = 52;
const HEAD_H  = 36;
const COUNT_H = 28;
const OPEN_H  = 52;

const pad = (n: number) => String(n).padStart(2, '0');
const fmtTime = (h: number, m: number) => `${pad(h)}:${pad(m)}`;

const shiftDurH = (s: Shift) =>
  ((s.endHour * 60 + s.endMin) - (s.startHour * 60 + s.startMin) - s.breakMinutes) / 60;

const shiftLeft  = (s: Shift, base: number) => (s.startHour + s.startMin / 60 - base) * SLOT_W;
const shiftWidth = (s: Shift)               => ((s.endHour * 60 + s.endMin - s.startHour * 60 - s.startMin) / 60) * SLOT_W - 1;

const ROLE_OPTIONS = [
  { label: 'ADMIN',                            color: '#22c55e' },
  { label: 'MANAGER',                          color: '#f97316' },
  { label: 'OBJEKTVERANTWORTLICHER',            color: '#8b5cf6' },
  { label: 'Manager/ Objektverantwortlicher',   color: '#f97316' },
  { label: 'EMPLOYEE',                          color: '#3b82f6' },
];

const DAYS_S   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ══════════════════════════════════════════════════════════
   SHIFT MODAL  (create OR edit — Image 2)
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   REFINED PIXEL-PERFECT SHIFT MODAL
   ══════════════════════════════════════════════════════════ */

const ModalActionToolbar = ({ 
  onClose, 
  onAddItem, 
  onDelete,
  toolbarItems 
}: { 
  onClose: () => void;
  onAddItem: (type: string, label: string) => void;
  onDelete: () => void;
  toolbarItems: { id: string; type: string; label: string; value: string }[];
}) => {
  const hasItem = (type: string) => toolbarItems.some(item => item.type === type);

  return (
    <div className="px-5 py-4 flex flex-col gap-3 border-t border-[#F5F5F5]">
      <div className="flex items-center gap-2 flex-wrap">
        {!hasItem('umbrella') && (
          <button className="p-2 border border-[#E0E0E0] rounded-[4px] text-[#757575] hover:bg-gray-50 transition-colors" onClick={() => onAddItem('umbrella', 'Umbrella')}>
            <Umbrella size={18} strokeWidth={1.5} />
          </button>
        )}
        {!hasItem('comment') && (
          <button className="flex items-center gap-1 px-3 h-[32px] border border-[#E0E0E0] rounded-[4px] text-[13px] text-[#9E9E9E] font-medium hover:bg-gray-50" onClick={() => onAddItem('comment', 'Comment')}>
            <Plus size={14} /> Comment
          </button>
        )}
        {!hasItem('label') && (
          <button className="flex items-center gap-1 px-3 h-[32px] border border-[#E0E0E0] rounded-[4px] text-[13px] text-[#9E9E9E] font-medium hover:bg-gray-50" onClick={() => onAddItem('label', 'Label')}>
            <Plus size={14} /> Label
          </button>
        )}
        {!hasItem('address') && (
          <button className="flex items-center gap-1 px-3 h-[32px] border border-[#E0E0E0] rounded-[4px] text-[13px] text-[#9E9E9E] font-medium hover:bg-gray-50" onClick={() => onAddItem('address', 'Address')}>
            <Plus size={14} /> Address
          </button>
        )}
        {!hasItem('hashtag') && (
          <button className="w-[32px] h-[32px] flex items-center justify-center border border-[#E0E0E0] rounded-[4px] text-[#9E9E9E] text-[15px] font-semibold hover:bg-gray-50" onClick={() => onAddItem('hashtag', '#')}>
            #
          </button>
        )}
        {!hasItem('shield') && (
          <button className="w-[32px] h-[32px] flex items-center justify-center border border-[#E0E0E0] rounded-[4px] text-[#9E9E9E] hover:bg-gray-50" onClick={() => onAddItem('shield', 'Shield')}>
            <ShieldCheck size={16} strokeWidth={1.5} />
          </button>
        )}
        {!hasItem('percent') && (
          <button className="w-[32px] h-[32px] flex items-center justify-center border border-[#E0E0E0] rounded-[4px] text-[#9E9E9E] hover:bg-gray-50" onClick={() => onAddItem('percent', 'Percent')}>
            <Percent size={16} strokeWidth={1.5} />
          </button>
        )}
        {!hasItem('calendar') && (
          <button className="w-[32px] h-[32px] flex items-center justify-center border border-[#E0E0E0] rounded-[4px] text-[#9E9E9E] hover:bg-gray-50" onClick={() => onAddItem('calendar', 'Calendar')}>
            <CalendarPlus size={16} strokeWidth={1.5} />
          </button>
        )}
        {!hasItem('attachment') && (
          <button className="w-[32px] h-[32px] flex items-center justify-center border border-[#E0E0E0] rounded-[4px] text-[#9E9E9E] hover:bg-gray-50" onClick={() => onAddItem('attachment', 'Attachment')}>
            <Paperclip size={16} strokeWidth={1.5} className="rotate-45" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <button className="p-2 border border-[#E0E0E0] rounded-[4px] text-[#9E9E9E] hover:text-red-500 hover:bg-red-50 transition-all" onClick={onDelete}>
          <Trash2 size={20} />
        </button>
        <button onClick={onClose} className="bg-[#2196F3] text-white px-10 h-[40px] rounded-[4px] text-[14px] font-bold shadow-[0_2px_4px_rgba(33,150,243,0.3)] hover:bg-[#1E88E5] transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

function ShiftModal({ shift, empId, date, clickedHour = 8, onClose }: {
  shift: Shift | null; empId: number; date: string; clickedHour?: number; onClose: () => void;
}) {
  const { addShift, updateShift, deleteShift, employees } = useAppStore();
  const emp = employees.find(e => e.id === empId);

  // States
  const [sH, setSH] = useState(shift?.startHour ?? clickedHour);
  const [sM, setSM] = useState(shift?.startMin ?? 0);
  const [eH, setEH] = useState(shift?.endHour ?? Math.min(clickedHour + 12, 20));
  const [eM, setEM] = useState(shift?.endMin ?? 0);
  const [brk, setBrk] = useState(shift?.breakMinutes ?? 60);
  const [role, setRole] = useState(shift?.role ?? 'Manager/ Objektverantwortlicher');
  const [rc, setRc] = useState(shift?.roleColor ?? '#f97316');
  const [tags, setTags] = useState<string[]>(shift?.hashtags ?? ['Sachkunde']);
  const [cmt, setCmt] = useState(shift?.comment ?? 'testing');
  const [toolbarItems, setToolbarItems] = useState<{ id: string; type: string; label: string; value: string }[]>([]);
  const [showTracking, setShowTracking] = useState(true);
  const [showHashtags, setShowHashtags] = useState(true);
  const [showComment, setShowComment] = useState(true);

  // Calculation for the duration display (e.g., 11:00 h)
  const totalMinutes = (eH * 60 + eM) - (sH * 60 + sM) - brk;
  const durH = Math.floor(totalMinutes / 60);
  const durM = totalMinutes % 60;
  const durationLabel = `${durH}:${pad(durM)} h`;

  const d = new Date(date);
  const dateLabel = `${DAYS_S[d.getDay()]} ${pad(d.getDate())}. ${MONTHS_S[d.getMonth()]}`;

  const TimeInput = ({ val, set, max }: { val: number, set: (v: number) => void, max: number }) => (
    <input
      type="text"
      value={pad(val)}
      onChange={(e) => {
        const v = parseInt(e.target.value.replace(/\D/g, '')) || 0;
        set(Math.min(v, max));
      }}
      className="w-[64px] text-[32px] font-light text-gray-800 text-center outline-none focus:text-[#2196F3] transition-colors"
    />
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-[500] flex items-center justify-center backdrop-blur-[1px]">
      <div className="bg-white rounded-md shadow-2xl w-[640px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 p-4">
        
        {/* Top Header */}
        <div className="flex items-center px-5 py-4 border-b border-gray-100">
          <div className="w-24 text-[13px] text-gray-400 font-medium">{dateLabel}</div>
          <div className="flex-1 text-[16px] font-normal text-gray-700">{emp?.name || 'nacima Mohamed'}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#2196F3] text-[13px] font-medium">
              <Clock size={14} className="rotate-0" />
              <span>{fmtTime(eH, eM)}</span>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500"><X size={20} /></button>
          </div>
        </div>

        {/* Times Section */}
        <div className="flex items-center px-5 py-6 border-b border-gray-50">
          <div className="w-24 text-[13px] text-gray-400">Times</div>
          <div className="flex flex-1 items-center justify-start gap-0">
            <TimeInput val={sH} set={setSH} max={23} />
            <span className="text-[32px] font-light text-gray-300 mx-1">:</span>
            <TimeInput val={sM} set={setSM} max={59} />
            <span className="text-[32px] font-light text-gray-300 mx-4">–</span>
            <TimeInput val={eH} set={setEH} max={24} />
            <span className="text-[32px] font-light text-gray-300 mx-1">:</span>
            <TimeInput val={eM} set={setEM} max={59} />
          </div>
          
          {/* Break & Duration Column */}
          <div className="flex flex-col items-center border-l border-gray-100 pl-6 pr-4">
            <div className="flex items-center gap-1 text-[#2196F3]">
              <Coffee size={14} />
              <input 
                type="number" 
                value={brk} 
                onChange={e => setBrk(Number(e.target.value))}
                className="w-8 text-[13px] font-medium outline-none bg-transparent"
              />
            </div>
            <div className="text-[12px] text-gray-300 font-mono">00:00</div>
          </div>
          <div className="text-[13px] font-medium text-gray-400 bg-gray-50 px-3 py-2 rounded">
            {durationLabel}
          </div>
        </div>

        {/* Tracking */}
        {showTracking ? (
          <div className="flex items-center py-4 px-5 border-b border-[#EEEEEE]">
            <button className="flex items-center gap-1 text-[13px] text-[#2196F3] font-medium hover:underline mr-2" onClick={() => setShowTracking(false)}>
              Tracking <X size={12} />
            </button>
            <div className="flex flex-1 items-center text-[32px] font-light text-[#212121]">
              <span>14:00</span>
              <span className="mx-3 text-[#E0E0E0]">–</span>
              <span>20:00</span>
            </div>
            <div className="flex items-center border-l border-[#EEEEEE] pl-6 h-10 gap-3">
               <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[#2196F3]">
                  <Coffee size={14} /> <span className="text-[14px] font-medium">60</span>
                </div>
                <div className="text-[12px] text-[#BDBDBD] font-mono leading-none">00:00</div>
              </div>
              <button className="bg-[#2196F3] text-white px-4 py-1.5 rounded-[4px] text-[13px] font-bold shadow-sm">Save</button>
            </div>
          </div>
        ) : (
          <div className="px-5 py-3">
            <button className="flex items-center gap-1 text-[13px] text-[#9E9E9E] font-medium hover:text-[#2196F3] border border-dashed border-[#E0E0E0] px-3 py-2 rounded" onClick={() => setShowTracking(true)}>
              <Plus size={14} /> Add Tracking
            </button>
          </div>
        )}

        {/* Role Select */}
        <div className="flex items-center px-5 py-3 border-b border-gray-50">
          <div className="w-24 text-[13px] text-gray-400">Role</div>
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm" style={{ background: rc }} />
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded text-[13px] appearance-none outline-none focus:border-[#2196F3]"
            >
              {ROLE_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Hashtags */}
        {showHashtags && (
          <div className="flex items-start px-5 py-3 border-b border-gray-50">
            <div className="w-24 text-[13px] text-gray-400 mt-2">Hashtags</div>
            <div className="flex-1 flex flex-wrap gap-1 border border-gray-200 rounded p-1.5 min-h-[38px]">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-0.5 rounded text-[12px] text-gray-600">
                  {t} <X size={10} className="cursor-pointer text-gray-400" onClick={() => setTags([])} />
                </span>
              ))}
            </div>
            <button className="mt-3 ml-2 text-gray-300 hover:text-red-500" onClick={() => setShowHashtags(false)}><X size={14} /></button>
          </div>
        )}

        {/* Comment */}
        {showComment && (
          <div className="flex items-center px-5 py-3 border-b border-gray-50">
            <div className="w-24 text-[13px] text-gray-400">Comment</div>
            <input 
              value={cmt} 
              onChange={e => setCmt(e.target.value)}
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2196F3]" 
            />
            <button className="ml-2 text-gray-300 hover:text-red-500" onClick={() => setShowComment(false)}><X size={14} /></button>
          </div>
        )}

        {/* Toolbar Input Fields */}
        {toolbarItems.map(item => (
          <div key={item.id} className="flex items-center px-5 py-3 border-b border-gray-50">
            <div className="w-24 text-[13px] text-gray-400">{item.label}</div>
            <input 
              value={item.value} 
              onChange={e => setToolbarItems(prev => prev.map(i => i.id === item.id ? { ...i, value: e.target.value } : i))}
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2196F3]" 
              placeholder={`Enter ${item.label.toLowerCase()}...`}
            />
            <button className="ml-2 text-gray-300 hover:text-red-500" onClick={() => setToolbarItems(prev => prev.filter(i => i.id !== item.id))}><X size={14} /></button>
          </div>
        ))}

        <ModalActionToolbar 
          onClose={onClose} 
          onAddItem={(type, label) => setToolbarItems(prev => [...prev, { id: `${type}-${Date.now()}`, type, label, value: '' }])}
          onDelete={onClose}
          toolbarItems={toolbarItems}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SHIFT BLOCK
══════════════════════════════════════════════════════════ */
function ShiftBlock({ shift, baseHour, onClick }: {
  shift: Shift; baseHour: number; onClick: (s: Shift) => void;
}) {
  const left  = shiftLeft(shift, baseHour);
  const width = shiftWidth(shift);
  if (width <= 0 || left < 0) return null;

  const timeLabel = `${fmtTime(shift.startHour, shift.startMin)} / ${fmtTime(shift.endHour, shift.endMin)}`;

  return (
    <div
      onClick={e => { e.stopPropagation(); onClick(shift); }}
      className="absolute cursor-pointer select-none"
      style={{ left, width, top: 2, height: ROW_H - 4, zIndex: 5 }}
    >
      {/* Left colour bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ background: shift.roleColor || '#2196F3' }} />
      {/* Card */}
      <div className="absolute inset-0 ml-1 border border-gray-200 bg-white rounded-r hover:bg-gray-50 transition-colors overflow-hidden flex flex-col justify-center pl-2 pr-2">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[12px] font-semibold text-gray-800 truncate">{timeLabel}</span>
          {shift.breakMinutes > 0 && <span className="text-[11px] text-gray-400 shrink-0">{shift.breakMinutes}</span>}
          {shift.comment && <span className="text-[11px] text-gray-400 shrink-0 truncate max-w-[70px]">{shift.comment}</span>}
        </div>
        {shift.role && (
          <span className="text-[11px] truncate leading-tight" style={{ color: shift.roleColor || '#f97316' }}>
            {shift.role}
          </span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPLOYEE SIDEBAR
══════════════════════════════════════════════════════════ */
function EmployeeSidebar({ employees, shifts, date }: {
  employees: Employee[]; shifts: Shift[]; date: string;
}) {
  const { employeeSearch, setEmployeeSearch, selectedTimesheetEmployeeId, setSelectedTimesheetEmployee } = useAppStore();

  const workedH = (empId: number) => {
    const t = shifts.filter(s => s.employeeId === empId && s.date === date && !s.isWholeDay)
      .reduce((sum, s) => sum + Math.max(0, shiftDurH(s)), 0);
    if (t <= 0) return null;
    const h = Math.floor(t); const m = Math.round((t - h) * 60);
    return `${h}:${pad(m)}`;
  };

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 shrink-0" style={{ width: 200 }}>
      {/* Search */}
      <div className="flex items-center gap-1 px-1.5 border-b border-gray-200 shrink-0" style={{ height: HEAD_H }}>
        <div className="relative flex-1">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={employeeSearch} onChange={e => setEmployeeSearch(e.target.value)} placeholder="Employee"
            className="w-full pl-6 pr-1 py-[3px] text-[12px] border border-gray-200 rounded outline-none focus:border-[#2196F3] bg-white placeholder:text-gray-400 text-[#2196F3]" />
        </div>
        <button className="text-gray-400 hover:text-[#2196F3] p-0.5 shrink-0 transition-colors"><Shield size={12} /></button>
      </div>

      {/* Headcount */}
      <div className="flex items-center px-3 bg-[#2196F3] border-b border-blue-400 shrink-0" style={{ height: COUNT_H }}>
        <span className="text-[12px] font-semibold text-white">Headcount</span>
      </div>

      {/* Open shifts */}
      <div className="flex items-center justify-between px-3 border-b border-gray-100 shrink-0" style={{ height: OPEN_H }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-[#2196F3]">Open shifts</span>
          <div className="w-4 h-4 rounded-full bg-[#2196F3] flex items-center justify-center hover:bg-[#1976D2] transition-colors cursor-pointer">
            <Info size={9} className="text-white" />
          </div>
        </div>
        <button className="w-5 h-5 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors">
          <Plus size={11} />
        </button>
      </div>

      {/* Employee rows */}
      {employees.map(emp => {
        const active  = emp.id === selectedTimesheetEmployeeId;
        const worked  = workedH(emp.id);
        const quota   = emp.quotaHours > 0 ? `${emp.quotaHours}:00` : '0:00';
        const display = worked ? `${worked} / ${quota} h` : `0 / ${quota} h`;
        return (
          <div key={emp.id} onClick={() => setSelectedTimesheetEmployee(emp.id)}
            className={cn('flex flex-col justify-center px-3 border-b border-gray-100 cursor-pointer transition-colors select-none shrink-0',
              active ? 'bg-blue-50 border-l-2 border-l-[#2196F3]' : 'hover:bg-gray-50')}
            style={{ height: ROW_H }}>
            <span className={cn('text-[13px] font-medium leading-tight truncate', active ? 'text-[#2196F3]' : 'text-gray-800')}>
              {emp.name}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">{display}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TIMELINE
══════════════════════════════════════════════════════════ */
function ScheduleTimeline({ employees, shifts, date, startHour, endHour, onCell, onShift }: {
  employees: Employee[]; shifts: Shift[]; date: string;
  startHour: number; endHour: number;
  onCell: (empId: number, hour: number) => void;
  onShift: (s: Shift) => void;
}) {
  const hours  = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
  const totalW = hours.length * SLOT_W;

  const headcount = (h: number) =>
    shifts.filter(s => s.date === date && !s.isWholeDay && s.startHour <= h && s.endHour > h).length;

  return (
    <div className="flex-1 overflow-auto bg-white relative">
      {/* Time header */}
      <div className="flex sticky top-0 bg-white z-10 border-b border-gray-200 shrink-0" style={{ minWidth: totalW, height: HEAD_H }}>
        {hours.map(h => (
          <div key={h} className="shrink-0 flex items-center justify-start pl-2 text-[11px] text-gray-400 border-r border-gray-200 font-medium" style={{ width: SLOT_W }}>
            {`${h}:00`}
          </div>
        ))}
      </div>

      {/* Headcount row */}
      <div className="flex border-b border-gray-200 shrink-0" style={{ minWidth: totalW, height: COUNT_H }}>
        {hours.map(h => {
          const c = headcount(h);
          return (
            <div key={h} className="shrink-0 flex items-center justify-start pl-2 border-r border-gray-200 text-[11px] font-medium" style={{ width: SLOT_W }}>
              <span className={c > 0 ? 'text-[#2196F3]' : 'text-gray-300'}>{c}</span>
            </div>
          );
        })}
      </div>

      {/* Open shifts row */}
      <div className="flex border-b border-gray-100 shrink-0" style={{ minWidth: totalW, height: OPEN_H }}>
        {hours.map(h => (
          <div key={h} className="shrink-0 border-r border-gray-100" style={{ width: SLOT_W }} />
        ))}
      </div>

      {/* Employee rows */}
      {employees.map(emp => {
        const empShifts  = shifts.filter(s => s.employeeId === emp.id && s.date === date);
        const wholeDay   = empShifts.find(s => s.isWholeDay);
        const normalShifts = empShifts.filter(s => !s.isWholeDay);

        return (
          <div key={emp.id} className="relative border-b border-gray-100 shrink-0"
            style={{ minWidth: totalW, height: ROW_H }}>

            {/* Whole-day overlay */}
            {wholeDay ? (
              <div
                className="absolute inset-0 flex items-center justify-center text-[13px] text-red-400 cursor-pointer hover:bg-red-50/50 transition-colors"
                style={{ background: 'rgba(254,202,202,0.3)', zIndex: 2 }}
                onClick={() => onShift(wholeDay)}
              >
                whole day
              </div>
            ) : null}

            {/* Grid cells */}
            <div className="absolute inset-0 flex" style={{ zIndex: 1 }}>
              {hours.map(h => (
                <div key={h}
                  className="shrink-0 border-r border-gray-100 hover:bg-blue-50/40 transition-colors cursor-pointer"
                  style={{ width: SLOT_W, height: ROW_H }}
                  onClick={() => !wholeDay && onCell(emp.id, h)}
                />
              ))}
            </div>

            {/* Normal shift blocks */}
            {!wholeDay && normalShifts.map(s => (
              <ShiftBlock key={s.id} shift={s} baseHour={startHour} onClick={onShift} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FILTER PANEL
══════════════════════════════════════════════════════════ */
function FilterPanel({ close }: { close: () => void }) {
  const [role, setRole] = useState(''); const [lbl, setLbl] = useState('');
  const [addr, setAddr] = useState(''); const [hash, setHash] = useState('');
  const [from, setFrom] = useState('00:00'); const [to, setTo] = useState('00:00');
  const cls = 'w-full border border-gray-200 rounded px-3 py-1.5 text-[12px] outline-none focus:border-[#2196F3] bg-white placeholder:text-gray-400';

  return (
    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[200] w-72 fade-in">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <h4 className="text-[14px] font-semibold text-[#2196F3]">Filter shifts</h4>
      </div>
      <div className="px-4 py-3 space-y-2">
        {[{v:role,s:setRole,p:'All roles'},{v:lbl,s:setLbl,p:'All labels'},{v:addr,s:setAddr,p:'All addresses'},{v:hash,s:setHash,p:'All hashtags'}]
          .map(({v,s,p}) => (
            <div key={p} className="relative">
              <input value={v} onChange={e => s(e.target.value)} placeholder={p} className={cls} />
              {v && <button onClick={() => s('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><X size={11} /></button>}
            </div>
          ))}
        <div className="flex items-center gap-1.5">
          <input type="time" value={from} onChange={e => setFrom(e.target.value)} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#2196F3] bg-white" />
          <span className="text-gray-400 text-xs shrink-0">-</span>
          <input type="time" value={to} onChange={e => setTo(e.target.value)} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#2196F3] bg-white" />
          <button onClick={() => {setFrom('00:00');setTo('00:00');}} className="text-gray-400 hover:text-gray-600 shrink-0"><X size={11}/></button>
        </div>
        <button onClick={close} className="bg-[#2196F3] hover:bg-[#1976D2] text-white text-[12px] font-semibold rounded px-5 py-1.5 transition-colors">Done</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TOOLBAR
══════════════════════════════════════════════════════════ */
function ScheduleToolbar() {
  const { scheduleDate, scheduleStartHour, scheduleEndHour, navigateScheduleDate, setScheduleHours } = useAppStore();
  const [filterOpen, setFilterOpen] = useState(false);
  const d = scheduleDate;
  const ib = (a = false) => cn('w-8 h-8 border rounded flex items-center justify-center transition-colors bg-white',
    a ? 'border-[#2196F3] text-[#2196F3] bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3]');

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-white border-b border-gray-200 shrink-0 flex-wrap">
      <div className="flex items-center gap-1.5 mr-1 select-none">
        <span className="text-[17px] font-semibold whitespace-nowrap">
          <span className="text-gray-500 text-[14px]">{DAYS_S[d.getDay()]} </span>
          <span className="text-[#2196F3] font-bold">{pad(d.getDate())}</span>
          <span className="text-gray-700 ml-1.5 text-[14px]">{MONTHS_S[d.getMonth()]}</span>
        </span>
        <button onClick={() => navigateScheduleDate('prev')} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"><ChevronLeft size={14} /></button>
        <button onClick={() => navigateScheduleDate('next')} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"><ChevronRight size={14} /></button>
      </div>

      <div className="relative">
        <select value={scheduleStartHour} onChange={e => setScheduleHours(Number(e.target.value), scheduleEndHour)}
          className="border border-gray-200 rounded px-2.5 py-1.5 text-[13px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6 w-24">
          {[5,6,7,8,9,10].map(h => <option key={h} value={h}>{pad(h)}:00</option>)}
        </select>
        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
      </div>
      <div className="relative">
        <select value={scheduleEndHour} onChange={e => setScheduleHours(scheduleStartHour, Number(e.target.value))}
          className="border border-gray-200 rounded px-2.5 py-1.5 text-[13px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-6 w-24">
          {[18,19,20,21,22,23,24].map(h => <option key={h} value={h}>{pad(h >= 24 ? 0 : h)}:00</option>)}
        </select>
        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
      </div>

      <button title="Hide empty rows" className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-red-400 hover:border-red-300 bg-white transition-colors"><EyeOff size={14}/></button>
      <div className="flex-1"/>
      <button className={ib()}><Copy size={13}/></button>
      <div className="relative">
        <button onClick={() => setFilterOpen(v => !v)} className={ib(filterOpen)}><Filter size={13}/></button>
        {filterOpen && (<><div className="fixed inset-0 z-[190]" onClick={() => setFilterOpen(false)}/><div className="relative z-[200]"><FilterPanel close={() => setFilterOpen(false)}/></div></>)}
      </div>
      <button className="w-8 h-8 border border-[#2196F3] bg-white rounded flex items-center justify-center text-[#2196F3]"><ListIcon size={13}/></button>
      <button className={ib()}><Plus size={14}/></button>
      <button className={ib()}><Square size={12}/></button>
      <button className={ib()}><Columns2 size={12}/></button>
      <button className={ib()}><TableProperties size={12}/></button>
      <button className={ib()}><LayoutGrid size={12}/></button>
      <button className="w-8 h-8 bg-[#2196F3] hover:bg-[#1976D2] rounded flex items-center justify-center text-white transition-colors"><MoreHorizontal size={14}/></button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════ */
export function ScheduleView() {
  const { employees, shifts, scheduleDate, scheduleStartHour, scheduleEndHour, employeeSearch } = useAppStore();

  const [modal, setModal] = useState<{
    shift: Shift | null; empId: number; date: string; clickedHour: number;
  } | null>(null);

  const date     = scheduleDate.toISOString().split('T')[0];
  const filtered = employeeSearch ? employees.filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase())) : employees;

  const openCreate = useCallback((empId: number, hour: number) => {
    setModal({ shift: null, empId, date, clickedHour: hour });
  }, [date]);

  const openEdit = useCallback((s: Shift) => {
    setModal({ shift: s, empId: s.employeeId, date: s.date, clickedHour: s.startHour });
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>
      <ScheduleToolbar />
      <div className="flex flex-1 overflow-hidden">
        <EmployeeSidebar employees={filtered} shifts={shifts} date={date} />
        <ScheduleTimeline
          employees={filtered} shifts={shifts} date={date}
          startHour={scheduleStartHour} endHour={scheduleEndHour}
          onCell={openCreate} onShift={openEdit}
        />
      </div>
      {modal && (
        <ShiftModal
          shift={modal.shift} empId={modal.empId}
          date={modal.date} clickedHour={modal.clickedHour}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}