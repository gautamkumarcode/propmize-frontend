"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Property } from "@/types";
import { Bath, Bed, Eye, Heart, MapPin, Square, Star } from "lucide-react";
import Image from "next/image";

interface PropertyCardProps {
	property: Property;
	onFavorite?: (propertyId: string) => void;
	onClick?: (propertyId: string) => void;
	showFavorite?: boolean;
	showViews?: boolean;
	showRating?: boolean;
	className?: string;
}

export const PropertyCard = ({
	property,
	onFavorite,
	onClick,
	showFavorite = true,
	showViews = true,
	showRating = true,
	className = "",
}: PropertyCardProps) => {
	const handleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		onFavorite?.(property._id);
	};

	const handleClick = () => {
		onClick?.(property._id);
	};

	return (
		<Card
			className={cn(
				"overflow-hidden rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-white",
				className
			)}
			onClick={handleClick}>
			{/* Image Section */}
			<div className="relative h-56 overflow-hidden">
				<Image
					src={"/api/placeholder/400/300"}
					alt={property.title}
					fill
					className="object-cover group-hover:scale-110 transition-transform duration-500"
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

				{/* Type + Status Badges */}
				<div className="absolute top-3 left-3 flex flex-col gap-2">
					<Badge className="bg-white/90 text-gray-900 font-medium px-3 py-1 rounded-full shadow">
						{property.type}
					</Badge>
					<Badge className="bg-blue-600 text-white font-medium px-3 py-1 rounded-full shadow">
						{property.status}
					</Badge>
				</div>

				{/* Favorite */}
				{showFavorite && (
					<button
						onClick={handleFavorite}
						className="absolute top-3 right-3 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition">
						<Heart className="w-5 h-5" />
					</button>
				)}
			</div>

			<CardContent className="p-5">
				{/* Price + Rating */}
				<div className="flex items-center justify-between mb-3">
					<span className="text-2xl font-extrabold text-blue-700">
						₹{property.price?.toLocaleString()}
					</span>
					{showRating && (
						<div className="flex items-center text-yellow-500">
							<Star className="w-5 h-5 fill-current" />
							<span className="ml-1 font-medium text-gray-700">{"4.8"}</span>
						</div>
					)}
				</div>

				{/* Title */}
				<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
					{property.title}
				</h3>

				{/* Location */}
				{(property.address?.area || property.address?.city) && (
					<p className="text-sm text-gray-600 flex items-center mb-4">
						<MapPin className="w-4 h-4 mr-1 text-blue-500" />
						{[
							property.address.area,
							property.address.city,
							property.address.state,
						]
							.filter(Boolean)
							.join(", ")}
					</p>
				)}

				{/* Features */}
				{(property.bedrooms || property.bathrooms || property.area?.size) && (
					<div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
						{property.bedrooms && (
							<div className="text-center">
								<Bed className="w-5 h-5 text-blue-600 mx-auto mb-1" />
								<span className="font-semibold">{property.bedrooms}</span>
								<p className="text-xs text-gray-500">Beds</p>
							</div>
						)}
						{property.bathrooms && (
							<div className="text-center">
								<Bath className="w-5 h-5 text-blue-600 mx-auto mb-1" />
								<span className="font-semibold">{property.bathrooms}</span>
								<p className="text-xs text-gray-500">Baths</p>
							</div>
						)}
						{property.area?.size && (
							<div className="text-center">
								<Square className="w-5 h-5 text-blue-600 mx-auto mb-1" />
								<span className="font-semibold">{property.area.size}</span>
								<p className="text-xs text-gray-500">
									{property.area.unit || "sqft"}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Meta Info */}
				<div className="flex items-center justify-between text-xs text-gray-500">
					<span>
						{property.createdAt
							? `Posted ${formatDate(property.createdAt)}`
							: "Recently posted"}
					</span>
					{showViews && (
						<span className="flex items-center">
							<Eye className="w-4 h-4 mr-1 text-gray-400" />
							{(property.views || 2400).toLocaleString()} views
						</span>
					)}
				</div>
			</CardContent>

			<CardFooter className="p-5 pt-0">
				<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold">
					View Details
				</Button>
			</CardFooter>
		</Card>
	);
};

// Date Helper
const formatDate = (dateInput: string | Date) => {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) return "today";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
	return `${Math.ceil(diffDays / 30)} months ago`;
};
