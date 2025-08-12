"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	ArrowRight,
	Building,
	Eye,
	Heart,
	Home,
	Plus,
	RotateCcw,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SwitchMode() {
	const router = useRouter();
	const [selectedMode, setSelectedMode] = useState<"buyer" | "seller" | null>(
		null
	);

	const buyerFeatures = [
		{
			icon: Eye,
			title: "Smart Property Search",
			description: "AI-powered search to find your perfect home",
		},
		{
			icon: Heart,
			title: "Save & Compare",
			description: "Save favorites and compare properties easily",
		},
		{
			icon: Users,
			title: "Connect with Owners",
			description: "Direct communication with property owners",
		},
		{
			icon: TrendingUp,
			title: "Market Insights",
			description: "Get real-time market trends and pricing",
		},
	];

	const sellerFeatures = [
		{
			icon: Plus,
			title: "List Properties",
			description: "Easy property listing with professional photos",
		},
		{
			icon: Users,
			title: "Manage Inquiries",
			description: "Track and respond to buyer inquiries",
		},
		{
			icon: TrendingUp,
			title: "Analytics Dashboard",
			description: "Monitor views, leads, and performance metrics",
		},
		{
			icon: Building,
			title: "Premium Tools",
			description: "Advanced marketing tools for better visibility",
		},
	];

	const handleSwitchMode = (mode: "buyer" | "seller") => {
		if (mode === "buyer") {
			router.push("/");
		} else {
			router.push("/seller");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-6xl mx-auto px-4 py-16">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
						<RotateCcw className="w-8 h-8 text-blue-600" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Choose Your Mode
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Switch between buyer and seller modes to access different features
						and tools
					</p>
				</div>

				{/* Mode Selection */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{/* Buyer Mode */}
					<Card
						className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-xl ${
							selectedMode === "buyer"
								? "ring-2 ring-blue-500 shadow-xl"
								: "hover:shadow-lg"
						}`}
						onClick={() => setSelectedMode("buyer")}>
						<div className="text-center mb-6">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
								<Home className="w-10 h-10 text-blue-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Buyer Mode
							</h2>
							<p className="text-gray-600">
								Find and purchase your dream property
							</p>
						</div>

						<div className="space-y-4">
							{buyerFeatures.map((feature, index) => (
								<div key={index} className="flex items-start space-x-3">
									<div className="p-2 bg-blue-50 rounded-lg">
										<feature.icon className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<h3 className="font-medium text-gray-900">
											{feature.title}
										</h3>
										<p className="text-sm text-gray-600">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>

						<Button
							className="w-full mt-6"
							onClick={() => handleSwitchMode("buyer")}
							variant={selectedMode === "buyer" ? "default" : "outline"}>
							<Home className="w-4 h-4 mr-2" />
							Switch to Buyer Mode
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</Card>

					{/* Seller Mode */}
					<Card
						className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-xl ${
							selectedMode === "seller"
								? "ring-2 ring-purple-500 shadow-xl"
								: "hover:shadow-lg"
						}`}
						onClick={() => setSelectedMode("seller")}>
						<div className="text-center mb-6">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
								<Building className="w-10 h-10 text-purple-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Seller Mode
							</h2>
							<p className="text-gray-600">
								List and sell your properties effectively
							</p>
						</div>

						<div className="space-y-4">
							{sellerFeatures.map((feature, index) => (
								<div key={index} className="flex items-start space-x-3">
									<div className="p-2 bg-purple-50 rounded-lg">
										<feature.icon className="w-5 h-5 text-purple-600" />
									</div>
									<div>
										<h3 className="font-medium text-gray-900">
											{feature.title}
										</h3>
										<p className="text-sm text-gray-600">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>

						<Button
							className="w-full mt-6"
							onClick={() => handleSwitchMode("seller")}
							variant={selectedMode === "seller" ? "default" : "outline"}>
							<Building className="w-4 h-4 mr-2" />
							Switch to Seller Mode
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</Card>
				</div>

				{/* Benefits Section */}
				<div className="text-center">
					<div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
						<h3 className="text-2xl font-bold text-gray-900 mb-4">
							Why Switch Modes?
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
									<Eye className="w-6 h-6 text-green-600" />
								</div>
								<h4 className="font-semibold mb-2">Different Perspectives</h4>
								<p className="text-sm text-gray-600">
									Experience both sides of the real estate market
								</p>
							</div>
							<div>
								<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
									<TrendingUp className="w-6 h-6 text-yellow-600" />
								</div>
								<h4 className="font-semibold mb-2">Better Understanding</h4>
								<p className="text-sm text-gray-600">
									Understand market dynamics from all angles
								</p>
							</div>
							<div>
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
									<Users className="w-6 h-6 text-blue-600" />
								</div>
								<h4 className="font-semibold mb-2">Unified Experience</h4>
								<p className="text-sm text-gray-600">
									Seamlessly switch between buying and selling
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
