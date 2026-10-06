import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Leaf, LayoutDashboard, Utensils, BarChart3, Trophy, Gift, Crown, Users, Settings,
  Upload, Recycle, Clock, Flame, CheckCircle2, Circle, Coffee, IceCream, Percent,
  Target, Repeat, Menu, X, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoBite — Gamified Food Waste Dashboard" },
      { name: "description", content: "Pre-book meals, check plates, complete challenges and earn rewards for wasting less food." },
      { property: "og:title", content: "EcoBite — Gamified Food Waste Dashboard" },
      { property: "og:description", content: "A premium dashboard that turns food waste reduction into a game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EcoBite,
});

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Meals", icon: Utensils },
  { label: "Waste Insights", icon: BarChart3 },
  { label: "Challenges", icon: Trophy },
  { label: "Rewards", icon: Gift },
  { label: "Leaderboard", icon: Crown },
  { label: "Community", icon: Users },
  { label: "Settings", icon: Settings },
];

const MEALS = [
  { name: "Veg Thali", slot: "12:00 – 12:30", kcal: 100 },
  { name: "Paneer Rice Bowl", slot: "12:30 – 13:00", kcal: 120 },
  { name: "Veg Thali", slot: "1:00 – 1:30", kcal: 150 },
  { name: "Paneer Rice Bowl", slot: "1:30 – 2:00", kcal: 120 },
];

const WASTE = [
  { w: "Wk 1", v: 72, c: "bg-eb-green-3" },
  { w: "Wk 2", v: 54, c: "bg-eb-green" },
  { w: "Wk 3", v: 38, c: "bg-eb-green-2" },
  { w: "Wk 4", v: 22, c: "bg-eb-green-4" },
];

const card = "rounded-xl border border-eb-line bg-eb-card transition-all duration-200 hover:border-eb-green/40 hover:-translate-y-0.5";

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-eb-raised">
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }} className="h-full rounded-full bg-eb-green" />
    </div>
  );
}

function EcoBite() {
  const [points, setPoints] = useState(32);
  const [day, setDay] = useState<"Today" | "Tomorrow">("Today");
  const [booked, setBooked] = useState<Record<string, boolean>>({});
  const [recurring, setRecurring] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { t: "Pre-book today's lunch", done: true, pts: 2 },
    { t: "Upload a clean plate", done: false, pts: 3 },
    { t: "Skip a second helping", done: false, pts: 1 },
    { t: "Share a tip in Community", done: false, pts: 1 },
  ]);

  const book = (key: string, name: string) => {
    if (booked[key]) return;
    setBooked((b) => ({ ...b, [key]: true }));
    setPoints((p) => p + 2);
    toast.success(`${name} booked • +2 points`);
  };
  const toggleTask = (i: number) =>
    setTasks((ts) => ts.map((x, j) => {
      if (j !== i) return x;
      setPoints((p) => p + (x.done ? -x.pts : x.pts));
      return { ...x, done: !x.done };
    }));

  const Sidebar = (
    <div className="flex h-full flex-col p-5">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-lg bg-eb-green/15 text-eb-green"><Leaf className="size-4" /></div>
        <span className="text-[17px] font-semibold tracking-tight">EcoBite</span>
      </div>
      <nav className="space-y-1">
        {NAV.map((n, i) => (
          <button key={n.label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${i === 0 ? "bg-eb-green/12 font-medium text-eb-green" : "text-eb-dim hover:bg-eb-raised hover:text-eb-text"}`}>
            <n.icon className="size-4" />{n.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-eb-line bg-eb-raised p-4">
        <p className="text-xs text-eb-dim">Eco Level</p>
        <p className="mt-0.5 font-semibold text-eb-green">Champion</p>
        <p className="mb-3 text-xs text-eb-dim">32 meals saved</p>
        <Bar pct={85} />
        <p className="mt-1.5 text-right text-[11px] text-eb-dim">85%</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-eb-bg text-eb-text">
      <Toaster position="bottom-center" theme="dark" />
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-eb-line bg-eb-bg lg:block">{Sidebar}</aside>
      {navOpen && (
        <div className="fixed inset-0 z-50 bg-eb-bg/70 backdrop-blur-sm lg:hidden" onClick={() => setNavOpen(false)}>
          <aside className="h-full w-64 border-r border-eb-line bg-eb-bg" onClick={(e) => e.stopPropagation()}>{Sidebar}</aside>
        </div>
      )}

      <main className="lg:pl-60">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-eb-line bg-eb-bg/80 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-eb-raised lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu">{navOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Go Green, Yash 🌿</h1>
              <p className="text-sm text-eb-dim">Nourishing body & planet, one plate at a time.</p>
            </div>
          </div>
          <div className="w-40 rounded-xl border border-eb-line bg-eb-card px-4 py-2.5 md:w-52">
            <div className="mb-1.5 flex justify-between text-xs"><span className="text-eb-dim">Meal Points</span><span className="font-semibold text-eb-green">{points}</span></div>
            <Bar pct={Math.min(100, (points / 40) * 100)} />
          </div>
        </header>

        <div className="space-y-6 p-5 md:p-8">
          {/* Top */}
          <section className="grid gap-4 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${card} p-6`}>
              <div className="mb-6 flex items-center justify-between"><span className="text-sm text-eb-dim">Meals Saved</span><Sparkles className="size-4 text-eb-green" /></div>
              <p className="text-5xl font-semibold tracking-tight">32</p>
              <p className="mt-2 text-sm text-eb-green">+6 this week</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${card} p-6 md:col-span-2`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-eb-dim">Plate Check</p>
                  <p className="mt-1 text-lg font-semibold">Snap your plate after eating</p>
                </div>
                <button onClick={() => { setPoints((p) => p + 3); toast.success("Plate verified • +3 points"); }} className="flex items-center gap-2 rounded-lg bg-eb-green px-4 py-2 text-sm font-medium text-eb-ink transition hover:brightness-110">
                  <Upload className="size-4" /> Upload plate
                </button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[["Recyclable plate check", "94%"], ["Clean plates", "28"], ["Waste avoided", "6.4kg"]].map(([l, v]) => (
                  <div key={l} className="rounded-lg bg-eb-raised p-3">
                    <Recycle className="mb-2 size-4 text-eb-green" />
                    <p className="text-lg font-semibold">{v}</p>
                    <p className="text-[11px] text-eb-dim">{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Pre-book */}
          <section className={`${card} p-6 hover:translate-y-0`}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Pre-book lunch</h2>
                <p className="text-sm text-eb-dim">Choose your meal · Booking closes every 4 points</p>
              </div>
              <div className="flex rounded-lg bg-eb-raised p-1">
                {(["Today", "Tomorrow"] as const).map((d) => (
                  <button key={d} onClick={() => setDay(d)} className={`rounded-md px-4 py-1.5 text-sm transition ${day === d ? "bg-eb-green text-eb-ink font-medium" : "text-eb-dim hover:text-eb-text"}`}>{d}</button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {MEALS.map((m, i) => {
                const key = `${day}-${i}`;
                const done = booked[key];
                return (
                  <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group rounded-xl bg-eb-cream p-4 text-eb-ink transition hover:-translate-y-1">
                    <div className="mb-3 grid h-20 place-items-center rounded-lg bg-eb-green-4/60 text-3xl transition group-hover:scale-[1.02]">{m.name.includes("Thali") ? "🍛" : "🍚"}</div>
                    <p className="font-semibold">{m.name}</p>
                    <div className="mt-1 flex items-center justify-between text-xs opacity-70">
                      <span className="flex items-center gap-1"><Clock className="size-3" />{m.slot}</span>
                      <span className="flex items-center gap-1"><Flame className="size-3" />{m.kcal} kcal</span>
                    </div>
                    <button onClick={() => book(key, m.name)} className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition ${done ? "bg-eb-ink text-eb-green" : "bg-eb-green text-eb-ink hover:brightness-110"}`}>
                      {done ? "Booked ✓" : "Book for 2 points"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
            <label className="mt-5 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-eb-dim hover:text-eb-text">
              <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="size-4 accent-eb-green" />
              <Repeat className="size-4" /> Recurring lunch plan
            </label>
          </section>

          {/* Chart + tasks */}
          <section className="grid gap-4 lg:grid-cols-5">
            <div className={`${card} p-6 lg:col-span-3`}>
              <h2 className="font-semibold">Meals waste this week</h2>
              <p className="text-sm text-eb-dim">Grams wasted per meal, trending down</p>
              <div className="mt-6 flex h-48 items-end gap-6">
                {WASTE.map((b, i) => (
                  <div key={b.w} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs text-eb-dim">{b.v}g</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${b.v * 1.8}px` }} transition={{ delay: i * 0.1, duration: 0.7 }} className={`w-full max-w-16 rounded-lg ${b.c} transition hover:brightness-110`} />
                    <span className="text-xs text-eb-dim">{b.w}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${card} p-6 lg:col-span-2`}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Gamified Dashboard</h2>
                <span className="rounded-full bg-eb-green/12 px-2.5 py-1 text-xs text-eb-green">Daily tasks</span>
              </div>
              <div className="space-y-2">
                {tasks.map((t, i) => (
                  <button key={t.t} onClick={() => toggleTask(i)} className="flex w-full items-center gap-3 rounded-lg bg-eb-raised px-3 py-2.5 text-left text-sm transition hover:bg-eb-line">
                    {t.done ? <CheckCircle2 className="size-4 text-eb-green" /> : <Circle className="size-4 text-eb-dim" />}
                    <span className={`flex-1 ${t.done ? "text-eb-dim line-through" : ""}`}>{t.t}</span>
                    <span className="text-xs text-eb-green">+{t.pts}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Second screen */}
          <section className="grid gap-4 lg:grid-cols-3">
            <div className={`${card} p-6`}>
              <h2 className="mb-4 font-semibold">Active challenges</h2>
              {[["Clean Plate Club", "5 clean plates in a row", 80], ["Routine buster", "Pre-book 7 days straight", 45]].map(([n, d, p]) => (
                <div key={n as string} className="mb-3 rounded-lg bg-eb-raised p-4 last:mb-0">
                  <div className="mb-1 flex items-center gap-2"><Target className="size-4 text-eb-green" /><span className="text-sm font-medium">{n}</span></div>
                  <p className="mb-3 text-xs text-eb-dim">{d}</p>
                  <Bar pct={p as number} />
                </div>
              ))}
            </div>
            <div className={`${card} p-6`}>
              <h2 className="mb-4 font-semibold">Recent activity</h2>
              <ul className="space-y-3">
                {[["Booked Veg Thali", "2h ago", "+2"], ["Clean plate verified", "Yesterday", "+3"], ["Joined Clean Plate Club", "2d ago", "+5"], ["Redeemed Free Coffee", "3d ago", "−10"]].map(([a, t, p]) => (
                  <li key={a} className="flex items-center gap-3 text-sm">
                    <span className="size-2 rounded-full bg-eb-green" />
                    <span className="flex-1">{a}<span className="block text-xs text-eb-dim">{t}</span></span>
                    <span className="text-xs font-medium text-eb-green">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${card} p-6`}>
              <h2 className="mb-4 font-semibold">Rewards</h2>
              {[{ n: "Free Dessert", c: 10, i: IceCream }, { n: "Free Coffee", c: 8, i: Coffee }, { n: "Discount of the Day", c: 15, i: Percent }].map((r) => (
                <div key={r.n} className="mb-3 flex items-center gap-3 rounded-lg bg-eb-raised p-3 last:mb-0">
                  <div className="grid size-9 place-items-center rounded-lg bg-eb-green/12 text-eb-green"><r.i className="size-4" /></div>
                  <div className="flex-1 text-sm">{r.n}<span className="block text-xs text-eb-dim">{r.c} points</span></div>
                  <button
                    onClick={() => {
                      if (points < r.c) { toast.error("Not enough points"); return; }
                      setPoints((p) => p - r.c);
                      toast.success(`${r.n} redeemed`);
                    }}
                    className="rounded-lg border border-eb-green/40 px-3 py-1.5 text-xs text-eb-green transition hover:bg-eb-green hover:text-eb-ink"
                  >Redeem</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
