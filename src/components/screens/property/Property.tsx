"use client";

import PropertiesList from "@/components/custom/property/PropertiesList";
import PropertySearch from "@/components/custom/property/PropertySearch";
import { PropertyFilters } from "@/lib/types/api";
import { useState } from "react";

const Property = ({ mode = "buyer" }: { mode?: "buyer" | "seller" }) => {
	const [filters, setFilters] = useState<PropertyFilters>({});
	const [searchQuery, setSearchQuery] = useState("");

	const handleFilterChange = (newFilters: PropertyFilters, query?: string) => {
		setFilters(newFilters);
		if (typeof query === "string") setSearchQuery(query);
		else setSearchQuery("");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Discover Your Dream Property
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Browse through our curated collection of premium properties
						tailored to your needs
					</p>
				</div>

				{/* Search and Filter */}
				<PropertySearch
					onFilterChange={handleFilterChange}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>

				{/* Property Listings */}
				<PropertiesList
					filters={filters as { [key: string]: unknown }}
					searchQuery={searchQuery}
				/>
			</div>
		</div>
	);
};

export default Property;
