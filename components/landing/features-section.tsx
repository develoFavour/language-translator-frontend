"use client";

import { motion, type Variants } from "framer-motion";
import { MessageSquare, Mic, Globe, History, Zap, Shield } from "lucide-react";

const features = [
	{
		icon: MessageSquare,
		title: "AI Chat Assistant",
		description:
			"Chat with our AI in Yoruba, Igbo, Hausa, or English. Get instant answers and support in your native language.",
	},
	{
		icon: Mic,
		title: "Voice Input & Output",
		description:
			"Speak naturally and hear accurate pronunciations with native voice selection for all supported languages.",
	},
	{
		icon: Globe,
		title: "Multi-Language Support",
		description:
			"Seamlessly translate between Yoruba, Igbo, Hausa, and English with context-aware AI translation.",
	},
	{
		icon: History,
		title: "Conversation History",
		description:
			"Access your previous translations and conversations anytime, anywhere with cloud sync.",
	},
	{
		icon: Zap,
		title: "Lightning Fast",
		description:
			"Get instant translations powered by advanced AI models. No waiting, just results.",
	},
	{
		icon: Shield,
		title: "Secure & Private",
		description:
			"Your conversations and translations are encrypted and secure. We respect your privacy.",
	},
];

export function FeaturesSection() {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const cardVariants: Variants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
			},
		},
	};

	return (
		<section id="features" className="py-20 md:py-32 px-4 md:px-6 bg-black">
			<div className="container mx-auto max-w-7xl">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16 md:mb-20 space-y-4"
				>
					<div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
						<span className="text-sm font-medium text-gray-300">Features</span>
					</div>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
						Everything you need to{" "}
						<span className="bg-gradient-to-r from-[#e78a53] to-[#f5a76e] bg-clip-text text-transparent">
							connect cultures
						</span>
					</h2>
					<p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
						Powerful features designed for seamless multilingual communication
					</p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
				>
					{features.map((feature, index) => (
						<motion.div key={index} variants={cardVariants} className="group">
							<div className="h-full p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#e78a53]/50 transition-all duration-300 hover:-translate-y-2">
								<div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#e78a53]/20 to-[#f5a76e]/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
									<feature.icon className="w-6 h-6 md:w-7 md:h-7 text-[#e78a53]" />
								</div>
								<h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
									{feature.title}
								</h3>
								<p className="text-sm md:text-base text-gray-400 leading-relaxed">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
