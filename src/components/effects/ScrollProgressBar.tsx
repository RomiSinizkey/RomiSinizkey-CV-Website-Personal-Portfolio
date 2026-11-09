import { useEffect, useState } from "react";

function getScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollHeight <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, scrollTop / scrollHeight));
}

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      setProgress(getScrollProgress());
    };

    const onScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="scrollProgressRoot" aria-hidden="true">
      <div className="scrollProgressTrack" />
      <div className="scrollProgressFill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}