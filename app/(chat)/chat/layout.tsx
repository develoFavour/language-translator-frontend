"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { ChevronLeft, Plus, LogOut, Home, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, type ApiConversation } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { user, logout } = useAuth();
	const [conversations, setConversations] = useState<
		Array<{ id: string; title: string; date: string }>
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await api.chat.getConversations();
				const sorted = [...(res.conversations || [])].sort(
					(a: ApiConversation, b: ApiConversation) => {
						const tb = new Date(
							((b.updatedAt ||
								b.updated_at ||
								b.createdAt ||
								b.created_at) as string) || ""
						).getTime();
						const ta = new Date(
							((a.updatedAt ||
								a.updated_at ||
								a.createdAt ||
								a.created_at) as string) || ""
						).getTime();
						return tb - ta;
					}
				);
				const items: Array<{ id: string; title: string; date: string }> =
					sorted.map((c: ApiConversation, idx) => ({
						id: (c.id ?? c._id ?? `${Date.now()}_${idx}`) as string,
						title: c.title || "Untitled",
						date: new Date(
							((c.updatedAt ||
								c.updated_at ||
								c.createdAt ||
								c.created_at) as string) || Date.now()
						).toLocaleString(),
					}));
				if (mounted) setConversations(items);
			} catch (e) {
				if (mounted) setError("Failed to load conversations");
			} finally {
				if (mounted) setLoading(false);
			}
		};
		load();
		return () => {
			mounted = false;
		};
	}, []);

	const handleNavigation = (id: string) => {
		router.push(`/chat?id=${encodeURIComponent(id)}`);
		if (isMobile) setSidebarOpen(false);
	};

	return (
		<div className="flex h-screen bg-black">
			{sidebarOpen && isMobile && (
				<div
					className="fixed inset-0 bg-black/50 z-40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`${
					sidebarOpen ? "w-64" : "w-0"
				} fixed md:relative md:w-64 h-screen transition-all duration-300 ease-in-out bg-black border-r border-slate-800 flex flex-col overflow-hidden z-50`}
			>
				<div className="p-4 border-b border-slate-800">
					<button
						onClick={() => {
							router.push(`/chat`);
							if (isMobile) setSidebarOpen(false);
						}}
						className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black font-medium transition-all duration-200 hover:shadow-lg text-sm md:text-base"
					>
						<Plus size={18} />
						New Chat
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-3 space-y-2">
					<div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-3">
						Recent Conversations
					</div>
					{loading && (
						<div className="px-3 py-2 text-sm text-slate-500">Loading…</div>
					)}
					{error && !loading && (
						<div className="px-3 py-2 text-sm text-red-400">{error}</div>
					)}
					{!loading && !error && conversations.length === 0 && (
						<div className="px-3 py-2 text-sm text-slate-500">
							No conversations yet
						</div>
					)}
					{!loading &&
						!error &&
						conversations.map((conv) => (
							<button
								key={conv.id}
								onClick={() => handleNavigation(conv.id)}
								className="w-full text-left p-3 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 group"
							>
								<p className="text-sm text-slate-200 group-hover:text-white transition-colors truncate">
									{conv.title}
								</p>
								<p className="text-xs text-slate-500 mt-1">{conv.date}</p>
							</button>
						))}
				</div>

				<div className="border-t border-slate-800 p-4 space-y-2">
					<div className="px-3 py-2 rounded-lg bg-slate-800/30">
						<p className="text-sm font-medium text-slate-200">{user?.name}</p>
						<p className="text-xs text-slate-500">{user?.email}</p>
					</div>
					<button
						onClick={logout}
						className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 text-sm"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col w-full">
				{/* Header */}
				<div className="border-b border-slate-800 bg-black px-4 md:px-6 py-4 flex items-center justify-between gap-2">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
					>
						{isMobile ? (
							<Menu size={20} className="text-slate-400" />
						) : (
							<ChevronLeft
								size={20}
								className={`text-slate-400 transition-transform duration-300 ${
									!sidebarOpen ? "rotate-180" : ""
								}`}
							/>
						)}
					</button>
					<h1 className="text-lg md:text-xl font-semibold text-white flex-1 text-center">
						LinguaBridge AI
					</h1>
					<Link
						href="/"
						className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-200"
					>
						<Home size={20} />
					</Link>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-hidden">{children}</div>
			</div>
		</div>
	);
}
