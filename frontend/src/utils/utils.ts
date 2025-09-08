import {addMinutes, getISOWeek} from "date-fns";
import {t} from "i18next";
import {NavigateFunction} from "react-router-dom";

export function getYearWeek(date: Date): number {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return year * 100 + week;
}

export const getDay = (timestamp: string): string => {
  const date = new Date(timestamp);
  const shortWeekdays = t("date.shortWeekdays", { returnObjects: true }) as string[];
  const dayOfWeek = shortWeekdays[(date.getDay() + 6) % 7]; // Adjust for Monday as first day of week
  const dateStr = date.toLocaleDateString(t('date.locale'), {day: 'numeric', month: 'long'});
  const sep = t('date.separator');
  return `${dayOfWeek}${sep} ${dateStr}`
}

export const getTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString(t('date.locale'), {hour: '2-digit', minute: '2-digit'});
  return time.replace(/\s?AM/i, ' am').replace(/\s?PM/i, ' pm');
}

export const navigateToDashboard = (role: string, navigate: NavigateFunction) => {
  if (role === 'ROLE_GUEST') navigate('/guest');
  else if (role === 'ROLE_EMPLOYEE' || role === "ROLE_RECEPTIONIST") navigate('/employee/today-schedules');
  else if (role === 'ROLE_MANAGER') navigate('/employee/today-schedules');
  else if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
  else navigate('/fallback');
}

const hourFormat = { hour: '2-digit', minute: '2-digit' } as const;

export const getScheduleTimeSpan = (date: Date, duration: number | undefined, locale: string): string => {
  const startTime = date.toLocaleTimeString(locale, hourFormat);
  const endTime = duration
    ? addMinutes(date, duration).toLocaleTimeString(locale, hourFormat)
    : null;
  return endTime ? `${startTime} - ${endTime}` : startTime;
}
