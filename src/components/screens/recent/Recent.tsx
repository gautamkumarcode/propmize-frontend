"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Bath,
	Bed,
	Clock,
	Eye,
	Heart,
	MapPin,
	Phone,
	Square,
	Trash2,
} from "lucide-react";
import { useState } from "react";

export default function Recent() {
	const [recentProperties, setRecentProperties] = useState([
		{
			id: 1,
			title: "3BHK Luxury Apartment",
			location: "Koramangala, Bangalore",
			price: "₹1.2 Cr",
			beds: 3,
			baths: 3,
			area: "1450 sq ft",
			image: "/api/placeholder/300/200",
			viewedDate: "2024-01-15T10:30:00",
			viewCount: 3,
		},
		{
			id: 2,
			title: "2BHK Modern Flat",
			location: "Whitefield, Bangalore",
			price: "₹85 Lakh",
			beds: 2,
			baths: 2,
			area: "1200 sq ft",
			image: "/api/placeholder/300/200",
			viewedDate: "2024-01-14T15:45:00",
			viewCount: 1,
		},
		{
			id: 3,
			title: "4BHK Villa with Garden",
			location: "HSR Layout, Bangalore",
			price: "₹2.5 Cr",
			beds: 4,
			baths: 4,
			area: "2800 sq ft",
			image: "/api/placeholder/300/200",
			viewedDate: "2024-01-13T09:15:00",
			viewCount: 5,
		},
		{
			id: 4,
			title: "1BHK Studio Apartment",
			location: "Electronic City, Bangalore",
			price: "₹45 Lakh",
			beds: 1,
			baths: 1,
			area: "650 sq ft",
			image: "/api/placeholder/300/200",
			viewedDate: "2024-01-12T14:20:00",
			viewCount: 2,
		},
	]);

	const [savedProperties, setSavedProperties] = useState<number[]>([]);

	const handleRemove = (propertyId: number) => {
		setRecentProperties(recentProperties.filter((p) => p.id !== propertyId));
	};

	const handleSave = (propertyId: number) => {
		setSavedProperties((prev) =>
			prev.includes(propertyId)
				? prev.filter((id) => id !== propertyId)
				: [...prev, propertyId]
		);
	};

	const handleContact = (propertyId: number) => {
		console.log("Contacting for property:", propertyId);
	};

	const clearAllHistory = () => {
		setRecentProperties([]);
	};

	const formatTimeAgo = (dateString: string) => {
		const now = new Date();
		const viewed = new Date(dateString);
		const diffInHours = Math.floor(
			(now.getTime() - viewed.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays}d ago`;
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
										<Eye className="w-6 h-6 mr-3 text-blue-500" />
										Recently Viewed
									</h1>
									<p className="text-gray-600 mt-1">
										{recentProperties.length} properties viewed recently
									</p>
								</div>
								{recentProperties.length > 0 && (
									<Button
										variant="outline"
										onClick={clearAllHistory}
										className="text-red-600 hover:text-red-700 hover:border-red-300">
										<Trash2 className="w-4 h-4 mr-2" />
										Clear All
									</Button>
								)}
							</div>
						</div>

						{/* Properties List */}
						{recentProperties.length > 0 ? (
							<div className="space-y-4">
								{recentProperties.map((property) => (
									<Card key={property.id} className="overflow-hidden">
										<div className="flex flex-col md:flex-row">
											<div className="relative md:w-80">
												<img
													src={property.image}
													alt={property.title}
													className="w-full h-48 md:h-full object-cover"
												/>
												<div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-semibold">
													{property.price}
												</div>
												<div className="absolute top-3 right-3 flex space-x-2">
													<button
														onClick={() => handleSave(property.id)}
														className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
														<Heart
															className={`w-4 h-4 ${
																savedProperties.includes(property.id)
																	? "text-red-500 fill-current"
																	: "text-gray-600"
															}`}
														/>
													</button>
													<button
														onClick={() => handleRemove(property.id)}
														className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
														<Trash2 className="w-4 h-4 text-gray-600" />
													</button>
												</div>
											</div>

											<div className="flex-1 p-6">
												<div className="flex items-start justify-between mb-3">
													<div>
														<h3 className="text-xl font-semibold text-gray-900 mb-2">
															{property.title}
														</h3>
														<p className="text-gray-600 flex items-center">
															<MapPin className="w-4 h-4 mr-1" />
															{property.location}
														</p>
													</div>
													<div className="text-right text-sm text-gray-500">
														<div className="flex items-center">
															<Clock className="w-4 h-4 mr-1" />
															{formatTimeAgo(property.viewedDate)}
														</div>
														<div className="flex items-center mt-1">
															<Eye className="w-4 h-4 mr-1" />
															Viewed {property.viewCount} time
															{property.viewCount > 1 ? "s" : ""}
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
													<span className="flex items-center">
														<Bed className="w-4 h-4 mr-1" />
														{property.beds} Beds
													</span>
													<span className="flex items-center">
														<Bath className="w-4 h-4 mr-1" />
														{property.baths} Baths
													</span>
													<span className="flex items-center">
														<Square className="w-4 h-4 mr-1" />
														{property.area}
													</span>
												</div>

												<div className="flex items-center justify-between">
													<Button variant="outline" size="sm">
														View Details
													</Button>
													<Button
														size="sm"
														onClick={() => handleContact(property.id)}>
														<Phone className="w-4 h-4 mr-1" />
														Contact Owner
													</Button>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<Card className="p-12 text-center">
								<Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									No Recently Viewed Properties
								</h3>
								<p className="text-gray-600 mb-6">
									Properties you view will appear here for quick access
								</p>
								<Button>Explore Properties</Button>
							</Card>
						)}
					</div>
				</div>
			</div>
		</BuyerLayout>
	);
}
