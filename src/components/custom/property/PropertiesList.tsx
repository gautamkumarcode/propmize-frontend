"use client";

import { Loader2 } from "lucide-react";
import {
	useInfiniteProperties,
	useRealTimeProperties,
	useSearchProperties,
} from "../../../lib/react-query/hooks/useProperties";
import { PropertyResponse } from "../../../types";
import { Button } from "../../ui/button";
import PropertyCard from "./PropertyCard";
import PropertyCardLoader from "./PropertyCardLoader";

interface PropertiesListProps {
	filters?: {
		[key: string]: unknown;
	};
	className?: string;
	showLoadMore?: boolean;
	mode?: "buyer" | "seller";
	searchQuery?: string;
}

export default function PropertiesList({
	filters = {},
	className = "",
	showLoadMore = true,
	mode = "buyer",
	searchQuery = "",
}: PropertiesListProps) {
	// Check if we have a search query or search filter
	const hasSearch =
		(!!searchQuery && searchQuery.trim().length > 0) ||
		(!!filters.search && (filters.search as string).trim().length > 0);

	const searchTerm = searchQuery || (filters.search as string) || "";

	// Use search hook when we have a search term, otherwise use infinite scroll
	const infinite = useInfiniteProperties(filters);
	const search = useSearchProperties(searchTerm, filters);

	// Real-time updates
	useRealTimeProperties();

	// Select data based on search mode
	const data = hasSearch ? search.data : infinite.data;
	const fetchNextPage = hasSearch ? undefined : infinite.fetchNextPage;
	const hasNextPage = hasSearch ? false : infinite.hasNextPage;
	const isFetchingNextPage = hasSearch ? false : infinite.isFetchingNextPage;
	const isLoading = hasSearch ? search.isLoading : infinite.isLoading;
	const isError = hasSearch ? search.isError : infinite.isError;
	const error = hasSearch ? search.error : infinite.error;

	if (isLoading) {
		return (
			<div className={`flex items-center justify-center py-12 ${className}`}>
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
					<p className="text-gray-600">
						{hasSearch ? "Searching properties..." : "Loading properties..."}
					</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={`text-center py-12 ${className}`}>
				<div className="text-red-600 mb-4">
					<p className="text-lg font-semibold">Failed to load properties</p>
					<p className="text-sm">
						{error?.message || "Something went wrong. Please try again."}
					</p>
				</div>
			</div>
		);
	}

	// Handle different data structures for search vs infinite scroll
	let properties: PropertyResponse[] = [];

	if (hasSearch) {
		// Search returns direct array
		properties = Array.isArray(search.data) ? search.data : [];
	} else {
		// Infinite scroll returns pages
		properties =
			infinite.data?.pages.flatMap(
				(page: PropertyResponse[] | { data: PropertyResponse[] }) =>
					Array.isArray(page)
						? page
						: (page as { data: PropertyResponse[] })?.data ?? []
			) || [];
	}

	if (properties.length === 0) {
		return (
			<div className={`text-center py-12 ${className}`}>
				<div className="text-gray-500">
					<p className="text-lg font-semibold mb-2">
						{hasSearch
							? "No properties found for your search"
							: "No properties found"}
					</p>
					<p className="text-sm">
						{hasSearch
							? "Try adjusting your search terms or filters."
							: "Try adjusting your filters or check back later for new listings."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			{/* Show search results count */}
			{hasSearch && (
				<div className="mb-4">
					<p className="text-sm text-gray-600">
						Found {properties.length} properties for &quot;{searchTerm}&quot;
					</p>
				</div>
			)}

			{/* Properties Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{properties.map((property: PropertyResponse) => (
					<PropertyCard
						key={property._id}
						property={property}
						showSaveButton={true}
					/>
				))}
				{/* Show loading placeholders when fetching next page */}
				{isFetchingNextPage &&
					Array.from({ length: 3 }).map((_, index) => (
						<PropertyCardLoader key={`loader-${index}`} />
					))}
			</div>

			{/* Load More Button - only show for infinite scroll */}
			{!hasSearch && showLoadMore && hasNextPage && (
				<div className="text-center mt-8">
					<Button
						onClick={() => fetchNextPage && fetchNextPage()}
						disabled={isFetchingNextPage}
						variant="outline"
						className="px-8 py-2">
						{isFetchingNextPage ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Loading more...
							</>
						) : (
							"Load More Properties"
						)}
					</Button>
				</div>
			)}

			{/* Loading indicator for infinite scroll */}
			{!hasSearch && isFetchingNextPage && !showLoadMore && (
				<div className="text-center py-8">
					<Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
				</div>
			)}

			{/* End of results */}
			{!hasSearch && !hasNextPage && properties.length > 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500 text-sm">
						You&apos;ve reached the end of the properties list
					</p>
				</div>
			)}
		</div>
	);
}