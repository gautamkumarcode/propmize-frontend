"use client";

import AppLayout from "@/components/custom/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecentlyViewedProperties } from "@/lib/react-query/hooks/useProperties";
import { Property } from "@/types";
import { Bath, Bed, Eye, MapPin, Phone, Square, Trash2 } from "lucide-react";

export default function Recent() {
	const { data: recentPropertiesData, isLoading } = useRecentlyViewedProperties();
	const recentProperties: Property[] = recentPropertiesData?.data || [];

	// Example clearAllHistory handler (implement API if needed)
	const clearAllHistory = () => {
		// TODO: Call API to clear history, then refetch
	};

	return (
		<AppLayout mode="buyer">
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-6">
						{/* Header */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold text-gray-900 flex items-center">
										<Eye className="w-6 h-6 mr-3 text-blue-500" />
										Recently Viewed Properties
									</h1>
									<p className="text-gray-600 mt-1">
										{recentProperties.length} properties viewed
									</p>
								</div>
								<Button
									variant="outline"
									onClick={clearAllHistory}
									className="text-red-600 hover:text-red-700 hover:border-red-300">
									<Trash2 className="w-4 h-4 mr-2" />
									Clear History
								</Button>
							</div>
						</div>

						{/* Properties Grid */}
						{isLoading ? (
							<div className="text-center py-12">Loading...</div>
						) : recentProperties.length > 0 ? (
							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{recentProperties.map((property: Property) => (
									<Card key={property._id} className="overflow-hidden">
										<div className="relative">
											<img
												src={
													property.images?.[0]?.url ||
													"/api/placeholder/300/200"
												}
												alt={property.title}
												className="w-full h-48 object-cover"
											/>
											<div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
												₹{property.price}
											</div>
										</div>
										<div className="p-4">
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{property.title}
											</h3>
											<p className="text-gray-600 flex items-center mb-3">
												<MapPin className="w-4 h-4 mr-1" />
												{property.address?.city}, {property.address?.area}
											</p>
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center space-x-4 text-sm text-gray-600">
													<span className="flex items-center">
														<Bed className="w-4 h-4 mr-1" />
														{property.bedrooms} Beds
													</span>
													<span className="flex items-center">
														<Bath className="w-4 h-4 mr-1" />
														{property.bathrooms} Baths
													</span>
													<span className="flex items-center">
														<Square className="w-4 h-4 mr-1" />
														{property.area?.size} {property.area?.unit}
													</span>
												</div>
											</div>

											<div className="flex items-center justify-between">
												<p className="text-xs text-gray-500">
													{/* If API provides viewedDate, format it here */}
													{/* Example: Viewed on 22/08/2025 */}
												</p>
												<Button size="sm">
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
								<Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									No Recently Viewed Properties
								</h3>
								<p className="text-gray-600 mb-6">
									Start exploring properties and your recently viewed will
									appear here
								</p>
								<Button>Explore Properties</Button>
							</Card>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
