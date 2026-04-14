import { FixedSizeList as List } from 'react-window';
import { ChevronLeft, ChevronRight, ChevronDown, Eye, Download, FileText, Search, Filter } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { EMPLOYEES, ABSENCE_TYPES } from '@/data/mockData';
import { cn } from '@/utils';
import type { Employee, VacationEntitlement } from '@/types';

const ROW_H   = 46;
const COL_W   = [210, 145, 165, 90, 90, 165];
const TOTAL_W = COL_W.reduce((a, b) => a + b, 0);

interface RD {
  employees: Employee[];
  ents: VacationEntitlement[];
  update: (id: number, f: 'entitlement' | 'entitlementCorrected', v: number | null) => void;
}

function EntRow({ index, style, data }: { index: number; style: React.CSSProperties; data: RD }) {
  const e   = data.employees[index];
  const ent = data.ents.find(x => x.employeeId === e.id);

  const numInput = (field: 'entitlement' | 'entitlementCorrected') => (
    <input
      type="number" min="0"
      value={ent?.[field] ?? ''}
      placeholder="—"
      onChange={ev => data.update(e.id, field, ev.target.value !== '' ? Number(ev.target.value) : null)}
      className="w-20 text-center text-[12px] border border-gray-200 rounded px-2 py-1 outline-none focus:border-[#2196F3] bg-white placeholder:text-gray-300 transition-colors"
    />
  );

  return (
    <div style={style} className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center px-3 text-[13px] font-medium text-gray-700 border-r border-gray-100 shrink-0" style={{ width: COL_W[0] }}>{e.name}</div>
      <div className="flex items-center justify-center px-2 border-r border-gray-100 shrink-0" style={{ width: COL_W[1] }}>{numInput('entitlement')}</div>
      <div className="flex items-center justify-center px-2 border-r border-gray-100 shrink-0" style={{ width: COL_W[2] }}>{numInput('entitlementCorrected')}</div>
      <div className="flex items-center justify-center text-[13px] text-gray-400 border-r border-gray-100 shrink-0" style={{ width: COL_W[3] }}>{ent?.requested ?? '–'}</div>
      <div className="flex items-center justify-center text-[13px] text-gray-400 border-r border-gray-100 shrink-0" style={{ width: COL_W[4] }}>{ent?.accepted ?? ''}</div>
      <div className="flex items-center justify-center text-[13px] text-gray-400 shrink-0" style={{ width: COL_W[5] }}>{ent?.remaining ?? ''}</div>
    </div>
  );
}

export function AbsenceEntitlementView() {
  const {
    entitlementYear, entitlementType,
    employees, vacationEntitlements,
    navigateEntitlementYear, setEntitlementType,
    updateEntitlement, employeeSearch, setEmployeeSearch,
  } = useAppStore();

  const filtered = employeeSearch
    ? employees.filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()))
    : employees;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        {/* Year nav */}
        <div className="flex overflow-hidden rounded border border-[#2196F3]">
          <button onClick={() => navigateEntitlementYear('prev')} className="px-2 py-1.5 bg-[#2196F3] hover:bg-[#1976D2] text-white transition-colors">
            <ChevronLeft size={13} />
          </button>
          <span className="px-3 py-1.5 bg-[#2196F3] text-white font-mono font-semibold text-[13px] border-x border-[#1976D2] select-none">
            {entitlementYear}
          </span>
          <button onClick={() => navigateEntitlementYear('next')} className="px-2 py-1.5 bg-[#2196F3] hover:bg-[#1976D2] text-white transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="relative">
          <select value={entitlementType} onChange={e => setEntitlementType(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-600 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[120px]">
            {[...(ABSENCE_TYPES as unknown as string[]), 'Urlaub'].map(t => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="flex-1" />

        <button className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors" title="Toggle visibility">
          <Eye size={13} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          <Download size={12} />excel
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          <FileText size={12} />csv
        </button>
      </div>

      {/* Table header */}
      <div className="flex bg-white border-b border-gray-200 shrink-0" style={{ minWidth: TOTAL_W }}>
        {/* Employee col with search */}
        <div className="flex items-center gap-1.5 px-2 py-2 border-r border-gray-200 shrink-0" style={{ width: COL_W[0] }}>
          <div className="relative flex-1">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input value={employeeSearch} onChange={e => setEmployeeSearch(e.target.value)} placeholder="Employee"
              className="w-full pl-6 pr-1 py-1 text-[11px] border border-gray-200 rounded outline-none focus:border-[#2196F3] bg-white placeholder:text-gray-400" />
          </div>
          <button className="text-gray-400 hover:text-[#2196F3] transition-colors shrink-0"><Filter size={11} /></button>
        </div>

        {/* Entitlement col with BULK */}
        <div className="flex items-center justify-between px-3 py-2 border-r border-gray-200 text-[12px] font-semibold text-[#2196F3] shrink-0" style={{ width: COL_W[1] }}>
          Entitlement
          <button className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold hover:bg-blue-200 transition-colors">BULK</button>
        </div>

        {/* Remaining cols */}
        {['Entitlement Corrected', 'Requested', 'Accepted', 'Remaining Entitlement'].map((c, i) => (
          <div key={c} className="flex items-center px-3 py-2 border-r border-gray-200 last:border-r-0 text-[12px] font-semibold text-[#2196F3] shrink-0" style={{ width: COL_W[i + 2] }}>
            {c}
          </div>
        ))}
      </div>

      {/* Virtualized rows */}
      <div className="flex-1 overflow-auto bg-white">
        <List
          height={500}
          itemCount={filtered.length}
          itemSize={ROW_H}
          itemData={{ employees: filtered, ents: vacationEntitlements, update: updateEntitlement }}
          width="100%"
        >
          {EntRow}
        </List>
      </div>
    </div>
  );
}
