"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

export function HeroSection() {
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate-in");
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (heroRef.current) {
			observer.observe(heroRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={heroRef}
			className="relative min-h-screen flex items-center justify-center px-4 md:px-6 pt-20 md:pt-24"
		>
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black pointer-events-none" />

			<div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
				{/* Badge */}
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
					<Sparkles className="w-4 h-4 text-[#e78a53]" />
					<span className="text-sm font-medium text-gray-300">
						AI-Powered Translation
					</span>
				</div>

				{/* Main Headline */}
				<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
					Break Language Barriers{" "}
					<span className="bg-gradient-to-r from-[#e78a53] to-[#f5a76e] bg-clip-text text-transparent">
						with AI
					</span>
				</h1>

				{/* Subheadline */}
				<p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
					Translate between Yoruba, Igbo, Hausa, and English instantly. Chat
					with AI in your native language and connect cultures effortlessly.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
					<Link href="/auth?tab=signup">
						<Button
							size="lg"
							className="w-full sm:w-auto bg-[#e78a53] hover:bg-[#f5a76e] text-black font-semibold text-base md:text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
						>
							Get Started Free
							<ArrowDown className="ml-2 w-5 h-5 rotate-[-90deg]" />
						</Button>
					</Link>
					<Link href="#features">
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-base md:text-lg px-8 py-6 rounded-full transition-all duration-300 bg-transparent"
						>
							Learn More
						</Button>
					</Link>
				</div>

				{/* Scroll Indicator */}
				<div className="pt-12 md:pt-16 animate-in fade-in duration-700 delay-500">
					<div className="flex flex-col items-center gap-2 text-gray-500">
						<span className="text-sm">Scroll to explore</span>
						<ArrowDown className="w-5 h-5 animate-bounce" />
					</div>
				</div>
			</div>
		</section>
	);
}
