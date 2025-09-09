"use client";

import PropertyCard from "@/components/custom/property/PropertyCard";
import PropertyCardLoader from "@/components/custom/property/PropertyCardLoader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecentlyViewedProperties } from "@/lib/react-query/hooks/useProperties";
import { PropertyResponse } from "@/types";
import { Eye } from "lucide-react";

export default function Recent() {
	const { data: recentPropertiesData, isLoading } =
		useRecentlyViewedProperties();
	const recentProperties: PropertyResponse[] = recentPropertiesData?.data || [];

	return (
		<div className="min-h-screen bg-gray-50 ">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm p-4">
						<div className="flex lg:items-center justify-between lg:flex-row flex-col gap-4">
							<div>
								<h1 className="text-2xl font-bold text-gray-900 flex items-center">
									<Eye className="w-6 h-6 mr-3 text-blue-500" />
									Recently Viewed Properties
								</h1>
								<p className="text-gray-600 mt-1">
									{recentProperties.length} properties viewed
								</p>
							</div>
							{/* <Button
								variant="outline"
								onClick={clearAllHistory}
								className="text-red-600 hover:text-red-700 hover:border-red-300">
								<Trash2 className="w-4 h-4 mr-2" />
								Clear History
							</Button> */}
						</div>
					</div>

					{/* Properties Grid */}
					{isLoading ? (
						<PropertyCardLoader />
					) : recentProperties.length > 0 ? (
						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{recentProperties.map((property: PropertyResponse) => (
								<PropertyCard key={property._id} property={property} />
							))}
						</div>
					) : (
						<Card className="p-12 text-center">
							<Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No Recently Viewed Properties
							</h3>
							<p className="text-gray-600 mb-6">
								Start exploring properties and your recently viewed will appear
								here
							</p>
							<Button>Explore Properties</Button>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
