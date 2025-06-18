import {getISOWeek} from "date-fns";
import {OrderStatus} from "../components/layout/ScheduleTable.tsx";

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

export const orderStatus: Record<OrderStatus, {text: string, background: string}> = {
  "AVAILABLE": {text: "#27a6e0", background: "#b8e7fb"},
  "REQUESTED": {text: "#9a73c7", background: "#ddcbf2"},
  "ACTIVE": {text: "#5ea5aa", background: "#cbf0f2"},
  "COMPLETED": {text: "#5eaa62", background: "#cce8cd"},
  "CANCELED": {text: "#eee", background: "#333"},
}
