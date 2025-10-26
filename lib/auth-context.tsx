"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { api, APIError } from "./api-client";

interface User {
	id: string;
	email: string;
	name: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				// ensure role cookie is cleared if no token
				document.cookie = "role=; path=/; max-age=0; sameSite=Lax";
				setIsLoading(false);
				return;
			}
			try {
				const data = await api.auth.me();
				const user: User = {
					id: data.user.id,
					email: data.user.email,
					name: data.user.name,
					role: data.user.role,
				};
				setUser(user);
				localStorage.setItem("user", JSON.stringify(user));
				// Set role cookie for middleware (7 days to match token lifetime)
				document.cookie = `role=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=Lax`;
			} catch (e) {
				api.auth.logout();
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};
		init();
	}, []);

	const login = async (email: string, password: string) => {
		setError(null);
		try {
			const data = await api.auth.login(email, password);
			const user: User = {
				id: data.user.id,
				email: data.user.email,
				name: data.user.name,
				role: data.user.role,
			};
			setUser(user);
			localStorage.setItem("user", JSON.stringify(user));
			document.cookie = `role=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=Lax`;
		} catch (err) {
			if (err instanceof APIError) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
			}
			throw err;
		}
	};

	const signup = async (email: string, password: string, name: string) => {
		setError(null);
		try {
			const data = await api.auth.signup(name, email, password);
			const user: User = {
				id: data.user.id,
				email: data.user.email,
				name: data.user.name,
				role: data.user.role,
			};
			setUser(user);
			localStorage.setItem("user", JSON.stringify(user));
			document.cookie = `role=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=Lax`;
		} catch (err) {
			if (err instanceof APIError) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
			}
			throw err;
		}
	};

	const logout = () => {
		api.auth.logout();
		setUser(null);
		// Clear role cookie
		document.cookie = "role=; path=/; max-age=0; sameSite=Lax";
	};

	return (
		<AuthContext.Provider
			value={{ user, login, signup, logout, isLoading, error }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
