import { motion } from "motion/react";
import { Crown } from "lucide-react";
import { LEADERBOARD } from "./data";

export function Leaderboard({ userPoints }: { userPoints: number }) {
  const rows = LEADERBOARD.map((r) => (r.isUser ? { ...r, points: userPoints } : r)).sort(
    (a, b) => b.points - a.points,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-tight">Leaderboard</h2>
        <span className="text-[12px] text-muted-foreground">This month</span>
      </div>

      <ul className="mt-5 space-y-2">
        {rows.map((row, i) => (
          <li
            key={row.name}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
              row.isUser
                ? "border border-primary/25 bg-primary/8"
                : "border border-transparent hover:bg-white/4"
            }`}
          >
            <span
              className={`flex size-7 items-center justify-center rounded-lg text-[12px] font-semibold ${
                i === 0 ? "bg-amberish/18 text-amberish" : "bg-white/6 text-muted-foreground"
              }`}
            >
              {i === 0 ? <Crown className="size-3.5" /> : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium">{row.name}</p>
              <p className="text-[11.5px] text-muted-foreground">{row.branch}</p>
            </div>
            <span className="text-[13px] font-semibold tabular-nums">
              {row.points.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
