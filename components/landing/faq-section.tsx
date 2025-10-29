"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
	{
		question: "What languages does Campuslingo support?",
		answer:
			"Campuslingo currently supports Yoruba, Igbo, Hausa, and English. We're constantly working to add more Nigerian languages and dialects based on user feedback.",
	},
	{
		question: "How accurate are the translations?",
		answer:
			"Our AI-powered translation engine is trained on extensive datasets of Nigerian languages and achieves over 95% accuracy. The AI also understands context and cultural nuances to provide more natural translations.",
	},
	{
		question: "Can I use Campuslingo offline?",
		answer:
			"Currently, Campuslingo requires an internet connection to access our AI translation models. However, we're working on an offline mode for basic translations that will be available soon.",
	},
	{
		question: "Is my conversation data secure?",
		answer:
			"Yes, absolutely. All your conversations and translations are encrypted end-to-end. We take privacy seriously and never share your data with third parties. You can also delete your conversation history at any time.",
	},
	{
		question: "Can I cancel my subscription anytime?",
		answer:
			"Yes, you can cancel your Pro subscription at any time. You'll continue to have access to Pro features until the end of your billing period, after which you'll be moved to the Free plan.",
	},
	{
		question: "Do you offer student or educational discounts?",
		answer:
			"Yes! We offer a 50% discount for students and educators with a valid institutional email address. Contact our support team to verify your status and get your discount code.",
	},
];

export function FAQSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [openIndex, setOpenIndex] = useState<number | null>(null);

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
			id="faq"
			ref={sectionRef}
			className="py-20 md:py-32 px-4 md:px-6 bg-black"
		>
			<div className="container mx-auto max-w-4xl">
				{/* Section Header */}
				<div className="text-center mb-16 md:mb-20 space-y-4">
					<div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
						<span className="text-sm font-medium text-gray-300">FAQ</span>
					</div>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
						Frequently asked questions
					</h2>
					<p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
						Everything you need to know about Campuslingo
					</p>
				</div>

				{/* FAQ Items */}
				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
						>
							<button
								onClick={() => setOpenIndex(openIndex === index ? null : index)}
								className="w-full flex items-center justify-between gap-4 text-left"
							>
								<h3 className="text-base md:text-lg font-semibold text-white">
									{faq.question}
								</h3>
								<ChevronDown
									className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
										openIndex === index ? "rotate-180" : ""
									}`}
								/>
							</button>
							{openIndex === index && (
								<p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
									{faq.answer}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
