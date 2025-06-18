import {getISOWeek} from "date-fns";
import {OrderStatus, Schedule} from "../types/schedule.ts"

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
