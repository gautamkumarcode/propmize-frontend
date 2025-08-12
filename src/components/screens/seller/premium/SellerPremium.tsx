"use client";

import SellerLayout from "@/components/layout/SellerLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Camera,
	Crown,
	Diamond,
	Headphones,
	Lock,
	Rocket,
	Shield,
	Star,
	TrendingUp,
	Unlock,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";

export default function SellerPremium() {
	const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

	const premiumFeatures = [
		{
			id: "photography",
			title: "Professional Photography",
			description: "High-quality photos by certified photographers",
			icon: Camera,
			status: "available",
			benefits: [
				"Professional equipment and lighting",
				"Expert composition and editing",
				"Virtual tour integration",
				"Same-day delivery",
			],
		},
		{
			id: "priority",
			title: "Priority Support",
			description: "24/7 dedicated customer support",
			icon: Headphones,
			status: "available",
			benefits: [
				"Direct phone line to experts",
				"Live chat support",
				"Email priority response",
				"Weekend support available",
			],
		},
		{
			id: "marketing",
			title: "Advanced Marketing",
			description: "Boost your property visibility",
			icon: TrendingUp,
			status: "available",
			benefits: [
				"Featured listing placement",
				"Social media promotion",
				"Email marketing campaigns",
				"Google Ads integration",
			],
		},
		{
			id: "analytics",
			title: "Premium Analytics",
			description: "Detailed insights and reporting",
			icon: Shield,
			status: "available",
			benefits: [
				"Real-time view statistics",
				"Lead quality scoring",
				"Market trend analysis",
				"Performance benchmarking",
			],
		},
		{
			id: "verification",
			title: "Verified Badge",
			description: "Build trust with verified status",
			icon: Shield,
			status: "locked",
			benefits: [
				"Green verified checkmark",
				"Enhanced credibility",
				"Higher search ranking",
				"Increased buyer confidence",
			],
		},
		{
			id: "branding",
			title: "Custom Branding",
			description: "Personalize your listings",
			icon: Crown,
			status: "locked",
			benefits: [
				"Custom logo placement",
				"Branded contact cards",
				"Personal landing pages",
				"Professional templates",
			],
		},
	];

	const successStats = [
		{
			metric: "3x Faster",
			description: "Properties sell faster",
			icon: Rocket,
		},
		{
			metric: "67% More",
			description: "Inquiries received",
			icon: Users,
		},
		{
			metric: "45% Higher",
			description: "Conversion rate",
			icon: TrendingUp,
		},
		{
			metric: "90% Satisfied",
			description: "Customer satisfaction",
			icon: Star,
		},
	];

	const testimonials = [
		{
			name: "Rajesh Kumar",
			property: "3 BHK Villa in Mumbai",
			rating: 5,
			text: "Premium features helped me sell my property 40% above market price!",
			days: "Sold in 12 days",
		},
		{
			name: "Priya Sharma",
			property: "2 BHK Apartment in Delhi",
			rating: 5,
			text: "Professional photography made all the difference. Got multiple offers!",
			days: "Sold in 8 days",
		},
		{
			name: "Amit Patel",
			property: "Commercial Space in Bangalore",
			rating: 5,
			text: "Excellent support team and great marketing features. Highly recommended!",
			days: "Sold in 15 days",
		},
	];

	const currentPlan = {
		name: "Basic",
		expires: "Free Forever",
		features: ["3 Property Listings", "Basic Photos", "Email Support"],
		limitations: [
			"Limited visibility",
			"No professional photography",
			"Basic analytics",
		],
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }).map((_, index) => (
			<Star
				key={index}
				className={`w-4 h-4 ${
					index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
				}`}
			/>
		));
	};

	return (
		<SellerLayout>
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-8">
						{/* Header */}
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6">
								<Diamond className="w-8 h-8 text-white" />
							</div>
							<h1 className="text-4xl font-bold text-gray-900 mb-4">
								Premium Features
							</h1>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								Unlock powerful tools and exclusive features to sell your
								property faster and for better prices
							</p>
						</div>

						{/* Current Plan Status */}
						<Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold text-gray-900 mb-2">
										Current Plan: {currentPlan.name}
									</h2>
									<p className="text-gray-600 mb-4">
										Expires: {currentPlan.expires}
									</p>
									<div className="space-y-2">
										<div className="flex flex-wrap gap-2">
											{currentPlan.features.map((feature, index) => (
												<Badge
													key={index}
													className="bg-green-100 text-green-800">
													{feature}
												</Badge>
											))}
										</div>
									</div>
								</div>
								<Button
									size="lg"
									className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
									<Crown className="w-5 h-5 mr-2" />
									Upgrade Now
								</Button>
							</div>
						</Card>

						{/* Success Stats */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{successStats.map((stat, index) => {
								const IconComponent = stat.icon;
								return (
									<Card key={index} className="p-6 text-center">
										<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
											<IconComponent className="w-6 h-6 text-purple-600" />
										</div>
										<h3 className="text-2xl font-bold text-gray-900 mb-2">
											{stat.metric}
										</h3>
										<p className="text-gray-600">{stat.description}</p>
									</Card>
								);
							})}
						</div>

						{/* Premium Features Grid */}
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
								Premium Features
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{premiumFeatures.map((feature) => {
									const IconComponent = feature.icon;
									const isLocked = feature.status === "locked";
									return (
										<Card
											key={feature.id}
											className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
												selectedFeature === feature.id
													? "ring-2 ring-purple-500"
													: ""
											} ${isLocked ? "opacity-75" : ""}`}
											onClick={() =>
												setSelectedFeature(
													selectedFeature === feature.id ? null : feature.id
												)
											}>
											<div className="flex items-center justify-between mb-4">
												<div
													className={`w-12 h-12 rounded-full flex items-center justify-center ${
														isLocked ? "bg-gray-100" : "bg-purple-100"
													}`}>
													<IconComponent
														className={`w-6 h-6 ${
															isLocked ? "text-gray-400" : "text-purple-600"
														}`}
													/>
												</div>
												{isLocked ? (
													<Lock className="w-5 h-5 text-gray-400" />
												) : (
													<Unlock className="w-5 h-5 text-green-500" />
												)}
											</div>

											<h3 className="text-xl font-bold text-gray-900 mb-2">
												{feature.title}
											</h3>
											<p className="text-gray-600 mb-4">
												{feature.description}
											</p>

											{selectedFeature === feature.id && (
												<div className="space-y-3">
													<h4 className="font-semibold text-gray-900">
														Benefits:
													</h4>
													<ul className="space-y-2">
														{feature.benefits.map((benefit, index) => (
															<li key={index} className="flex items-start">
																<Zap className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
																<span className="text-sm text-gray-700">
																	{benefit}
																</span>
															</li>
														))}
													</ul>
													{!isLocked && (
														<Button className="w-full mt-4" size="sm">
															Activate Now
														</Button>
													)}
													{isLocked && (
														<Button
															className="w-full mt-4"
															variant="outline"
															size="sm">
															<Crown className="w-4 h-4 mr-2" />
															Upgrade Required
														</Button>
													)}
												</div>
											)}
										</Card>
									);
								})}
							</div>
						</div>

						{/* Testimonials */}
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
								Success Stories
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{testimonials.map((testimonial, index) => (
									<Card key={index} className="p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center">
												{renderStars(testimonial.rating)}
											</div>
											<Badge className="bg-green-100 text-green-800">
												{testimonial.days}
											</Badge>
										</div>
										<blockquote className="text-gray-700 mb-4">
											"{testimonial.text}"
										</blockquote>
										<div>
											<p className="font-semibold text-gray-900">
												{testimonial.name}
											</p>
											<p className="text-sm text-gray-600">
												{testimonial.property}
											</p>
										</div>
									</Card>
								))}
							</div>
						</div>

						{/* Pricing CTA */}
						<Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
							<Crown className="w-16 h-16 mx-auto mb-6 text-white" />
							<h2 className="text-3xl font-bold mb-4">Ready to Sell Faster?</h2>
							<p className="text-xl mb-8 text-purple-100">
								Join thousands of successful sellers who chose Premium
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									className="bg-white text-purple-600 hover:bg-gray-100">
									<TrendingUp className="w-5 h-5 mr-2" />
									View All Plans
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-white text-white hover:bg-white hover:text-purple-600">
									<Headphones className="w-5 h-5 mr-2" />
									Talk to Expert
								</Button>
							</div>
							<div className="mt-6 text-sm text-purple-100">
								30-day money-back guarantee • Cancel anytime • No hidden fees
							</div>
						</Card>
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
