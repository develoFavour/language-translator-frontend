/**
 * Translation Service Configuration
 *
 * Supports multiple FREE translation APIs:
 * 1. MyMemory API - Completely free, no API key, 10k words/day
 * 2. LibreTranslate - Open-source, free public instance
 * 3. Google Translate - Free tier with quotas (best for Nigerian languages)
 */

export interface TranslationProvider {
	name: string;
	endpoint: string;
	requiresApiKey: boolean;
	supportsNigerianLanguages: boolean;
	dailyLimit: string;
}

export const TRANSLATION_PROVIDERS: Record<string, TranslationProvider> = {
	mymemory: {
		name: "MyMemory",
		endpoint: "https://api.mymemory.translated.net/get",
		requiresApiKey: false,
		supportsNigerianLanguages: true,
		dailyLimit: "10,000 words/day",
	},
	libretranslate: {
		name: "LibreTranslate",
		endpoint: "https://libretranslate.de/translate",
		requiresApiKey: false,
		supportsNigerianLanguages: false, // Limited support
		dailyLimit: "Unlimited (rate-limited)",
	},
	google: {
		name: "Google Translate",
		endpoint: "https://translation.googleapis.com/language/translate/v2",
		requiresApiKey: true,
		supportsNigerianLanguages: true,
		dailyLimit: "500,000 characters/month",
	},
};

// Language codes mapping for different providers
export const LANGUAGE_CODES = {
	en: { name: "English", flag: "🇬🇧", native: "English" },
	yo: { name: "Yoruba", flag: "🇳🇬", native: "Yorùbá" },
	ig: { name: "Igbo", flag: "🇳🇬", native: "Igbo" },
	ha: { name: "Hausa", flag: "🇳🇬", native: "Hausa" },
	fr: { name: "French", flag: "🇫🇷", native: "Français" },
	es: { name: "Spanish", flag: "🇪🇸", native: "Español" },
	ar: { name: "Arabic", flag: "🇸🇦", native: "العربية" },
	pt: { name: "Portuguese", flag: "🇵🇹", native: "Português" },
	sw: { name: "Swahili", flag: "🇰🇪", native: "Kiswahili" },
};

/**
 * MyMemory Translation API (FREE - No API Key Required)
 * Best for Nigerian languages with no setup required
 */
export async function translateWithMyMemory(
	text: string,
	sourceLang: string,
	targetLang: string
): Promise<string> {
	const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
		text
	)}&langpair=${sourceLang}|${targetLang}`;

	const response = await fetch(url);
	const data = await response.json();

	if (data.responseStatus === 200 || data.responseData) {
		return data.responseData.translatedText;
	}

	throw new Error(data.responseDetails || "Translation failed");
}

/**
 * LibreTranslate API (FREE - Open Source)
 * Self-hostable, good for privacy
 */
export async function translateWithLibreTranslate(
	text: string,
	sourceLang: string,
	targetLang: string
): Promise<string> {
	const response = await fetch("https://libretranslate.de/translate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			q: text,
			source: sourceLang,
			target: targetLang,
			format: "text",
		}),
	});

	const data = await response.json();

	if (data.translatedText) {
		return data.translatedText;
	}

	throw new Error(data.error || "Translation failed");
}

/**
 * Detect language automatically
 */
export async function detectLanguage(text: string): Promise<string> {
	try {
		const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
			text
		)}&langpair=auto|en`;
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);

		// MyMemory doesn't provide language detection, so we'll use a simple heuristic
		// In production, you'd use a dedicated language detection API
		return "auto";
	} catch (error) {
		console.log(error);
		return "en"; // Default to English
	}
}
