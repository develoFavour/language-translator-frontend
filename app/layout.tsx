import type React from "react";
import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "LinguaBridge - Multilingual Campus Translator",
	description:
		"Bridge languages, connect cultures. Translate between Yoruba, Igbo, Hausa, and more.",
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans antialiased text-white`}>
				<AuthProvider>
					<ToastProvider>
						<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
					</ToastProvider>
				</AuthProvider>
				<Toaster position="top-right" />
				<Analytics />
			</body>
		</html>
	);
}
