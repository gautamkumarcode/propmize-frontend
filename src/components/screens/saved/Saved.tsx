"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bath, Bed, Heart, MapPin, Phone, Share2, Square } from "lucide-react";
import { useState } from "react";

export default function Saved() {
	const [savedProperties, setSavedProperties] = useState([
		{
			id: 1,
			title: "3BHK Luxury Apartment",
			location: "Koramangala, Bangalore",
			price: "₹1.2 Cr",
			beds: 3,
			baths: 3,
			area: "1450 sq ft",
			image: "/api/placeholder/300/200",
			savedDate: "2024-01-15",
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
			savedDate: "2024-01-12",
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
			savedDate: "2024-01-10",
		},
	]);

	const handleUnsave = (propertyId: number) => {
		setSavedProperties(savedProperties.filter((p) => p.id !== propertyId));
	};

	const handleContact = (propertyId: number) => {
		// Contact logic here
		console.log("Contacting for property:", propertyId);
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
										<Heart className="w-6 h-6 mr-3 text-red-500" />
										Saved Properties
									</h1>
									<p className="text-gray-600 mt-1">
										{savedProperties.length} properties saved
									</p>
								</div>
								<Button variant="outline">
									<Share2 className="w-4 h-4 mr-2" />
									Share List
								</Button>
							</div>
						</div>

						{/* Properties Grid */}
						{savedProperties.length > 0 ? (
							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{savedProperties.map((property) => (
									<Card key={property.id} className="overflow-hidden">
										<div className="relative">
											<img
												src={property.image}
												alt={property.title}
												className="w-full h-48 object-cover"
											/>
											<button
												onClick={() => handleUnsave(property.id)}
												className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
												<Heart className="w-5 h-5 text-red-500 fill-current" />
											</button>
											<div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
												{property.price}
											</div>
										</div>
										<div className="p-4">
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{property.title}
											</h3>
											<p className="text-gray-600 flex items-center mb-3">
												<MapPin className="w-4 h-4 mr-1" />
												{property.location}
											</p>

											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center space-x-4 text-sm text-gray-600">
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
											</div>

											<div className="flex items-center justify-between">
												<p className="text-xs text-gray-500">
													Saved on{" "}
													{(() => {
														const date = new Date(property.savedDate);
														const day = date
															.getDate()
															.toString()
															.padStart(2, "0");
														const month = (date.getMonth() + 1)
															.toString()
															.padStart(2, "0");
														const year = date.getFullYear();
														return `${day}/${month}/${year}`;
													})()}
												</p>
												<Button
													size="sm"
													onClick={() => handleContact(property.id)}>
													<Phone className="w-4 h-4 mr-1" />
													Contact
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<Card className="p-12 text-center">
								<Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									No Saved Properties
								</h3>
								<p className="text-gray-600 mb-6">
									Start exploring properties and save your favorites here
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
