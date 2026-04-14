import { useState } from 'react';
import { X, Plus, GripVertical, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { EMPLOYEES, TASK_STATUSES } from '@/data/mockData';
import { cn } from '@/utils';

/* ── Checklist modal ─────────────────────────────────────── */
function ChecklistModal({ close }: { close: () => void }) {
  const [name,  setName]  = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => setTasks(p => [...p, '']);
  const upd     = (i: number, v: string) => setTasks(p => p.map((t, x) => x === i ? v : t));
  const del     = (i: number) => setTasks(p => p.filter((_, x) => x !== i));
  const save    = () => { if (!name.trim()) return; close(); setName(''); setTasks([]); };

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="bg-white rounded-lg shadow-2xl w-[520px] fade-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-[15px] font-medium text-gray-800">Checklist name</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <input autoFocus placeholder="Checklist name" value={name} onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2.5 text-[13px] outline-none focus:border-[#2196F3] placeholder:text-gray-300 transition-colors" />
          <div>
            <h4 className="text-[13px] font-medium text-gray-700 mb-3">Tasks</h4>
            {tasks.map((t, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <GripVertical size={13} className="text-gray-300 cursor-grab shrink-0" />
                <input value={t} onChange={e => upd(i, e.target.value)} placeholder="Task description"
                  className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#2196F3] transition-colors" />
                <button onClick={() => del(i)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0"><X size={13} /></button>
              </div>
            ))}
            <button onClick={addTask}
              className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-300 rounded text-[13px] text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors">
              <Plus size={13} />Add task
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-gray-100">
          <button onClick={close} className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={save} disabled={!name.trim()}
            className={cn('px-5 py-1.5 rounded text-[13px] font-medium transition-colors',
              name.trim() ? 'bg-[#2196F3] hover:bg-[#1976D2] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_TMPLS = ['Hachinger Haid 22:45', 'Hotel Aigner'];

export function TasksView() {
  const { taskSubTab, setTaskSubTab, taskStartDate, taskEndDate, taskEmployee, taskStatus, setTaskFilter } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>
      {/* Tertiary tabs */}
      <div className="flex px-4 pt-2.5 bg-white border-b border-gray-200 shrink-0">
        {(['Task Reporting', 'Task Templates'] as const).map(tab => (
          <button key={tab} onClick={() => setTaskSubTab(tab)}
            className={cn('px-1 py-1.5 text-[13px] mr-6 -mb-px border-b-2 transition-all',
              taskSubTab === tab ? 'border-[#2196F3] text-[#2196F3] font-semibold' : 'border-transparent text-gray-500 hover:text-[#2196F3]')}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters (Task Reporting only) */}
      {taskSubTab === 'Task Reporting' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1.5 bg-white">
            <input type="date" value={taskStartDate} onChange={e => setTaskFilter('taskStartDate', e.target.value)} className="text-[12px] text-gray-600 outline-none bg-transparent" />
            <span className="text-gray-400 text-xs">~</span>
            <input type="date" value={taskEndDate} onChange={e => setTaskFilter('taskEndDate', e.target.value)} className="text-[12px] text-gray-600 outline-none bg-transparent" />
          </div>
          <div className="relative">
            <select value={taskEmployee} onChange={e => setTaskFilter('taskEmployee', e.target.value)}
              className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-white outline-none cursor-pointer appearance-none pr-7">
              <option value="">Employee</option>
              {EMPLOYEES.map(e => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={taskStatus} onChange={e => setTaskFilter('taskStatus', e.target.value)}
              className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-white outline-none cursor-pointer appearance-none pr-7">
              {TASK_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <select className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-white outline-none cursor-pointer appearance-none pr-7">
              {['Checklists', 'Tasks'].map(v => <option key={v}>{v}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">
        {taskSubTab === 'Task Reporting' ? (
          <div className="flex items-center justify-center h-full text-[13px] text-gray-400">No task data for the selected period.</div>
        ) : (
          <div className="p-4 space-y-2">
            <div className="bg-blue-50 border border-blue-100 rounded px-4 py-3 text-[13px] text-[#2196F3] mb-3">
              Create tasks in the form of checklists that you can assign to shifts in the schedule. Employees confirm each task by checking it off.
            </div>
            {SAMPLE_TMPLS.map(t => (
              <div key={t} className="flex items-center gap-3 px-3 py-2.5 border border-gray-200 rounded bg-white hover:border-gray-300 cursor-pointer transition-colors">
                <GripVertical size={14} className="text-gray-300 shrink-0" />
                <span className="text-[13px] text-gray-700">{t}</span>
              </div>
            ))}
            <button onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded bg-white text-[13px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors mt-1">
              <Plus size={13} />New checklist
            </button>
          </div>
        )}
      </div>

      {modalOpen && <ChecklistModal close={() => setModalOpen(false)} />}
    </div>
  );
}
