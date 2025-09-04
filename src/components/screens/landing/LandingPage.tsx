"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Building2,
	Clock,
	Home,
	Search,
	Shield,
	Sparkles,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
	const router = useRouter();
	const [selectedMode, setSelectedMode] = useState<"buyer" | "seller" | null>(
		null
	);

	const handleModeSelection = (mode: "buyer" | "seller") => {
		setSelectedMode(mode);
		setTimeout(() => {
			if (mode === "buyer") {
				router.push("/buyer/assistant");
			} else {
				router.push("/seller");
			}
		}, 300);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Main Content */}
			<main className="mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8 md:mb-12">
					<div className="inline-flex items-center justify-center mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
						<Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
						AI-Powered Real Estate
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
						Welcome to{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Propmize
						</span>
					</h2>

					<p className="text-sm md:text-md text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
						Your gateway to the perfect property experience. Choose your role to
						get started.
					</p>
				</div>

				{/* Mode Selection Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
					{/* Buyer Card */}
					<Card
						className={`cursor-pointer transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:scale-102 md:hover:scale-105 p-0 border-2 ${
							selectedMode === "buyer"
								? "ring-4 ring-blue-500 shadow-xl md:shadow-2xl scale-102 md:scale-105 border-blue-300"
								: "border-transparent hover:border-blue-200"
						}`}
						onClick={() => handleModeSelection("buyer")}>
						<CardHeader className="text-center py-4 md:py-6 px-2 md:px-4">
							<div className="mx-auto mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
								<Search className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-blue-600" />
							</div>
							<CardTitle className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900">
								Looking to Buy
							</CardTitle>
							<CardDescription className="text-gray-600 text-xs md:text-sm lg:block hidden">
								Find your dream property with AI-powered assistance
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 md:space-y-4 px-3 md:px-4 pb-4 md:pb-6">
							<div className="space-y-2 md:space-y-3 lg:block hidden">
								<div className="flex items-center text-xs md:text-sm text-gray-700">
									<Home className="h-3 w-3 md:h-4 md:w-4 mr-2 text-blue-500" />
									Browse thousands of properties
								</div>
								<div className="flex items-center text-xs md:text-sm text-gray-700">
									<Zap className="h-3 w-3 md:h-4 md:w-4 mr-2 text-blue-500" />
									AI-powered property recommendations
								</div>
								<div className="flex items-center text-xs md:text-sm text-gray-700">
									<Users className="h-3 w-3 md:h-4 md:w-4 mr-2 text-blue-500" />
									Direct contact with property owners
								</div>
							</div>
							<Button
								className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm md:text-base py-2 md:py-3"
								size="lg">
								Start as Buyer
							</Button>
						</CardContent>
					</Card>

					{/* Seller Card */}
					<Card
						className={`cursor-pointer transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:scale-102 md:hover:scale-105 p-0 border-2 ${
							selectedMode === "seller"
								? "ring-4 ring-green-500 shadow-xl md:shadow-2xl scale-102 md:scale-105 border-green-300"
								: "border-transparent hover:border-green-200"
						}`}
						onClick={() => handleModeSelection("seller")}>
						<CardHeader className="text-center py-4 md:py-6 px-2 md:px-4">
							<div className="mx-auto mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
								<Building2 className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-green-600" />
							</div>
							<CardTitle className="text-lg md:text-xl lg:text-2xl font-bold text-green-900">
								Looking to Sell
							</CardTitle>
							<CardDescription className="text-gray-600 text-xs md:text-sm lg:block hidden">
								List your property and connect with potential buyers
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 md:space-y-4 px-3 md:px-4 pb-4 md:pb-6">
							<div className="space-y-2 md:space-y-3 lg:block hidden">
								<div className="flex items-center text-xs md:text-sm text-gray-700">
									<TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-2 text-green-500" />
									Advanced analytics and insights
								</div>
								<div className="flex items-center text-xs md:text-sm text-gray-700">
									<Users className="h-3 w-3 md:h-4 md:w-4 mr-2 text-green-500" />
									Manage leads and inquiries
								</div>
								<div className="flex items-center text-xs md:text-sm text-gray-700">
									<Zap className="h-3 w-3 md:h-4 md:w-4 mr-2 text-green-500" />
									Premium listing features
								</div>
							</div>
							<Button
								className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium text-sm md:text-base py-2 md:py-3"
								size="lg">
								Start as Seller
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Features Section */}
				<div className="text-center">
					<h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 md:mb-8">
						Why Choose Propmize?
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
						{[
							{
								icon: Zap,
								title: "AI-Powered",
								description: "Smart recommendations and instant assistance",
								color: "purple",
								bg: "bg-purple-100",
								text: "text-purple-600",
							},
							{
								icon: Shield,
								title: "Verified Users",
								description: "Connect with genuine buyers and sellers",
								color: "orange",
								bg: "bg-orange-100",
								text: "text-orange-600",
							},
							{
								icon: Clock,
								title: "Instant Results",
								description: "Get matched with properties in seconds",
								color: "red",
								bg: "bg-red-100",
								text: "text-red-600",
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-white rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
								<div
									className={`mx-auto mb-3 md:mb-4 p-2 md:p-3 ${feature.bg} rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center`}>
									<feature.icon
										className={`h-5 w-5 md:h-6 md:w-6 ${feature.text}`}
									/>
								</div>
								<h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
									{feature.title}
								</h4>
								<p className="text-gray-600 text-xs md:text-sm">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Stats Section */}
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white text-center mt-8 md:mt-12">
					<h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
						Trusted by Thousands
					</h4>
					<div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto">
						{[
							{ number: "10K+", label: "Properties" },
							{ number: "50K+", label: "Users" },
							{ number: "99%", label: "Satisfaction" },
						].map((stat, index) => (
							<div key={index}>
								<div className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
									{stat.number}
								</div>
								<div className="text-blue-100 text-xs md:text-sm">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="container mx-auto px-4 py-6 md:py-8 text-center text-gray-500 text-sm md:text-base">
				<p>&copy; 2025 Propmize. All rights reserved.</p>
			</footer>
		</div>
	);
}