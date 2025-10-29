"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Adebayo Ogunlesi",
		role: "Student, University of Lagos",
		content:
			"Campuslingo helped me communicate with my Igbo classmates effortlessly. The AI chat is incredibly accurate!",
		rating: 5,
	},
	{
		name: "Chioma Nwosu",
		role: "Lecturer, Nnamdi Azikiwe University",
		content:
			"Finally, a translation tool that understands Nigerian languages properly. The voice feature is a game-changer.",
		rating: 5,
	},
	{
		name: "Ibrahim Musa",
		role: "Researcher, Ahmadu Bello University",
		content:
			"The conversation history feature saves me so much time. I can reference past translations instantly.",
		rating: 5,
	},
	{
		name: "Ngozi Okafor",
		role: "Business Owner, Lagos",
		content:
			"I use Campuslingo daily to communicate with customers across Nigeria. It's fast, accurate, and reliable.",
		rating: 5,
	},
	{
		name: "Yusuf Abdullahi",
		role: "Student, Bayero University",
		content:
			"The AI understands context and cultural nuances. Best translation tool I've used for Nigerian languages.",
		rating: 5,
	},
	{
		name: "Amaka Eze",
		role: "Teacher, Port Harcourt",
		content:
			"My students love using Campuslingo to learn and practice different Nigerian languages. Highly recommended!",
		rating: 5,
	},
];

export function TestimonialsSection() {
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
		<section
			id="testimonials"
			ref={sectionRef}
			className="py-20 md:py-32 px-4 md:px-6 bg-black"
		>
			<div className="container mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="text-center mb-16 md:mb-20 space-y-4">
					<div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
						<span className="text-sm font-medium text-gray-300">
							Testimonials
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
						What our users say
					</h2>
					<p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
						Join thousands of users breaking language barriers across Nigeria
					</p>
				</div>

				{/* Testimonials Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#e78a53]/50 transition-all duration-300 hover:-translate-y-2"
						>
							{/* Rating */}
							<div className="flex gap-1 mb-4">
								{Array.from({ length: testimonial.rating }).map((_, i) => (
									<Star
										key={i}
										className="w-4 h-4 fill-[#e78a53] text-[#e78a53]"
									/>
								))}
							</div>

							{/* Content */}
							<p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
								{testimonial.content}
							</p>

							{/* Author */}
							<div className="flex items-center gap-3 pt-4 border-t border-white/10">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e78a53] to-[#f5a76e] flex items-center justify-center">
									<span className="text-black font-bold text-sm">
										{testimonial.name.charAt(0)}
									</span>
								</div>
								<div>
									<p className="text-sm font-semibold text-white">
										{testimonial.name}
									</p>
									<p className="text-xs text-gray-400">{testimonial.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
