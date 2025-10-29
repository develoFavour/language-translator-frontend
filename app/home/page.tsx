import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
// import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<LandingHeader />
			<main>
				<HeroSection />
				<FeaturesSection />
				<TestimonialsSection />
				{/* <PricingSection /> */}
				<FAQSection />
				<CTASection />
			</main>
			<LandingFooter />
		</div>
	);
}
