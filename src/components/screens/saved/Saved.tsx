"use client";

import AppLayout from "@/components/custom/layout/AppLayout";
import PropertyCard from "@/components/custom/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useLikedProperties } from "@/lib";
import { Heart, Share2 } from "lucide-react";

export default function Saved() {
	const { data: savedProperties = [], isLoading: _isLoading } =
		useLikedProperties();

	// const handleUnsave = (propertyId: string) => {
	// 	// unsaveMutation.mutate(propertyId);
	// };

	// const handleContact = (propertyId: string) => {
	// 	// Contact logic here
	// 	console.log("Contacting for property:", propertyId);
	// };

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
									<PropertyCard key={property._id} property={property} />
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
		</AppLayout>
	);
}
