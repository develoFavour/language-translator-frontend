"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/translate");
		}
	}, [user, router]);

	return <AuthGate />;
}
