"use client";

import { Calendar, Eye, Heart, MapPin, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useToggleLike } from "../../../lib/react-query/hooks/useProperties";
import { Property } from "../../../types";

interface PropertyCardProps {
	property: Property;
	isSaved?: boolean;
	showSaveButton?: boolean;
	className?: string;
}

export default function PropertyCard({
	property,
	isSaved = false,
	showSaveButton = true,
	className = "",
}: PropertyCardProps) {
	const toggleLikeMutation = useToggleLike();

	const handleSaveToggle = (e: React.MouseEvent) => {
		e.preventDefault(); // Prevent navigation when clicking save button

		toggleLikeMutation.mutate(property._id);
	};

	const formatPrice = (price: number) => {
		if (price >= 10000000) {
			// 1 crore or more
			return `₹${(price / 10000000).toFixed(2)}Cr`;
		} else if (price >= 100000) {
			// 1 lakh or more
			return `₹${(price / 100000).toFixed(2)}L`;
		} else if (price >= 1000) {
			// 1 thousand or more
			return `₹${(price / 1000).toFixed(0)}K`;
		} else {
			return `₹${price}`;
		}
	};

	const formatArea = (area: number) => {
		if (area >= 1000) {
			return `${(area / 1000).toFixed(1)}K sq ft`;
		}
		return `${area} sq ft`;
	};

	return (
		<Link
			href={`/property/${property._id}`}
			className={`block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${className}`}>
			<div className="relative">
				{/* Property Image */}
				<div className="relative h-48 w-full">
					<Image
						src={
							typeof property.images?.[0] === "string"
								? property.images[0]
								: property.images?.[0]?.url || "/placeholder-property.jpg"
						}
						alt={property.title}
						fill
						className="object-cover rounded-t-lg"
					/>
					{property.features && (
						<div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
							FEATURED
						</div>
					)}
					{property?.isNew && (
						<div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
							NEW
						</div>
					)}
					{showSaveButton && (
						<button
							onClick={handleSaveToggle}
							disabled={toggleLikeMutation.isPending}
							className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-colors ${
								isSaved || property.isLiked
									? "bg-red-500 text-white"
									: "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
							}`}>
							<Heart
								className={`h-5 w-5 ${
									isSaved || property.isLiked ? "fill-current" : ""
								}`}
							/>
						</button>
					)}
				</div>

				{/* Property Details */}
				<div className="p-4">
					{/* Price and Type */}
					<div className="flex items-start justify-between mb-2">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
								{property.title}
							</h3>
							<p className="text-xl font-bold text-blue-600">
								{formatPrice(property.price)}
								{property.status === "rent" && (
									<span className="text-sm text-gray-500 font-normal">
										/month
									</span>
								)}
							</p>
						</div>
						<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
							{property.status}
						</span>
					</div>

					{/* Location */}
					<div className="flex items-center text-gray-600 mb-3">
						<MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
						<span className="text-sm truncate">
							{property.address.street}, {property.address.city}
						</span>
					</div>

					{/* Property Specs */}
					<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
						<div className="flex items-center">
							<Square className="h-4 w-4 mr-1" />
							<span>{formatArea(property.area.size)}</span>
						</div>
						{property && <span>{property.bedrooms} Bed</span>}
						{property.bathrooms && <span>{property.bathrooms} Bath</span>}
						{property.parking && <span>Parking</span>}
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between pt-3 border-t border-gray-100">
						<div className="flex items-center text-xs text-gray-500">
							<Calendar className="h-3 w-3 mr-1" />
							<span>
								{new Date(property.createdAt).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
								})}
							</span>
						</div>
						<div className="flex items-center text-xs text-gray-500">
							<Eye className="h-3 w-3 mr-1" />
							<span>{property.views || 0} views</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
