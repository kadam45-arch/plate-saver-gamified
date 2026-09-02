import { motion } from "motion/react";
import { Gift, Lock } from "lucide-react";
import { REWARDS } from "./data";

export function Rewards({
  points,
  onRedeem,
}: {
  points: number;
  onRedeem: (reward: (typeof REWARDS)[number]) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-tight">Rewards Store</h2>
        <span className="text-[12px] text-muted-foreground">
          {points.toLocaleString()} pts available
        </span>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {REWARDS.map((reward) => {
          const affordable = points >= reward.cost;
          return (
            <div
              key={reward.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white/3 p-3.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/6 text-muted-foreground">
                <Gift className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium">{reward.name}</p>
                <p className="text-[11.5px] text-muted-foreground">
                  {reward.tag} · {reward.cost} pts
                </p>
              </div>
              <button
                type="button"
                disabled={!affordable}
                onClick={() => onRedeem(reward)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  affordable
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "cursor-not-allowed border border-border text-muted-foreground"
                }`}
              >
                {affordable ? "Redeem" : <Lock className="size-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
