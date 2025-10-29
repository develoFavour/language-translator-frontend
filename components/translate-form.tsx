"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { api, APIError } from "@/lib/api-client";
import type { Translation } from "@/app/page";
import { LANGUAGE_CODES } from "@/lib/translation-service";
import { LanguageSelector } from "./language-selector";
import { SourceTextarea } from "./source-textarea";
import { TargetDisplay } from "./target-display";
import { playYoruba } from "@/lib/yoruba-tts";
import { ensureAudioUnlocked } from "@/lib/audio-unlock";

interface TranslateFormProps {
	onTranslate: (translation: Translation) => void;
	onRequestFeedback: (translation: Translation) => void;
	canRate?: boolean;
}

const LANGUAGES = Object.entries(LANGUAGE_CODES).map(([code, info]) => ({
	code,
	name: info.name,
	flag: info.flag,
	native: info.native,
}));

export function TranslateForm({
	onTranslate,
	onRequestFeedback,
	canRate = true,
}: TranslateFormProps) {
	const [sourceText, setSourceText] = useState("");
	const [translatedText, setTranslatedText] = useState("");
	const [sourceLang, setSourceLang] = useState("en");
	const [targetLang, setTargetLang] = useState("yo");
	const [isTranslating, setIsTranslating] = useState(false);
	const [currentTranslation, setCurrentTranslation] =
		useState<Translation | null>(null);
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [speaking, setSpeaking] = useState(false);

	const mapToBcp47 = (lang: string) => {
		const map: Record<string, string> = {
			yo: "yo-NG",
			ig: "ig-NG",
			ha: "ha-NG",
			en: "en-NG",
			fr: "fr-FR",
			es: "es-ES",
			sw: "sw-TZ",
			zu: "zu-ZA",
		};
		return map[lang] || lang;
	};

	const isTtsEnabled = (langCode: string) => {
		const disabled = new Set(["ig", "ar", "sw", "ha"]);
		return !disabled.has(langCode.toLowerCase());
	};

	useEffect(() => {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
		const synth = window.speechSynthesis;
		const load = () => {
			const list = synth.getVoices();
			if (list && list.length) setVoices(list);
		};
		load();
		const handler = () => load();
		synth.addEventListener("voiceschanged", handler);
		return () => synth.removeEventListener("voiceschanged", handler);
	}, []);

	const selectVoiceForLang = (list: SpeechSynthesisVoice[], bcp: string) => {
		if (!list || !list.length) return undefined;
		let v = list.find((x) => x.lang?.toLowerCase() === bcp.toLowerCase());
		if (v) return v;
		const base = bcp.split("-")[0];
		v = list.find((x) => x.lang?.toLowerCase().startsWith(base.toLowerCase()));
		if (v) return v;
		const regionals = ["en-NG", "en-ZA", "en-GB"];
		v = list.find((x) => regionals.includes(x.lang));
		if (v) return v;
		v = list.find((x) => x.lang?.toLowerCase().startsWith("en"));
		return v;
	};

	const handleTranslate = async () => {
		if (!sourceText.trim()) return;
		setIsTranslating(true);
		setError(null);
		try {
			const response = await api.translations.translate(
				sourceText,
				sourceLang,
				targetLang
			);
			const translation: Translation = {
				id: response.translation.id,
				sourceText: response.translation.sourceText,
				translatedText: response.translation.translatedText,
				sourceLang: response.translation.sourceLang,
				targetLang: response.translation.targetLang,
				timestamp: new Date(response.translation.createdAt),
				createdAt: new Date(response.translation.createdAt),
			};
			setTranslatedText(translation.translatedText);
			setCurrentTranslation(translation);
			onTranslate(translation);
		} catch (err) {
			console.error("Translation error:", err);
			if (err instanceof APIError) {
				setError(err.message);
			} else {
				setError("Failed to translate. Please try again.");
			}
		} finally {
			setIsTranslating(false);
		}
	};

	const handleSpeak = async (text: string, lang: string) => {
		if (!text) return;
		setSpeaking(true);
		const bcp = mapToBcp47(lang);
		const base = bcp.toLowerCase().split("-")[0];
		try {
			// Unlock audio on mobile within the user gesture before any awaits
			await ensureAudioUnlocked();
			// Client-side Yoruba TTS using Xenova
			if (base === "yo") {
				try {
					await playYoruba(text);
					return;
				} catch (e) {
					console.warn(
						"Client Yoruba TTS failed, falling back to backend TTS:",
						e
					);
				}
			}
			try {
				const blob = await api.tts.speak(text, bcp);
				const url = URL.createObjectURL(blob);
				const audio = new Audio(url);
				// Ensure inline playback on mobile
				audio.setAttribute("playsinline", "true");
				try {
					await audio.play();
					return;
				} catch (playErr) {
					// If mobile blocks playback after async work, fall back below
					console.warn(
						"HTMLAudioElement.play() was blocked, falling back to browser TTS:",
						playErr
					);
				} finally {
					URL.revokeObjectURL(url);
				}
			} catch (e) {
				console.warn(
					"Backend TTS fetch failed, falling back to browser TTS:",
					e
				);
			}
			if ("speechSynthesis" in window) {
				const synth = window.speechSynthesis;
				const voice = selectVoiceForLang(voices, bcp);
				const utterance = new SpeechSynthesisUtterance(text);
				utterance.lang = bcp;
				if (voice) utterance.voice = voice;
				utterance.rate = 0.95;
				utterance.pitch = 1.0;
				synth.cancel();
				synth.speak(utterance);
			}
		} finally {
			setSpeaking(false);
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(translatedText);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const swapLanguages = () => {
		setSourceLang(targetLang);
		setTargetLang(sourceLang);
		setSourceText(translatedText);
		setTranslatedText(sourceText);
	};

	return (
		<div className="space-y-6">
			{error && (
				<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
					<AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
					<div>
						<p className="font-medium text-destructive">Translation Error</p>
						<p className="text-sm text-destructive/80 mt-1">{error}</p>
					</div>
				</div>
			)}

			<div className="flex items-center gap-4">
				<LanguageSelector
					value={sourceLang}
					onValueChange={setSourceLang}
					languages={LANGUAGES}
				/>
				<Button
					variant="outline"
					size="icon"
					onClick={swapLanguages}
					className="shrink-0 bg-transparent hover:bg-primary/10 hover:border-primary transition-all hover:rotate-180 duration-300"
				>
					<ArrowLeftRight className="h-4 w-4" />
				</Button>
				<LanguageSelector
					value={targetLang}
					onValueChange={setTargetLang}
					languages={LANGUAGES}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<SourceTextarea
					sourceLang={sourceLang}
					sourceText={sourceText}
					onTextChange={setSourceText}
					onSpeak={handleSpeak}
					speaking={speaking}
					languages={LANGUAGES}
					ttsEnabled={isTtsEnabled(sourceLang)}
				/>
				<TargetDisplay
					targetLang={targetLang}
					translatedText={translatedText}
					currentTranslation={currentTranslation}
					copied={copied}
					onSpeak={handleSpeak}
					onCopy={handleCopy}
					onRequestFeedback={onRequestFeedback}
					speaking={speaking}
					languages={LANGUAGES}
					canRate={canRate}
					ttsEnabled={isTtsEnabled(targetLang)}
				/>
			</div>

			<Button
				onClick={handleTranslate}
				disabled={!sourceText.trim() || isTranslating}
				size="lg"
				className="w-full border border-white cursor-pointer text-lg  h-14 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isTranslating ? (
					<>
						<Loader2 className="h-5 w-5 mr-2 animate-spin" />
						Translating...
					</>
				) : (
					<>
						<Sparkles className="h-5 w-5 mr-2" />
						Translate
					</>
				)}
			</Button>
		</div>
	);
}
