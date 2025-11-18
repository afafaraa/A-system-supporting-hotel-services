import {addMinutes, format} from "date-fns";
import {t} from "i18next";

export const formatDateFromTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const shortWeekdays = t("date.shortWeekdays", { returnObjects: true }) as string[];
  const dayOfWeek = shortWeekdays[(date.getDay() + 6) % 7]; // Adjust for Monday as first day of week
  const dateStr = date.toLocaleDateString(t('date.locale'), {day: 'numeric', month: 'long'});
  const sep = t('date.separator');
  return `${dayOfWeek}${sep} ${dateStr}`
}

export const formatTimeFromTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString(t('date.locale'), {hour: '2-digit', minute: '2-digit'});
  return time.replace(/\s?AM/i, ' am').replace(/\s?PM/i, ' pm');
}

const hourFormat = { hour: '2-digit', minute: '2-digit' } as const;

export const formatTimeRange = (date: Date, duration: number | undefined): string => {
  const startTime = date.toLocaleTimeString(t('date.locale'), hourFormat);
  const endTime = duration
    ? addMinutes(date, duration).toLocaleTimeString(t('date.locale'), hourFormat)
    : null;
  return endTime ? `${startTime} - ${endTime}` : startTime;
}

export const formatDateRange = (start: string | Date, end: string | Date): string => {
  const startDateStr = new Date(start).toLocaleDateString(t('date.locale'));
  const endDateStr = new Date(end).toLocaleDateString(t('date.locale'));
  return startDateStr + " - " + endDateStr;
}

export const formatNumericDayMonth = (date: Date): string => {
  return date.toLocaleDateString(t('date.locale'), { day: '2-digit', month: '2-digit' })
}

export const toLocalISODate = (date: Date): string => format(date, "yyyy-MM-dd");
