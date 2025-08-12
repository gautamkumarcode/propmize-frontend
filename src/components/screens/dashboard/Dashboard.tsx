"use client";

import AIPropertyChat from "@/components/custom/features/AIPropertyChat";
import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import {
	Award,
	Bath,
	Bed,
	Building,
	Calendar,
	Filter,
	Heart,
	Home,
	MapPin,
	Search,
	Square,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
	const [showChat, setShowChat] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleNewChat = () => {
		console.log("Starting new chat");
		setShowChat(true);
	};

	const handleDeleteChat = (chatId: string) => {
		console.log("Deleting chat:", chatId);
	};

	const handleChatHistory = () => {
		console.log("Opening chat history");
	};

	if (showChat) {
		return (
			<BuyerLayout>
				<div className="">
					<AIPropertyChat
						onNewChat={handleNewChat}
						onDeleteChat={handleDeleteChat}
						onChatHistory={handleChatHistory}
					/>
				</div>
			</BuyerLayout>
		);
	}

	return (
		<BuyerLayout>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
				{/* Hero Section */}
				<div className="relative overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
						<div className="text-center space-y-8">
							<div className="space-y-4">
								<div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-slate-700 text-sm font-medium mb-6">
									<Star className="w-4 h-4 mr-2 text-yellow-500" />
									India's Most Trusted Real Estate Platform
								</div>

								<h1 className="text-4xl lg:text-6xl font-bold leading-tight">
									<span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
										Find Your Dream
									</span>
									<br />
									<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
										Property
									</span>
								</h1>

								<p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
									Discover premium properties with AI-powered search, expert
									insights, and seamless buying experience. Your perfect home is
									just a click away.
								</p>
							</div>

							{/* Enhanced Search Bar */}
							<div className="max-w-3xl mx-auto">
								<div className="relative group">
									<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
									<div className="relative bg-white rounded-xl p-3 shadow-2xl">
										<div className="flex flex-col lg:flex-row gap-3">
											<div className="flex-1 relative">
												<input
													type="text"
													placeholder="Search by location, property type, or budget..."
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
													className="w-full h-14 pl-12 pr-4 text-lg border-0 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
												/>
												<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
											</div>
											<div className="flex gap-3">
												<button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center">
													<Filter className="w-5 h-5 mr-2" />
													Filters
												</button>
												<button
													onClick={handleNewChat}
													className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg transition-all flex items-center">
													<Search className="w-5 h-5 mr-2" />
													AI Search
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Property Type Quick Filters */}
							<div className="flex flex-wrap justify-center gap-3">
								{[
									{ icon: Home, label: "Residential", active: false },
									{ icon: Building, label: "Commercial", active: false },
									{ icon: MapPin, label: "Land", active: false },
									{ icon: Star, label: "Premium", active: true },
								].map((type, index) => (
									<button
										key={index}
										className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center ${
											type.active
												? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
												: "bg-white/80 text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md"
										}`}>
										<type.icon className="w-5 h-5 mr-2" />
										{type.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								title: "Properties Listed",
								value: "1,50,000+",
								icon: Home,
								color: "from-blue-500 to-indigo-600",
								trend: "+15%",
							},
							{
								title: "Happy Families",
								value: "75,000+",
								icon: Users,
								color: "from-emerald-500 to-green-600",
								trend: "+12%",
							},
							{
								title: "Cities Covered",
								value: "500+",
								icon: MapPin,
								color: "from-purple-500 to-pink-600",
								trend: "+8%",
							},
							{
								title: "Awards Won",
								value: "25+",
								icon: Award,
								color: "from-orange-500 to-red-600",
								trend: "+5%",
							},
						].map((stat, index) => (
							<div
								key={index}
								className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 text-center group hover:scale-105 transition-all duration-500 hover:shadow-2xl border border-slate-200/60">
								<div className="space-y-4">
									<div
										className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
										<stat.icon className="w-10 h-10 text-white" />
									</div>
									<div>
										<h3 className="text-4xl font-bold text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">
											{stat.value}
										</h3>
										<p className="text-slate-600 font-semibold text-lg mb-2">
											{stat.title}
										</p>
										<div className="flex items-center justify-center text-emerald-600 text-sm font-medium">
											<TrendingUp className="w-4 h-4 mr-1" />
											{stat.trend} this month
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Featured Properties */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="text-center mb-12">
						<div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold mb-6">
							<Star className="w-5 h-5 mr-2" />
							Handpicked Premium Collection
						</div>
						<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
							Featured Properties
						</h2>
						<p className="text-xl text-slate-600">
							Discover our curated selection of premium properties with
							unmatched luxury
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "Oceanfront Luxury Villa",
								location: "Alibaug, Maharashtra",
								price: 85000000,
								beds: 5,
								baths: 4,
								area: "4,500 sq ft",
								type: "Luxury Villa",
								status: "premium",
								features: ["Sea View", "Private Beach", "Pool"],
							},
							{
								title: "Sky Penthouse with Terrace",
								location: "Worli, Mumbai",
								price: 125000000,
								beds: 4,
								baths: 5,
								area: "3,800 sq ft",
								type: "Penthouse",
								status: "featured",
								features: ["City View", "Private Lift", "Garden"],
							},
							{
								title: "Modern Smart Home",
								location: "Whitefield, Bangalore",
								price: 45000000,
								beds: 4,
								baths: 3,
								area: "2,800 sq ft",
								type: "Villa",
								status: "new",
								features: ["Smart Home", "Solar", "Theater"],
							},
						].map((property, index) => (
							<div
								key={index}
								className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-slate-200/60">
								{/* Property Image Placeholder */}
								<div className="relative h-64 bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300">
									{/* Status Badge */}
									<div className="absolute top-6 left-6 z-10">
										<div
											className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
												property.status === "premium"
													? "bg-gradient-to-r from-amber-500 to-orange-500"
													: property.status === "featured"
													? "bg-gradient-to-r from-blue-500 to-indigo-500"
													: "bg-gradient-to-r from-pink-500 to-rose-500"
											}`}>
											{property.status.toUpperCase()}
										</div>
									</div>

									{/* Heart Icon */}
									<div className="absolute top-6 right-6 z-10">
										<button className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full border border-white/30 transition-colors">
											<Heart className="w-5 h-5 text-white" />
										</button>
									</div>

									{/* Features */}
									<div className="absolute bottom-4 left-4 right-4">
										<div className="flex flex-wrap gap-2">
											{property.features.map((feature, idx) => (
												<span
													key={idx}
													className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/30">
													{feature}
												</span>
											))}
										</div>
									</div>
								</div>

								<div className="p-6 space-y-4">
									{/* Price and Type */}
									<div className="flex items-center justify-between">
										<div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
											₹{(property.price / 10000000).toFixed(1)}Cr
										</div>
										<div className="text-slate-600 bg-slate-100 px-3 py-1 rounded-lg font-medium text-sm">
											{property.type}
										</div>
									</div>

									{/* Title & Location */}
									<div className="space-y-2">
										<h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
											{property.title}
										</h3>
										<div className="flex items-center text-slate-600">
											<MapPin className="w-4 h-4 mr-2 text-slate-400" />
											<span className="text-sm font-medium">
												{property.location}
											</span>
										</div>
									</div>

									{/* Property Details */}
									<div className="flex items-center space-x-4 text-slate-600 bg-slate-50 rounded-lg p-3">
										<div className="flex items-center">
											<Bed className="w-4 h-4 mr-1 text-slate-400" />
											<span className="text-sm font-medium">
												{property.beds} Beds
											</span>
										</div>
										<div className="flex items-center">
											<Bath className="w-4 h-4 mr-1 text-slate-400" />
											<span className="text-sm font-medium">
												{property.baths} Baths
											</span>
										</div>
										<div className="flex items-center">
											<Square className="w-4 h-4 mr-1 text-slate-400" />
											<span className="text-sm font-medium">
												{property.area}
											</span>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex space-x-3 pt-2">
										<button className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all">
											View Details
										</button>
										<button className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
											<Calendar className="w-4 h-4 text-slate-600" />
										</button>
										<button className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
											<Heart className="w-4 h-4 text-slate-600" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="text-center mt-12">
						<button
							onClick={handleNewChat}
							className="px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold shadow-xl transition-all hover:scale-105 flex items-center mx-auto">
							<Search className="w-5 h-5 mr-3" />
							Explore All Properties with AI
						</button>
					</div>
				</div>

				{/* CTA Section */}
				<div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
					<div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
						<div className="text-center space-y-8">
							<h2 className="text-3xl lg:text-5xl font-bold leading-tight">
								<span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
									Ready to Find Your
								</span>
								<br />
								<span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
									Perfect Home?
								</span>
							</h2>
							<p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
								Join over 75,000 satisfied families who found their dream
								properties with our AI-powered platform.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button
									onClick={handleNewChat}
									className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 text-white rounded-xl font-bold shadow-2xl transition-all hover:scale-105 flex items-center justify-center">
									<Star className="w-5 h-5 mr-2" />
									Start Property Search
								</button>
								<button className="px-8 py-4 border-2 border-slate-400 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center">
									<Users className="w-5 h-5 mr-2" />
									Talk to Expert
								</button>
							</div>

							{/* Trust Indicators */}
							<div className="pt-8 border-t border-slate-700">
								<div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
									<div className="flex items-center gap-2">
										<Award className="w-5 h-5 text-yellow-500" />
										<span>Award Winning</span>
									</div>
									<div className="flex items-center gap-2">
										<Star className="w-5 h-5 text-yellow-500" />
										<span>4.9/5 Rating</span>
									</div>
									<div className="flex items-center gap-2">
										<Users className="w-5 h-5 text-blue-400" />
										<span>75K+ Happy Customers</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BuyerLayout>
	);
}
