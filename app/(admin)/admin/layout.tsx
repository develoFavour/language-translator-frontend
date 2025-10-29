"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
	ChevronLeft,
	BarChart3,
	Users,
	MessageSquare,
	Settings,
	LogOut,
	Menu,
	HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { user, logout, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (isLoading) return;
		if (!user || user.role !== "admin") {
			router.replace("/");
		}
	}, [user, isLoading, router]);

	const navItems = [
		{ label: "Dashboard", icon: BarChart3, href: "/admin" },
		{ label: "Users", icon: Users, href: "/admin/users" },
		{ label: "Feedbacks", icon: MessageSquare, href: "/admin/feedbacks" },
	];

	const handleNavigation = (href: string) => {
		router.push(href);
		if (isMobile) setSidebarOpen(false);
	};

	return (
		<div className="flex h-screen bg-black flex-col md:flex-row">
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
				} fixed md:relative md:w-64 h-screen transition-all duration-300 ease-in-out bg-gradient-to-b from-slate-900 to-black border-r border-slate-800 flex flex-col overflow-hidden z-50`}
			>
				{/* Logo */}
				<div className="p-6 border-b border-slate-800">
					<h2 className="text-xl font-bold text-white">Admin Panel</h2>
					<p className="text-xs text-slate-500 mt-1">Campuslingo</p>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4 space-y-2">
					{navItems.map((item) => (
						<button
							key={item.href}
							onClick={() => handleNavigation(item.href)}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
						>
							<item.icon
								size={18}
								className="group-hover:text-cyan-500 transition-colors"
							/>
							<span className="text-sm font-medium">{item.label}</span>
						</button>
					))}
				</nav>

				{/* User Section */}
				<div className="border-t border-slate-800 p-4 space-y-2">
					<div className="px-3 py-2 rounded-lg bg-slate-800/30">
						<p className="text-sm font-medium text-slate-200">{user?.name}</p>
						<p className="text-xs text-slate-500">{user?.email}</p>
						<p className="text-xs text-cyan-500 font-semibold mt-1">Admin</p>
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
				<div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-black/50 backdrop-blur-sm px-4 md:px-6 py-4 flex items-center justify-between gap-2">
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
					<h1 className="text-base md:text-lg font-semibold text-white flex-1 text-center">
						Analytics Dashboard
					</h1>
					<Link
						href="/"
						className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-200"
					>
						<HomeIcon size={20} />
					</Link>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-auto">{children}</div>
			</div>
		</div>
	);
}
