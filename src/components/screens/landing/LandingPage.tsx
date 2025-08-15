"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Building2, Home, Search, TrendingUp, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
	const router = useRouter();
	const [selectedMode, setSelectedMode] = useState<"buyer" | "seller" | null>(
		null
	);

	const handleModeSelection = (mode: "buyer" | "seller") => {
		setSelectedMode(mode);
		// Add a small delay for better UX
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
			{/* Header */}
			<header className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-center">
					<div className="flex items-center space-x-2">
						<Building2 className="h-8 w-8 text-blue-600" />
						<h1 className="text-2xl font-bold text-gray-900">Propmize</h1>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Welcome to Propmize
					</h2>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Your gateway to the perfect property experience. Choose your role to
						get started.
					</p>
				</div>

				{/* Mode Selection Cards */}
				<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
					{/* Buyer Card */}
					<Card
						className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
							selectedMode === "buyer"
								? "ring-4 ring-blue-500 shadow-2xl scale-105"
								: ""
						}`}
						onClick={() => handleModeSelection("buyer")}>
						<CardHeader className="text-center pb-4">
							<div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
								<Search className="h-10 w-10 text-blue-600" />
							</div>
							<CardTitle className="text-2xl text-blue-900">
								I'm Looking to Buy
							</CardTitle>
							<CardDescription className="text-gray-600">
								Find your dream property with AI-powered assistance
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="flex items-center text-sm text-gray-700">
									<Home className="h-4 w-4 mr-2 text-blue-500" />
									Browse thousands of properties
								</div>
								<div className="flex items-center text-sm text-gray-700">
									<Zap className="h-4 w-4 mr-2 text-blue-500" />
									AI-powered property recommendations
								</div>
								<div className="flex items-center text-sm text-gray-700">
									<Users className="h-4 w-4 mr-2 text-blue-500" />
									Direct contact with property owners
								</div>
							</div>
							<Button
								className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
								size="lg">
								Start as Buyer
							</Button>
						</CardContent>
					</Card>

					{/* Seller Card */}
					<Card
						className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
							selectedMode === "seller"
								? "ring-4 ring-green-500 shadow-2xl scale-105"
								: ""
						}`}
						onClick={() => handleModeSelection("seller")}>
						<CardHeader className="text-center pb-4">
							<div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
								<Building2 className="h-10 w-10 text-green-600" />
							</div>
							<CardTitle className="text-2xl text-green-900">
								I Want to Sell
							</CardTitle>
							<CardDescription className="text-gray-600">
								List your property and connect with potential buyers
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="flex items-center text-sm text-gray-700">
									<TrendingUp className="h-4 w-4 mr-2 text-green-500" />
									Advanced analytics and insights
								</div>
								<div className="flex items-center text-sm text-gray-700">
									<Users className="h-4 w-4 mr-2 text-green-500" />
									Manage leads and inquiries
								</div>
								<div className="flex items-center text-sm text-gray-700">
									<Zap className="h-4 w-4 mr-2 text-green-500" />
									Premium listing features
								</div>
							</div>
							<Button
								className="w-full bg-green-600 hover:bg-green-700 transition-colors"
								size="lg">
								Start as Seller
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Features Section */}
				<div className="text-center">
					<h3 className="text-2xl font-semibold text-gray-900 mb-6">
						Why Choose Propmize?
					</h3>
					<div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
						<div className="text-center">
							<div className="mx-auto mb-3 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
								<Zap className="h-8 w-8 text-purple-600" />
							</div>
							<h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
							<p className="text-sm text-gray-600">
								Smart recommendations and instant assistance
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-3 p-3 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center">
								<Users className="h-8 w-8 text-orange-600" />
							</div>
							<h4 className="font-semibold text-gray-900 mb-2">
								Verified Users
							</h4>
							<p className="text-sm text-gray-600">
								Connect with genuine buyers and sellers
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-3 p-3 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
								<TrendingUp className="h-8 w-8 text-red-600" />
							</div>
							<h4 className="font-semibold text-gray-900 mb-2">
								Market Insights
							</h4>
							<p className="text-sm text-gray-600">
								Real-time market data and trends
							</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="container mx-auto px-4 py-8 text-center text-gray-500">
				<p>&copy; 2025 Propmize. All rights reserved.</p>
			</footer>
		</div>
	);
}
