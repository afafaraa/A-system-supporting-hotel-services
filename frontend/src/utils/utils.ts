import {getISOWeek} from "date-fns";

export function getYearWeek(date: Date): number {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return year * 100 + week;
}

export const weekDayToInt: Record<string, number> = {
  "MONDAY": 0,
  "TUESDAY": 1,
  "WEDNESDAY": 2,
  "THURSDAY": 3,
  "FRIDAY": 4,
  "SATURDAY": 5,
  "SUNDAY": 6
}

export const DateWithHour = (hour: number) => {
  const now = new Date();
  now.setHours(hour, 0, 0, 0);
  return now;
}
