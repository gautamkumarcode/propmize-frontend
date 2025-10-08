"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { triggerToast } from "@/components/ui/Toaster";
import { PropertyResponse, useAuth, useProperty, useToggleLike } from "@/lib";
import {
	Bath,
	Bed,
	Building,
	BuildingIcon,
	Calendar,
	Car,
	CarIcon,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	Contact,
	Crown,
	Dumbbell,
	Eye,
	Heart,
	Home,
	MapPin,
	Phone,
	School,
	Share2,
	Shield,
	ShoppingCart,
	Snowflake,
	Square,
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
		return property.likedBy.find((likedUser) => {
			return String(likedUser?.user) === String(user._id);
		});
	}, [user, property?.likedBy]);

	const handleSaveToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user) {
			triggerToast({
				title: "Login Required",
				description: "You need to be logged in to save properties.",
				variant: "destructive",
			});
			return;
		}
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

	const images = Array.isArray(property.images) ? property.images : [];
	const imageUrl =
		images.length > 0 ? images[currentImageIndex] : "/placeholder-property.jpg";

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
		<div className="min-h-screen bg-background">
			{/* Hero Header Section */}
			<div className="relative border-b border-border">
				<div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
				<div className="relative max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
					{/* Main Content Row */}
					<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
						{/* Left Section - Title and Address */}
						<div className="flex-1 animate-fadeInUp min-w-0">
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight break-words">
								{property.title.charAt(0).toUpperCase() +
									property.title.slice(1)}
							</h1>

							{/* Address Badge */}
							<div className="flex items-center gap-3 mb-6 md:mb-8 p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 w-full max-w-2xl">
								<div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
									<MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
								</div>
								<span className="text-base md:text-lg text-muted-foreground leading-relaxed break-words">
									{property.address.street}, {property.address.area},{" "}
									{property.address.city}, {property.address.state} -{" "}
									{property.address.zipCode}
								</span>
							</div>
						</div>

						{/* Right Section - Badges */}
						<div className="flex flex-col gap-4 lg:items-end lg:max-w-md">
							{/* Status and Feature Badges */}
							<div className="flex flex-wrap gap-2 md:gap-3 justify-start lg:justify-end">
								<Badge
									variant={
										["sale", "rent"].includes(property.status)
											? "default"
											: "secondary"
									}
									className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
									{property.status.toUpperCase()}
								</Badge>

								{property.featured && (
									<Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-2 hover:from-purple-600 hover:to-purple-700 flex-shrink-0">
										<Crown className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
										FEATURED
									</Badge>
								)}

								{property.isPremium && (
									<Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-2 hover:from-amber-600 hover:to-amber-700 flex-shrink-0">
										<TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
										PREMIUM
									</Badge>
								)}
							</div>

							{/* Type Badges */}
							<div className="flex flex-wrap gap-2 md:gap-3 justify-start lg:justify-end">
								<Badge
									variant="outline"
									className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 capitalize border-border bg-card/50 flex-shrink-0">
									{property.propertyType}
								</Badge>
								<Badge
									variant="outline"
									className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 capitalize border-border bg-card/50 flex-shrink-0">
									{property.listingType}
								</Badge>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20">
				{/* Image Gallery */}
				<div className="relative mb-8 md:mb-12 rounded-3xl overflow-hidden shadow-2xl animate-fadeInUp">
					<div className="relative h-72 md:h-96 lg:h-[32rem] bg-gradient-to-br from-muted/50 to-muted">
						{images.length > 0 ? (
							<Image
								fill
								src={imageError ? "/placeholder-property.jpg" : imageUrl}
								alt={property.title}
								className="object-cover transition-all duration-500 hover:scale-105"
								onError={() => setImageError(true)}
								priority
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-muted">
								<div className="text-center">
									<Home className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">No images available</p>
								</div>
							</div>
						)}

						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

						{/* Navigation Arrows */}
						{images.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-card/90 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-card hover:scale-110 transition-all duration-300 border border-border/50">
									<ChevronLeft className="h-6 w-6 md:h-7 md:w-7 text-foreground" />
								</button>
								<button
									onClick={nextImage}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card/90 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-card hover:scale-110 transition-all duration-300 border border-border/50">
									<ChevronRight className="h-6 w-6 md:h-7 md:w-7 text-foreground" />
								</button>
							</>
						)}

						{/* Image Counter */}
						{images.length > 1 && (
							<div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm md:text-base font-medium">
								{currentImageIndex + 1} / {images.length}
							</div>
						)}

						{/* Action Buttons */}
						<div className="absolute top-6 right-6 flex gap-3">
							<Button
								size="icon"
								variant="secondary"
								className="rounded-full bg-card/90 backdrop-blur-md text-foreground hover:bg-card hover:scale-110 transition-all duration-300 border border-border/50 shadow-lg"
								onClick={handleSaveToggle}>
								<Heart
									className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
										isLikedByUser ? "fill-red-500 text-red-500" : ""
									}`}
								/>
							</Button>
							<Button
								size="icon"
								variant="secondary"
								className="rounded-full bg-card/90 backdrop-blur-md text-foreground hover:bg-card hover:scale-110 transition-all duration-300 border border-border/50 shadow-lg">
								<Share2 className="h-5 w-5 md:h-6 md:w-6" />
							</Button>
						</div>
					</div>

					{/* Thumbnails */}
					{images.length > 1 && (
						<div className="flex gap-3 mt-6 overflow-x-auto py-2 px-1">
							{images.map((img, idx) => (
								<div
									key={idx}
									className={`relative h-20 w-20 md:h-24 md:w-24 min-w-[5rem] md:min-w-[6rem] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
										currentImageIndex === idx
											? "ring-3 ring-primary ring-offset-2 ring-offset-background scale-105"
											: "opacity-70 hover:opacity-100 hover:scale-105"
									}`}
									onClick={() => setCurrentImageIndex(idx)}>
									<Image
										fill
										src={img}
										alt={`${property.title} ${idx + 1}`}
										className="object-cover"
									/>
									{currentImageIndex === idx && (
										<div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-2xl"></div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8 md:space-y-10">
						{/* Price Section */}
						<div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 rounded-3xl border border-border/50 backdrop-blur-sm animate-fadeInUp overflow-hidden">
							{/* Background Pattern */}
							<div className="absolute inset-0 bg-dot-pattern opacity-10"></div>

							<div className="relative z-10">
								<div className="flex flex-wrap items-center justify-between gap-6 mb-6">
									<div>
										<div className="flex items-baseline gap-2 mb-2">
											<span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
												{property.listingType === "sale"
													? `₹${formatPrice(property.price)}`
													: `₹${property.pricing?.basePrice}`}
											</span>
											{property.listingType !== "sale" && (
												<span className="text-lg md:text-xl text-muted-foreground font-medium">
													/
													{property.listingType === "rent"
														? "month"
														: "lease period"}
												</span>
											)}
										</div>
										{property.pricing?.priceNegotiable && (
											<div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
												💬 Price Negotiable
											</div>
										)}
									</div>
								</div>

								{property.pricing && (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-border/30">
										{property.pricing.maintenanceCharges && (
											<div className="text-center p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300">
												<div className="text-sm text-muted-foreground font-medium mb-1">
													Maintenance
												</div>
												<div className="font-bold text-lg text-foreground">
													₹
													{formatPrice(
														Number(property.pricing.maintenanceCharges)
													)}
													<span className="text-xs text-muted-foreground ml-1">
														/month
													</span>
												</div>
											</div>
										)}
										{property.pricing.securityDeposit && (
											<div className="text-center p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300">
												<div className="text-sm text-muted-foreground font-medium mb-1">
													Security Deposit
												</div>
												<div className="font-bold text-lg text-foreground">
													₹
													{formatPrice(
														Number(property.pricing.securityDeposit)
													)}
												</div>
											</div>
										)}
										{property.pricing.brokeragePercentage && (
											<div className="text-center p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300">
												<div className="text-sm text-muted-foreground font-medium mb-1">
													Brokerage
												</div>
												<div className="font-bold text-lg text-foreground">
													{property.pricing.brokeragePercentage}%
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Property Overview */}
						<div className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-border/50 animate-fadeInUp">
							<div className="flex items-center gap-3 mb-8">
								<div className="p-2 bg-primary/10 rounded-xl">
									<Home className="h-6 w-6 text-primary" />
								</div>
								<h2 className="text-2xl md:text-3xl font-bold text-foreground">
									Property Overview
								</h2>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
								{[
									{
										icon: Bed,
										label: "Bedrooms",
										value: property.bedrooms || 0,
										color: "text-blue-500",
										bg: "bg-blue-50",
									},
									{
										icon: Bath,
										label: "Bathrooms",
										value: property.bathrooms || 0,
										color: "text-cyan-500",
										bg: "bg-cyan-50",
									},
									{
										icon: Square,
										label: "Area",
										value: `${property.area.value} ${property.area.unit}`,
										color: "text-green-500",
										bg: "bg-green-50",
									},
									{
										icon: Car,
										label: "Parking",
										value: property.parking || 0,
										color: "text-purple-500",
										bg: "bg-purple-50",
									},
									...(property.balconies
										? [
												{
													icon: TreePine,
													label: "Balconies",
													value: property.balconies,
													color: "text-emerald-500",
													bg: "bg-emerald-50",
												},
										  ]
										: []),
									...(property.floor
										? [
												{
													icon: Building,
													label: "Floor",
													value: `${property.floor}${
														property.totalFloors
															? ` of ${property.totalFloors}`
															: ""
													}`,
													color: "text-orange-500",
													bg: "bg-orange-50",
												},
										  ]
										: []),
									{
										icon: Calendar,
										label: "Age",
										value: `${property.age} years`,
										color: "text-red-500",
										bg: "bg-red-50",
									},
									{
										icon: Home,
										label: "Furnishing",
										value: property.furnished,
										color: "text-indigo-500",
										bg: "bg-indigo-50",
									},
								].map((item, index) => (
									<div
										key={index}
										className="group flex flex-col items-center p-4 md:p-6 bg-muted/30 rounded-2xl border border-border/30 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-card/50">
										<div
											className={`p-3 ${item.bg} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
											<item.icon
												className={`h-6 w-6 md:h-7 md:w-7 ${item.color}`}
											/>
										</div>
										<span className="text-sm text-muted-foreground font-medium mb-2 text-center">
											{item.label}
										</span>
										<span className="font-bold text-base md:text-lg text-foreground text-center">
											{item.value}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Description */}
						<div className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-border/50 animate-fadeInUp">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-secondary/10 rounded-xl">
									<Building className="h-6 w-6 text-secondary" />
								</div>
								<h2 className="text-2xl md:text-3xl font-bold text-foreground">
									Description
								</h2>
							</div>
							<div className="prose prose-lg max-w-none">
								<p className="text-muted-foreground leading-relaxed text-base md:text-lg">
									{property.description}
								</p>
							</div>
						</div>

						{/* Amenities */}
						{property.amenities && property.amenities.length > 0 && (
							<div className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-border/50 animate-fadeInUp">
								<div className="flex items-center gap-3 mb-8">
									<div className="p-2 bg-accent/10 rounded-xl">
										<Star className="h-6 w-6 text-accent" />
									</div>
									<h2 className="text-2xl md:text-3xl font-bold text-foreground">
										Amenities
									</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
									{property.amenities.map((amenity, idx) => (
										<div
											key={idx}
											className="group flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/30 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-card/50">
											<div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
												{renderAmenityIcon(amenity)}
											</div>
											<span className="text-base md:text-lg text-foreground capitalize font-medium">
												{amenity}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Additional Features */}
						{property.features && (
							<div className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-border/50 animate-fadeInUp">
								<div className="flex items-center gap-3 mb-8">
									<div className="p-2 bg-primary/10 rounded-xl">
										<Shield className="h-6 w-6 text-primary" />
									</div>
									<h2 className="text-2xl md:text-3xl font-bold text-foreground">
										Additional Features
									</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{Object.entries(property.features).map(([key, value]) => {
										if (value === null || value === undefined || value === "")
											return null;

										const label = key
											.replace(/([A-Z])/g, " $1")
											.replace(/^./, (str) => str.toUpperCase());
										const displayValue =
											typeof value === "boolean"
												? value
													? "Yes"
													: "No"
												: value;

										return (
											<div
												key={key}
												className="group p-5 bg-muted/30 rounded-2xl border border-border/30 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-card/50">
												<div className="flex items-center justify-between">
													<div>
														<h3 className="text-sm font-medium text-muted-foreground mb-1">
															{label}
														</h3>
														<p className="font-bold text-lg text-foreground capitalize">
															{displayValue}
														</p>
													</div>
													<div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
														<CheckCircle className="h-5 w-5 text-secondary" />
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Location & Nearby Places */}
						<div className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-border/50 animate-fadeInUp">
							<div className="flex items-center gap-3 mb-8">
								<div className="p-2 bg-accent/10 rounded-xl">
									<MapPin className="h-6 w-6 text-accent" />
								</div>
								<h2 className="text-2xl md:text-3xl font-bold text-foreground">
									Location & Connectivity
								</h2>
							</div>

							{/* Address Card */}
							<div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
										<MapPin className="h-6 w-6 text-primary" />
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-bold text-foreground mb-2">
											{property.address.area}, {property.address.city}
										</h3>
										<p className="text-muted-foreground mb-2">
											{property.address.street}, {property.address.state} -{" "}
											{property.address.zipCode}
										</p>
										{property.address.landmark && (
											<div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
												<span className="w-2 h-2 bg-primary rounded-full"></span>
												<span className="text-sm font-medium text-primary">
													Near {property.address.landmark}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Nearby Places */}
							{property.nearbyPlaces &&
								Object.entries(property.nearbyPlaces).some(
									([_, places]) => Array.isArray(places) && places.length > 0
								) && (
									<>
										<h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
											<div className="w-2 h-2 bg-secondary rounded-full"></div>
											Nearby Amenities
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{Object.entries(property.nearbyPlaces).map(
												([type, places]) => {
													if (!Array.isArray(places) || places.length === 0)
														return null;

													return (
														<div
															key={type}
															className="group p-6 bg-muted/30 rounded-2xl border border-border/30 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-card/50">
															<div className="flex items-center gap-3 mb-4">
																<div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
																	{renderNearbyIcon(type)}
																</div>
																<h4 className="font-bold text-lg text-foreground capitalize">
																	{type}
																</h4>
															</div>
															<div className="space-y-3">
																{places.slice(0, 3).map((place, idx) => (
																	<div
																		key={idx}
																		className="flex justify-between items-center p-3 bg-card/50 rounded-xl">
																		<span className="text-foreground font-medium">
																			{place.name}
																		</span>
																		<span className="text-sm text-muted-foreground font-semibold px-2 py-1 bg-muted/50 rounded-lg">
																			{place.distance} {place.unit || "km"}
																		</span>
																	</div>
																))}
															</div>
														</div>
													);
												}
											)}
										</div>
									</>
								)}
						</div>

						{/* Property History */}
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
							<h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">
								Property History
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
								<div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
									<h3 className="text-sm font-medium text-gray-600 mb-2">
										Listed On
									</h3>
									<p className="font-semibold text-gray-900 text-base">
										{new Date(property.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
									<h3 className="text-sm font-medium text-gray-600 mb-2">
										Views
									</h3>
									<p className="font-semibold text-gray-900 text-base flex items-center gap-2">
										<Eye className="h-4 w-4" /> {property.views || 0}
									</p>
								</div>
								{property.expiresAt && (
									<div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
										<h3 className="text-sm font-medium text-gray-600 mb-2">
											Expires On
										</h3>
										<p className="font-semibold text-gray-900 text-base">
											{new Date(property.expiresAt).toLocaleDateString()}
										</p>
									</div>
								)}
								{property.likedBy && (
									<div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
										<h3 className="text-sm font-medium text-gray-600 mb-2">
											Likes
										</h3>
										<p className="font-semibold text-gray-900 text-base flex items-center gap-2">
											<Heart className="h-4 w-4" /> {property.likedBy.length}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-8">
						{/* Contact Info Card */}
						<div className="bg-card/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-border/50 sticky top-6 animate-fadeInUp">
							<div className="text-center mb-6">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
									<Contact className="h-8 w-8 text-primary" />
								</div>
								<h2 className="text-xl font-bold text-foreground mb-2">
									Contact Information
								</h2>
								<p className="text-sm text-muted-foreground">
									Get in touch with the property owner
								</p>
							</div>

							{/* Contact Person */}
							<div className="bg-muted/30 p-5 rounded-2xl mb-6 text-center">
								<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
									<span className="text-xl font-bold text-primary">
										{property.contact?.name?.charAt(0)?.toUpperCase() || "?"}
									</span>
								</div>
								<h3 className="font-bold text-lg text-foreground mb-1">
									{property.contact?.name || "Contact Person"}
								</h3>
								<span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full capitalize">
									{property.contact?.type || "Agent"}
								</span>
							</div>

							{/* Contact Methods */}
							<div className="space-y-4 mb-6">
								{/* Phone */}
								<div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
											<Phone className="h-5 w-5 text-blue-500" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Phone</p>
											{user ? (
												<p className="font-semibold text-foreground">
													{property.contact?.phone || "Not available"}
												</p>
											) : (
												<p className="text-sm text-muted-foreground italic">
													Login to view
												</p>
											)}
										</div>
									</div>
								</div>

								{/* WhatsApp */}
								{property.contact?.whatsapp && (
									<div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
												<svg
													className="h-5 w-5 text-green-500"
													fill="currentColor"
													viewBox="0 0 24 24">
													<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
												</svg>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													WhatsApp
												</p>
												{user ? (
													<p className="font-semibold text-foreground">
														{property.contact.whatsapp}
													</p>
												) : (
													<p className="text-sm text-muted-foreground italic">
														Login to view
													</p>
												)}
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Action Buttons */}
						{
							user && 	<div className="space-y-3">
								<Button
									className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
									onClick={() => {
										if (user && property.contact?.phone) {
											const phone = property.contact.phone.replace(
												/[^0-9+]/g,
												""
											);
											window.open(`tel:${phone}`);
										} else {
											triggerToast({
												title: "Login Required",
												description:
													"Please login to view and call the contact number.",
												variant: "destructive",
											});
										}
									}}>
									<Phone className="h-5 w-5 mr-2" />
									Call Now
								</Button>

								{property.contact?.whatsapp && (
									<Button
										className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
										onClick={() => {
											if (user && property.contact?.whatsapp) {
												const phone = property.contact.whatsapp.replace(
													/[^0-9]/g,
													""
												);
												window.open(`https://wa.me/${phone}`, "_blank");
											} else {
												triggerToast({
													title: "Login Required",
													description: "Please login to contact via WhatsApp.",
													variant: "destructive",
												});
											}
										}}>
										<svg
											className="h-5 w-5 mr-2"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
										</svg>
										WhatsApp
									</Button>
								)}
							</div>
						}
						</div>
					</div>

					{/* Property Summary Card */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<h2 className="text-xl font-semibold mb-6 text-gray-900">
							Property Summary
						</h2>
						<div className="space-y-4">
							{[
								{ label: "Property ID", value: property._id.substring(0, 8) },
								{
									label: "Type",
									value: property.propertyType,
									capitalize: true,
								},
								{
									label: "Listing Type",
									value: property.listingType,
									capitalize: true,
								},
								{
									label: "Furnishing",
									value: property.furnished,
									capitalize: true,
								},
								{ label: "Property Age", value: `${property.age} years` },
								...(property.legalInfo
									? [
											{
												label: "Ownership",
												value: property.legalInfo.ownershipType,
												capitalize: true,
											},
											...(property.legalInfo.rera
												? [
														{
															label: "RERA Number",
															value: property.legalInfo.rera.number,
														},
														{
															label: "RERA Status",
															value: property.legalInfo.rera.approved
																? "Approved"
																: "Pending",
														},
												  ]
												: []),
									  ]
									: []),
							].map((item, index) => (
								<div
									key={index}
									className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
									<span className="text-sm font-medium text-gray-600">
										{item.label}
									</span>
									<span className="font-semibold text-gray-900 text-sm md:text-base capitalize">
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Availability Card */}
					{property.availability && (
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
							<h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
								<Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
								Availability
							</h2>
							<div className="space-y-4">
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm font-medium text-gray-600">
										Immediate Availability
									</span>
									<span
										className={`font-semibold ${
											property.availability.immediatelyAvailable
												? "text-green-600"
												: "text-red-600"
										}`}>
										{property.availability.immediatelyAvailable ? "Yes" : "No"}
									</span>
								</div>
								{property.availability.possessionDate && (
									<div className="flex justify-between items-center py-2 border-b border-gray-100">
										<span className="text-sm font-medium text-gray-600">
											Possession Date
										</span>
										<span className="font-semibold text-gray-900 text-sm md:text-base">
											{new Date(
												property.availability.possessionDate
											).toLocaleDateString()}
										</span>
									</div>
								)}
								{property.availability.leaseDuration && (
									<div className="flex justify-between items-center py-2">
										<span className="text-sm font-medium text-gray-600">
											Lease Duration
										</span>
										<span className="font-semibold text-gray-900 text-sm md:text-base">
											{property.availability.leaseDuration} months
										</span>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PropertyDetails;