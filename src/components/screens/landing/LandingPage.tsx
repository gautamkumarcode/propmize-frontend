"use client";

import AuthModal from "@/components/custom/auth-modal/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib";
import { useAuthStore } from "@/store/app-store";
import {
	ArrowRight,
	Building2,
	CheckCircle,
	Home,
	Loader2,
	Search,
	Shield,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "../../../assests/logo1.png";

export default function LandingPage() {
	const router = useRouter();
	const [selectedService, setSelectedService] = useState<string | null>(null);

	const { user, isAuthenticated, setUser, setUserMode } = useAuthStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleServiceSelection = async (
		service: string,
		mode?: "buyer" | "seller"
	) => {
		setSelectedService(service);

		// Only show loading for seller mode or if authentication is required
		if (mode === "seller" && (!isAuthenticated || !user?._id)) {
			setIsLoading(true);
		}

		if (mode && isAuthenticated && user?._id) {
			setUserMode(mode);

			try {
				const response = await apiClient.put(`/users/${user._id}/role`, {
					role: mode,
				});
				if (response.data.success) {
					setUser({ ...user, role: mode });
				}
			} catch (error) {
				console.log("API error:", error);
			}
		} else if (mode) {
			setUserMode(mode);
		}

		// Navigate immediately for buyer, handle seller auth separately
		if (mode === "seller") {
			router.push("/seller");
		} else {
			// Buyer mode - no authentication required
			router.push("/buyer/assistant");
		}

		setIsLoading(false);
	};

	const services = [
		{
			id: "search",
			title: "Buy / Rent Property",
			subtitle: "Find your dream home or the perfect rental",
			icon: Search,
			mode: "buyer" as const,
		},
		{
			id: "manage",
			title: "Sell / Rent Property",
			subtitle: "List your property & reach genuine buyers/tenants",
			icon: Building2,
			mode: "seller" as const,
		},
	];

	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* Header */}
			<header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
				<Image
					src={logo}
					alt="Propmize Logo"
					width={120}
					height={40}
					className="mx-auto sm:w-[150px] sm:h-[50px]"
				/>
			</header>

			{isLoading && (
				<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
					<Loader2 className="w-10 h-10 animate-spin text-primary" />
				</div>
			)}

			{/* Hero Section */}
			<section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

				{/* Floating Elements - Hidden on mobile for better performance */}
				<div className="hidden sm:block absolute top-20 left-10 w-16 h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full animate-float"></div>
				<div className="hidden sm:block absolute bottom-32 right-16 w-12 h-12 lg:w-16 lg:h-16 bg-secondary/20 rounded-full animate-float animation-delay-2000"></div>
				<div className="hidden lg:block absolute top-1/3 right-20 w-12 h-12 bg-accent/20 rounded-full animate-float animation-delay-4000"></div>

				{/* Content */}
				<div className="relative z-10 text-center mb-12 sm:mb-16 max-w-4xl px-4">
					<div className="flex items-center justify-center mb-4 sm:mb-6">
						<div className="p-3 sm:p-4 bg-primary/10 rounded-full animate-bounce">
							<span className="text-3xl sm:text-4xl">🏡</span>
						</div>
					</div>
					<h1 className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fadeInUp leading-tight">
						What&apos;s on your mind?
					</h1>
					<p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fadeInUp leading-relaxed">
						Discover your perfect property with AI-powered insights. Connect
						with verified buyers and sellers in a trusted marketplace.
					</p>
				</div>

				{/* Service Cards */}
				<div className="relative z-10 grid gap-6 sm:gap-8 md:grid-cols-2 w-full max-w-5xl">
					{services.map((service, index) => (
						<button
							key={service.id}
							className={`group relative w-full text-left border-blue-800 cursor-pointer transition-all duration-500 rounded-2xl sm:rounded-3xl bg-card/80 backdrop-blur-md shadow-2xl hover:scale-[1.02] overflow-hidden animate-fadeInUp bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 ${
								selectedService === service.id ? "ring-2 ring-primary/50" : ""
							}`}
							style={{ animationDelay: `${index * 0.2}s` }}
							onClick={() => handleServiceSelection(service.id, service.mode)}
							disabled={isLoading && selectedService === service.id}>
							{/* Gradient Background */}
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

							{/* Animated Border */}
							<div className="absolute inset-0 rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
								<div className="h-full w-full rounded-2xl sm:rounded-3xl bg-card/90 backdrop-blur-md"></div>
							</div>

							<div className="relative p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between z-10 gap-4 sm:gap-6">
								<div className="flex items-center space-x-4 sm:space-x-6 flex-1">
									<div
										className={`p-3 sm:p-4 lg:p-5 text-white rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${
											service.id === "search"
												? "bg-primary/10 text-primary"
												: "bg-secondary/10 text-secondary"
										}`}>
										<service.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 text-gray-900">
											{service.title}
										</h3>
										<p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
											{service.subtitle}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 flex-shrink-0 self-center sm:self-auto">
									{isLoading && selectedService === service.id ? (
										<Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-white" />
									) : (
										<ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300 text-white" />
									)}
								</div>
							</div>
						</button>
					))}
				</div>
			</section>

			{/* Rest of your components remain the same */}
			{/* Features Section */}
			<section className="py-16 sm:py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
				{/* Background Elements */}
				<div className="absolute inset-0 bg-dot-pattern opacity-20"></div>
				<div className="hidden sm:block absolute top-0 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl"></div>
				<div className="hidden sm:block absolute bottom-0 right-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-secondary/5 rounded-full blur-3xl"></div>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="text-center mb-12 sm:mb-16 lg:mb-20">
						<div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
							<Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
							<span className="text-primary font-semibold text-sm sm:text-base">
								Features
							</span>
						</div>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
							Why Choose Propmize?
						</h2>
						<p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Experience the future of real estate with our innovative platform
							designed for modern property transactions.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
						{[
							{
								icon: Zap,
								title: "AI-Powered Insights",
								description:
									"Get intelligent property recommendations and market analysis powered by advanced AI algorithms.",
								gradient: "from-primary/20 to-primary/5",
								iconBg: "bg-primary/10",
								iconColor: "text-primary",
							},
							{
								icon: Shield,
								title: "Verified Community",
								description:
									"Connect with authenticated buyers and sellers in a secure, trusted marketplace environment.",
								gradient: "from-secondary/20 to-secondary/5",
								iconBg: "bg-secondary/10",
								iconColor: "text-secondary",
							},
							{
								icon: TrendingUp,
								title: "Real-Time Analytics",
								description:
									"Access live market data, pricing trends, and property insights to make informed decisions.",
								gradient: "from-accent/20 to-accent/5",
								iconBg: "bg-accent/10",
								iconColor: "text-accent",
							},
						].map((feature, index) => (
							<Card
								key={index}
								className="group relative bg-card/80 backdrop-blur-md border-border/50 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] sm:hover:scale-[1.05] rounded-2xl overflow-hidden sm:col-span-1 lg:col-span-1"
								style={{ animationDelay: `${index * 0.2}s` }}>
								{/* Gradient Background */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

								<CardHeader className="relative z-10 text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
									<div
										className={`mx-auto mb-4 sm:mb-6 p-3 sm:p-4 ${feature.iconBg} rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
										<feature.icon
											className={`h-8 w-8 sm:h-10 sm:w-10 ${feature.iconColor}`}
										/>
									</div>
									<CardTitle className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="relative z-10 pb-6 sm:pb-8 px-4 sm:px-6">
									<p className="text-muted-foreground text-center leading-relaxed text-sm sm:text-base">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
				{/* Background Elements */}
				<div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
				<div className="hidden sm:block absolute top-1/4 left-0 w-48 h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
				<div className="hidden sm:block absolute bottom-1/4 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="text-center mb-12 sm:mb-16">
						<div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-4 sm:mb-6">
							<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-2" />
							<span className="text-white font-semibold text-sm sm:text-base">
								Our Impact
							</span>
						</div>
						<h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
							Trusted by Thousands
						</h3>
						<p className="text-white/80 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
							Join our growing community of satisfied users who have found their
							perfect properties
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
						{[
							{ number: "50K+", label: "Active Properties", icon: Home },
							{ number: "100K+", label: "Happy Users", icon: Users },
							{
								number: "99.5%",
								label: "Satisfaction Rate",
								icon: CheckCircle,
							},
						].map((stat, index) => (
							<div
								key={index}
								className="text-center group"
								style={{ animationDelay: `${index * 0.2}s` }}>
								<div className="mx-auto mb-4 sm:mb-6 p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
									<stat.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
								</div>
								<div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
									{stat.number}
								</div>
								<div className="text-white/80 text-base sm:text-lg lg:text-xl font-medium">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

			{/* Footer */}
			<footer className="bg-card border-t border-border py-12 sm:py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-2xl mx-auto">
						<div className="mb-6 sm:mb-8">
							<h4 className="text-2xl sm:text-3xl font-bold text-primary mb-2 sm:mb-3">
								Propmize
							</h4>
							<p className="text-muted-foreground text-base sm:text-lg">
								AI-Powered Real Estate Platform
							</p>
						</div>

						{/* Decorative Element */}
						<div className="flex items-center justify-center mb-6 sm:mb-8">
							<div className="h-px bg-border flex-1 max-w-24 sm:max-w-32"></div>
							<div className="mx-3 sm:mx-4 p-2 bg-primary/10 rounded-full">
								<Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
							</div>
							<div className="h-px bg-border flex-1 max-w-24 sm:max-w-32"></div>
						</div>

						<p className="text-muted-foreground text-sm sm:text-base">
							&copy; 2025 Propmize. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}