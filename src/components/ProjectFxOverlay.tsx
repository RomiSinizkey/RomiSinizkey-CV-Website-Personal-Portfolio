import { AnimatePresence, motion } from "framer-motion";

export type FxKey = "sod" | "chat" | "gta" | null;

type Props = { fx: FxKey };

export default function ProjectFxOverlay({ fx }: Props) {
  return (
    <AnimatePresence mode="wait">
      {fx && (
        <motion.div
          key={fx}
          className="fixed inset-0 z-[8000] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {/* base fade */}
          <div className="absolute inset-0 bg-black/0" />

          {fx === "sod" ? (
            <>
              {/* SOD — dashboard vibe (orange/purple) */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(circle at 18% 20%, rgba(234,88,12,0.26), transparent 55%)," +
                    "radial-gradient(circle at 82% 28%, rgba(139,92,246,0.20), transparent 60%)," +
                    "radial-gradient(circle at 60% 86%, rgba(0,0,0,0.12), transparent 55%)",
                }}
              />

              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 2.8, ease: "linear", repeat: Infinity }}
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(234,88,12,0.12), rgba(139,92,246,0.10), rgba(255,255,255,0))",
                  backgroundSize: "220% 220%",
                  opacity: 0.8,
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  opacity: 0.08,
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, rgba(255,255,255,0) 3px, rgba(255,255,255,0) 6px)",
                }}
              />
            </>
          ) : fx === "chat" ? (
            <>
              {/* CHAT — chat vibe (blue/green) */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(circle at 22% 30%, rgba(14,165,233,0.24), transparent 60%)," +
                    "radial-gradient(circle at 78% 36%, rgba(34,197,94,0.18), transparent 60%)," +
                    "radial-gradient(circle at 60% 86%, rgba(0,0,0,0.12), transparent 55%)",
                }}
              />

              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(14,165,233,0.12), rgba(34,197,94,0.10), rgba(255,255,255,0))",
                  backgroundSize: "240% 240%",
                  opacity: 0.82,
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  opacity: 0.07,
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, rgba(255,255,255,0) 3px, rgba(255,255,255,0) 6px)",
                }}
              />
            </>
          ) : (
            <>
              {/* GTA — neon night / city vibe (pink/purple/blue) */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(circle at 18% 22%, rgba(236,72,153,0.22), transparent 58%)," +
                    "radial-gradient(circle at 82% 28%, rgba(99,102,241,0.22), transparent 60%)," +
                    "radial-gradient(circle at 62% 86%, rgba(14,165,233,0.16), transparent 58%)," +
                    "radial-gradient(circle at 50% 95%, rgba(0,0,0,0.12), transparent 55%)",
                }}
              />

              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(236,72,153,0.12), rgba(99,102,241,0.12), rgba(14,165,233,0.06), rgba(255,255,255,0))",
                  backgroundSize: "240% 240%",
                  opacity: 0.85,
                }}
              />

              {/* light scanlines */}
              <div
                className="absolute inset-0"
                style={{
                  opacity: 0.06,
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, rgba(255,255,255,0) 3px, rgba(255,255,255,0) 7px)",
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
