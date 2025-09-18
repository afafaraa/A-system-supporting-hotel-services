
const navigateDestination: Record<string, string> = {
  'ROLE_GUEST': '/guest',
  'ROLE_EMPLOYEE': '/employee/today-schedules',
  'ROLE_RECEPTIONIST': '/employee/today-schedules',
  'ROLE_MANAGER': '/employee/today-schedules',
  'ROLE_ADMIN': '/employee/today-schedules'
} as const;

function dashboardDestination(role: string) {
  return navigateDestination[role] || '/fallback';
}

export default dashboardDestination;
