import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { FoodMatchLoader } from "@/components/FoodMatchLoader";
import { LEVELS, levelInfo, makeToken } from "@/lib/eco";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eco-Mess — Student Food Waste Reduction App" },
      {
        name: "description",
        content:
          "Eco-Mess helps hostel students cut mess food waste: book meals, finish your plate, donate extras, earn eco-points and redeem rewards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Eco-Mess — Student Food Waste Reduction App" },
      {
        property: "og:description",
        content:
          "Earn eco-points for zero-waste meals, climb the leaderboard and redeem mess rewards.",
      },
    ],
  }),
  component: Index,
});

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

const ACTIONS = [
  {
    id: "book",
    title: "Accurate Meal Booking",
    desc: "Tell mess if you'll eat tomorrow. Saves cooking.",
    cta: "Book Meal",
    points: 10,
    meal_type: "lunch",
    status: "pre_booked" as const,
    image: unsplash("photo-1567337710282-00832b415979"),
  },
  {
    id: "plate",
    title: "Finish Your Plate",
    desc: "Upload empty plate photo after lunch.",
    cta: "Upload Photo",
    points: 15,
    meal_type: "lunch",
    status: "zero_waste" as const,
    image: unsplash("photo-1512621776951-a57141f2eefd"),
  },
  {
    id: "donate",
    title: "Join Redistribution",
    desc: "Donate extra meal to staff/NGO.",
    cta: "Donate Now",
    points: 25,
    meal_type: "dinner",
    status: "zero_waste" as const,
    image: unsplash("photo-1593113646773-028c64a8f1b8"),
  },
];

const REWARDS = [
  { id: "dessert", emoji: "🍦", name: "Free Dessert", cost: 100 },
  { id: "merch", emoji: "👕", name: "Mess Merch", cost: 500 },
  { id: "free", emoji: "🎟️", name: "1 Day Mess Free", cost: 1000 },
];

type Profile = {
  id: string;
  full_name: string;
  roll_no: string | null;
  branch: string | null;
  eco_points: number;
  total_eaten: number;
};

type Redemption = {
  id: string;
  reward_name: string;
  token: string;
  cost: number;
  created_at: string;
};

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[24px] border border-zinc-200 bg-white p-6 shadow-xl"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const dayLabel = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" });
const dayKey = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

function Index() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const userId = session?.user.id ?? null;
  const isAuthed = !!userId;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<{ created_at: string; points_earned: number }[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [rows, setRows] = useState<
    { id: string; full_name: string; branch: string | null; eco_points: number }[]
  >([]);

  const [modal, setModal] = useState<null | "book" | "plate" | "level">(null);
  const [congrats, setCongrats] = useState<null | { name: string; token: string; left: number }>(null);
  const [verified, setVerified] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSync, setShowSync] = useState(false);

  const points = profile?.eco_points ?? 0;
  const meals = profile?.total_eaten ?? 0;
  const lvl = levelInfo(points);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isAuthed && userId) {
      localStorage.setItem("currentUserId", userId);
      if (sessionStorage.getItem("ecomess_just_logged_in") === "1") {
        sessionStorage.removeItem("ecomess_just_logged_in");
        setShowSync(true);
        const t = setTimeout(() => setShowSync(false), 3000);
        return () => clearTimeout(t);
      }
    } else if (!loading) {
      localStorage.removeItem("currentUserId");
    }
  }, [isAuthed, userId, loading]);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLogs([]);
      setRedemptions([]);
      setRows([]);
      return;
    }
    const [p, l, r, lb] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("meal_logs")
        .select("created_at, points_earned")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("redemptions")
        .select("id, reward_name, token, cost, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.rpc("get_leaderboard"),
    ]);

    if (!p.data) {
      const { data: created } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name:
            (session?.user.user_metadata?.["full_name"] as string) ||
            session?.user.email?.split("@")[0] ||
            "Student",
          eco_points: 0,
          total_eaten: 0,
        })
        .select("*")
        .maybeSingle();
      setProfile((created as Profile) ?? null);
    } else {
      setProfile(p.data as Profile);
    }
    setLogs(l.data ?? []);
    setRedemptions((r.data as Redemption[]) ?? []);
    setRows((lb.data as typeof rows) ?? []);
  }, [userId, session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const week = useMemo(() => {
    const days: { day: string; key: string; pts: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ day: dayLabel(d), key: dayKey(d), pts: 0 });
    }
    for (const log of logs) {
      const day = days.find((x) => x.key === dayKey(log.created_at));
      if (day) day.pts += log.points_earned;
    }
    const max = Math.max(1, ...days.map((d) => d.pts));
    return days.map((d) => ({ ...d, v: Math.round((d.pts / max) * 100) }));
  }, [logs]);

  const notify = (msg: string) => toast(msg, { duration: 3000 });

  const logMeal = async (action: (typeof ACTIONS)[number]) => {
    if (!userId || !profile) {
      navigate({ to: "/auth" });
      return;
    }
    const nextPoints = points + action.points;
    const { error } = await supabase.from("meal_logs").insert({
      user_id: userId,
      meal_type: action.meal_type,
      status: action.status,
      points_earned: action.points,
    });
    if (error) {
      notify(error.message);
      return;
    }
    await supabase
      .from("profiles")
      .update({ eco_points: nextPoints, total_eaten: meals + 1 })
      .eq("id", userId);
    notify(`+${action.points} pts • ${action.title}`);
    await refresh();
  };

  const redeem = async (r: (typeof REWARDS)[number]) => {
    if (!userId || points < r.cost) return;
    const token = makeToken(r.id);
    const left = points - r.cost;
    const { error } = await supabase.from("redemptions").insert({
      user_id: userId,
      reward_id: r.id,
      reward_name: r.name,
      cost: r.cost,
      token,
    });
    if (error) {
      notify(error.message);
      return;
    }
    await supabase.from("profiles").update({ eco_points: left }).eq("id", userId);
    await refresh();
    setCongrats({ name: r.name, token, left });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("currentUserId");
    navigate({ to: "/auth", replace: true });
  };

  const leaders = rows.map((r, i) => ({
    id: r.id,
    name: r.id === userId ? `${r.full_name || "You"}` : r.full_name || "Student",
    sub: r.id === userId ? "You" : r.branch || "Student",
    pts: r.eco_points,
    you: r.id === userId,
    medal: ["🥇", "🥈", "🥉"][i] ?? `#${i + 1}`,
  }));

  const displayName = profile?.full_name || session?.user.email || "Student";

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-zinc-200 bg-white/70 backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#111111] text-[15px] font-semibold text-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div className="leading-tight">
              <h1 className="text-[15px] font-semibold tracking-tight">Eco-Mess</h1>
              <p className="text-[12px] text-muted-foreground">Food waste, gamified</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading ? null : isAuthed ? (
              <>
                <span className="hidden text-right leading-tight sm:block">
                  <span className="block text-[13.5px] font-semibold tracking-tight">
                    {displayName}
                    {profile?.branch ? ` • ${profile.branch}` : ""}
                  </span>
                  <span className="block text-[11.5px] text-muted-foreground">
                    {profile?.roll_no ? `Roll No. ${profile.roll_no} • ` : ""}
                    {meals} meals logged
                  </span>
                </span>
                <motion.span
                  key={points}
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 18 }}
                  className="rounded-full bg-[#111111] px-4 py-2 text-[13px] font-semibold text-white"
                >
                  {points.toLocaleString()} pts
                </motion.span>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium shadow-sm hover:shadow-md"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-[#111111] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:py-10">
        {!loading && !isAuthed && (
          <div className="soft-card flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-[13.5px] text-muted-foreground">
              Log in to start earning eco-points — every account starts at 0.
            </p>
            <Link
              to="/auth"
              className="rounded-full bg-[#111111] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Login / Signup
            </Link>
          </div>
        )}

        {/* HERO */}
        <section className="grid gap-4 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[28px] bg-[#111111] p-7 text-white lg:col-span-7"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
              Total Eco-Points
            </p>
            <p className="mt-3 text-[56px] font-bold leading-none tracking-tight">
              {points.toLocaleString()}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModal("level")}
                className="rounded-full bg-[#D9F99D] px-3.5 py-1.5 text-[12px] font-semibold text-[#111111] transition-opacity hover:opacity-90"
              >
                Level {lvl.level} • {lvl.name}
              </button>
              <span className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#111111]">
                {meals} meals logged
              </span>
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between text-[12px] text-white/60">
                <span>
                  {lvl.next ? `Progress to ${lvl.next.name}` : "Max level reached"}
                </span>
                <span>{Math.round(lvl.progress)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/12">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lvl.progress}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-[#D9F99D]"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[26px] border border-lime bg-[#D9F99D] p-6 text-[#111111]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111111]/50">
                Your Impact 🌱
              </p>
              <div className="mt-4 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {(meals * 0.25).toFixed(1)}kg
                  </p>
                  <p className="text-[12px] text-[#111111]/60">Food Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {(meals * 0.38).toFixed(1)}kg
                  </p>
                  <p className="text-[12px] text-[#111111]/60">CO₂ Avoided</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="soft-card p-4"
            >
              <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Weekly Activity
              </p>
              <div className="mt-3 flex h-12 items-end justify-between gap-1.5">
                {week.map((d, i) => (
                  <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
                    <motion.div
                      title={`${d.pts} pts`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(d.v, 4)}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full rounded-full ${
                        i === week.length - 1 ? "bg-[#111111]" : "bg-zinc-200"
                      }`}
                    />
                    <span className="text-[9.5px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ACTIONS */}
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">What will you do today?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {ACTIONS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="soft-card group flex flex-col overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[15px] font-semibold tracking-tight">{a.title}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {a.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthed) {
                        navigate({ to: "/auth" });
                        return;
                      }
                      if (a.id === "book") setModal("book");
                      else if (a.id === "plate") {
                        setVerified(false);
                        setModal("plate");
                      } else void logMeal(a);
                    }}
                    className="mt-4 rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {a.cta} +{a.points} pts
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BOTTOM */}
        <section className="grid gap-4 lg:grid-cols-5">
          <div className="soft-card p-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold tracking-tight">Leaderboard 🏆</h2>
              <span className="text-[12px] text-muted-foreground">All students</span>
            </div>
            {leaders.length === 0 ? (
              <p className="mt-5 text-[13px] text-muted-foreground">
                {isAuthed ? "No students on the board yet." : "Log in to see the leaderboard."}
              </p>
            ) : (
              <ul className="mt-5 space-y-2.5">
                {leaders.map((l) => (
                  <li
                    key={l.id}
                    className={`flex items-center gap-3 rounded-[20px] px-4 py-3 ${
                      l.you ? "bg-[#111111] text-white" : "border border-zinc-200 bg-white"
                    }`}
                  >
                    <span className="text-[18px]">{l.medal}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold">{l.name}</p>
                      <p
                        className={`text-[11.5px] ${
                          l.you ? "text-white/60" : "text-muted-foreground"
                        }`}
                      >
                        {l.sub}
                      </p>
                    </div>
                    <span className="text-[13.5px] font-semibold tabular-nums">
                      {l.pts.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="soft-card p-6 lg:col-span-2">
            <h2 className="text-[16px] font-semibold tracking-tight">Rewards Store 🎁</h2>
            <ul className="mt-5 space-y-2.5">
              {REWARDS.map((r) => {
                const ok = isAuthed && points >= r.cost;
                return (
                  <li
                    key={r.id}
                    className="flex items-center gap-3 rounded-[20px] border border-zinc-200 p-3"
                  >
                    <span className="text-[18px]">{r.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{r.name}</p>
                      <p className="text-[11.5px] text-muted-foreground">{r.cost} pts</p>
                    </div>
                    <button
                      type="button"
                      disabled={!ok}
                      onClick={() => void redeem(r)}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-opacity ${
                        ok
                          ? "bg-[#111111] text-white hover:opacity-90"
                          : "cursor-not-allowed border border-zinc-200 text-muted-foreground"
                      }`}
                    >
                      Redeem
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* MY REWARDS */}
        {isAuthed && (
          <section className="soft-card p-6">
            <h2 className="text-[16px] font-semibold tracking-tight">My Rewards 🎫</h2>
            {redemptions.length === 0 ? (
              <p className="mt-4 text-[13px] text-muted-foreground">
                No rewards claimed yet. Earn points and redeem your first one.
              </p>
            ) : (
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {redemptions.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-zinc-200 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold">{r.reward_name}</p>
                      <p className="text-[11.5px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()} • {r.cost} pts
                      </p>
                    </div>
                    <code className="rounded-full bg-[#F6F5F2] px-3 py-1.5 text-[11.5px] font-semibold">
                      {r.token}
                    </code>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Book modal */}
      <Modal open={modal === "book"} onClose={() => setModal(null)}>
        <h3 className="text-lg font-semibold tracking-tight">Book Tomorrow's Lunch?</h3>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Confirming helps the mess cook the right quantity and cut waste.
        </p>
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              setModal(null);
              void logMeal(ACTIONS[0]!);
            }}
            className="flex-1 rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Yes, book it +10 pts
          </button>
          <button
            type="button"
            onClick={() => setModal(null)}
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-[13px] font-semibold"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Plate modal */}
      <Modal open={modal === "plate"} onClose={() => setModal(null)}>
        <h3 className="text-lg font-semibold tracking-tight">Upload Empty Plate</h3>
        {!verified ? (
          <button
            type="button"
            onClick={() => setVerified(true)}
            className="mt-4 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-zinc-300 bg-[#F6F5F2] text-[13px] text-muted-foreground transition-colors hover:border-[#111111]"
          >
            <span className="text-2xl">📸</span>
            Tap to upload empty plate
          </button>
        ) : (
          <div className="mt-4">
            <div className="flex h-40 flex-col items-center justify-center gap-1.5 rounded-[20px] bg-[#D9F99D] text-[#111111]">
              <p className="text-[14px] font-semibold">AI Verification Done ✅</p>
              <p className="text-[12.5px] text-[#111111]/65">Plate is 100% empty</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModal(null);
                void logMeal(ACTIONS[1]!);
              }}
              className="mt-4 w-full rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Collect +15 pts
            </button>
          </div>
        )}
      </Modal>

      {/* Level modal */}
      <Modal open={modal === "level"} onClose={() => setModal(null)}>
        <h3 className="text-lg font-semibold tracking-tight">Level system</h3>
        <p className="mt-2 text-[13px] text-muted-foreground">
          You are Level {lvl.level} • {lvl.name} with {points.toLocaleString()} points.
          {lvl.next
            ? ` ${lvl.pointsToNext} more points to reach ${lvl.next.name}.`
            : " You've reached the top level."}
        </p>
        <ul className="mt-5 space-y-2">
          {LEVELS.map((l) => (
            <li
              key={l.level}
              className={`flex items-center justify-between rounded-[18px] px-4 py-2.5 text-[13px] ${
                l.level === lvl.level
                  ? "bg-[#111111] font-semibold text-white"
                  : "border border-zinc-200"
              }`}
            >
              <span>
                Lvl {l.level} • {l.name}
              </span>
              <span className="tabular-nums">
                {l.max === Infinity ? "1000+ pts" : `${l.min}–${l.max} pts`}
              </span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setModal(null)}
          className="mt-6 w-full rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          Got it
        </button>
      </Modal>

      {/* Congrats modal */}
      <Modal open={!!congrats} onClose={() => setCongrats(null)}>
        <p className="text-center text-4xl">🎉</p>
        <h3 className="mt-3 text-center text-lg font-semibold tracking-tight">Congratulations!</h3>
        <p className="mt-2 text-center text-[13px] text-muted-foreground">
          You redeemed <span className="font-semibold text-[#111111]">{congrats?.name}</span>.
          Show this code at the mess counter.
        </p>
        <p className="mt-5 rounded-[18px] bg-[#D9F99D] px-4 py-3 text-center text-[15px] font-bold tracking-wide text-[#111111]">
          {congrats?.token}
        </p>
        <p className="mt-3 text-center text-[12.5px] text-muted-foreground">
          Remaining balance: {congrats?.left.toLocaleString()} pts
        </p>
        <button
          type="button"
          onClick={() => setCongrats(null)}
          className="mt-6 w-full rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          Done
        </button>
      </Modal>

      <FoodMatchLoader open={showSync} />

      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "!rounded-full !bg-[#111111] !text-white !border-none !px-5 !py-3 !text-[13px] !font-medium !justify-center",
        }}
      />
    </div>
  );
}
