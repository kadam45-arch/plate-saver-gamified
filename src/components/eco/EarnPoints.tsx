import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { EARN_ACTIONS, type EarnAction } from "./data";

export function EarnPoints({ onEarn }: { onEarn: (action: EarnAction) => void }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">How to Earn Points</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Tap an action after you complete it in the mess.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {EARN_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            type="button"
            onClick={() => onEarn(action)}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.985 }}
            className="glass-card group overflow-hidden p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative h-40 overflow-hidden rounded-t-[23px]">
              <img
                src={action.image}
                alt={action.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
              <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-md">
                +{action.points} pts
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-[15px] font-semibold tracking-tight">{action.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {action.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border bg-white/4 px-3 py-1.5 text-[12px] font-medium transition-colors group-hover:border-primary/40 group-hover:text-primary">
                <Plus className="size-3.5" /> Log action
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
