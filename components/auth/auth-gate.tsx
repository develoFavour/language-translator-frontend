"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export function AuthGate() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const authParam = searchParams.get("auth");
	const tabParam = searchParams.get("tab");
	const mode = authParam || tabParam || "login";
	const showLogin = useMemo(() => mode !== "signup", [mode]);

	const setAuthMode = (next: "login" | "signup") => {
		const params = new URLSearchParams(searchParams?.toString());
		params.set("auth", next);
		params.set("tab", next); // maintain compatibility with legacy links
		router.replace(`?${params.toString()}`);
	};

	return (
		<div className="min-h-screen pattern-bg flex items-center justify-center p-4 bg-black">
			<div className="w-full max-w-md space-y-8">
				{/* Logo */}

				{/* Auth Forms */}
				{showLogin ? (
					<LoginForm onSwitchToSignup={() => setAuthMode("signup")} />
				) : (
					<SignupForm onSwitchToLogin={() => setAuthMode("login")} />
				)}
			</div>
		</div>
	);
}
