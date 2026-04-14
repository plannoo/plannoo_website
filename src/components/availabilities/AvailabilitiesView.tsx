import { useAppStore } from '@/store/useAppStore';
import { ChevronDown, Plus } from 'lucide-react';
import { AVAILABILITY_DAYS, EMPLOYEES } from '@/data/mockData';

export function AvailabilitiesView() {
  const { employees, availabilities, addAvailabilitySlot } = useAppStore();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--header-height) - var(--subnav-height))' }}>
      {/* Title */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-gray-800 border-l-4 border-[#2196F3] pl-3 leading-tight">Availabilities</h1>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-white border-b border-gray-100 shrink-0">
        <div className="relative">
          <select className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-white outline-none cursor-pointer appearance-none pr-7 min-w-[150px]">
            <option value="">Employee</option>
            {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:border-[#2196F3] hover:text-[#2196F3] bg-white transition-colors">
          <Plus size={11} />More filters
        </button>
      </div>

      {/* Availability grids */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4 space-y-4">
        {employees.map(emp => {
          const avail = availabilities.find(a => a.employeeId === emp.id);
          return (
            <div key={emp.id}>
              <p className="text-[13px] font-semibold text-gray-700 mb-1.5">{emp.name}</p>
              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                {/* Day headers */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  {AVAILABILITY_DAYS.map(day => (
                    <div key={day} className="flex-1 flex items-center justify-center border-r border-gray-200 last:border-r-0 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Cells */}
                <div className="flex" style={{ minHeight: 64 }}>
                  {AVAILABILITY_DAYS.map((_, di) => {
                    const dayData = avail?.weeklyTemplate[di];
                    const slots   = dayData?.slots ?? [];
                    return (
                      <div key={di}
                        className="flex-1 border-r border-gray-100 last:border-r-0 flex items-center justify-center cursor-pointer hover:bg-blue-50/60 transition-colors group min-h-[64px]"
                        onClick={() => addAvailabilitySlot(emp.id, di)}>
                        {slots.length > 0 ? (
                          <div className="flex flex-col items-center gap-0.5 p-1">
                            {slots.map((s, si) => (
                              <span key={si} className="text-[10px] font-medium text-[#2196F3] bg-blue-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                                {s.start}–{s.end}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-200 text-2xl group-hover:text-[#2196F3] transition-colors">+</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
