import { useAppStore } from '@/store/useAppStore';
import { ChevronDown, FileText } from 'lucide-react';
import { EMPLOYEES, ROLE_OPTIONS, ABSENCE_TYPES, ABSENCE_STATUSES } from '@/data/mockData';
import { cn } from '@/utils';

const COLS = ['Employee', 'Type', 'Dates', 'days', 'Effective days', 'Status'];

function Sel({ val, onChange, opts, ph }: {
  val: string; onChange: (v: string) => void; opts: readonly string[]; ph: string;
}) {
  return (
    <div className="relative">
      <select value={val} onChange={e => onChange(e.target.value)}
        className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[110px]">
        <option value="">{ph}</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

export function AbsenceListView() {
  const {
    listSubTab, setListSubTab,
    listAbsenceType, listEmployee, listRole, listStatus,
    listStartDate, listEndDate, setListFilter,
  } = useAppStore();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>

      {/* Tertiary tabs */}
      <div className="flex px-4 pt-2.5 bg-white border-b border-gray-200 shrink-0">
        {(['Detailed', 'Summed days'] as const).map(tab => (
          <button key={tab} onClick={() => setListSubTab(tab)}
            className={cn('px-1 py-1.5 text-[13px] mr-5 -mb-px border-b-2 transition-all',
              listSubTab === tab
                ? 'border-transparent text-[#2196F3] font-semibold underline underline-offset-4 decoration-2 decoration-[#2196F3]'
                : 'border-transparent text-gray-500 hover:text-[#2196F3]')}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        <Sel val={listAbsenceType} onChange={v => setListFilter('listAbsenceType', v)} opts={ABSENCE_TYPES} ph="All types" />

        <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1.5 bg-white">
          <input type="date" value={listStartDate} onChange={e => setListFilter('listStartDate', e.target.value)} className="text-[12px] text-gray-600 outline-none bg-transparent" />
          <span className="text-gray-400 text-xs">~</span>
          <input type="date" value={listEndDate} onChange={e => setListFilter('listEndDate', e.target.value)} className="text-[12px] text-gray-600 outline-none bg-transparent" />
        </div>

        <Sel val={listRole}     onChange={v => setListFilter('listRole',     v)} opts={ROLE_OPTIONS as unknown as readonly string[]} ph="Role" />
        <Sel val={listEmployee} onChange={v => setListFilter('listEmployee', v)} opts={EMPLOYEES.map(e => e.name)} ph="Employee" />
        <Sel val={listStatus}   onChange={v => setListFilter('listStatus',   v)} opts={ABSENCE_STATUSES as unknown as readonly string[]} ph="Status" />

        <div className="flex-1" />

        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          <FileText size={12} />pdf
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-200">
              {COLS.map(c => (
                <th key={c} className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#2196F3] whitespace-nowrap">{c}</th>
              ))}
              <th className="w-5 border-l border-gray-100" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={COLS.length + 1}>
                <div className="flex items-center justify-center py-16 text-[13px] text-gray-400">
                  No entries in the selected period
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
