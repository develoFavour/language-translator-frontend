"use client";

import type React from "react";

import { useState } from "react";
import {
	ChevronLeft,
	BarChart3,
	Users,
	MessageSquare,
	Settings,
	LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const { user, logout } = useAuth();

	const navItems = [
		{ label: "Dashboard", icon: BarChart3, href: "/admin" },
		{ label: "Users", icon: Users, href: "/admin/users" },
		{ label: "Feedbacks", icon: MessageSquare, href: "/admin/feedbacks" },
	];

	return (
		<div className="flex h-screen bg-black">
			{/* Sidebar */}
			<div
				className={`${
					sidebarOpen ? "w-64" : "w-0"
				} transition-all duration-300 ease-in-out bg-gradient-to-b from-slate-900 to-black border-r border-slate-800 flex flex-col overflow-hidden`}
			>
				{/* Logo */}
				<div className="p-6 border-b border-slate-800">
					<h2 className="text-xl font-bold text-white">Admin Panel</h2>
					<p className="text-xs text-slate-500 mt-1">LinguaBridge</p>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4 space-y-2">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
						>
							<item.icon
								size={18}
								className="group-hover:text-cyan-500 transition-colors"
							/>
							<span className="text-sm font-medium">{item.label}</span>
						</Link>
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
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-black/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
					>
						<ChevronLeft
							size={20}
							className={`text-slate-400 transition-transform duration-300 ${
								!sidebarOpen ? "rotate-180" : ""
							}`}
						/>
					</button>
					<h1 className="text-lg font-semibold text-white">
						Analytics Dashboard
					</h1>
					<Link
						href="/"
						className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-200"
					>
						<Settings size={20} />
					</Link>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-auto">{children}</div>
			</div>
		</div>
	);
}
