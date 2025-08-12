"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import apiClient from "@/lib/api";
import { useAuthStore } from "@/store/app-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React, { useState } from "react";

export interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialTab?: "login" | "register";
}

interface LoginData {
	email: string;
	password: string;
}

interface RegisterData {
	name: string;
	email: string;
	phone: string;
	password: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
	isOpen,
	onClose,
	initialTab = "login",
}) => {
	const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
	const queryClient = useQueryClient();
	const { login } = useAuthStore();

	const [loginForm, setLoginForm] = useState<LoginData>({
		email: "",
		password: "",
	});

	const [registerForm, setRegisterForm] = useState<RegisterData>({
		name: "",
		email: "",
		phone: "",
		password: "",
	});

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: async (data: LoginData) => {
			const response = await apiClient.post("/auth/login", data);
			return response.data;
		},
		onSuccess: (data) => {
			// Handle the correct response structure from backend
			const { user, tokens } = data.data;
			login(user, tokens.accessToken, tokens.refreshToken);
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast({
				title: "Login successful",
				description: `Welcome back, ${user.name}!`,
			});
			onClose();
		},
		onError: (error: any) => {
			toast({
				title: "Login failed",
				description: error.response?.data?.error || "Invalid email or password",
				variant: "destructive",
			});
		},
	});

	// Register mutation
	const registerMutation = useMutation({
		mutationFn: async (data: RegisterData) => {
			const response = await apiClient.post("/auth/register", data);
			return response.data;
		},
		onSuccess: (data) => {
			// Handle the correct response structure from backend
			const { user, tokens } = data.data;
			login(user, tokens.accessToken, tokens.refreshToken);
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast({
				title: "Registration successful",
				description: `Welcome to Propmize, ${user.name}!`,
			});
			onClose();
		},
		onError: (error: any) => {
			toast({
				title: "Registration failed",
				description: error.response?.data?.error || "Registration failed",
				variant: "destructive",
			});
		},
	});

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		if (!loginForm.email || !loginForm.password) {
			toast({
				title: "Validation Error",
				description: "Please fill in all fields",
				variant: "destructive",
			});
			return;
		}
		loginMutation.mutate(loginForm);
	};

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!registerForm.name ||
			!registerForm.email ||
			!registerForm.phone ||
			!registerForm.password
		) {
			toast({
				title: "Validation Error",
				description: "Please fill in all fields",
				variant: "destructive",
			});
			return;
		}

		// Phone validation
		const phoneRegex = /^\+?[\d\s-()]{10,}$/;
		if (!phoneRegex.test(registerForm.phone)) {
			toast({
				title: "Validation Error",
				description: "Please enter a valid phone number",
				variant: "destructive",
			});
			return;
		}

		registerMutation.mutate(registerForm);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative w-full max-w-md mx-4">
				<Card className="w-full">
					<CardHeader className="relative">
						<button
							onClick={onClose}
							className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100">
							<X className="h-5 w-5" />
						</button>
						<CardTitle className="text-center">
							{activeTab === "login" ? "Welcome Back" : "Join E-State"}
						</CardTitle>
						<div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
							<button
								onClick={() => setActiveTab("login")}
								className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
									activeTab === "login"
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}>
								Login
							</button>
							<button
								onClick={() => setActiveTab("register")}
								className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
									activeTab === "register"
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}>
								Register
							</button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{activeTab === "login" ? (
							<form onSubmit={handleLogin} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={loginForm.email}
										onChange={(e) =>
											setLoginForm({
												...loginForm,
												email: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="Enter your password"
										value={loginForm.password}
										onChange={(e) =>
											setLoginForm({
												...loginForm,
												password: e.target.value,
											})
										}
										required
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={loginMutation.isPending}>
									{loginMutation.isPending ? "Signing in..." : "Sign In"}
								</Button>
							</form>
						) : (
							<form onSubmit={handleRegister} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										type="text"
										placeholder="Enter your full name"
										value={registerForm.name}
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												name: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="register-email">Email</Label>
									<Input
										id="register-email"
										type="email"
										placeholder="Enter your email"
										value={registerForm.email}
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												email: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="Enter your phone number"
										value={registerForm.phone}
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												phone: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="register-password">Password</Label>
									<Input
										id="register-password"
										type="password"
										placeholder="Create a password"
										value={registerForm.password}
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												password: e.target.value,
											})
										}
										required
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={registerMutation.isPending}>
									{registerMutation.isPending
										? "Creating account..."
										: "Create Account"}
								</Button>
							</form>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AuthModal;
