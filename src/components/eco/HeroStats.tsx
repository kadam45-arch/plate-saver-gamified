import { motion } from "motion/react";
import { Flame, Sparkles, Shield, Leaf, Cloud } from "lucide-react";

type Props = {
  points: number;
  streak: number;
  level: number;
  levelTitle: string;
  xp: number;
  xpMax: number;
  foodSavedKg: number;
  co2AvoidedKg: number;
};

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] as const },
});

export function HeroStats({
  points,
  streak,
  level,
  levelTitle,
  xp,
  xpMax,
  foodSavedKg,
  co2AvoidedKg,
}: Props) {
  const pct = Math.min(100, Math.round((xp / xpMax) * 100));

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <motion.div {...fade(0)} className="ivory-card relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/70 blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-black/45">
              Total Eco-Points
            </p>
            <motion.p
              key={points}
              initial={{ scale: 0.94, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="mt-3 text-5xl font-semibold tracking-tight text-black"
            >
              {points.toLocaleString()}
            </motion.p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-2xl bg-black/6 text-black/70 ring-1 ring-black/10">
            <Sparkles className="size-5" />
          </span>
        </div>
        <div className="relative mt-6 flex items-center gap-2 rounded-2xl bg-black/6 px-3 py-2 text-[13px] font-medium text-black/75 ring-1 ring-black/8">
          <Flame className="size-4 text-orange-600" />
          {streak} day streak
          <span className="ml-auto text-black/45">Keep it alive</span>
        </div>
      </motion.div>

      <motion.div {...fade(1)} className="glass-card relative overflow-hidden p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Level {level}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{levelTitle}</p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
            <Shield className="size-5" />
          </span>
        </div>
        <div className="mt-7">
          <div className="flex items-baseline justify-between text-[13px]">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-medium">
              {xp} / {xpMax} XP
            </span>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-eco-soft to-eco shadow-[0_0_20px_-2px_var(--eco)]"
            />
          </div>
          <p className="mt-2 text-[12px] text-muted-foreground">
            {xpMax - xp} XP to Level {level + 1}
          </p>
        </div>
      </motion.div>

      <motion.div {...fade(2)} className="azure-card relative overflow-hidden p-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Your Impact
        </p>
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white/8 text-eco ring-1 ring-white/10">
              <Leaf className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{foodSavedKg} kg</p>
              <p className="text-[12px] text-muted-foreground">Food saved</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white/8 text-azure ring-1 ring-white/10">
              <Cloud className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{co2AvoidedKg} kg</p>
              <p className="text-[12px] text-muted-foreground">CO₂ avoided</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
