import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/eco/Header";
import { HeroStats } from "@/components/eco/HeroStats";
import { EarnPoints } from "@/components/eco/EarnPoints";
import { Leaderboard } from "@/components/eco/Leaderboard";
import { Rewards } from "@/components/eco/Rewards";
import { WeeklyChart } from "@/components/eco/WeeklyChart";
import { INITIAL_STATS } from "@/components/eco/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eco-Mess — Gamified College Mess Food Waste Dashboard" },
      {
        name: "description",
        content:
          "Eco-Mess turns college mess food waste into a game: earn eco-points, level up, climb the leaderboard and redeem campus rewards.",
      },
      { property: "og:title", content: "Eco-Mess — Gamified Mess Food Waste Dashboard" },
      {
        property: "og:description",
        content:
          "Track eco-points, streaks, CO₂ avoided and weekly mess waste in one premium campus dashboard.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [stats, setStats] = useState(INITIAL_STATS);

  const handleEarn = (action: { title: string; points: number }) => {
    setStats((prev) => {
      const xpTotal = prev.xp + action.points;
      const levelUp = xpTotal >= prev.xpMax;
      return {
        ...prev,
        points: prev.points + action.points,
        xp: levelUp ? xpTotal - prev.xpMax : xpTotal,
        level: levelUp ? prev.level + 1 : prev.level,
        foodSavedKg: Number((prev.foodSavedKg + action.points / 100).toFixed(1)),
        co2AvoidedKg: Number((prev.co2AvoidedKg + action.points / 60).toFixed(1)),
      };
    });
    toast.success(`+${action.points} Eco-Points`, { description: action.title });
  };

  const handleRedeem = (reward: { name: string; cost: number }) => {
    setStats((prev) => ({ ...prev, points: prev.points - reward.cost }));
    toast.success("Reward redeemed", { description: `${reward.name} · -${reward.cost} pts` });
  };

  return (
    <div className="grid-backdrop min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-10 px-5 pb-20 pt-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Good evening, Yash.
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
            Your mess wasted 19.8 kg less food this week than last. Keep logging actions to hold
            your streak.
          </p>
        </div>

        <HeroStats {...stats} />
        <EarnPoints onEarn={handleEarn} />

        <div className="grid gap-4 lg:grid-cols-2">
          <Leaderboard userPoints={stats.points} />
          <Rewards points={stats.points} onRedeem={handleRedeem} />
        </div>

        <WeeklyChart />
      </main>
      <Toaster />
    </div>
  );
}
