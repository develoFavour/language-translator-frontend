"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
	{
		name: "Free",
		price: "₦0",
		period: "forever",
		description: "Perfect for getting started",
		features: [
			"100 translations per month",
			"Basic AI chat access",
			"Voice input & output",
			"7-day conversation history",
			"Community support",
		],
		cta: "Get Started",
		href: "/auth?tab=signup",
		popular: false,
	},
	{
		name: "Pro",
		price: "₦2,500",
		period: "per month",
		description: "For power users and professionals",
		features: [
			"Unlimited translations",
			"Advanced AI chat with context",
			"Priority voice processing",
			"Unlimited conversation history",
			"Priority email support",
			"Export conversation history",
			"Custom voice selection",
		],
		cta: "Start Free Trial",
		href: "/auth?tab=signup",
		popular: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "contact us",
		description: "For organizations and institutions",
		features: [
			"Everything in Pro",
			"Custom AI model training",
			"Dedicated support team",
			"API access",
			"Custom integrations",
			"SLA guarantee",
			"On-premise deployment option",
		],
		cta: "Contact Sales",
		href: "mailto:sales@linguabridge.com",
		popular: false,
	},
];

export function PricingSection() {
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

		const cards = sectionRef.current?.querySelectorAll(".pricing-card");
		cards?.forEach((card) => observer.observe(card));

		return () => observer.disconnect();
	}, []);

	return (
		<section
			id="pricing"
			ref={sectionRef}
			className="py-20 md:py-32 px-4 md:px-6 bg-black"
		>
			<div className="container mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="text-center mb-16 md:mb-20 space-y-4">
					<div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
						<span className="text-sm font-medium text-gray-300">Pricing</span>
					</div>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
						Simple, transparent pricing
					</h2>
					<p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
						Choose the plan that fits your needs. Start free, upgrade anytime.
					</p>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
					{plans.map((plan, index) => (
						<div
							key={index}
							className={`pricing-card opacity-0 translate-y-8 transition-all duration-700 ${
								plan.popular ? "md:-translate-y-4" : ""
							}`}
							style={{ transitionDelay: `${index * 100}ms` }}
						>
							<div
								className={`h-full p-6 md:p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 ${
									plan.popular
										? "bg-gradient-to-b from-[#e78a53]/10 to-black border-[#e78a53]/50"
										: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
								}`}
							>
								{plan.popular && (
									<div className="inline-block px-3 py-1 rounded-full bg-[#e78a53] text-black text-xs font-semibold mb-4">
										Most Popular
									</div>
								)}

								<h3 className="text-2xl font-bold text-white mb-2">
									{plan.name}
								</h3>
								<p className="text-sm text-gray-400 mb-6">{plan.description}</p>

								<div className="mb-6">
									<span className="text-4xl md:text-5xl font-bold text-white">
										{plan.price}
									</span>
									<span className="text-gray-400 ml-2">/ {plan.period}</span>
								</div>

								<Link href={plan.href}>
									<Button
										className={`w-full mb-8 ${
											plan.popular
												? "bg-[#e78a53] hover:bg-[#f5a76e] text-black"
												: "bg-white/10 hover:bg-white/20 text-white border border-white/20"
										}`}
									>
										{plan.cta}
									</Button>
								</Link>

								<ul className="space-y-3">
									{plan.features.map((feature, i) => (
										<li key={i} className="flex items-start gap-3">
											<Check className="w-5 h-5 text-[#e78a53] flex-shrink-0 mt-0.5" />
											<span className="text-sm text-gray-300">{feature}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
