"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import {
	AlertCircle,
	BookOpen,
	Filter,
	MessageSquare,
	Plus,
	Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AIAssistantPage from "./AIAssistantPage";

export default function Dashboard() {
	const router = useRouter();
	const [showChat, setShowChat] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedType, setSelectedType] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [properties, setProperties] = useState<any[]>([]);

	const propertyTypes = ["all", "apartment", "house", "villa", "commercial"];
	const stats = [
		{ value: "10K+", label: "Properties" },
		{ value: "5K+", label: "Happy Clients" },
		{ value: "50+", label: "Cities" },
		{ value: "99%", label: "Satisfaction" },
	];

	// Mock properties data
	const mockProperties = [
		{
			_id: "1",
			title: "Modern Apartment in Downtown",
			price: 8500000,
			location: "Bandra West, Mumbai",
			bedrooms: 3,
			bathrooms: 2,
			area: 1200,
			images: [
				"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop",
			],
			type: "apartment",
			pricePerSqFt: 7083,
			featured: true,
		},
		// ... rest of your mock properties
	];

	useEffect(() => {
		fetchProperties();
	}, [selectedType]);

	const fetchProperties = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const filteredProperties =
				selectedType === "all"
					? mockProperties
					: mockProperties.filter((prop) => prop.type === selectedType);
			setProperties(filteredProperties);
			setError("");
		} catch (err) {
			setError("Failed to fetch properties. Please try again.");
			console.error("Error fetching properties:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = () => {
		console.log("Searching for:", searchQuery);
		fetchProperties();
	};

	const handleTypeFilter = (type: string) => {
		setSelectedType(type);
	};

	const formatPrice = (price: number) => {
		if (price >= 10000000) {
			return `₹${(price / 10000000).toFixed(1)} Cr`;
		} else if (price >= 100000) {
			return `₹${price / 100000} Lacs`;
		}
		return `₹${price.toLocaleString()}`;
	};

	const handleNewChat = () => {
		setShowChat(true);
	};

	const PropertyCard = ({ property }: { property: any }) => (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
			{/* ... rest of your PropertyCard component */}
		</div>
	);

	return (
		<BuyerLayout>
			<div className="min-h-screen bg-gray-50">
				{showChat && (
					<AIAssistantPage
						onPropertyClick={(id) => console.log("Property clicked:", id)}
						onNavigate={(path) => router.push(path)}
					/>
				)}

				{!showChat && (
					<>
						{" "}
						{/* Mobile Header with Search */}
						<div className="sticky top-0 z-10 bg-white shadow-sm border-b">
							<div className="px-4 py-3">
								{/* Search Bar */}
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="text"
										placeholder="Search properties..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyPress={(e) => e.key === "Enter" && handleSearch()}
										className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>
						</div>
						{/* Property Type Filters */}
						<div className="px-4 py-3 bg-white border-b border-gray-100">
							<div className="flex gap-2 overflow-x-auto scrollbar-hide">
								{propertyTypes.map((type) => (
									<button
										key={type}
										onClick={() => handleTypeFilter(type)}
										className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
											selectedType === type
												? "bg-blue-600 text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}>
										{type === "all"
											? "All Properties"
											: type.charAt(0).toUpperCase() + type.slice(1)}
									</button>
								))}
							</div>
						</div>
						{/* Stats Section */}
						<div className="px-4 py-6 bg-white">
							<div className="grid grid-cols-4 gap-4">
								{stats.map((stat, index) => (
									<div key={index} className="text-center">
										<div className="text-2xl font-bold text-blue-600 mb-1">
											{stat.value}
										</div>
										<div className="text-xs text-gray-600 font-medium">
											{stat.label}
										</div>
									</div>
								))}
							</div>
						</div>
						{/* Properties List */}
						<div className="px-4 py-4">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold text-gray-900">
									{selectedType === "all"
										? "All Properties"
										: `${
												selectedType.charAt(0).toUpperCase() +
												selectedType.slice(1)
										  } Properties`}
								</h2>
								<button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
									<Filter className="w-4 h-4 text-gray-600" />
								</button>
							</div>

							{isLoading ? (
								<div className="flex justify-center items-center py-20">
									<div className="flex items-center space-x-3">
										<div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
										<span className="text-gray-600 font-medium">
											Loading properties...
										</span>
									</div>
								</div>
							) : error ? (
								<div className="text-center py-20">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
										<AlertCircle className="w-8 h-8 text-red-600" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Oops! Something went wrong
									</h3>
									<p className="text-gray-600 mb-6">{error}</p>
									<button
										onClick={fetchProperties}
										className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
										Try Again
									</button>
								</div>
							) : (
								<div className="space-y-4">
									{properties.map((property) => (
										<PropertyCard key={property._id} property={property} />
									))}
								</div>
							)}

							{/* No properties found */}
							{!isLoading && !error && properties.length === 0 && (
								<div className="text-center py-20">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
										<Search className="w-8 h-8 text-gray-400" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										No Properties Found
									</h3>
									<p className="text-gray-600 mb-6">
										Try adjusting your search criteria or browse all properties
									</p>
									<button
										onClick={() => {
											setSearchQuery("");
											setSelectedType("all");
											fetchProperties();
										}}
										className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
										Show All Properties
									</button>
								</div>
							)}

							{/* Load More Button */}
							{!isLoading && !error && properties.length > 0 && (
								<div className="pt-6">
									<button className="w-full py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
										Load More Properties
									</button>
								</div>
							)}
						</div>
						{/* CTA Section */}
						<div className="px-4 py-8 bg-gradient-to-r from-blue-600 to-purple-600 mx-4 rounded-xl mb-6">
							<div className="text-center text-white">
								<h2 className="text-xl font-bold mb-2">
									Ready to Find Your Perfect Property?
								</h2>
								<p className="text-blue-100 mb-4 text-sm">
									Join thousands of satisfied customers
								</p>
								<div className="flex gap-3">
									<button
										onClick={() => router.push("/seller")}
										className="flex-1 bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
										<Plus className="w-4 h-4 mr-2 inline" />
										List Property
									</button>
									<button
										onClick={() => router.push("/guide")}
										className="flex-1 border border-white/30 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors">
										<BookOpen className="w-4 h-4 mr-2 inline" />
										Learn More
									</button>
								</div>
							</div>
						</div>
						{/* Floating AI Chat Button */}
						<div className="fixed bottom-6 right-4 z-50">
							<button
								onClick={handleNewChat}
								className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110">
								<MessageSquare className="w-6 h-6 mx-auto" />
							</button>
						</div>
						{/* Bottom Padding for Navigation */}
						<div className="h-20"></div>
					</>
				)}
			</div>
		</BuyerLayout>
	);
}