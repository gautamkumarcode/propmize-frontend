"use client";

import PropertiesList from "@/components/custom/property/PropertiesList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/lib";
import { MapPin } from "lucide-react";

const Property = () => {
	const { data: properties, isLoading } = useProperties();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Discover Your Dream Property
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Browse through our curated collection of premium properties tailored
						to your needs
					</p>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
						{[...Array(6)].map((_, i) => (
							<Card
								key={i}
								className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
								<Skeleton className="w-full h-60 rounded-none" />
								<CardContent className="p-6">
									<Skeleton className="h-6 w-3/4 mb-4" />
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-2/3 mb-4" />
									<div className="flex justify-between items-center mb-4">
										<Skeleton className="h-6 w-20" />
										<Skeleton className="h-6 w-24" />
									</div>
									<Skeleton className="h-10 w-full" />
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<PropertiesList properties={properties} />
				)}

				{/* Empty State */}
				{!isLoading && (!properties || properties.length === 0) && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<MapPin className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-2xl font-semibold text-gray-900 mb-2">
							No properties found
						</h3>
						<p className="text-gray-600 mb-6">
							We couldn't find any properties matching your criteria.
						</p>
						<Button className="bg-blue-600 hover:bg-blue-700">
							Browse All Properties
						</Button>
					</div>
				)}

				{/* Load More Button */}
				{properties && properties.length > 0 && (
					<div className="text-center mt-12">
						<Button variant="outline" className="px-8 py-3">
							Load More Properties
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Property;
