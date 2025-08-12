"use client";

import BuyerLayout from "@/components/layout/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	BookOpen,
	Calculator,
	CheckCircle,
	Download,
	FileText,
	Lightbulb,
	PlayCircle,
	Search,
	Star,
} from "lucide-react";
import { useState } from "react";

export default function Guide() {
	const [activeTab, setActiveTab] = useState("getting-started");

	const guideCategories = [
		{
			id: "getting-started",
			title: "Getting Started",
			icon: BookOpen,
			articles: [
				{
					title: "First Time Home Buyer's Complete Guide",
					description:
						"Everything you need to know before buying your first home",
					readTime: "12 min read",
					difficulty: "Beginner",
					rating: 4.8,
				},
				{
					title: "Understanding Property Types in India",
					description: "Apartment vs Villa vs Plot - What's right for you?",
					readTime: "8 min read",
					difficulty: "Beginner",
					rating: 4.6,
				},
				{
					title: "Location Research: How to Choose the Right Area",
					description: "Factors to consider when selecting a neighborhood",
					readTime: "15 min read",
					difficulty: "Intermediate",
					rating: 4.7,
				},
			],
		},
		{
			id: "legal",
			title: "Legal & Documentation",
			icon: FileText,
			articles: [
				{
					title: "Essential Documents Checklist",
					description: "Must-have documents before property purchase",
					readTime: "10 min read",
					difficulty: "Beginner",
					rating: 4.9,
				},
				{
					title: "Understanding Property Registration Process",
					description: "Step-by-step guide to property registration in India",
					readTime: "20 min read",
					difficulty: "Advanced",
					rating: 4.5,
				},
				{
					title: "RERA Guidelines for Home Buyers",
					description: "Your rights and protections under RERA",
					readTime: "12 min read",
					difficulty: "Intermediate",
					rating: 4.4,
				},
			],
		},
		{
			id: "finance",
			title: "Finance & Investment",
			icon: Calculator,
			articles: [
				{
					title: "Home Loan Complete Guide",
					description:
						"Types of home loans, eligibility, and application process",
					readTime: "25 min read",
					difficulty: "Intermediate",
					rating: 4.8,
				},
				{
					title: "Property Investment Analysis",
					description: "How to evaluate property as an investment",
					readTime: "18 min read",
					difficulty: "Advanced",
					rating: 4.6,
				},
				{
					title: "Tax Benefits on Home Purchase",
					description: "Section 80C, 24(b) and other tax savings",
					readTime: "14 min read",
					difficulty: "Intermediate",
					rating: 4.7,
				},
			],
		},
		{
			id: "tips",
			title: "Expert Tips",
			icon: Lightbulb,
			articles: [
				{
					title: "Negotiation Strategies for Property Purchase",
					description: "How to get the best deal on your property",
					readTime: "16 min read",
					difficulty: "Intermediate",
					rating: 4.5,
				},
				{
					title: "Property Inspection Checklist",
					description: "What to look for during property visits",
					readTime: "11 min read",
					difficulty: "Beginner",
					rating: 4.8,
				},
				{
					title: "Timing Your Property Purchase",
					description: "Best time to buy property in different markets",
					readTime: "13 min read",
					difficulty: "Advanced",
					rating: 4.4,
				},
			],
		},
	];

	const tools = [
		{
			title: "EMI Calculator",
			description: "Calculate your monthly home loan EMI",
			icon: Calculator,
			action: "Calculate",
		},
		{
			title: "Affordability Calculator",
			description: "Find out how much property you can afford",
			icon: Calculator,
			action: "Check",
		},
		{
			title: "Property Comparison Tool",
			description: "Compare multiple properties side by side",
			icon: Search,
			action: "Compare",
		},
		{
			title: "Legal Document Templates",
			description: "Download standard agreement formats",
			icon: Download,
			action: "Download",
		},
	];

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Beginner":
				return "bg-green-100 text-green-800";
			case "Intermediate":
				return "bg-yellow-100 text-yellow-800";
			case "Advanced":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<BuyerLayout>
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-6">
						{/* Header */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold text-gray-900 flex items-center">
										<BookOpen className="w-6 h-6 mr-3 text-blue-500" />
										Buyer's Guide & Advice
									</h1>
									<p className="text-gray-600 mt-1">
										Expert guidance for your property buying journey
									</p>
								</div>
								<Button>
									<PlayCircle className="w-4 h-4 mr-2" />
									Watch Video Guide
								</Button>
							</div>
						</div>

						{/* Quick Tools */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-semibold mb-4">Quick Tools</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{tools.map((tool, index) => (
									<Card
										key={index}
										className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
										<div className="flex items-start space-x-3">
											<div className="p-2 bg-blue-100 rounded-lg">
												<tool.icon className="w-5 h-5 text-blue-600" />
											</div>
											<div className="flex-1">
												<h3 className="font-medium text-gray-900 mb-1">
													{tool.title}
												</h3>
												<p className="text-sm text-gray-600 mb-3">
													{tool.description}
												</p>
												<Button size="sm" variant="outline">
													{tool.action}
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						{/* Guide Categories */}
						<div className="bg-white rounded-lg shadow-sm">
							<div className="border-b">
								<div className="flex space-x-8 px-6">
									{guideCategories.map((category) => (
										<button
											key={category.id}
											onClick={() => setActiveTab(category.id)}
											className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
												activeTab === category.id
													? "border-blue-500 text-blue-600"
													: "border-transparent text-gray-500 hover:text-gray-700"
											}`}>
											<category.icon className="w-4 h-4" />
											<span>{category.title}</span>
										</button>
									))}
								</div>
							</div>

							<div className="p-6">
								{guideCategories.map((category) => (
									<div
										key={category.id}
										className={activeTab === category.id ? "block" : "hidden"}>
										<div className="space-y-4">
											{category.articles.map((article, index) => (
												<Card
													key={index}
													className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<h3 className="text-lg font-semibold text-gray-900 mb-2">
																{article.title}
															</h3>
															<p className="text-gray-600 mb-4">
																{article.description}
															</p>
															<div className="flex items-center space-x-4">
																<span className="text-sm text-gray-500">
																	{article.readTime}
																</span>
																<span
																	className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
																		article.difficulty
																	)}`}>
																	{article.difficulty}
																</span>
																<div className="flex items-center">
																	<Star className="w-4 h-4 text-yellow-500 mr-1" />
																	<span className="text-sm font-medium">
																		{article.rating}
																	</span>
																</div>
															</div>
														</div>
														<div className="ml-4">
															<Button size="sm">Read Guide</Button>
														</div>
													</div>
												</Card>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Additional Resources */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-semibold mb-4">
								Additional Resources
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Card className="p-6 text-center">
									<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<CheckCircle className="w-6 h-6 text-green-600" />
									</div>
									<h3 className="font-semibold mb-2">Property Verification</h3>
									<p className="text-sm text-gray-600 mb-4">
										Learn how to verify property documents and ownership
									</p>
									<Button size="sm" variant="outline">
										Learn More
									</Button>
								</Card>

								<Card className="p-6 text-center">
									<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Calculator className="w-6 h-6 text-blue-600" />
									</div>
									<h3 className="font-semibold mb-2">Financial Planning</h3>
									<p className="text-sm text-gray-600 mb-4">
										Plan your finances and understand the total cost
									</p>
									<Button size="sm" variant="outline">
										Plan Now
									</Button>
								</Card>

								<Card className="p-6 text-center">
									<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<FileText className="w-6 h-6 text-purple-600" />
									</div>
									<h3 className="font-semibold mb-2">Legal Support</h3>
									<p className="text-sm text-gray-600 mb-4">
										Get legal assistance for your property purchase
									</p>
									<Button size="sm" variant="outline">
										Get Help
									</Button>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BuyerLayout>
	);
}
