"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Check,
	Crown,
	Diamond,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";

export default function SellerPlans() {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

	const plans = [
		{
			id: "basic",
			name: "Basic",
			price: "Free",
			duration: "Forever",
			color: "border-gray-200",
			headerColor: "bg-gray-50",
			features: [
				"List up to 3 properties",
				"Basic property photos",
				"Standard listing visibility",
				"Email support",
				"Basic analytics",
			],
			limitations: [
				"Limited to 3 active listings",
				"No premium features",
				"Standard customer support",
			],
		},
		{
			id: "premium",
			name: "Premium",
			price: "₹999",
			duration: "per month",
			color: "border-blue-500",
			headerColor: "bg-blue-50",
			popular: true,
			features: [
				"List up to 25 properties",
				"Professional photography service",
				"Priority listing visibility",
				"24/7 phone & chat support",
				"Advanced analytics & insights",
				"Lead management tools",
				"Virtual tour integration",
				"Social media promotion",
			],
			limitations: [],
		},
		{
			id: "enterprise",
			name: "Enterprise",
			price: "₹2499",
			duration: "per month",
			color: "border-purple-500",
			headerColor: "bg-purple-50",
			features: [
				"Unlimited property listings",
				"Dedicated account manager",
				"Custom branding options",
				"API access",
				"White-label solutions",
				"Advanced lead scoring",
				"Custom integrations",
				"Priority customer support",
				"Market trend reports",
				"Bulk upload tools",
			],
			limitations: [],
		},
	];

	const handleSelectPlan = (planId: string) => {
		setSelectedPlan(planId);
		// Handle plan selection logic
		console.log("Selected plan:", planId);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{/* Header */}
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
							<Crown className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Choose Your Seller Plan
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Unlock powerful tools and features to sell your properties
							faster and more effectively
						</p>
					</div>

					{/* Current Plan Status */}
					<Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
									<Star className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										Current Plan: Basic
									</h3>
									<p className="text-gray-600">
										You have 2 of 3 available listings used
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-sm text-gray-500">Next billing date</p>
								<p className="font-semibold">Free Forever</p>
							</div>
						</div>
					</Card>

					{/* Plans Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{plans.map((plan) => (
							<Card
								key={plan.id}
								className={`relative overflow-hidden ${plan.color} ${
									plan.popular
										? "ring-2 ring-blue-500 shadow-xl"
										: "shadow-lg"
								} ${
									selectedPlan === plan.id ? "ring-2 ring-green-500" : ""
								}`}>
								{plan.popular && (
									<div className="absolute top-0 right-0">
										<Badge className="bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg">
											Most Popular
										</Badge>
									</div>
								)}

								<div className={`${plan.headerColor} p-6 text-center`}>
									<div className="mb-4">
										{plan.id === "basic" && (
											<Zap className="w-12 h-12 mx-auto text-gray-600" />
										)}
										{plan.id === "premium" && (
											<Crown className="w-12 h-12 mx-auto text-blue-600" />
										)}
										{plan.id === "enterprise" && (
											<Diamond className="w-12 h-12 mx-auto text-purple-600" />
										)}
									</div>
									<h3 className="text-2xl font-bold text-gray-900 mb-2">
										{plan.name}
									</h3>
									<div className="mb-4">
										<span className="text-4xl font-bold text-gray-900">
											{plan.price}
										</span>
										{plan.duration !== "Forever" && (
											<span className="text-gray-600 ml-2">
												{plan.duration}
											</span>
										)}
									</div>
								</div>

								<div className="p-6">
									<div className="space-y-4 mb-6">
										{plan.features.map((feature, index) => (
											<div key={index} className="flex items-start">
												<Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
												<span className="text-gray-700">{feature}</span>
											</div>
										))}
									</div>

									<Button
										className="w-full mb-4"
										variant={plan.id === "basic" ? "outline" : "default"}
										onClick={() => handleSelectPlan(plan.id)}>
										{plan.id === "basic"
											? "Current Plan"
											: `Upgrade to ${plan.name}`}
									</Button>

									{plan.limitations.length > 0 && (
										<div className="border-t pt-4">
											<p className="text-sm font-medium text-gray-900 mb-2">
												Limitations:
											</p>
											<div className="space-y-2">
												{plan.limitations.map((limitation, index) => (
													<div key={index} className="flex items-start">
														<span className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
														<span className="text-sm text-gray-600">
															{limitation}
														</span>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</Card>
						))}
					</div>

					{/* Features Comparison */}
					<Card className="p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
							Feature Comparison
						</h2>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4">Features</th>
										<th className="text-center py-3 px-4">Basic</th>
										<th className="text-center py-3 px-4">Premium</th>
										<th className="text-center py-3 px-4">Enterprise</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-b">
										<td className="py-3 px-4 font-medium">
											Property Listings
										</td>
										<td className="text-center py-3 px-4">3</td>
										<td className="text-center py-3 px-4">25</td>
										<td className="text-center py-3 px-4">Unlimited</td>
									</tr>
									<tr className="border-b">
										<td className="py-3 px-4 font-medium">
											Professional Photos
										</td>
										<td className="text-center py-3 px-4">❌</td>
										<td className="text-center py-3 px-4">✅</td>
										<td className="text-center py-3 px-4">✅</td>
									</tr>
									<tr className="border-b">
										<td className="py-3 px-4 font-medium">
											Priority Support
										</td>
										<td className="text-center py-3 px-4">❌</td>
										<td className="text-center py-3 px-4">✅</td>
										<td className="text-center py-3 px-4">✅</td>
									</tr>
									<tr className="border-b">
										<td className="py-3 px-4 font-medium">
											Advanced Analytics
										</td>
										<td className="text-center py-3 px-4">❌</td>
										<td className="text-center py-3 px-4">✅</td>
										<td className="text-center py-3 px-4">✅</td>
									</tr>
									<tr className="border-b">
										<td className="py-3 px-4 font-medium">
											Dedicated Manager
										</td>
										<td className="text-center py-3 px-4">❌</td>
										<td className="text-center py-3 px-4">❌</td>
										<td className="text-center py-3 px-4">✅</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Card>

					{/* Success Stories */}
					<Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
							Success Stories
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingUp className="w-8 h-8 text-green-600" />
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">
									3x Faster Sales
								</h3>
								<p className="text-gray-600">
									Premium sellers sell properties 3x faster than basic users
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Users className="w-8 h-8 text-blue-600" />
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">
									5x More Inquiries
								</h3>
								<p className="text-gray-600">
									Premium listings receive significantly more buyer inquiries
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Star className="w-8 h-8 text-purple-600" />
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">
									Higher Ratings
								</h3>
								<p className="text-gray-600">
									Premium sellers maintain higher customer satisfaction
									ratings
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
