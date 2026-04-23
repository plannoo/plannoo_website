import { useState } from 'react';
import { ChevronDown, Plus, X, Clock } from 'lucide-react';
import { EMPLOYEES } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils';

/* ══════════════════════════════════════════════════════════
   ADD AVAILABILITY MODAL
══════════════════════════════════════════════════════════ */
interface Slot { start: string; end: string; day: string }

function AddAvailabilityModal({ employeeName, onSave, onClose }: {
  employeeName: string;
  onSave: (slot: Slot) => void;
  onClose: () => void;
}) {
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const [day,   setDay]   = useState('Monday');
  const [start, setStart] = useState('09:00');
  const [end,   setEnd]   = useState('17:00');

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[420px] fade-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-[15px] font-medium text-gray-800">Add Availability — {employeeName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* Day */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Day</label>
            <div className="relative">
              <select value={day} onChange={e => setDay(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] bg-white outline-none focus:border-[#2196F3] cursor-pointer appearance-none pr-7">
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* Time range */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Start</label>
              <input type="time" value={start} onChange={e => setStart(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2196F3]" />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">End</label>
              <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2196F3]" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave({ day, start, end }); onClose(); }}
            className="px-5 py-1.5 bg-[#2196F3] hover:bg-[#1976D2] text-white text-[13px] font-medium rounded transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPLOYEE AVAILABILITY ROW — matches screenshot exactly
  Layout:  [Employee name]
           [  + button  |  slot chips ...            gray bar  ]
══════════════════════════════════════════════════════════ */
interface EmpSlot { day: string; start: string; end: string }

function EmployeeRow({ emp }: { emp: typeof EMPLOYEES[0] }) {
  const [slots,    setSlots]    = useState<EmpSlot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const addSlot = (s: EmpSlot) => setSlots(p => [...p, s]);
  const removeSlot = (i: number) => setSlots(p => p.filter((_, x) => x !== i));

  return (
    <div className="mb-5">
      {/* Employee name */}
      <p className="text-[13px] text-gray-700 mb-1.5 ml-0.5">{emp.name}</p>

      {/* The wide bar */}
      <div className="flex items-center bg-gray-100 rounded" style={{ minHeight: 44 }}>
        {/* + button — white box on left */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center bg-white border border-gray-200 rounded m-1 shrink-0 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors text-gray-400"
          style={{ width: 80, height: 34 }}
        >
          <Plus size={16} />
        </button>

        {/* Slot chips */}
        <div className="flex items-center flex-wrap gap-2 px-2 flex-1">
          {slots.map((s, i) => (
            <span key={i}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2.5 py-1 text-[12px] text-gray-700 group">
              <Clock size={11} className="text-gray-400 shrink-0" />
              <span className="font-medium text-[#2196F3] text-[11px] mr-1">{s.day.slice(0,3)}</span>
              {s.start}–{s.end}
              <button
                onClick={() => removeSlot(i)}
                className="text-gray-300 hover:text-red-400 transition-colors ml-0.5">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {modalOpen && (
        <AddAvailabilityModal
          employeeName={emp.name}
          onSave={addSlot}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN VIEW
══════════════════════════════════════════════════════════ */
export function AvailabilitiesView() {
  const { employees } = useAppStore();
  const [empFilter, setEmpFilter] = useState('');

  const filtered = empFilter
    ? employees.filter(e => e.id === Number(empFilter))
    : employees;

  return (
    <div
      className="flex flex-col bg-white"
      style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}
    >
      {/* Title */}
      <div className="px-6 py-4 shrink-0">
        <h1 className="text-[22px] font-normal text-gray-800 border-l-4 border-[#2196F3] pl-3 leading-tight">
          Availabilities
        </h1>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-6 pb-4 shrink-0">
        {/* Employee dropdown */}
        <div className="relative">
          <select
            value={empFilter}
            onChange={e => setEmpFilter(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-500 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[140px]"
          >
            <option value="">Employee</option>
            {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* More filters */}
        <button className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          <Plus size={13} />More filters
        </button>
      </div>

      {/* Employee rows */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {filtered.map(emp => (
          <EmployeeRow key={emp.id} emp={emp} />
        ))}
      </div>
    </div>
  );
}