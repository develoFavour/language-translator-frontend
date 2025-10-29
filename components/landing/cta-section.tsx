"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
	const sectionRef = useRef<HTMLDivElement>(null);

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

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section ref={sectionRef} className="py-20 md:py-32 px-4 md:px-6 bg-black">
			<div className="container mx-auto max-w-5xl">
				<div className="relative p-8 md:p-16 rounded-3xl bg-gradient-to-br from-[#e78a53]/20 via-[#f5a76e]/10 to-black border border-[#e78a53]/30 backdrop-blur-sm overflow-hidden">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(231,138,83,0.1),transparent_50%)] pointer-events-none" />

					<div className="relative z-10 text-center space-y-6 md:space-y-8">
						<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight">
							Ready to break language barriers?
						</h2>
						<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
							Join thousands of users connecting cultures across Nigeria. Start
							translating for free today.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
							<Link href="/auth?tab=signup">
								<Button
									size="lg"
									className="w-full sm:w-auto bg-[#e78a53] hover:bg-[#f5a76e] text-black font-semibold text-base md:text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
								>
									Get Started Free
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
							</Link>
							<Link href="/auth?tab=login">
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-base md:text-lg px-8 py-6 rounded-full transition-all duration-300 bg-transparent"
								>
									Sign In
								</Button>
							</Link>
						</div>

						<p className="text-sm text-gray-400 pt-4">
							No credit card required • Free forever plan available
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
