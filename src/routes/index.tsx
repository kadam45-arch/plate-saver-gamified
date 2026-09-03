import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { ConnectSyncOverlay } from "@/components/ConnectSyncOverlay";


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
          "Earn eco-points for zero-waste meals, climb the hostel leaderboard and redeem mess rewards.",
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
    image: unsplash("photo-1567337710282-00832b415979"),
  },
  {
    id: "plate",
    title: "Finish Your Plate",
    desc: "Upload empty plate photo after lunch.",
    cta: "Upload Photo",
    points: 15,
    image: unsplash("photo-1512621776951-a57141f2eefd"),
  },
  {
    id: "donate",
    title: "Join Redistribution",
    desc: "Donate extra meal to staff/NGO.",
    cta: "Donate Now",
    points: 25,
    image: unsplash("photo-1593113646773-028c64a8f1b8"),
  },
];

const WEEK = [
  { day: "Wed", v: 38 },
  { day: "Thu", v: 74 },
  { day: "Fri", v: 55 },
  { day: "Sat", v: 68 },
  { day: "Sun", v: 92 },
];


const REWARDS = [
  { id: "dessert", emoji: "🍦", name: "Free Dessert", cost: 100 },
  { id: "merch", emoji: "👕", name: "Mess Merch", cost: 500 },
  { id: "free", emoji: "🎟️", name: "1 Day Mess Free", cost: 1000 },
];

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
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

function Index() {
  const [points, setPoints] = useState(1250);
  const [modal, setModal] = useState<null | "book" | "plate">(null);
  const [verified, setVerified] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const isAuthed = !!session;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isAuthed && sessionStorage.getItem("ecomess_just_logged_in") === "1") {
      sessionStorage.removeItem("ecomess_just_logged_in");
      setShowSync(true);
    }
  }, [isAuthed]);

  const [rows, setRows] = useState<
    { id: string; full_name: string; branch: string | null; eco_points: number }[]
  >([]);

  useEffect(() => {
    if (!isAuthed) {
      setRows([]);
      return;
    }
    let active = true;
    supabase
      .rpc("get_leaderboard")
      .then(({ data }) => {
        if (active && data) setRows(data as typeof rows);
      });
    return () => {
      active = false;
    };
  }, [isAuthed]);


  const notify = (msg: string) => toast(msg, { duration: 3000 });

  const add = (n: number, msg: string) => {
    setPoints((p) => p + n);
    notify(msg);
  };

  const redeem = (r: (typeof REWARDS)[number]) => {
    if (points < r.cost) return;
    setPoints((p) => p - r.cost);
    notify(`Redeemed • ${r.name}`);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const leaders = [
    { name: "Yash Kadam", sub: "You • Hostel B", pts: points, you: true, medal: "🥇" },
    { name: "Aarav Sharma", sub: "Hostel B", pts: 1180, you: false, medal: "🥈" },
    { name: "Priya Mehta", sub: "Hostel B", pts: 1050, you: false, medal: "🥉" },
  ];

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
              Y
            </span>
            <div className="leading-tight">
              <h1 className="text-[15px] font-semibold tracking-tight">Eco-Mess</h1>
              <p className="text-[12px] text-muted-foreground">Food waste, gamified</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading ? null : isAuthed ? (
              <>
                <span className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium shadow-sm sm:inline">
                  🔥 12 Day Streak
                </span>
                <span className="hidden text-right leading-tight sm:block">
                  <span className="block text-[13.5px] font-semibold tracking-tight">
                    Yash Kadam • ECS 2nd Year
                  </span>
                  <span className="block text-[11.5px] text-muted-foreground">
                    Day Scholar • Roll No. 33 • Veg
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
              <span className="rounded-full bg-[#D9F99D] px-3.5 py-1.5 text-[12px] font-semibold text-[#111111]">
                Level 5 • Green Guardian
              </span>
              <span className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#111111]">
                2x Bonus Today
              </span>
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between text-[12px] text-white/60">
                <span>Progress to Planet Hero</span>
                <span>75%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/12">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
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
                  <p className="text-2xl font-bold tracking-tight">8.2kg</p>
                  <p className="text-[12px] text-[#111111]/60">Food Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">12.5kg</p>
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

                {WEEK.map((d, i) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${d.v}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full rounded-full ${i === WEEK.length - 1 ? "bg-[#111111]" : "bg-zinc-200"}`}
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
                      if (a.id === "book") setModal("book");
                      else if (a.id === "plate") {
                        setVerified(false);
                        setModal("plate");
                      } else add(25, "+25 pts • Meal Donated");
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
              <span className="text-[12px] text-muted-foreground">This Week</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {leaders.map((l) => (
                <li
                  key={l.name}
                  className={`flex items-center gap-3 rounded-[20px] px-4 py-3 ${
                    l.you ? "bg-[#111111] text-white" : "border border-zinc-200 bg-white"
                  }`}
                >
                  <span className="text-[18px]">{l.medal}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{l.name}</p>
                    <p className={`text-[11.5px] ${l.you ? "text-white/60" : "text-muted-foreground"}`}>
                      {l.sub}
                    </p>
                  </div>
                  <span className="text-[13.5px] font-semibold tabular-nums">
                    {l.pts.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="soft-card p-6 lg:col-span-2">
            <h2 className="text-[16px] font-semibold tracking-tight">Rewards Store 🎁</h2>
            <ul className="mt-5 space-y-2.5">
              {REWARDS.map((r) => {
                const ok = points >= r.cost;
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
                      onClick={() => redeem(r)}
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
              add(10, "+10 pts • Lunch Booked");
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
                add(15, "+15 pts • Clean Plate");
              }}
              className="mt-4 w-full rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Collect +15 pts
            </button>
          </div>
        )}
      </Modal>

      <ConnectSyncOverlay open={showSync} points={points} onClose={() => setShowSync(false)} />

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
