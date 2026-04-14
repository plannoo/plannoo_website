import { useAppStore } from '@/store/useAppStore';
import { TopNav } from '@/components/layout/TopNav';
import { SubNav } from '@/components/layout/SubNav';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { TimesheetsView } from '@/components/timesheets/TimesheetsView';
import { ReportingView } from '@/components/reporting/ReportingView';
import { AvailabilitiesView } from '@/components/availabilities/AvailabilitiesView';
import { TasksView } from '@/components/tasks/TasksView';
import { AbsenceCalendarView } from '@/components/absences/AbsenceCalendarView';
import { AbsenceListView } from '@/components/absences/AbsenceListView';
import { AbsenceEntitlementView } from '@/components/absences/AbsenceEntitlementView';

function PageContent() {
  const { mainTab, scheduleSubTab, absenceSubTab } = useAppStore();

  if (mainTab === 'dashboard') return <DashboardView />;

  if (mainTab === 'absences') {
    switch (absenceSubTab) {
      case 'CALENDAR':    return <AbsenceCalendarView />;
      case 'LIST':        return <AbsenceListView />;
      case 'ENTITLEMENT': return <AbsenceEntitlementView />;
    }
  }

  switch (scheduleSubTab) {
    case 'SCHEDULE':       return <ScheduleView />;
    case 'TIMESHEETS':     return <TimesheetsView />;
    case 'REPORTING':      return <ReportingView />;
    case 'AVAILABILITIES': return <AvailabilitiesView />;
    case 'TASKS':          return <TasksView />;
  }

  return <ScheduleView />;
}

export default function App() {
  const { mainTab } = useAppStore();
  const hasSub = mainTab !== 'dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />
      {hasSub && <SubNav />}
      <main style={{
        paddingTop: hasSub
          ? 'calc(var(--header-height) + var(--subnav-height))'
          : 'var(--header-height)',
      }}>
        <PageContent />
      </main>
    </div>
  );
}
