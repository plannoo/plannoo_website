import { useAppStore } from '@/store/useAppStore';

export function useSelectedTimesheetEmployee() {
  const { employees, selectedTimesheetEmployeeId } = useAppStore();
  return employees.find(e => e.id === selectedTimesheetEmployeeId) ?? employees[0];
}
