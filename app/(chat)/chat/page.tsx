"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Mic, Copy, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api, type ApiConversation, type ApiMessage } from "@/lib/api-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	language: string;
	timestamp: Date;
}

interface Conversation {
	id: string;
	title: string;
	messages: Message[];
	createdAt: Date;
	updatedAt: Date;
}

export default function ChatPage() {
	const { user } = useAuth();
	const searchParams = useSearchParams();
	const convId = searchParams.get("id");
	const router = useRouter();
	const [currentConversation, setCurrentConversation] =
		useState<Conversation | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [isListening, setIsListening] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	type SpeechRecognitionType = {
		start: () => void;
		stop: () => void;
		continuous: boolean;
		interimResults: boolean;
		lang: string;
		onstart?: () => void;
		onend?: () => void;
		onresult?: (event: {
			results: ArrayLike<{ 0: { transcript: string } }>;
		}) => void;
	};
	const recognitionRef = useRef<SpeechRecognitionType | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const id = convId;
		if (!id) {
			setCurrentConversation(null);
			setMessages([]);
			return;
		}
		let mounted = true;
		(async () => {
			try {
				const res = await api.chat.getConversation(id);
				const raw: ApiConversation = res.conversation;
				const conv: Conversation = {
					id: (raw.id ?? raw._id ?? id) as string,
					title: raw.title || "Untitled",
					messages: (raw.messages || []).map<Message>((m: ApiMessage, idx) => ({
						id: (m.id ?? m._id ?? `${Date.now()}_${idx}`) as string,
						role: m.role,
						content: m.content,
						language: m.language || "en",
						timestamp: new Date(m.createdAt || m.created_at || Date.now()),
					})),
					createdAt: new Date(raw.createdAt || raw.created_at || Date.now()),
					updatedAt: new Date(
						raw.updatedAt || raw.updated_at || raw.createdAt || Date.now()
					),
				};
				if (mounted) {
					setCurrentConversation(conv);
					setMessages(conv.messages);
				}
			} catch (err) {
				console.debug("Failed to load conversation", id, err);
				if (mounted) {
					setCurrentConversation(null);
					setMessages([]);
				}
			}
		})();
		return () => {
			mounted = false;
		};
	}, [convId]);

	useEffect(() => {
		const anyWindow = window as unknown as {
			SpeechRecognition?: new () => unknown;
			webkitSpeechRecognition?: new () => unknown;
		};
		const SpeechRecognitionCtor =
			anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition;
		if (SpeechRecognitionCtor) {
			recognitionRef.current =
				new SpeechRecognitionCtor() as SpeechRecognitionType;
			recognitionRef.current.continuous = false;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.lang =
				selectedLanguage === "en" ? "en-US" : selectedLanguage;

			recognitionRef.current.onstart = () => setIsListening(true);
			recognitionRef.current.onend = () => setIsListening(false);
			recognitionRef.current.onresult = (event) => {
				const results = Array.from(
					event.results as ArrayLike<{ 0: { transcript: string } }>
				);
				const transcript = results
					.map((result) => result[0].transcript)
					.join("");
				setInput(transcript);
			};
		}
	}, [selectedLanguage]);

	const startListening = () => {
		if (recognitionRef.current) {
			recognitionRef.current.start();
		}
	};

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			language: selectedLanguage,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const response = await api.chat.sendMessage(
				input,
				currentConversation?.id,
				selectedLanguage
			);

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: response.message.content,
				language: selectedLanguage,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);

			if (!currentConversation && response.conversation) {
				const raw: ApiConversation = response.conversation;
				const conv: Conversation = {
					id: (raw.id ?? raw._id ?? Date.now().toString()) as string,
					title: raw.title || "Untitled",
					messages: (raw.messages || []).map<Message>((m: ApiMessage, idx) => ({
						id: (m.id ?? m._id ?? `${Date.now()}_${idx}`) as string,
						role: m.role,
						content: m.content,
						language: m.language || "en",
						timestamp: new Date(m.createdAt || m.created_at || Date.now()),
					})),
					createdAt: new Date(raw.createdAt || raw.created_at || Date.now()),
					updatedAt: new Date(
						raw.updatedAt || raw.updated_at || raw.createdAt || Date.now()
					),
				};
				setCurrentConversation(conv);
				const newId = raw.id || raw._id;
				if (newId) {
					router.replace(`/chat?id=${encodeURIComponent(newId)}`);
				}
			}
		} catch (error) {
			console.error("[v0] Error sending message:", error);
			const errorMessage: Message = {
				id: (Date.now() + 2).toString(),
				role: "assistant",
				content: "Sorry, I encountered an error. Please try again.",
				language: selectedLanguage,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	const copyMessage = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="flex flex-col h-full bg-black">
			<div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4">
				{messages.length === 0 && (
					<div className="flex items-center justify-center h-full">
						<div className="text-center px-4">
							<div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full border-2 border-slate-700 flex items-center justify-center">
								<span className="text-xl sm:text-2xl">💬</span>
							</div>
							<h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
								Start a Conversation
							</h2>
							<p className="text-sm sm:text-base text-slate-400">
								Type a message or use voice input to begin
							</p>
						</div>
					</div>
				)}

				{messages.map((message, index) => (
					<div
						key={message.id}
						className={`flex ${
							message.role === "user" ? "justify-end" : "justify-start"
						} animate-in fade-in slide-in-from-bottom-2 duration-300`}
						style={{ animationDelay: `${index * 50}ms` }}
					>
						<div
							className={`max-w-xs sm:max-w-sm md:max-w-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
								message.role === "user"
									? "bg-white text-black rounded-br-none"
									: "bg-slate-900 text-white rounded-bl-none border border-slate-700"
							}`}
						>
							{message.role === "assistant" ? (
								<div className="prose prose-sm prose-invert max-w-none">
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={{
											p: ({ node, ...props }) => (
												<p
													className="text-xs sm:text-sm leading-relaxed mb-2 text-white"
													{...props}
												/>
											),
											table: ({ node, ...props }) => (
												<table
													className="text-xs border-collapse border border-slate-600 my-2 overflow-x-auto"
													{...props}
												/>
											),
											th: ({ node, ...props }) => (
												<th
													className="border border-slate-600 px-2 py-1 bg-slate-800 font-semibold text-white"
													{...props}
												/>
											),
											td: ({ node, ...props }) => (
												<td
													className="border border-slate-600 px-2 py-1 text-white"
													{...props}
												/>
											),
											ul: ({ node, ...props }) => (
												<ul
													className="list-disc list-inside text-xs sm:text-sm mb-2 text-white"
													{...props}
												/>
											),
											ol: ({ node, ...props }) => (
												<ol
													className="list-decimal list-inside text-xs sm:text-sm mb-2 text-white"
													{...props}
												/>
											),
											li: ({ node, ...props }) => (
												<li
													className="text-xs sm:text-sm mb-1 text-white"
													{...props}
												/>
											),
											strong: ({ node, ...props }) => (
												<strong
													className="font-semibold text-white"
													{...props}
												/>
											),
											em: ({ node, ...props }) => (
												<em className="italic text-white" {...props} />
											),
											h1: ({ node, ...props }) => (
												<h1
													className="text-base sm:text-lg font-bold mb-2 text-white"
													{...props}
												/>
											),
											h2: ({ node, ...props }) => (
												<h2
													className="text-sm sm:text-base font-bold mb-2 text-white"
													{...props}
												/>
											),
											h3: ({ node, ...props }) => (
												<h3
													className="text-xs sm:text-sm font-bold mb-1 text-white"
													{...props}
												/>
											),
											code: ({ node, ...props }) => (
												<code
													className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-slate-200"
													{...props}
												/>
											),
										}}
									>
										{message.content}
									</ReactMarkdown>
								</div>
							) : (
								<p className="text-xs sm:text-sm leading-relaxed">
									{message.content}
								</p>
							)}

							{message.role === "assistant" && (
								<div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700">
									<button
										onClick={() => copyMessage(message.content)}
										className="p-1.5 hover:bg-slate-800 rounded transition-colors duration-200"
										title="Copy"
									>
										<Copy
											size={16}
											className="text-slate-400 hover:text-slate-200"
										/>
									</button>
								</div>
							)}
						</div>
					</div>
				))}

				{loading && (
					<div className="flex justify-start">
						<div className="bg-slate-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-700 flex items-center gap-2 text-sm">
							<Loader2 size={16} className="animate-spin text-slate-400" />
							<span>Thinking...</span>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className="border-t border-slate-800 bg-black p-3 sm:p-4 md:p-6">
				<div className="max-w-4xl mx-auto space-y-3">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<label className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">
							Response Language:
						</label>
						<select
							value={selectedLanguage}
							onChange={(e) => setSelectedLanguage(e.target.value)}
							className="px-3 py-1.5 rounded-lg bg-black border border-white text-white text-xs sm:text-sm focus:outline-none focus:border-slate-500 transition-colors duration-200"
						>
							<option value="en">English</option>
							<option value="yo">Yoruba</option>
							<option value="ig">Igbo</option>
							<option value="ha">Hausa</option>
						</select>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">
						<div className="flex-1 relative">
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage();
									}
								}}
								placeholder="Type your message or click the mic to speak..."
								className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-slate-500 focus:bg-slate-900 transition-all duration-200 resize-none"
								rows={3}
							/>
						</div>

						<div className="flex gap-2 w-full sm:w-auto">
							<button
								onClick={startListening}
								disabled={isListening || loading}
								className={`flex-1 sm:flex-none p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
									isListening
										? "bg-red-600 text-white"
										: "bg-slate-800 text-slate-300 hover:bg-slate-700"
								}`}
								title="Voice input"
							>
								<Mic size={18} className="mx-auto" />
							</button>

							<button
								onClick={handleSendMessage}
								disabled={!input.trim() || loading}
								className="flex-1 sm:flex-none p-2.5 sm:p-3 rounded-lg bg-white text-black hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
								title="Send message"
							>
								{loading ? (
									<Loader2 size={18} className="animate-spin mx-auto" />
								) : (
									<Send size={18} className="mx-auto" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
