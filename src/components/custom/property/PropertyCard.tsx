"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useCreateLead } from "@/lib/react-query/hooks/useLeads";
import { cn } from "@/lib/utils";
import { PropertyResponse } from "@/types";
import {
	Bath,
	Bed,
	Calendar,
	Car,
	Crown,
	Eye,
	Heart,
	MapPin,
	MessageCircle,
	Phone,
	Shield,
	Square,
	Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useToggleLike } from "../../../lib/react-query/hooks/useProperties";

interface PropertyCardProps {
	property: PropertyResponse;
	isSaved?: boolean;
	showSaveButton?: boolean;
	className?: string;
}

// Helper functions outside component to avoid recreation on each render
const formatPrice = (price: number, status: string) => {
	if (price >= 10000000) {
		return `₹${(price / 10000000).toFixed(2)}Cr${
			status === "rent" ? "/month" : ""
		}`;
	} else if (price >= 100000) {
		return `₹${(price / 100000).toFixed(2)}L${
			status === "rent" ? "/month" : ""
		}`;
	} else if (price >= 1000) {
		return `₹${(price / 1000).toFixed(0)}K${status === "rent" ? "/month" : ""}`;
	} else {
		return `₹${price}${status === "rent" ? "/month" : ""}`;
	}
};

const formatArea = (area: number, unit: string = "sq ft") => {
	if (area >= 1000) {
		return `${(area / 1000).toFixed(1)}K ${unit}`;
	}
	return `${area} ${unit}`;
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export default function PropertyCard({
	property,
	isSaved = false,
	showSaveButton = true,
	className = "",
}: PropertyCardProps) {
	const toggleLikeMutation = useToggleLike();
	const { user } = useAuth();
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	const createLeadMutation = useCreateLead();

	const isOwner = user && property.seller?.toString() === user._id;

	// Check if the current user has liked this property
	const isLikedByUser = React.useMemo(() => {
		if (!user || !property?.likedBy) return false;

		return property.likedBy.some((likedUser) => {
			const likedUserId =
				typeof likedUser.user === "string" ? likedUser.user : likedUser._id;
			return String(likedUserId) === String(user._id);
		});
	}, [user, property?.likedBy]);

	const handleSaveToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleLikeMutation.mutate(property._id);
	};

	const handleContactSeller = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user) {
			// Ideally, trigger auth modal here
			toast({
				title: "Authentication Required",
				description: "Please sign in to contact the seller.",
				variant: "destructive",
			});
			return;
		}

		createLeadMutation.mutate(
			{
				propertyId: property._id,
				message: "I am interested in this property.", // Default message
				buyerContact: {
					contactMethod: "any", // Default to 'any'
					phone: user?.phone || undefined,
				},
				// You might want to add more details here, like buyer's contact from user object
				// or open a modal for a custom message
			},
			{
				onSuccess: () => {
					toast({
						title: "Inquiry Sent",
						description: "Your inquiry has been sent to the seller.",
					});
				},
				onError: (error) => {
					console.error("Error creating lead:", error);
					toast({
						title: "Failed to Send Inquiry",
						description:
							"There was an error sending your inquiry. Please try again.",
						variant: "destructive",
					});
				},
			}
		);
	};

	const handleImageError = () => {
		setImageError(true);
		setImageLoading(false);
	};

	const handleImageLoad = () => {
		setImageLoading(false);
	};

	const propertySpecs = [
		{
			icon: Bed,
			value: `${property.bedrooms} `,
			key: "bedrooms",
		},
		{
			icon: Bath,
			value: `${property.bathrooms} `,
			key: "bathrooms",
		},
		{
			icon: Square,
			value: formatArea(property.area.value, property.area.unit),
			key: "area",
		},
		...(property.parking
			? [
					{
						icon: Car,
						value: `${property.parking} `,
						key: "parking",
					},
			  ]
			: []),
	];

	const statusColors = {
		active: "bg-green-100 text-green-800",
		sold: "bg-purple-100 text-purple-800",
		rented: "bg-blue-100 text-blue-800",
		inactive: "bg-gray-100 text-gray-800",
		pending: "bg-amber-100 text-amber-800",
	};

	return (
		<Card
			className={cn(
				"overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl",
				"transform hover:-translate-y-1",
				className
			)}>
			<Link href={`/property/${property._id}`} className="block">
				<div className="relative">
					{/* Property Image */}
					<div className="relative h-64 w-full overflow-hidden">
						{/* Image loading skeleton */}
						{imageLoading && (
							<div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl" />
						)}

						<Image
							src={
								imageError ? "/placeholder-property.jpg" : property.images[0]
							}
							alt={property.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
							onError={handleImageError}
							onLoad={handleImageLoad}
							unoptimized
						/>

						{/* Gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						{/* Status badges */}
						<div className="absolute top-4 left-4 flex flex-col gap-2">
							<div className="flex flex-wrap gap-2">
								{property.featured && (
									<Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 shadow-lg border-0">
										<Crown className="h-3 w-3 mr-1" />
										FEATURED
									</Badge>
								)}
								{property.isPremium && (
									<Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1.5 shadow-lg border-0">
										<Star className="h-3 w-3 mr-1" />
										PREMIUM
									</Badge>
								)}
								<Badge
									className={cn(
										"px-3 py-1.5 shadow-lg border-0 capitalize",
										statusColors[
											property.status as keyof typeof statusColors
										] || statusColors.active
									)}>
									{property.status}
								</Badge>
							</div>
						</div>

						{/* Price badge */}
						<div className="absolute bottom-4 left-4">
							<Badge className="bg-white/95 backdrop-blur-sm text-gray-900 text-lg font-bold px-4 py-2 shadow-xl border-0 rounded-xl">
								{formatPrice(
									property.price || property?.pricing?.basePrice?.value || 0,
									property.status
								)}{" "}
							</Badge>
						</div>

						{/* Save button */}
						{showSaveButton && (
							<button
								onClick={handleSaveToggle}
								disabled={toggleLikeMutation.isPending}
								className={cn(
									"absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110",
									isLikedByUser || isSaved
										? "bg-red-500 text-white hover:bg-red-600"
										: "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-red-50 hover:text-red-500"
								)}
								aria-label={
									isLikedByUser || isSaved
										? "Remove from saved"
										: "Save property"
								}>
								<Heart
									className={cn(
										"h-5 w-5 transition-colors",
										isLikedByUser || isSaved ? "fill-current" : ""
									)}
								/>
							</button>
						)}
					</div>

					{/* Property Details */}
					<CardContent className="p-5">
						{/* Title and Type */}
						<div className="flex items-start justify-between mb-3 h-[2.5rem]">
							<h3 className="text-lg  font-bold text-gray-900 line-clamp-2 flex-1 leading-tight">
								{property.title}
							</h3>
							<Badge variant="outline" className="ml-3 capitalize bg-gray-50">
								{property.propertyType}
							</Badge>
						</div>

						{/* Location */}
						<div className="flex items-center text-gray-600 mb-4">
							<MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
							<span className="text-sm truncate">
								{property.address.area}, {property.address.city}
							</span>
						</div>

						{/* Property Specs */}
						{/* <div className="grid grid-cols-4 gap-3 mb-4">
							{propertySpecs.map((spec) => (
								<div key={spec.key} className="flex items-center ">
									<spec.icon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
									<span className="text-sm text-gray-700">{spec.value}</span>
								</div>
							))}
						</div> */}

						{/* Furnishing Status */}
					</CardContent>

					{/* Footer */}
					<CardFooter className="px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
						<div className="w-full">
							{/* Date and Views */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center text-sm text-gray-500">
									<Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
									<span>
										{formatDate(property.createdAt as unknown as string)}
									</span>
								</div>
								<div className="flex items-center text-sm text-gray-500">
									<Eye className="h-4 w-4 mr-1.5 text-gray-400" />
									<span>{property.views || 0} views</span>
								</div>
							</div>

							{/* Contact Information */}
							{user ? (
								<div className="space-y-3">
									<div className="grid grid-cols-2 gap-3">
										{property.contact?.phone && (
											<Button
												variant="outline"
												size="sm"
												className="w-full text-xs h-9"
												onClick={(e) => {
													e.preventDefault();
													window.location.href = `tel:${property.contact?.phone}`;
												}}>
												<Phone className="h-3.5 w-3.5 mr-1.5" />
												Call
											</Button>
										)}
										{property.contact?.whatsapp && (
											<Button
												variant="outline"
												size="sm"
												className="w-full text-xs h-9 text-green-600 border-green-200 hover:bg-green-50"
												onClick={(e) => {
													e.preventDefault();
													window.open(
														`https://wa.me/${property.contact?.whatsapp}`,
														"_blank"
													);
												}}>
												<MessageCircle className="h-3.5 w-3.5 mr-1.5" />
												WhatsApp
											</Button>
										)}
									</div>
									<div className="text-xs text-gray-500 text-center">
										Contact: {property.contact?.name} ({property.contact?.type})
									</div>
								</div>
							) : (
								<div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
									<Shield className="h-4 w-4 mx-auto mb-1 text-amber-600" />
									<p className="text-xs text-amber-700 font-medium">
										Sign in to view contact details
									</p>
								</div>
							)}

							{user && !isOwner && (
								<Button
									className="w-full mt-3"
									onClick={handleContactSeller}
									disabled={createLeadMutation.isPending}>
									{createLeadMutation.isPending
										? "Sending Inquiry..."
										: "Contact Seller"}
								</Button>
							)}
						</div>
					</CardFooter>
				</div>
			</Link>
		</Card>
	);
}