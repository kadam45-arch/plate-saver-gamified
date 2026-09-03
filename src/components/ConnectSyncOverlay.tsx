import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Database, UtensilsCrossed } from "lucide-react";

export function ConnectSyncOverlay({
  open,
  points,
  onClose,
}: {
  open: boolean;
  points: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-5 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-[26px] border border-zinc-200 bg-white p-7 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="flex size-14 items-center justify-center rounded-2xl bg-[#F6F5F2] text-[#111111]"
              >
                <UtensilsCrossed className="size-6" />
              </motion.span>

              <div className="relative mx-1 flex flex-1 items-center justify-between">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.15, scale: 0.7 }}
                    animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.15, 0.7] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
                    className="relative size-2 rounded-full bg-[#10b981] shadow-[0_0_10px_2px_rgba(16,185,129,0.55)]"
                  />
                ))}
              </div>

              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(16,185,129,0.35)",
                    "0 0 0 12px rgba(16,185,129,0)",
                  ],
                }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="flex size-14 items-center justify-center rounded-2xl bg-[#10b981]/10 text-[#10b981]"
              >
                <Database className="size-6" />
              </motion.span>
            </div>

            <p className="mt-6 text-center text-[14.5px] font-semibold tracking-tight text-[#111111]">
              Eco-Mess Connected • {points.toLocaleString()} Points Synced
            </p>
            <div className="mx-auto mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full rounded-full bg-[#10b981]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
