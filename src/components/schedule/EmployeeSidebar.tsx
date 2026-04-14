import { FixedSizeList as List } from 'react-window';
import { Info, Plus, Search, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useFilteredEmployees } from '@/hooks';
import { cn } from '@/utils';
import type { Employee } from '@/types';

const ROW_H         = 52;
const HEADER_H      = 36;   // time header equivalent
const HEADCOUNT_H   = 32;   // headcount row
const OPEN_SHIFTS_H = 52;   // open shifts row

// ── Flat list item (no role-group headers shown in Image 9) ─
interface RowData {
  employees: Employee[];
  selectedId: number;
  onSelect: (id: number) => void;
}

function EmpRow({ index, style, data }: { index: number; style: React.CSSProperties; data: RowData }) {
  const emp = data.employees[index];
  const isSelected = emp.id === data.selectedId;

  return (
    <div
      style={style}
      onClick={() => data.onSelect(emp.id)}
      className={cn(
        'flex flex-col justify-center px-3.5 border-b border-slate-100 cursor-pointer transition-colors',
        isSelected
          ? 'bg-[#e8f4fd] border-l-[3px] border-l-[#1d8ce0]'
          : 'hover:bg-slate-50'
      )}
    >
      <p className={cn('text-[13px] font-medium leading-tight', isSelected ? 'text-[#1d8ce0]' : 'text-slate-700')}>
        {emp.name}
      </p>
      <p className="text-[11px] text-slate-400 mt-0.5">0 / {emp.quotaHours}:00 h</p>
    </div>
  );
}

export function EmployeeSidebar() {
  const {
    employeeSearch, setEmployeeSearch,
    selectedTimesheetEmployeeId, setSelectedTimesheetEmployee,
    toggleModal,
  } = useAppStore();

  const groups = useFilteredEmployees();
  const flatEmployees: Employee[] = Object.values(groups).flat();

  // Height budget: total sidebar height minus fixed rows
  const listHeight = Math.max(200, 600 - HEADER_H - HEADCOUNT_H - OPEN_SHIFTS_H - 44);

  return (
    <div className="flex flex-col bg-white border-r border-slate-200 shrink-0" style={{ width: 204 }}>

      {/* Search bar row – same height as time header */}
      <div
        className="flex items-center gap-1 px-2 border-b border-slate-200 sticky top-0 bg-white z-10"
        style={{ height: HEADER_H }}
      >
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            placeholder="Employee"
            className="w-full pl-7 pr-2 py-1 text-[12px] border border-slate-200 rounded outline-none focus:border-[#1d8ce0] bg-white placeholder:text-slate-400"
          />
        </div>
        <button
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-[#1d8ce0] transition-colors"
          title="Permissions"
        >
          <Shield size={13} />
        </button>
      </div>

      {/* Headcount row – blue background, matching Image 9 */}
      <div
        className="flex items-center px-3 bg-[#1d8ce0] border-b border-[#1570b8]"
        style={{ height: HEADCOUNT_H }}
      >
        <span className="text-[12px] font-semibold text-white">Headcount</span>
      </div>

      {/* Open shifts row */}
      <div
        className="flex items-center justify-between px-3 border-b border-slate-100"
        style={{ height: OPEN_SHIFTS_H }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-[#1d8ce0]">Open shifts</span>
          <div
            className="w-4 h-4 rounded-full bg-[#1d8ce0] text-white flex items-center justify-center cursor-pointer hover:bg-[#1570b8] transition-colors"
            title="Clocked in employees"
          >
            <Info size={10} />
          </div>
        </div>
        <button
          onClick={() => toggleModal('showAddShiftModal')}
          className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0] transition-colors"
          title="Add open shift"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Virtualized employee list */}
      <List
        height={listHeight}
        itemCount={flatEmployees.length}
        itemSize={ROW_H}
        itemData={{
          employees: flatEmployees,
          selectedId: selectedTimesheetEmployeeId,
          onSelect: setSelectedTimesheetEmployee,
        }}
        width="100%"
      >
        {EmpRow}
      </List>
    </div>
  );
}
