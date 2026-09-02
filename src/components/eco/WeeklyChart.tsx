import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WEEKLY } from "./data";

export function WeeklyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">Weekly Mess Waste</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Kilograms wasted vs. redistributed, last 7 days
          </p>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[4px] bg-chart-5" /> Wasted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[4px] bg-eco" /> Saved
          </span>
        </div>
      </div>

      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEKLY} barGap={6}>
            <CartesianGrid vertical={false} stroke="oklch(1 0 0 / 0.06)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
              contentStyle={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                fontSize: 12,
                color: "var(--foreground)",
              }}
            />
            <Bar dataKey="waste" name="Wasted" fill="var(--chart-5)" radius={[8, 8, 4, 4]} />
            <Bar dataKey="saved" name="Saved" fill="var(--eco)" radius={[8, 8, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
