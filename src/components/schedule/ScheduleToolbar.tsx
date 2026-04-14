import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button, DateNavButton, Modal, FormField, FormInput } from '@/components/shared';
import { generateId } from '@/utils';
import { EMPLOYEES, ROLE_OPTIONS } from '@/data/mockData';
import { cn } from '@/utils';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─────────────────────────────────────────────────────────────
// FILTER SHIFTS PANEL  (Image 9)
// Floats below the Filter button, contains: All roles, All labels,
// All addresses, All hashtags, time range 00:00 - 00:00, Done button
// ─────────────────────────────────────────────────────────────
function FilterShiftsPanel({ onClose }: { onClose: () => void }) {
  const [role,      setRole]      = useState('');
  const [label,     setLabel]     = useState('');
  const [address,   setAddress]   = useState('');
  const [hashtag,   setHashtag]   = useState('');
  const [timeFrom,  setTimeFrom]  = useState('00:00');
  const [timeTo,    setTimeTo]    = useState('00:00');

  const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#1d8ce0] transition-colors bg-white placeholder:text-slate-400';

  return (
    <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[160] w-[340px]">
      {/* Title */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <h4 className="text-[15px] font-semibold text-[#1d8ce0]">Filter shifts</h4>
      </div>

      <div className="px-4 py-3 space-y-2.5">
        {/* All roles */}
        <div className="relative">
          <input
            type="text"
            placeholder="All roles"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputCls}
          />
          {role && (
            <button onClick={() => setRole('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* All labels */}
        <div className="relative">
          <input
            type="text"
            placeholder="All labels"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputCls}
          />
          {label && (
            <button onClick={() => setLabel('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* All addresses */}
        <div className="relative">
          <input
            type="text"
            placeholder="All addresses"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={cn(inputCls, 'text-slate-400')}
          />
          {address && (
            <button onClick={() => setAddress('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* All hashtags */}
        <div className="relative">
          <input
            type="text"
            placeholder="All hashtags"
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            className={cn(inputCls, 'text-slate-400')}
          />
          {hashtag && (
            <button onClick={() => setHashtag('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Time range */}
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
            className="flex-1 border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#1d8ce0] transition-colors bg-white"
          />
          <span className="text-slate-400 text-sm">-</span>
          <input
            type="time"
            value={timeTo}
            onChange={(e) => setTimeTo(e.target.value)}
            className="flex-1 border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#1d8ce0] transition-colors bg-white"
          />
          <button onClick={() => { setTimeFrom('00:00'); setTimeTo('00:00'); }}
            className="text-slate-400 hover:text-slate-600">
            <X size={13} />
          </button>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="w-24 bg-[#1d8ce0] hover:bg-[#1570b8] text-white text-[13px] font-semibold rounded px-4 py-2 transition-colors mt-1"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE MODAL  (Image 10 – centre modal)
// Times row: start–end, break indicator, Role dropdown, Label dropdown
// + Comment, + Address, #, shield, %, calendar, paperclip icons, Save
// ─────────────────────────────────────────────────────────────
function TemplateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [startTime, setStartTime] = useState('');
  const [endTime,   setEndTime]   = useState('');
  const [role,      setRole]      = useState('');
  const [label,     setLabel]     = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-[580px] max-w-[calc(100vw-40px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-[16px] font-medium text-slate-800">Template</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Times row */}
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-500 w-16 shrink-0">Times</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00:00"
                className="border border-slate-200 rounded px-3 py-2 text-[15px] text-slate-400 outline-none focus:border-[#1d8ce0] transition-colors w-28 font-mono"
              />
              <span className="text-slate-400 font-bold">—</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00:00"
                className="border border-slate-200 rounded px-3 py-2 text-[15px] text-[#1d8ce0] outline-none focus:border-[#1d8ce0] transition-colors w-28 font-mono"
              />
            </div>
            {/* Break indicator */}
            <div className="flex flex-col items-start text-[12px] text-[#1d8ce0]">
              <div className="flex items-center gap-1">
                <span>⏱</span>
                <span className="text-slate-400">00</span>
              </div>
              <span className="text-slate-400">00:00</span>
            </div>
          </div>

          {/* Role row */}
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-500 w-16 shrink-0">Role</span>
            <div className="relative flex-1">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-[13px] bg-white outline-none focus:border-[#1d8ce0] cursor-pointer appearance-none pr-8"
              >
                <option value=""></option>
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Label row */}
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-500 w-16 shrink-0">Label</span>
            <div className="relative flex-1">
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-[13px] bg-white outline-none focus:border-[#1d8ce0] cursor-pointer appearance-none pr-8"
              >
                <option value=""></option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors ml-1">
              <X size={14} />
            </button>
          </div>

          {/* Icon action row */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {[
              { label: '+ Comment' },
              { label: '+ Address' },
            ].map(({ label }) => (
              <button key={label}
                className="border border-slate-200 rounded px-2.5 py-1 text-[12px] text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors">
                {label}
              </button>
            ))}
            {['#', '🛡', '%', '📅', '📎'].map((icon) => (
              <button key={icon}
                className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-[13px] text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-4 border-t border-slate-100">
          <button
            disabled
            className="px-6 py-2 rounded text-[13px] font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VORLAGEN (TEMPLATES) DRAWER  (Image 10 – right panel)
// ─────────────────────────────────────────────────────────────
function VorlagenDrawer({ isOpen, onClose, onNew }: {
  isOpen: boolean;
  onClose: () => void;
  onNew: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed right-0 z-[190] bg-white border-l border-slate-200 shadow-xl flex flex-col"
      style={{ top: 'var(--header-height)', bottom: 0, width: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="text-[15px] font-semibold text-slate-700">Vorlagen</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* New template button */}
      <div className="px-3 py-3 border-b border-slate-100">
        <button
          onClick={onNew}
          className="w-full bg-[#1d8ce0] hover:bg-[#1570b8] text-white text-[13px] font-semibold rounded py-2.5 transition-colors"
        >
          + Neue Vorlage
        </button>
      </div>

      {/* Empty templates list */}
      <div className="flex-1 flex items-center justify-center text-[13px] text-slate-400">
        No templates yet.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADD SHIFT MODAL
// ─────────────────────────────────────────────────────────────
export function AddShiftModal() {
  const { showAddShiftModal, toggleModal, addShift, scheduleDate } = useAppStore();

  const [empId, setEmpId] = useState('1');
  const [start, setStart] = useState('09:00');
  const [end,   setEnd]   = useState('17:00');
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#1d8ce0');

  const handleAdd = () => {
    addShift({
      id: generateId(),
      employeeId: Number(empId),
      date: scheduleDate.toISOString().split('T')[0],
      startHour: Number(start.split(':')[0]),
      endHour:   Number(end.split(':')[0]),
      label: label || 'Shift',
      color,
    });
    toggleModal('showAddShiftModal');
    setLabel('');
  };

  return (
    <Modal isOpen={showAddShiftModal} onClose={() => toggleModal('showAddShiftModal')} title="Add New Shift">
      <div className="space-y-4">
        <FormField label="Employee">
          <select
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="border border-slate-200 rounded-md px-3 py-2 text-[13px] w-full outline-none bg-white focus:border-[#1d8ce0] transition-all"
          >
            {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Start Time">
            <FormInput type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </FormField>
          <FormField label="End Time">
            <FormInput type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </FormField>
        </div>
        <FormField label="Shift Label">
          <FormInput value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Morning Shift" />
        </FormField>
        <FormField label="Colour">
          <div className="flex items-center gap-3">
            {['#1d8ce0','#22c55e','#f97316','#8b5cf6','#ef4444','#06b6d4'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{ background: c, outline: color === c ? `3px solid ${c}` : undefined, outlineOffset: 2 }}
              />
            ))}
          </div>
        </FormField>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={() => toggleModal('showAddShiftModal')}>Cancel</Button>
          <Button variant="primary" onClick={handleAdd}>Add Shift</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// SCHEDULE TOOLBAR (main export)
// ─────────────────────────────────────────────────────────────
export function ScheduleToolbar() {
  const { scheduleDate, navigateScheduleDate, toggleModal } = useAppStore();

  const [filterOpen,   setFilterOpen]   = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [vorlagenOpen, setVorlagenOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200 flex-wrap relative">
      {/* Date + nav – exact format: "Mo 29 Dec" with blue day number */}
      <div className="flex items-center gap-1">
        <span className="text-[15px] font-semibold text-slate-700 mr-1">
          <span className="text-slate-500">{DAYS[scheduleDate.getDay()].slice(0,2)} </span>
          <span className="text-[#1d8ce0] font-bold">{scheduleDate.getDate()}</span>
          <span className="text-slate-700 ml-1">{MONTHS[scheduleDate.getMonth()]}</span>
        </span>
        <DateNavButton direction="prev" onClick={() => navigateScheduleDate('prev')} />
        <DateNavButton direction="next" onClick={() => navigateScheduleDate('next')} />
      </div>

      {/* Start/end hour selects */}
      <select className="border border-slate-200 rounded px-2.5 py-[5px] text-[13px] text-slate-600 bg-white outline-none cursor-pointer appearance-none">
        {['06:00','07:00','08:00'].map((h) => <option key={h}>{h}</option>)}
      </select>
      <select className="border border-slate-200 rounded px-2.5 py-[5px] text-[13px] text-slate-600 bg-white outline-none cursor-pointer appearance-none">
        {['20:00','21:00','22:00'].map((h) => <option key={h}>{h}</option>)}
      </select>

      {/* Hide empty rows – with red strikethrough eye icon */}
      <button
        className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-red-400 hover:border-red-300 transition-colors bg-white"
        title="Hide empty rows"
      >
        <span className="text-[12px]">👁‍🗨</span>
      </button>

      <div className="flex-1" />

      {/* Right tools – matches Image 9 toolbar */}
      {/* Copy */}
      <button className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors bg-white" title="Copy">
        <span className="text-[11px] font-bold">⎘</span>
      </button>

      {/* Filter – opens FilterShiftsPanel */}
      <div className="relative">
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={cn(
            'w-8 h-8 border rounded flex items-center justify-center transition-colors bg-white',
            filterOpen
              ? 'border-[#1d8ce0] text-[#1d8ce0] bg-[#e8f4fd]'
              : 'border-slate-200 text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0]'
          )}
          title="Filter shifts"
        >
          <span className="text-[12px]">⚙</span>
        </button>
        {filterOpen && <FilterShiftsPanel onClose={() => setFilterOpen(false)} />}
      </div>

      {/* List view */}
      <button className="w-8 h-8 border border-[#1d8ce0] rounded flex items-center justify-center text-[#1d8ce0] bg-white transition-colors" title="List view">
        <span className="text-[11px]">≡</span>
      </button>

      {/* Add shift */}
      <button
        onClick={() => toggleModal('showAddShiftModal')}
        className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors bg-white"
        title="Add shift"
      >
        <span className="text-[16px] leading-none font-light">+</span>
      </button>

      {/* Day view */}
      <button className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors bg-white" title="Day view">
        <span className="text-[11px]">▭</span>
      </button>

      {/* Week view */}
      <button className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors bg-white" title="Week view">
        <span className="text-[10px]">⬜⬜</span>
      </button>

      {/* Table view */}
      <button className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors bg-white" title="Table view">
        <span className="text-[10px]">⊞</span>
      </button>

      {/* Grid view */}
      <button className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors bg-white" title="Grid view">
        <span className="text-[10px]">⊟</span>
      </button>

      {/* Vorlagen (Templates) drawer trigger – blue dot button */}
      <button
        onClick={() => { setVorlagenOpen(true); setTemplateOpen(true); }}
        className="w-8 h-8 bg-[#1d8ce0] hover:bg-[#1570b8] rounded flex items-center justify-center text-white transition-colors"
        title="Templates / Vorlagen"
      >
        <span className="text-[13px] font-bold">⋯</span>
      </button>

      {/* Vorlagen drawer (right side panel) */}
      <VorlagenDrawer
        isOpen={vorlagenOpen}
        onClose={() => setVorlagenOpen(false)}
        onNew={() => setTemplateOpen(true)}
      />

      {/* Template modal */}
      <TemplateModal isOpen={templateOpen} onClose={() => setTemplateOpen(false)} />
    </div>
  );
}
