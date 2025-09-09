"use client";

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

	const handleServiceSelection = async (
		service: string,
		mode?: "buyer" | "seller"
	) => {
		setSelectedService(service);
		setIsLoading(true);

		if (mode && isAuthenticated && user?._id) {
			try {
				const response = await apiClient.put(`/users/${user._id}/role`, {
					role: mode,
				});
				if (response.data.success) {
					setUser({ ...user, role: mode });
					setUserMode(mode);
					if (mode === "seller") {
						router.push("/seller");
					} else {
						router.push("/buyer/assistant");
					}
				}
			} catch (error) {
				console.log("API error:", error);
			}
		} else if (mode) {
			setUserMode(mode);
		}
		setIsLoading(false);
	};

	const services = [
		{
			id: "search",
			title: "Buy / Rent Property",
			subtitle: "Find your dream home or the perfect rental",
			icon: Search,
			color: "bg-blue-100 text-blue-600",
			mode: "buyer" as const,
		},
		{
			id: "manage",
			title: "Sell / Rent Property",
			subtitle: "List your property & reach genuine buyers/tenants",
			icon: Building2,
			color: "bg-green-100 text-green-600",
			mode: "seller" as const,
		},
	];

	return (
		<div className="min-h-screen flex flex-col ">
			<Image
				src={logo}
				alt="Propmize Logo"
				width={150}
				height={50}
				className="mx-auto my-8"
			/>
			{/* Main content */}
			<div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-blue-500 to-blue-300 rounded-t-4xl">
				{/* Greeting Section */}
				<div className="text-center mb-12">
					{/* <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
						Welcome to <span className="text-blue-800">Propmize</span>
					</h1> */}
					<div className="flex items-center justify-center mb-4">
						<span className="text-4xl animate-bounce">😎</span>
					</div>
					<h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-sm">
						What&apos;s on your mind?
					</h1>
					<p className="text-blue-100 mt-2 text-base md:text-lg">
						Discover your perfect property with AI-powered insights. Connect
						with verified buyers and sellers in a trusted marketplace.
					</p>
				</div>

				{/* Service Cards */}
				<div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl mb-16 relative">
					{services.map((service) => (
						<Card
							key={service.id}
							className={`cursor-pointer transition-all duration-300 rounded-2xl bg-white/90 backdrop-blur-md hover:shadow-2xl hover:scale-[1.03] ${
								selectedService === service.id
									? "ring-4 ring-offset-2 ring-blue-400"
									: ""
							}`}
							onClick={() => handleServiceSelection(service.id, service.mode)}>
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className={`p-4 rounded-xl ${service.color}`}>
										<service.icon className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h3 className="text-xl font-semibold text-gray-900 mb-1">
											{service.title}
										</h3>
										<p className="text-gray-600 text-sm">{service.subtitle}</p>
									</div>
								</div>
								<ArrowRight className="h-6 w-6 text-gray-400 animate-bounce" />
							</CardContent>
						</Card>
					))}

					{isLoading && (
						<p>
							<Loader2 className="w-4 h-4 animate-spin text-blue-800   " />
						</p>
					)}
				</div>
			</div>

			{/* Features Section */}
			<section className="py-16 lg:py-24 bg-white/80">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
							Why Choose Propmize?
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Experience the future of real estate with our innovative platform
							designed for modern property transactions.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{[
							{
								icon: Zap,
								title: "AI-Powered Insights",
								description:
									"Get intelligent property recommendations and market analysis powered by advanced AI algorithms.",
								color: "text-blue-600",
								bgColor: "bg-blue-100",
							},
							{
								icon: Shield,
								title: "Verified Community",
								description:
									"Connect with authenticated buyers and sellers in a secure, trusted marketplace environment.",
								color: "text-green-600",
								bgColor: "bg-green-100",
							},
							{
								icon: TrendingUp,
								title: "Real-Time Analytics",
								description:
									"Access live market data, pricing trends, and property insights to make informed decisions.",
								color: "text-purple-600",
								bgColor: "bg-purple-100",
							},
						].map((feature, index) => (
							<Card
								key={index}
								className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
								<CardHeader className="text-center pb-4">
									<div
										className={`mx-auto mb-4 p-4 ${feature.bgColor} rounded-full w-16 h-16 flex items-center justify-center`}>
										<feature.icon className={`h-8 w-8 ${feature.color}`} />
									</div>
									<CardTitle className="text-xl font-serif font-semibold text-gray-900 mb-2">
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 text-center">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 lg:py-24 bg-gradient-to-b from-blue-300 to-blue-500 text-white rounded-b-4xl">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
							Trusted by Thousands
						</h3>
						<p className="text-blue-100 text-lg">
							Join our growing community of satisfied users
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{[
							{ number: "50K+", label: "Active Properties", icon: Home },
							{ number: "100K+", label: "Happy Users", icon: Users },
							{
								number: "99.5%",
								label: "Satisfaction Rate",
								icon: CheckCircle,
							},
						].map((stat, index) => (
							<div key={index} className="text-center">
								<div className="mx-auto mb-4 p-3 bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center">
									<stat.icon className="h-8 w-8 text-white" />
								</div>
								<div className="text-4xl md:text-5xl font-serif font-bold mb-2">
									{stat.number}
								</div>
								<div className="text-blue-100 text-lg">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200 py-12">
				<div className="container mx-auto px-4 text-center">
					<div className="mb-8">
						<h4 className="text-2xl font-serif font-bold text-blue-600 mb-2">
							Propmize
						</h4>
						<p className="text-gray-600">AI-Powered Real Estate Platform</p>
					</div>
					<p className="text-gray-600 text-sm">
						&copy; 2025 Propmize. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
