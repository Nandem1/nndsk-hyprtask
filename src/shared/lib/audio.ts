let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedContext || sharedContext.state === "closed") {
    sharedContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
  }
  return sharedContext;
}

export function playSuccessSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not available (SSR, no audio hardware, etc.)
  }
}

export function closeAudioContext(): void {
  if (sharedContext) {
    sharedContext.close();
    sharedContext = null;
  }
}
