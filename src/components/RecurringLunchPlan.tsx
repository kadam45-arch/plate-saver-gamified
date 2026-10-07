import { useState } from "react";
import { endOfMonth, format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LUNCH_COST, WEEKDAYS, lunchDates, planRange, type LunchPlan } from "@/lib/lunch-plan";

function DatePicker({ label, date, min, onChange }: { label: string; date: Date; min: Date; onChange: (date: Date) => void }) {
  const [open, setOpen] = useState(false);
  return <div className="min-w-0 space-y-2">
    <p className="text-sm text-eb-dim">{label}</p>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="outline" aria-label={`${label} date`} className="w-full justify-start border-eb-line bg-eb-raised text-eb-text hover:bg-eb-line"><CalendarIcon />{format(date, "MMM d, yyyy")}</Button></PopoverTrigger>
      <PopoverContent align="start" className="ecobite-theme w-auto border-eb-line bg-eb-card p-0 text-eb-text">
        <Calendar mode="single" selected={date} defaultMonth={date} disabled={{ before: min }} onSelect={(value) => { if (value) { onChange(value); setOpen(false); } }} className="pointer-events-auto bg-eb-card" />
      </PopoverContent>
    </Popover>
  </div>;
}

export function RecurringLunchPlan({ open, onOpenChange, plan, points, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; plan: LunchPlan | null; points: number; onConfirm: (plan: LunchPlan) => void }) {
  const today = startOfDay(new Date());
  const [from, setFrom] = useState(plan?.from ?? today);
  const [to, setTo] = useState(plan?.to ?? endOfMonth(today));
  const [weekdays, setWeekdays] = useState(plan?.weekdays ?? [1, 2, 3, 4, 5]);
  const meals = lunchDates(from, to, weekdays).length;
  const cost = meals * LUNCH_COST;
  const daysLabel = weekdays.length === 5 && [1, 2, 3, 4, 5].every((day) => weekdays.includes(day)) ? "Mon-Fri" : WEEKDAYS.filter((_, i) => weekdays.includes(i + 1)).join(", ");

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="ecobite-theme max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl border-eb-line bg-eb-card text-eb-text">
      <DialogTitle>Recurring lunch plan</DialogTitle>
      <DialogDescription className="text-eb-dim">50 points per lunch</DialogDescription>
      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="From" date={from} min={today} onChange={(date) => { setFrom(date); if (date > to) setTo(date); }} />
        <DatePicker label="To" date={to} min={from > today ? from : today} onChange={setTo} />
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Lunch weekdays">
        {WEEKDAYS.map((day, i) => <Button key={day} variant="ghost" size="sm" aria-pressed={weekdays.includes(i + 1)} onClick={() => setWeekdays((days) => days.includes(i + 1) ? days.filter((value) => value !== i + 1) : [...days, i + 1])} className={weekdays.includes(i + 1) ? "bg-eb-green text-eb-ink hover:bg-eb-green/90" : "bg-eb-raised text-eb-dim hover:bg-eb-line"}>{day}</Button>)}
      </div>
      <p className="text-sm leading-relaxed" aria-live="polite">{planRange(from, to)}, {daysLabel || "No weekdays selected"} ({meals} meals) = {cost} points</p>
      {cost > points && <p className="text-sm text-eb-dim">You have {points} points. This plan needs {cost} points.</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button disabled={!meals || cost > points || from < today} onClick={() => onConfirm({ from, to, weekdays, meals })} className="bg-eb-green text-eb-ink hover:bg-eb-green/90">Confirm Plan</Button>
      </div>
    </DialogContent>
  </Dialog>;
}