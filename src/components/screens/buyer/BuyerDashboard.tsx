"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation";
import {
	Bot,
	Building,
	Eye,
	Filter,
	Heart,
	HelpCircle,
	MessageSquare,
	Search,
	TrendingUp,
	User,
} from "lucide-react";
import { useState } from "react";
import AIAssistantPage from "../dashboard/AIAssistantPage";

export default function BuyerDashboard() {
	const [showAIAssistant, setShowAIAssistant] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedType, setSelectedType] = useState<string>("all");
	const navigation = useNavigation();

	const propertyTypes = ["all", "apartment", "house", "villa", "commercial"];

	const stats = [
		{ value: "10K+", label: "Properties", icon: TrendingUp },
		{ value: "5K+", label: "Happy Clients", icon: Heart },
		{ value: "50+", label: "Cities", icon: Search },
		{ value: "99%", label: "Satisfaction", icon: Bot },
	];

	// Quick actions for the dashboard
	const quickActions = [
		{
			title: "AI Property Assistant",
			description:
				"Get personalized property recommendations and instant answers",
			icon: Bot,
			action: () => setShowAIAssistant(true),
			color: "bg-blue-500 hover:bg-blue-600",
			featured: true,
		},
		{
			title: "Advanced Search",
			description: "Find properties with detailed filters",
			icon: Search,
			action: () => console.log("Advanced search"),
			color: "bg-green-500 hover:bg-green-600",
		},
		{
			title: "Saved Properties",
			description: "View your bookmarked properties",
			icon: Heart,
			action: () => navigation.goToSaved(),
			color: "bg-red-500 hover:bg-red-600",
		},
		{
			title: "Recently Viewed",
			description: "See properties you viewed recently",
			icon: Eye,
			action: () => navigation.goToRecent(),
			color: "bg-purple-500 hover:bg-purple-600",
		},
		{
			title: "Contacted Owners",
			description: "Properties where you contacted owners",
			icon: MessageSquare,
			action: () => navigation.goToContacted(),
			color: "bg-indigo-500 hover:bg-indigo-600",
		},
		{
			title: "New Projects",
			description: "Latest projects in your city",
			icon: Building,
			action: () => navigation.goToNewProjects(),
			color: "bg-orange-500 hover:bg-orange-600",
		},
		{
			title: "My Profile",
			description: "Manage your account and preferences",
			icon: User,
			action: () => navigation.goToProfile(),
			color: "bg-gray-500 hover:bg-gray-600",
		},
		{
			title: "Help & Support",
			description: "Get help and support",
			icon: HelpCircle,
			action: () => navigation.goToSupport(),
			color: "bg-teal-500 hover:bg-teal-600",
		},
	];

	if (showAIAssistant) {
		return (
			<BuyerLayout>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								AI Property Assistant
							</h1>
							<p className="text-gray-600">
								Get personalized property recommendations
							</p>
						</div>
						<Button variant="outline" onClick={() => setShowAIAssistant(false)}>
							Back to Dashboard
						</Button>
					</div>
					<AIAssistantPage />
				</div>
			</BuyerLayout>
		);
	}

	return (
		<BuyerLayout>
			<div className="space-y-6">
				{/* Welcome Section */}
				<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold mb-2">
								Welcome to Your Property Journey
							</h1>
							<p className="text-blue-100 mb-4 max-w-2xl">
								Discover your perfect home with AI-powered recommendations and
								personalized assistance.
							</p>
						</div>
						<div className="hidden md:block">
							<Bot className="h-16 w-16 text-blue-200" />
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{stats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<Card key={index} className="text-center">
								<CardContent className="p-4">
									<IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
									<div className="text-2xl font-bold text-gray-900">
										{stat.value}
									</div>
									<div className="text-sm text-gray-600">{stat.label}</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Quick Actions */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Quick Actions
						</h2>
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigation.navigateTo("/navigation")}
							className="text-blue-600 border-blue-300 hover:bg-blue-50">
							<Search className="h-4 w-4 mr-2" />
							View All Pages
						</Button>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{quickActions.map((action, index) => {
							const IconComponent = action.icon;
							return (
								<Card
									key={index}
									className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
										action.featured ? "ring-2 ring-blue-500 shadow-lg" : ""
									}`}
									onClick={action.action}>
									<CardHeader className="pb-3">
										<div className="flex items-center space-x-3">
											<div
												className={`p-2 rounded-lg ${action.color} text-white`}>
												<IconComponent className="h-6 w-6" />
											</div>
											<div className="flex-1">
												<CardTitle className="text-lg">
													{action.title}
												</CardTitle>
												{action.featured && (
													<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mt-1 inline-block">
														✨ Featured
													</span>
												)}
											</div>
										</div>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="text-gray-600 text-sm">
											{action.description}
										</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>

				{/* Search Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Search className="h-5 w-5" />
							<span>Find Your Perfect Property</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Search Input */}
						<div className="flex flex-col md:flex-row gap-3">
							<div className="flex-1">
								<input
									type="text"
									placeholder="Search by location, property type, or keywords..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								/>
							</div>
							<Button className="bg-blue-600 hover:bg-blue-700 px-6">
								<Search className="h-4 w-4 mr-2" />
								Search
							</Button>
						</div>

						{/* Property Type Filter */}
						<div className="flex flex-wrap gap-2">
							{propertyTypes.map((type) => (
								<button
									key={type}
									onClick={() => setSelectedType(type)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
										selectedType === type
											? "bg-blue-100 text-blue-700 border border-blue-300"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}>
									{type}
								</button>
							))}
						</div>

						{/* Advanced Filter Button */}
						<div className="flex justify-center">
							<Button variant="outline" className="flex items-center space-x-2">
								<Filter className="h-4 w-4" />
								<span>Advanced Filters</span>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between py-2">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-green-100 rounded-full">
										<Heart className="h-4 w-4 text-green-600" />
									</div>
									<div>
										<p className="font-medium">Property Saved</p>
										<p className="text-sm text-gray-600">
											Modern Apartment in Bandra
										</p>
									</div>
								</div>
								<span className="text-sm text-gray-500">2h ago</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-blue-100 rounded-full">
										<Search className="h-4 w-4 text-blue-600" />
									</div>
									<div>
										<p className="font-medium">Search Performed</p>
										<p className="text-sm text-gray-600">
											3 BHK apartments in Mumbai
										</p>
									</div>
								</div>
								<span className="text-sm text-gray-500">5h ago</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-purple-100 rounded-full">
										<Bot className="h-4 w-4 text-purple-600" />
									</div>
									<div>
										<p className="font-medium">AI Recommendation</p>
										<p className="text-sm text-gray-600">
											5 properties match your preferences
										</p>
									</div>
								</div>
								<span className="text-sm text-gray-500">1d ago</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</BuyerLayout>
	);
}
