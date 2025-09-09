"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyResponse, useAuth, useProperty, useToggleLike } from "@/lib";
import {
	BuildingIcon,
	CarIcon,
	ChevronLeft,
	ChevronRight,
	Contact,
	Crown,
	Dumbbell,
	Heart,
	Home,
	MapPin,
	MessageCircle,
	Phone,
	School,
	Share2,
	Shield,
	ShoppingCart,
	Snowflake,
	Star,
	Train,
	TreePine,
	TrendingUp,
	Wifi,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const PropertyDetails = () => {
	const params = useParams();
	const { user } = useAuth();
	const { data: propertyData, isLoading } = useProperty(
		(params.id ?? "") as string
	);

	const toggleLikeMutation = useToggleLike();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [imageError, setImageError] = useState(false);

	const property: PropertyResponse | null = propertyData || null;

	const isLikedByUser = useMemo(() => {
		if (!user || !property?.likedBy) return false;
		return property.likedBy.some((likedUser) => {
			const likedUserId =
				typeof likedUser === "string" ? likedUser : likedUser._id;
			return String(likedUserId) === String(user._id);
		});
	}, [user, property?.likedBy]);

	const handleSaveToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (property) {
			toggleLikeMutation.mutate(property._id);
		}
	};

	if (isLoading)
		return (
			<div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
					<div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<div className="h-32 bg-gray-200 rounded-xl"></div>
							<div className="h-64 bg-gray-200 rounded-xl"></div>
						</div>
						<div className="h-96 bg-gray-200 rounded-xl"></div>
					</div>
				</div>
			</div>
		);

	if (!property)
		return (
			<div className="text-center py-12 text-gray-600">Property not found</div>
		);

	const nextImage = () => {
		setCurrentImageIndex((prev) =>
			prev === property.images.length - 1 ? 0 : prev + 1
		);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) =>
			prev === 0 ? property.images.length - 1 : prev - 1
		);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-IN").format(price);
	};

	const renderAmenityIcon = (amenity: string) => {
		const amenityIcons: Record<string, JSX.Element> = {
			wifi: <Wifi className="h-4 w-4 md:h-5 md:w-5" />,
			ac: <Snowflake className="h-4 w-4 md:h-5 md:w-5" />,
			gym: <Dumbbell className="h-4 w-4 md:h-5 md:w-5" />,
			park: <TreePine className="h-4 w-4 md:h-5 md:w-5" />,
			security: <Shield className="h-4 w-4 md:h-5 md:w-5" />,
			pool: <Snowflake className="h-4 w-4 md:h-5 md:w-5" />,
			parking: <CarIcon className="h-4 w-4 md:h-5 md:w-5" />,
		};
		return (
			amenityIcons[amenity.toLowerCase()] || (
				<Star className="h-4 w-4 md:h-5 md:w-5" />
			)
		);
	};

	const images = property.images || [];
	const imageUrl = images[currentImageIndex] || "/placeholder-property.jpg";

	const renderNearbyIcon = (type: string) => {
		const icons: Record<string, JSX.Element> = {
			schools: <School className="h-4 w-4 md:h-5 md:w-5" />,
			hospitals: <BuildingIcon className="h-4 w-4 md:h-5 md:w-5" />,
			malls: <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />,
			transport: <Train className="h-4 w-4 md:h-5 md:w-5" />,
		};
		return icons[type] || <MapPin className="h-4 w-4 md:h-5 md:w-5" />;
	};

	return (
		<div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-10 flex flex-col">
			{/* Header Section */}
			<header className="space-y-4">
				<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
					{property.title}
				</h1>

				<div className="flex items-center gap-2 text-gray-600">
					<MapPin className="h-5 w-5 text-blue-500" />
					<span className="text-sm md:text-base">
						{property.address.street}, {property.address.area},{" "}
						{property.address.city}, {property.address.state} -{" "}
						{property.address.zipCode}
					</span>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge
						variant={
							["sale", "rent"].includes(property.status)
								? "default"
								: "secondary"
						}
						className="text-xs md:text-sm">
						{property.status.toUpperCase()}
					</Badge>

					{property.featured && (
						<Badge className="bg-purple-100 text-purple-800 text-xs md:text-sm">
							<Crown className="h-4 w-4 mr-1" /> FEATURED
						</Badge>
					)}

					{property.isPremium && (
						<Badge className="bg-amber-100 text-amber-800 text-xs md:text-sm">
							<TrendingUp className="h-4 w-4 mr-1" /> PREMIUM
						</Badge>
					)}

					<Badge variant="outline" className="text-xs md:text-sm capitalize">
						{property.propertyType}
					</Badge>
					<Badge variant="outline" className="text-xs md:text-sm capitalize">
						{property.listingType}
					</Badge>
				</div>
			</header>

			{/* Image Gallery */}
			<section className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
				<div className="relative h-64 md:h-80 lg:h-96 bg-gray-100">
					{images.length > 0 ? (
						<Image
							fill
							src={imageError ? "/placeholder-property.jpg" : imageUrl}
							alt={property.title}
							className="object-contain transition-transform duration-300 hover:scale-105"
							onError={() => setImageError(true)}
							priority
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<Home className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
						</div>
					)}

					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white">
								<ChevronLeft className="h-6 w-6" />
							</button>
							<button
								onClick={nextImage}
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white">
								<ChevronRight className="h-6 w-6" />
							</button>
						</>
					)}

					{/* Counter */}
					{images.length > 1 && (
						<div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
							{currentImageIndex + 1} / {images.length}
						</div>
					)}

					{/* Actions */}
					<div className="absolute top-4 right-4 flex gap-2">
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-white/90 hover:bg-white shadow-sm"
							onClick={handleSaveToggle}>
							<Heart
								className={`h-5 w-5 ${
									isLikedByUser ? "fill-red-500 text-red-500" : "text-gray-600"
								}`}
							/>
						</Button>
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-white/90 hover:bg-white shadow-sm">
							<Share2 className="h-5 w-5 text-gray-600" />
						</Button>
					</div>
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="flex gap-3 px-4 py-3 overflow-x-auto bg-gray-50 border-t">
						{images.map((img, idx) => (
							<div
								key={idx}
								className={`relative h-16 w-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
									currentImageIndex === idx
										? "ring-2 ring-blue-500"
										: "opacity-70 hover:opacity-100"
								}`}
								onClick={() => setCurrentImageIndex(idx)}>
								<Image
									fill
									src={img}
									alt={`${property.title} ${idx + 1}`}
									className="object-cover"
								/>
							</div>
						))}
					</div>
				)}
			</section>

			{/* Layout: Main + Sidebar */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column (Main details) */}
				<div className="lg:col-span-2 space-y-8">
					{/* Price */}
					<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div>
								<span className="text-3xl font-bold text-green-700">
									{property.listingType === "sale"
										? `₹${formatPrice(property.price)}`
										: `₹${property.pricing?.basePrice}`}
								</span>
								{property.listingType !== "sale" && (
									<span className="ml-2 text-gray-600">
										/{property.listingType === "rent" ? "month" : "lease"}
									</span>
								)}
								{property.pricing?.priceNegotiable && (
									<p className="text-sm text-blue-600 font-medium mt-1">
										💬 Price Negotiable
									</p>
								)}
							</div>
							<div className="flex gap-3">
								<Button className="bg-green-600 hover:bg-green-700 px-6">
									<Phone className="h-5 w-5 mr-2" /> Call
								</Button>
								<Button variant="outline" className="px-6">
									<MessageCircle className="h-5 w-5 mr-2" /> Message
								</Button>
							</div>
						</div>
					</div>

					{/* Overview */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border">
						<h2 className="text-xl font-semibold mb-6">Property Overview</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{/* map items like before */}
						</div>
					</div>

					{/* Description */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border">
						<h2 className="text-xl font-semibold mb-4">Description</h2>
						<p className="text-gray-700 leading-relaxed">
							{property.description}
						</p>
					</div>

					{/* ... keep Amenities, Features, Location, History etc. with same card style */}
				</div>

				{/* Right column (Sidebar) */}
				<aside className="space-y-8">
					{/* Contact Info */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6">
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Contact className="h-5 w-5 text-blue-500" />
							Contact Information
						</h2>
						{/* contact cards like before */}
					</div>

					{/* Summary */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border">
						<h2 className="text-lg font-semibold mb-4">Property Summary</h2>
						{/* summary list */}
					</div>
				</aside>
			</div>
		</div>
	);
};

export default PropertyDetails;