import {getISOWeek} from "date-fns";
import {Schedule} from "../types/schedule.ts"
import {t} from "i18next";
import {NavigateFunction} from "react-router-dom";

export function getYearWeek(date: Date): number {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return year * 100 + week;
}

export const weekDayToInt: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6
}

export const DateWithHour = (hour: number) => {
  const now = new Date();
  now.setHours(hour, 0, 0, 0);
  return now;
}

export const getStartTime = (schedules: Schedule[] | undefined): Date => {
  if (!schedules || schedules.length === 0) return DateWithHour(6);
  const minMinutes = Math.min(
    ...schedules.map(s => {
      const d = new Date(s.date);
      return d.getHours() * 60 + d.getMinutes();
    })
  );
  return DateWithHour(Math.floor(minMinutes / 60));
}

export const getEndTime = (schedules: Schedule[] | undefined): Date => {
  if (!schedules || schedules.length === 0) return DateWithHour(8);
  const maxMinutes = Math.max(
    ...schedules.map(s => {
      const d = new Date(s.date);
      return d.getHours() * 60 + d.getMinutes() + (s.duration || 0);
    })
  );
  return DateWithHour(Math.ceil(maxMinutes / 60));
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
  if (role === 'ROLE_GUEST') navigate('/services/available');
  else if (role === 'ROLE_EMPLOYEE') navigate('/home');
  else navigate('/home')
}
