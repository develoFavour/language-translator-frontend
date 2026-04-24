import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function LandingFooter() {
	const footerLinks = {
		Product: [
			{ label: "Features", href: "#features" },
			{ label: "Pricing", href: "#pricing" },
			{ label: "Testimonials", href: "#testimonials" },
			{ label: "FAQ", href: "#faq" },
		],
		Company: [
			{ label: "About Us", href: "/about" },
			{ label: "Blog", href: "/blog" },
			{ label: "Careers", href: "/careers" },
			{ label: "Contact", href: "/contact" },
		],
		Legal: [
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Terms of Service", href: "/terms" },
			{ label: "Cookie Policy", href: "/cookies" },
		],
	};

	const socialLinks = [
		{ icon: Facebook, href: "https://facebook.com", label: "Facebook" },
		{ icon: Twitter, href: "https://twitter.com", label: "Twitter" },
		{ icon: Instagram, href: "https://instagram.com", label: "Instagram" },
		{ icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
	];

	return (
		<footer className="bg-black border-t border-white/10 py-12 md:py-16 px-4 md:px-6">
			<div className="container mx-auto max-w-7xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<Image
									src={"/hallmark (1).svg"}
									height={100}
									width={100}
									alt="logo"
									className="rounded-full"
								/>
							</div>
							<span className="text-xl font-bold text-white">Campuslingo</span>
						</Link>
						<p className="text-sm text-gray-400 mb-6 max-w-sm">
							Breaking language barriers with AI-powered translation. Connect
							cultures across Nigeria effortlessly.
						</p>
						<div className="flex items-center gap-4">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#e78a53]/50 transition-all duration-300"
									aria-label={social.label}
								>
									<social.icon className="w-5 h-5 text-gray-400" />
								</a>
							))}
						</div>
					</div>

					{/* Links */}
					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<h3 className="text-sm font-semibold text-white mb-4">
								{category}
							</h3>
							<ul className="space-y-3">
								{links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom */}
				<div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-gray-400">
						© 2025 Campuslingo. All rights reserved.
					</p>
					<p className="text-sm text-gray-400">Made with ❤️ in Nigeria</p>
				</div>
			</div>
		</footer>
	);
}
