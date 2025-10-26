const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
// const API_BASE_URL = "http://localhost:8080/api/v1";

class APIError extends Error {
	constructor(message: string, public status: number) {
		super(message);
		this.name = "APIError";
	}
}

// Chat API types
export interface ApiMessage {
	id?: string;
	_id?: string;
	role: "user" | "assistant";
	content: string;
	language?: string;
	createdAt?: string;
	created_at?: string;
}

export interface ApiConversation {
	id?: string;
	_id?: string;
	title?: string;
	messages?: ApiMessage[];
	createdAt?: string;
	created_at?: string;
	updatedAt?: string;
	updated_at?: string;
}

export type GetConversationResponse =
	| { conversation: ApiConversation }
	| ApiConversation;

export interface ChatSendMessageResponse {
	message: { content: string };
	conversation?: ApiConversation;
}

// Optional convenience aliases used by api.chat methods
export type ChatGetConversationResponse = GetConversationResponse;
export type ChatGetConversationsResponse =
	| { conversations: ApiConversation[] }
	| ApiConversation[];

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
	const token = localStorage.getItem("token");

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string> | undefined),
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new APIError(data.error || "An error occurred", response.status);
	}

	return data;
}

export const api = {
	// Auth endpoints
	auth: {
		signup: async (name: string, email: string, password: string) => {
			const data = await fetchAPI("/auth/signup", {
				method: "POST",
				body: JSON.stringify({ name, email, password }),
			});
			localStorage.setItem("token", data.token);
			return data;
		},

		login: async (email: string, password: string) => {
			const data = await fetchAPI("/auth/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			localStorage.setItem("token", data.token);
			return data;
		},

		logout: () => {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		},
	},

	// Translation endpoints
	translations: {
		translate: async (
			sourceText: string,
			sourceLang: string,
			targetLang: string
		) => {
			return fetchAPI("/translate", {
				method: "POST",
				body: JSON.stringify({ sourceText, sourceLang, targetLang }),
			});
		},

		getHistory: async () => {
			return fetchAPI("/translations");
		},
	},

	// Feedback endpoints
	feedback: {
		submit: async (
			translationId: string,
			rating: number,
			suggestedText?: string
		) => {
			return fetchAPI("/feedback", {
				method: "POST",
				body: JSON.stringify({ translationId, rating, suggestedText }),
			});
		},

		getForTranslation: async (translationId: string) => {
			return fetchAPI(`/feedback/${translationId}`);
		},
	},

	chat: {
		sendMessage: async (
			message: string,
			conversationId?: string,
			language = "en"
		): Promise<ChatSendMessageResponse> => {
			return fetchAPI("/chat", {
				method: "POST",
				body: JSON.stringify({
					message,
					conversationId: conversationId || "",
					language,
				}),
			});
		},

		getConversations: async (): Promise<{
			conversations: ApiConversation[];
		}> => {
			return fetchAPI("/conversations");
		},

		getConversation: async (
			conversationId: string
		): Promise<{ conversation: ApiConversation }> => {
			return fetchAPI(`/conversations/${conversationId}`);
		},
	},

	// Text-to-Speech endpoint (returns binary audio)
	tts: {
		speak: async (text: string, lang: string): Promise<Blob> => {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API_BASE_URL}/tts`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify({ text, lang }),
			});
			if (!res.ok) {
				let message = "TTS request failed";
				try {
					const err = await res.json();
					message = err.error || message;
				} catch {
					// ignore JSON parse error for non-JSON responses
				}
				throw new APIError(message, res.status);
			}
			return await res.blob();
		},
	},

	admin: {
		getStats: async () => {
			return fetchAPI("/admin/stats");
		},

		getAllFeedbacks: async () => {
			return fetchAPI("/admin/feedbacks");
		},

		getAllUsers: async () => {
			return fetchAPI("/admin/users");
		},
	},
};

export { APIError };
