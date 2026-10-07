import { eachDayOfInterval, format, startOfDay } from "date-fns";

export const LUNCH_COST = 50;
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export type LunchPlan = { from: Date; to: Date; weekdays: number[]; meals: number };

export function lunchDates(from: Date, to: Date, weekdays: number[]) {
  if (startOfDay(to) < startOfDay(from)) return [];
  return eachDayOfInterval({ start: from, end: to }).filter((date) => weekdays.includes(date.getDay()));
}

export function planRange(from: Date, to: Date) {
  return `${format(from, "MMM d")} - ${format(to, "MMM d")}`;
}