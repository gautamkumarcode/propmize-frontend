"use client";

import SellerLayout from "@/components/custom/layout/SellerLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	BookOpen,
	Camera,
	CheckCircle,
	Clock,
	DollarSign,
	FileText,
	Home,
	MessageSquare,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import React, { useState } from "react";

export default function SellerGuide() {
	const [activeStep, setActiveStep] = useState<number>(0);

	const sellingSteps = [
		{
			id: 1,
			title: "Property Preparation",
			description: "Get your property ready for listing",
			icon: Home,
			status: "completed",
			time: "1-2 weeks",
		},
		{
			id: 2,
			title: "Documentation",
			description: "Gather all necessary documents",
			icon: FileText,
			status: "in-progress",
			time: "3-5 days",
		},
		{
			id: 3,
			title: "Pricing Strategy",
			description: "Set the right price for your property",
			icon: DollarSign,
			status: "pending",
			time: "1-2 days",
		},
		{
			id: 4,
			title: "Photography",
			description: "Capture professional property photos",
			icon: Camera,
			status: "pending",
			time: "1 day",
		},
		{
			id: 5,
			title: "Listing Creation",
			description: "Create compelling property listing",
			icon: Target,
			status: "pending",
			time: "2-3 hours",
		},
		{
			id: 6,
			title: "Marketing",
			description: "Promote your property effectively",
			icon: TrendingUp,
			status: "pending",
			time: "Ongoing",
		},
		{
			id: 7,
			title: "Lead Management",
			description: "Handle inquiries and viewings",
			icon: Users,
			status: "pending",
			time: "Ongoing",
		},
		{
			id: 8,
			title: "Closing",
			description: "Complete the sale process",
			icon: CheckCircle,
			status: "pending",
			time: "2-4 weeks",
		},
	];

	const tips = [
		{
			category: "Preparation",
			items: [
				"Deep clean your property inside and out",
				"Fix any minor repairs and maintenance issues",
				"Remove personal items and declutter",
				"Consider staging to highlight property features",
				"Ensure all appliances are working properly",
			],
		},
		{
			category: "Photography",
			items: [
				"Use natural light whenever possible",
				"Capture wide-angle shots of each room",
				"Include exterior and surrounding area photos",
				"Highlight unique features and selling points",
				"Take photos during the best time of day",
			],
		},
		{
			category: "Pricing",
			items: [
				"Research comparable properties in your area",
				"Consider current market conditions",
				"Factor in unique features and upgrades",
				"Be realistic about your property's value",
				"Consider pricing slightly below market for quick sale",
			],
		},
		{
			category: "Marketing",
			items: [
				"Write a compelling property description",
				"Highlight key features and benefits",
				"Use high-quality photos",
				"Promote on multiple platforms",
				"Respond quickly to inquiries",
			],
		},
	];

	const faqs = [
		{
			question: "How long does it typically take to sell a property?",
			answer:
				"The average time to sell depends on location, price, and market conditions. Typically, well-priced properties sell within 30-90 days.",
		},
		{
			question: "What documents do I need to sell my property?",
			answer:
				"You'll need property title, NOC, completion certificate, occupancy certificate, tax receipts, and maintenance records.",
		},
		{
			question: "Should I hire a professional photographer?",
			answer:
				"Professional photos can significantly increase inquiries. They help showcase your property in the best light and attract more serious buyers.",
		},
		{
			question: "How do I determine the right price?",
			answer:
				"Research similar properties, consider recent sales, factor in current market trends, and evaluate your property's unique features.",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-green-600 bg-green-100";
			case "in-progress":
				return "text-blue-600 bg-blue-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="w-4 h-4" />;
			case "in-progress":
				return <Clock className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4 opacity-50" />;
		}
	};

	return (
		<SellerLayout>
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-8">
						{/* Header */}
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
								<BookOpen className="w-8 h-8 text-white" />
							</div>
							<h1 className="text-4xl font-bold text-gray-900 mb-4">
								Seller's Guide
							</h1>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								A comprehensive guide to help you sell your property quickly and
								for the best price
							</p>
						</div>

						{/* Progress Overview */}
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-gray-900">
									Your Selling Journey
								</h2>
								<Badge className="bg-blue-100 text-blue-800">
									Step 2 of 8 in progress
								</Badge>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{sellingSteps.map((step, index) => {
									const IconComponent = step.icon;
									return (
										<Card
											key={step.id}
											className={`p-4 cursor-pointer transition-all ${
												activeStep === index ? "ring-2 ring-blue-500" : ""
											}`}
											onClick={() => setActiveStep(index)}>
											<div className="flex items-center space-x-3 mb-3">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
														step.status
													)}`}>
													<IconComponent className="w-5 h-5" />
												</div>
												<div
													className={`flex items-center ${getStatusColor(
														step.status
													)} px-2 py-1 rounded-full text-xs font-medium`}>
													{getStatusIcon(step.status)}
													<span className="ml-1 capitalize">
														{step.status.replace("-", " ")}
													</span>
												</div>
											</div>
											<h3 className="font-semibold text-gray-900 mb-1">
												{step.title}
											</h3>
											<p className="text-sm text-gray-600 mb-2">
												{step.description}
											</p>
											<div className="flex items-center text-xs text-gray-500">
												<Clock className="w-3 h-3 mr-1" />
												{step.time}
											</div>
										</Card>
									);
								})}
							</div>
						</Card>

						{/* Step Details */}
						<Card className="p-6">
							<div className="flex items-center space-x-4 mb-6">
								{React.createElement(sellingSteps[activeStep].icon, {
									className: "w-8 h-8 text-blue-600",
								})}
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										{sellingSteps[activeStep].title}
									</h2>
									<p className="text-gray-600">
										{sellingSteps[activeStep].description}
									</p>
								</div>
							</div>

							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										What you need to do:
									</h3>
									<div className="bg-gray-50 rounded-lg p-4">
										<p className="text-gray-700">
											{activeStep === 0 &&
												"Prepare your property for potential buyers by cleaning, decluttering, and making necessary repairs."}
											{activeStep === 1 &&
												"Gather all necessary legal documents including title deed, NOC, and certificates."}
											{activeStep === 2 &&
												"Research market prices and set a competitive price for your property."}
											{activeStep === 3 &&
												"Arrange for professional photography or take high-quality photos yourself."}
											{activeStep === 4 &&
												"Create an attractive listing with compelling descriptions and photos."}
											{activeStep === 5 &&
												"Promote your property through various marketing channels."}
											{activeStep === 6 &&
												"Manage inquiries, schedule viewings, and negotiate with potential buyers."}
											{activeStep === 7 &&
												"Complete legal formalities and transfer ownership to the buyer."}
										</p>
									</div>
								</div>

								<div className="flex space-x-4">
									{activeStep > 0 && (
										<Button
											variant="outline"
											onClick={() => setActiveStep(activeStep - 1)}>
											Previous Step
										</Button>
									)}
									{activeStep < sellingSteps.length - 1 && (
										<Button onClick={() => setActiveStep(activeStep + 1)}>
											Next Step
										</Button>
									)}
								</div>
							</div>
						</Card>

						{/* Tips Section */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{tips.map((tip, index) => (
								<Card key={index} className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-4">
										{tip.category} Tips
									</h3>
									<div className="space-y-3">
										{tip.items.map((item, itemIndex) => (
											<div key={itemIndex} className="flex items-start">
												<Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
												<span className="text-gray-700">{item}</span>
											</div>
										))}
									</div>
								</Card>
							))}
						</div>

						{/* FAQ Section */}
						<Card className="p-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Frequently Asked Questions
							</h2>
							<div className="space-y-6">
								{faqs.map((faq, index) => (
									<div key={index} className="border-b border-gray-200 pb-6">
										<div className="flex items-start">
											<MessageSquare className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
											<div>
												<h3 className="text-lg font-semibold text-gray-900 mb-2">
													{faq.question}
												</h3>
												<p className="text-gray-700">{faq.answer}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</Card>

						{/* CTA */}
						<Card className="p-8 bg-gradient-to-r from-blue-50 to-green-50 text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								Ready to Start Selling?
							</h2>
							<p className="text-gray-600 mb-6">
								Follow our step-by-step guide and get expert support throughout
								your selling journey
							</p>
							<div className="space-x-4">
								<Button size="lg">List Your Property</Button>
								<Button variant="outline" size="lg">
									Get Expert Help
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
