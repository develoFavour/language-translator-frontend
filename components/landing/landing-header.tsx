"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function LandingHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ label: "Features", href: "#features" },
		// { label: "Pricing", href: "#pricing" },
		{ label: "Testimonials", href: "#testimonials" },
		{ label: "FAQ", href: "#faq" },
	];

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-black/80 backdrop-blur-xl border-b border-white/10"
					: "bg-transparent"
			}`}
		>
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 md:gap-3 group">
						<div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<Image
								src={"/hallmark (1).svg"}
								height={100}
								width={100}
								alt="logo"
								className="rounded-full"
							/>
						</div>
						<span className="text-lg md:text-xl font-bold text-white">
							Campuslingo
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						{navItems.map((item) => (
							<a
								key={item.href}
								href={item.href}
								className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
							>
								{item.label}
							</a>
						))}
					</nav>

					{/* Desktop Auth Buttons */}
					<div className="hidden md:flex items-center gap-3">
						<Link href="/auth?tab=login">
							<Button variant="ghost" className="text-white hover:bg-white/10">
								Log In
							</Button>
						</Link>
						<Link href="/auth?tab=signup">
							<Button className="bg-[#e78a53] hover:bg-[#f5a76e] text-black font-medium">
								Sign Up
							</Button>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
					>
						{isMobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden py-4 border-t bg-black/30 backdrop-blur-xl border-white/10 animate-in slide-in-from-top-2 duration-200">
						<nav className="flex flex-col gap-4">
							{navItems.map((item) => (
								<a
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 py-2"
								>
									{item.label}
								</a>
							))}
							<div className="flex flex-col gap-2 pt-4 border-t border-white/10">
								<Link
									href="/auth?tab=login"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-white hover:bg-white/10"
									>
										Log In
									</Button>
								</Link>
								<Link
									href="/auth?tab=signup"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Button className="w-full bg-[#e78a53] hover:bg-[#f5a76e] text-black font-medium">
										Sign Up
									</Button>
								</Link>
							</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
