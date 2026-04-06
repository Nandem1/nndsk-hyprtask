import { useState } from "react";

export function useFullscreenTimerState() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  return {
    soundEnabled,
    setSoundEnabled,
    showParticles,
    setShowParticles,
    showCelebration,
    setShowCelebration,
  };
}
