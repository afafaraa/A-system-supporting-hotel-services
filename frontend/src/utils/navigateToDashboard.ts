import {NavigateFunction} from "react-router-dom";

function navigateToDashboard(role: string, navigate: NavigateFunction) {
  if (role === 'ROLE_GUEST') navigate('/guest');
  else if (role === 'ROLE_EMPLOYEE' || role === "ROLE_RECEPTIONIST") navigate('/employee/today-schedules');
  else if (role === 'ROLE_MANAGER') navigate('/management/guests');
  else if (role === 'ROLE_ADMIN') navigate('/management/guests');
  else navigate('/fallback');
}

export default navigateToDashboard;
