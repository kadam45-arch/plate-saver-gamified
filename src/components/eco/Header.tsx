import { motion } from "motion/react";
import { Leaf, Bell, Search } from "lucide-react";
import { USER } from "./data";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <Leaf className="size-4.5" />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight">Eco-Mess</p>
            <p className="text-[11px] text-muted-foreground">Campus food waste intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
          >
            <Search className="size-4" />
          </button>
          <button
            aria-label="Notifications"
            className="relative size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground flex"
          >
            <Bell className="size-4" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" />
          </button>
          <div className="ml-1 flex items-center gap-3 rounded-2xl border border-border bg-surface/60 py-1.5 pl-1.5 pr-3.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-azure/70 text-[12px] font-semibold text-primary-foreground">
              {USER.initials}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-[13px] font-medium">{USER.name}</p>
              <p className="text-[11px] text-muted-foreground">{USER.branch}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
