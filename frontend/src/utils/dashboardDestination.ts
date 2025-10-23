
const navigateDestination: Record<string, string> = {
  'ROLE_GUEST': '/guest',
  'ROLE_EMPLOYEE': '/employee/today-schedules',
  'ROLE_RECEPTIONIST': '/receptionist/guest-arrival-and-departures',
  'ROLE_MANAGER': '/management/guests',
  'ROLE_ADMIN': '/management/guests'
} as const;

function dashboardDestination(role: string) {
  return navigateDestination[role] || '/fallback';
}

export default dashboardDestination;
