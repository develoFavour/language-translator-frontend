import { getAudioContext } from "./audio-unlock";

export async function playBlobViaWebAudio(blob: Blob): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.setAttribute("playsinline", "true");
    try {
      await audio.play();
    } finally {
      URL.revokeObjectURL(url);
    }
    return;
  }
  const buf = await blob.arrayBuffer();
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch {}
  }
  const audioBuffer = await ctx.decodeAudioData(buf.slice(0));
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  await new Promise<void>((resolve, reject) => {
    source.onended = () => resolve();
    try {
      source.start(0);
    } catch (e) {
      reject(e);
    }
  });
}
