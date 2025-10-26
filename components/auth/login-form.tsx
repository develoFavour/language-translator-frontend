"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface LoginFormProps {
	onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await login(email, password);
			toast.success("Login successful");
		} catch (err) {
			console.log(err);
			setError("Invalid email or password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md p-8 space-y-6 glass-card border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="space-y-2 text-center">
				<h2 className="text-2xl font-bold text-gradient">Welcome Back</h2>
				<p className="text-muted-foreground text-sm">
					Sign in to access your translation history
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2 animate-in fade-in duration-500 delay-100">
					<Label htmlFor="email" className="text-sm font-medium">
						Email
					</Label>
					<div className="relative group">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="pl-10 bg-card/50 border-border/50 hover:border-border transition-colors duration-300 focus:border-primary"
							required
						/>
					</div>
				</div>

				<div className="space-y-2 animate-in fade-in duration-500 delay-200">
					<Label htmlFor="password" className="text-sm font-medium">
						Password
					</Label>
					<div className="relative group">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="pl-10 bg-card/50 border-border/50 hover:border-border transition-colors duration-300 focus:border-primary"
							required
						/>
					</div>
				</div>

				{error && (
					<p className="text-sm text-destructive animate-in fade-in duration-300">
						{error}
					</p>
				)}

				<Button
					type="submit"
					className="w-full mt-6 cursor-pointer border bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Signing in...
						</>
					) : (
						"Sign In"
					)}
				</Button>
			</form>

			<div className="text-center text-sm">
				<span className="text-muted-foreground">
					Don&apos;t have an account?{" "}
				</span>
				<button
					type="button"
					onClick={onSwitchToSignup}
					className="text-primary cursor-pointer underline hover:text-accent font-medium transition-colors duration-300"
				>
					Sign up
				</button>
			</div>
		</Card>
	);
}
