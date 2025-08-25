"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
	Bath,
	Bed,
	Calendar,
	Eye,
	Heart,
	Home,
	MapPin,
	Square,
} from "lucide-react";
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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = date.getDate();
		const month = date.toLocaleDateString("en-IN", { month: "short" });
		return `${day} ${month}`;
	};

	return (
		<Card
			className={cn(
				"overflow-hidden group hover:shadow-lg transition-all duration-300",
				className
			)}>
			<Link href={`/property/${property._id}`} className="block">
				<div className="relative">
					{/* Property Image */}
					<div className="relative h-52 w-full overflow-hidden">
						<Image
							src={"/placeholder-property.jpg"}
							alt={property.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-500"
						/>

						{/* Status badges */}
						<div className="absolute top-3 left-3 flex flex-col gap-2">
							{property.featured && (
								<Badge variant="featured" className="shadow-lg">
									FEATURED
								</Badge>
							)}
							{property?.isNew && (
								<Badge variant="new" className="shadow-lg">
									NEW
								</Badge>
							)}
						</div>

						{/* Price badge */}
						<div className="absolute bottom-3 left-3">
							<Badge variant="price" className="text-sm px-3 py-1.5 shadow-lg">
								{formatPrice(property.price)}
								{property.status === "rent" && (
									<span className="font-normal">/month</span>
								)}
							</Badge>
						</div>

						{/* Save button */}
						{showSaveButton && (
							<button
								onClick={handleSaveToggle}
								disabled={toggleLikeMutation.isPending}
								className={cn(
									"absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300",
									isSaved || property.isLiked
										? "bg-red-500 text-white hover:bg-red-600"
										: "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-red-50 hover:text-red-500"
								)}>
								<Heart
									className={cn(
										"h-5 w-5",
										isSaved || property.isLiked ? "fill-current" : ""
									)}
								/>
							</button>
						)}
					</div>

					{/* Property Details */}
					<CardContent className="p-4">
						{/* Title and Type */}
						<div className="flex items-start justify-between mb-3">
							<h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
								{property.title}
							</h3>
							<Badge variant="secondary" className="ml-2 capitalize">
								{property.status}
							</Badge>
						</div>

						{/* Location */}
						<div className="flex items-center text-gray-600 mb-4">
							<MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-blue-500" />
							<span className="text-sm truncate">
								{property.address.street}, {property.address.city}
							</span>
						</div>

						{/* Property Specs */}
						<div className="grid grid-cols-4 gap-2 mb-2">
							<div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
								<Square className="h-4 w-4 mb-1 text-blue-500" />
								<span className="text-xs font-medium">
									{formatArea(property.area.size)}
								</span>
							</div>

							<div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
								<Bed className="h-4 w-4 mb-1 text-blue-500" />
								<span className="text-xs font-medium">
									{property.bedrooms} Bed
								</span>
							</div>

							{property.bathrooms && (
								<div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
									<Bath className="h-4 w-4 mb-1 text-blue-500" />
									<span className="text-xs font-medium">
										{property.bathrooms} Bath
									</span>
								</div>
							)}

							{property.parking && (
								<div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
									<Home className="h-4 w-4 mb-1 text-blue-500" />
									<span className="text-xs font-medium">Parking</span>
								</div>
							)}
						</div>
					</CardContent>

					{/* Footer */}
					<CardFooter className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
						<div className="flex items-center text-xs text-gray-500">
							<Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
							<span>{formatDate(property.createdAt as unknown as string)}</span>
						</div>
						<div className="flex items-center text-xs text-gray-500">
							<Eye className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
							<span>{property.views || 0} views</span>
						</div>
					</CardFooter>
				</div>
			</Link>
		</Card>
	);
}
