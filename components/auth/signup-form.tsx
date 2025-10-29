"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface SignupFormProps {
	onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
	const { signup } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setIsLoading(true);

		try {
			await signup(email, password, name);
			toast.success("Account created successfully");
		} catch (err) {
			console.log(err);
			setError("Failed to create account");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md p-8 space-y-6 glass-card border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="space-y-2 text-center">
				<h2 className="text-2xl font-bold text-gradient">Create Account</h2>
				<p className="text-muted-foreground text-sm">
					Join Campuslingo to save your translations
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2 animate-in fade-in duration-500 delay-100">
					<Label htmlFor="name" className="text-sm font-medium">
						Full Name
					</Label>
					<div className="relative group">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
						<Input
							id="name"
							type="text"
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="pl-10 bg-card/50 border-border/50 hover:border-border transition-colors duration-300 focus:border-primary"
							required
						/>
					</div>
				</div>

				<div className="space-y-2 animate-in fade-in duration-500 delay-200">
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

				<div className="space-y-2 animate-in fade-in duration-500 delay-300">
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

				<div className="space-y-2 animate-in fade-in duration-500 delay-400">
					<Label htmlFor="confirm-password" className="text-sm font-medium">
						Confirm Password
					</Label>
					<div className="relative group">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
						<Input
							id="confirm-password"
							type="password"
							placeholder="••••••••"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
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
					className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Creating account...
						</>
					) : (
						"Create Account"
					)}
				</Button>
			</form>

			<div className="text-center text-sm">
				<span className="text-muted-foreground">Already have an account? </span>
				<button
					type="button"
					onClick={onSwitchToLogin}
					className="text-primary cursor-pointer underline hover:text-accent font-medium transition-colors duration-300"
				>
					Sign in
				</button>
			</div>
		</Card>
	);
}
