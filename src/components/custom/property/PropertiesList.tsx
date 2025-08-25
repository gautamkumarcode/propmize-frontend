"use client";

import { Loader2 } from "lucide-react";
import {
	useInfiniteProperties,
	useRealTimeProperties,
} from "../../../lib/react-query/hooks/useProperties";
import { Property } from "../../../types";
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
}

export default function PropertiesList({
	filters = {},
	className = "",
	showLoadMore = true,
	mode = "buyer",
}: PropertiesListProps) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteProperties(filters);

	// Real-time updates
	useRealTimeProperties();

	if (isLoading) {
		return (
			<div className={`flex items-center justify-center py-12 ${className}`}>
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
					<p className="text-gray-600">Loading properties...</p>
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

	const properties =
		data?.pages.flatMap((page: Property[] | { data: Property[] }) =>
			Array.isArray(page) ? page : (page as { data: Property[] })?.data ?? []
		) || [];

	if (properties.length === 0) {
		return (
			<div className={`text-center py-12 ${className}`}>
				<div className="text-gray-500">
					<p className="text-lg font-semibold mb-2">No properties found</p>
					<p className="text-sm">
						Try adjusting your filters or check back later for new listings.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			{/* Properties Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{properties.map((property: Property) => (
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

			{/* Load More Button */}
			{showLoadMore && hasNextPage && (
				<div className="text-center mt-8">
					<Button
						onClick={() => fetchNextPage()}
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
			{isFetchingNextPage && !showLoadMore && (
				<div className="text-center py-8">
					<Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
				</div>
			)}

			{/* End of results */}
			{!hasNextPage && properties.length > 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500 text-sm">
						You&apos;ve reached the end of the properties list
					</p>
				</div>
			)}
		</div>
	);
}
