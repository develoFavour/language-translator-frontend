// Utility to unlock audio playback on mobile browsers (iOS/Android)
// Call ensureAudioUnlocked() in a direct user gesture before any async work.

let unlocked = false;
let unlocking = false;
let sharedCtx: AudioContext | null = null;

type WindowWithWebkitAC = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

export async function ensureAudioUnlocked(): Promise<void> {
  if (typeof window === "undefined") return;
  if (unlocked || unlocking) return;
  unlocking = true;
  try {
    const win = window as WindowWithWebkitAC;
    const AC: typeof AudioContext | undefined = win.AudioContext || win.webkitAudioContext;
    if (AC) {
      if (!sharedCtx) sharedCtx = new AC();
      if (sharedCtx.state === "suspended") {
        try { await sharedCtx.resume(); } catch { /* noop */ }
      }
      try {
        const buffer = sharedCtx.createBuffer(1, 1, 22050);
        const source = sharedCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(sharedCtx.destination);
        source.start(0);
      } catch { /* noop */ }
    }
    try {
      const a = new Audio();
      a.setAttribute("playsinline", "true");
      a.muted = true;
      a.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAAAB3AQACABAAZGF0YQAAAAA=";
      await a.play().catch(() => { /* ignore */ });
      a.pause();
      a.removeAttribute("src");
      a.load();
    } catch { /* noop */ }
    unlocked = true;
  } finally {
    unlocking = false;
  }
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const win = window as WindowWithWebkitAC;
  const AC: typeof AudioContext | undefined = win.AudioContext || win.webkitAudioContext;
  if (!AC) return null;
  if (!sharedCtx) sharedCtx = new AC();
  return sharedCtx;
}
