// Client-side Yoruba TTS using Xenova Transformers.js
// This module must only be imported on the client.

import { pipeline, env } from "@xenova/transformers";
import { playBlobViaWebAudio } from "./audio-playback";

// Ensure models are fetched remotely from Hugging Face, not via local /models path
env.allowLocalModels = false;
env.useBrowserCache = true;

type TtsOutput = { audio: Float32Array; sampling_rate: number };
type TtsSynthesizer = (
    text: string,
    options?: unknown,
    ...rest: unknown[]
) => Promise<TtsOutput>;

let synthesizerPromise: Promise<TtsSynthesizer> | null = null;

function getSynthesizer(): Promise<TtsSynthesizer> {
    if (!synthesizerPromise) {
        synthesizerPromise = (pipeline(
            "text-to-speech",
            "Xenova/mms-tts-yor",
            { quantized: false }
        ) as unknown) as Promise<TtsSynthesizer>;
    }
    return synthesizerPromise;
}

// Convert Float32 PCM [-1,1] to 16-bit WAV Blob (mono)
function floatToWavBlob(float32: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + float32.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++)
            view.setUint8(offset + i, str.charCodeAt(i));
    };

    const pcm16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    const channels = 1;
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;

    writeString(0, "RIFF");
    view.setUint32(4, 36 + pcm16.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, "data");
    view.setUint32(40, pcm16.length * 2, true);

    let offset = 44;
    for (let i = 0; i < pcm16.length; i++, offset += 2) {
        view.setInt16(offset, pcm16[i], true);
    }

    return new Blob([view], { type: "audio/wav" });
}

export async function synthesizeYorubaToBlob(text: string): Promise<Blob> {
    if (typeof window === "undefined")
        throw new Error("yoruba-tts must run on client");
    const synth = await getSynthesizer();
    const output = await synth(text); 
    return floatToWavBlob(output.audio, output.sampling_rate);
}

export async function playYoruba(text: string): Promise<void> {
    const blob = await synthesizeYorubaToBlob(text);
    await playBlobViaWebAudio(blob);
}
