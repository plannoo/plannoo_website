import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils';
import type { ScheduleSubTab, AbsenceSubTab } from '@/types';

const SCHED: ScheduleSubTab[] = ['SCHEDULE', 'TIMESHEETS', 'REPORTING', 'AVAILABILITIES', 'TASKS'];
const ABS:   AbsenceSubTab[]  = ['CALENDAR', 'LIST', 'ENTITLEMENT'];

export function SubNav() {
  const { mainTab, scheduleSubTab, absenceSubTab, setScheduleSubTab, setAbsenceSubTab } = useAppStore();
  if (mainTab === 'dashboard') return null;

  const tabs   = mainTab === 'absences' ? ABS : SCHED;
  const active = mainTab === 'absences' ? absenceSubTab : scheduleSubTab;
  const change = (t: string) =>
    mainTab === 'absences' ? setAbsenceSubTab(t as AbsenceSubTab) : setScheduleSubTab(t as ScheduleSubTab);

  return (
    <div
      className="fixed left-0 right-0 z-[90] flex items-end bg-white border-b border-gray-200 px-4 gap-0"
      style={{ top: 'var(--header-height)', height: 'var(--subnav-height)' }}
    >
      {tabs.map(tab => (
        <button key={tab} onClick={() => change(tab)}
          className={cn(
            'px-4 py-1.5 text-[12px] font-medium uppercase tracking-wide border-b-2 -mb-px transition-all duration-150 mr-1',
            active === tab
              ? 'border-[#2196F3] text-[#2196F3] font-semibold'
              : 'border-transparent text-gray-500 hover:text-[#2196F3]'
          )}>
          {tab}
        </button>
      ))}
    </div>
  );
}
