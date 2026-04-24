"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	ArrowDown,
	BookOpen,
	MapPin,
	MessageSquareText,
	Sparkles,
	Users,
} from "lucide-react";

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
			{ threshold: 0.1 },
		);

		if (heroRef.current) {
			observer.observe(heroRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={heroRef}
			className="relative min-h-screen overflow-hidden px-4 md:px-6 pt-20 md:pt-24"
		>
			<Image
				src="/hallmark-univeristy.jpg"
				alt="Hallmark University campus"
				fill
				priority
				className="object-cover object-center"
			/>
			<div className="absolute inset-0 bg-black/60 pointer-events-none" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231,138,83,0.28),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.78)_55%,#000_100%)] pointer-events-none" />
			<div className="absolute inset-x-0 top-24 h-32 bg-gradient-to-b from-[#e78a53]/20 to-transparent blur-3xl pointer-events-none" />

			<div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
				<div className="grid w-full items-end gap-10 py-10 md:grid-cols-[minmax(0,1fr)_380px] md:gap-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-14">
					<div className="text-center md:text-left space-y-8 md:space-y-10">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/[0.15] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
							<Sparkles className="w-4 h-4 text-[#e78a53]" />
							<span className="text-sm font-medium text-gray-200">
								Built for campus communication
							</span>
						</div>

						<div className="space-y-5">
							<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
								One campus, many languages,{" "}
								<span className="bg-gradient-to-r from-[#e78a53] to-[#f5a76e] bg-clip-text text-transparent">
									one clearer conversation
								</span>
							</h1>

							<p className="text-lg md:text-xl lg:text-2xl text-gray-200/85 max-w-3xl mx-auto md:mx-0 text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
								Bring students, lecturers, and visitors closer with instant AI
								translation across Yoruba, Igbo, Hausa, and English, designed
								for everyday life around Hallmark University.
							</p>
						</div>

						<div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-200/80 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-250">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/[0.25] px-4 py-2 backdrop-blur-md">
								<MapPin className="h-4 w-4 text-[#e78a53]" />
								<span>Hallmark University inspired</span>
							</div>
							<div className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/[0.25] px-4 py-2 backdrop-blur-md">
								<Users className="h-4 w-4 text-[#e78a53]" />
								<span>Made for students and staff</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
							<Link href="/auth?tab=signup">
								<Button
									size="lg"
									className="w-full sm:w-auto bg-[#e78a53] hover:bg-[#f5a76e] text-black font-semibold text-base md:text-lg px-8 py-6 rounded-full shadow-lg shadow-[#e78a53]/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
								>
									Start Translating
									<ArrowDown className="ml-2 w-5 h-5 rotate-[-90deg]" />
								</Button>
							</Link>
							<Link href="#features">
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-base md:text-lg px-8 py-6 rounded-full transition-all duration-300 bg-white/5 backdrop-blur-sm"
								>
									Explore Features
								</Button>
							</Link>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-700 delay-500">
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md">
								<div className="text-2xl font-semibold text-white">4</div>
								<div className="text-sm text-gray-300">
									Local + global languages
								</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md">
								<div className="text-2xl font-semibold text-white">24/7</div>
								<div className="text-sm text-gray-300">
									Always-ready AI conversations
								</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md">
								<div className="text-2xl font-semibold text-white">Campus</div>
								<div className="text-sm text-gray-300">
									Context for classes and community
								</div>
							</div>
						</div>
					</div>

					<div className="hidden md:block md:-translate-y-8 lg:-translate-y-20 animate-in fade-in slide-in-from-right-8 duration-700 delay-400">
						<div className="rounded-[32px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl shadow-2xl shadow-black/30">
							<div className="rounded-[24px] overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.18))]">
								<div className="border-b border-white/10 px-5 py-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs uppercase tracking-[0.24em] text-gray-400">
												Campus flow
											</p>
											<h3 className="mt-2 text-lg font-semibold text-white">
												How Campuslingo fits daily life
											</h3>
										</div>
										<div className="rounded-full border border-[#e78a53]/25 bg-[#e78a53]/15 px-3 py-1 text-xs font-medium text-[#f5c29b]">
											Live support
										</div>
									</div>
								</div>

								<div className="space-y-5 p-6">
									<div className="grid grid-cols-2 gap-3">
										<div className="rounded-2xl border border-white/10 bg-black/25 p-5">
											<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
												<BookOpen className="h-5 w-5 text-[#f5a76e]" />
											</div>
											<p className="text-sm font-medium text-white">
												Lecture clarity
											</p>
											<p className="mt-1 text-xs leading-relaxed text-gray-400">
												Explain course terms in familiar language.
											</p>
										</div>
										<div className="rounded-2xl border border-white/10 bg-black/25 p-5">
											<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
												<MessageSquareText className="h-5 w-5 text-[#f5a76e]" />
											</div>
											<p className="text-sm font-medium text-white">
												Easy conversations
											</p>
											<p className="mt-1 text-xs leading-relaxed text-gray-400">
												Bridge chats between students, staff, and visitors.
											</p>
										</div>
									</div>

									<div className="rounded-3xl border border-white/10 bg-black/30 p-5">
										<div className="mb-4 flex items-center justify-between">
											<p className="text-sm font-medium text-white">
												Language coverage
											</p>
											<p className="text-xs text-gray-400">Campus-ready</p>
										</div>
										<div className="flex flex-wrap gap-2">
											{["English", "Yoruba", "Igbo", "Hausa"].map(
												(language) => (
													<span
														key={language}
														className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200"
													>
														{language}
													</span>
												),
											)}
										</div>
										<div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
											<div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#e78a53] to-[#f5a76e]" />
										</div>
										<p className="mt-2 text-xs text-gray-400">
											Built for the everyday rhythm of a multilingual campus.
										</p>
									</div>

									<div className="rounded-2xl border border-white/10 bg-[#e78a53]/10 p-5">
										<div className="flex items-start gap-3">
											<div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e78a53]/15">
												<MapPin className="h-5 w-5 text-[#f5a76e]" />
											</div>
											<div>
												<p className="text-sm font-medium text-white">
													Grounded in campus context
												</p>
												<p className="mt-1 text-sm leading-relaxed text-gray-300">
													From lecture halls to admin offices, the experience is
													shaped to feel local, warm, and immediately useful.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:flex flex-col items-center gap-2 text-gray-400 animate-in fade-in duration-700 delay-500">
					<span className="text-sm">Scroll to explore</span>
					<ArrowDown className="w-5 h-5 animate-bounce" />
				</div> */}
			</div>
		</section>
	);
}
