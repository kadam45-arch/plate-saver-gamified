import { motion, AnimatePresence } from "motion/react";

function Plate({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative flex size-16 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">
      <div className="size-9 rounded-full border border-zinc-100 bg-[#F6F5F2]" />
      <span
        className={`absolute top-1/2 -translate-y-1/2 text-[26px] leading-none ${
          flip ? "right-full mr-1 -scale-x-100" : "left-full ml-1"
        }`}
        aria-hidden
      >
        🥄
      </span>
    </div>
  );
}

export function FoodMatchLoader({ open }: { open: boolean }) {
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
            className="w-full max-w-md rounded-[26px] border border-zinc-200 bg-white p-8 shadow-xl"
          >
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={{ x: [-34, 6, -34], rotate: [-6, 0, -6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Plate />
              </motion.div>
              <motion.div
                animate={{ x: [34, -6, 34], rotate: [6, 0, 6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Plate flip />
              </motion.div>
            </div>

            <p className="mt-7 text-center text-[14.5px] font-semibold tracking-tight text-[#111111]">
              Finding your perfect food match…
            </p>
            <div className="mx-auto mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full rounded-full bg-[#D9F99D]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
