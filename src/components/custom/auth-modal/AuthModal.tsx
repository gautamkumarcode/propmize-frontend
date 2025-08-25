"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import apiClient from "@/lib/api";
import { useAuthStore } from "@/store/app-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialTab?: "login" | "register";
	redirectTo?: string; // Add redirect URL parameter
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

interface OtpStep {
	phone: string;
	otp: string;
	isOtpSent: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({
	isOpen,
	onClose,
	redirectTo,
}) => {
	const queryClient = useQueryClient();
	const { login, setUserMode } = useAuthStore();
	const router = useRouter();
	const [step, setStep] = useState<OtpStep>({
		phone: "",
		otp: "",
		isOtpSent: false,
	});
	const [loading, setLoading] = useState(false);

	// Handle redirect after successful authentication
	const handlePostAuthRedirect = () => {
		if (redirectTo) {
			// Set user mode based on redirect URL
			if (redirectTo.startsWith("/seller")) {
				setUserMode("seller");
			} else if (redirectTo.startsWith("/buyer")) {
				setUserMode("buyer");
			}

			// Navigate to the intended destination after a brief delay
			setTimeout(() => {
				router.push(redirectTo);
			}, 100);
		}
		onClose();
	};

	// Login mutation
	const _loginMutation = useMutation({
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
			handlePostAuthRedirect();
		},
		onError: (error: AxiosError) => {
			const errorMessage =
				(error.response?.data as { error?: string })?.error ||
				typeof error.response?.data === "string"
					? (error.response?.data as string)
					: "Invalid email or password";
			toast({
				title: "Login failed",
				description: errorMessage,
				variant: "destructive",
			});
		},
	});

	// Register mutation
	const _registerMutation = useMutation({
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
			handlePostAuthRedirect();
		},
		onError: (error: AxiosError) => {
			toast({
				title: "Registration failed",
				description:
					typeof error.response?.data === "object" &&
					error.response?.data !== null &&
					"error" in error.response.data
						? (error.response.data as { error: string }).error
						: "Registration failed",
				variant: "destructive",
			});
		},
	});

	// Send OTP mutation
	const handleSendOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!step.phone) {
			toast({
				title: "Validation Error",
				description: "Enter phone number",
				variant: "destructive",
			});
			return;
		}
		setLoading(true);
		try {
			await apiClient.post("/auth/send-otp", { phone: step.phone });
			setStep((prev) => ({ ...prev, isOtpSent: true }));
			toast({
				title: "OTP sent",
				description: "Check your SMS for the OTP.",
			});
		} catch (error: unknown) {
			const errorMessage =
				error instanceof AxiosError
					? (error.response?.data as { error?: string })?.error ||
					  (typeof error.response?.data === "string"
							? error.response.data
							: "Failed to send OTP")
					: "Failed to send OTP";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
		setLoading(false);
	};

	// Verify OTP mutation
	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!step.otp) {
			toast({
				title: "Validation Error",
				description: "Enter OTP",
				variant: "destructive",
			});
			return;
		}
		setLoading(true);
		try {
			const response = await apiClient.post("/auth/verify-otp", {
				phone: step.phone,
				otp: step.otp,
			});
			const { user, tokens } = response.data.data;
			login(user, tokens.accessToken, tokens.refreshToken);
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast({
				title: "Login successful",
				description: `Welcome, ${user.name || user.phone}!`,
			});
			if (redirectTo) {
				if (redirectTo.startsWith("/seller")) setUserMode("seller");
				else if (redirectTo.startsWith("/buyer")) setUserMode("buyer");
				setTimeout(() => router.push(redirectTo), 100);
			}
			onClose();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof AxiosError
					? (error.response?.data as { error?: string })?.error ||
					  (typeof error.response?.data === "string"
							? error.response.data
							: "Invalid OTP")
					: "Invalid OTP";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
		setLoading(false);
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
						<CardTitle className="text-center">Mobile Login</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{!step.isOtpSent ? (
							<form onSubmit={handleSendOtp} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="Enter your phone number"
										value={step.phone}
										onChange={(e) =>
											setStep({ ...step, phone: e.target.value })
										}
										required
									/>
								</div>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Sending OTP..." : "Send OTP"}
								</Button>
							</form>
						) : (
							<form onSubmit={handleVerifyOtp} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="otp">Enter OTP</Label>
									<Input
										id="otp"
										type="text"
										placeholder="Enter OTP received"
										value={step.otp}
										onChange={(e) => setStep({ ...step, otp: e.target.value })}
										required
									/>
								</div>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Verifying..." : "Verify & Login"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									className="w-full"
									onClick={() =>
										setStep({ phone: "", otp: "", isOtpSent: false })
									}>
									Change phone number
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
