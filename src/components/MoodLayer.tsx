import { AnimatePresence, motion } from "framer-motion";

export type MoodKey = "sod" | "chat" | null;

type Props = { mood: MoodKey };

export default function MoodLayer({ mood }: Props) {
  return (
    <AnimatePresence>
      {mood && (
        <motion.div
          className="fixed inset-0 z-[50] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {mood === "sod" ? (
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 22% 18%, rgba(234,88,12,0.22), transparent 55%)",
              }}
            />
          ) : (
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 25% 30%, rgba(14,165,233,0.20), transparent 60%)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
