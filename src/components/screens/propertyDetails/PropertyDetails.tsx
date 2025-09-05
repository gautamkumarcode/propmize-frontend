"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyResponse, useAuth, useProperty, useToggleLike } from "@/lib";
import {
	Bath,
	Bed,
	Building,
	BuildingIcon,
	Calendar,
	Car,
	CarIcon,
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
	MessageCircle,
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

	console.log(property);

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
			{/* Header Section */}
			<div className="mb-6 md:mb-8">
				<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
					{property.title}
				</h1>
				<div className="flex items-center gap-2 mb-4 md:mb-6">
					<MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
					<span className="text-sm md:text-base text-gray-600 leading-relaxed">
						{property.address.street}, {property.address.area},{" "}
						{property.address.city}, {property.address.state} -{" "}
						{property.address.zipCode}
					</span>
				</div>
				<div className="flex flex-wrap gap-2 mb-4 md:mb-6">
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
							<Crown className="h-3 w-3 md:h-4 md:w-4 mr-1" /> FEATURED
						</Badge>
					)}
					{property.isPremium && (
						<Badge className="bg-amber-100 text-amber-800 text-xs md:text-sm">
							<TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" /> PREMIUM
						</Badge>
					)}
					<Badge variant="outline" className="text-xs md:text-sm capitalize">
						{property.propertyType}
					</Badge>
					<Badge variant="outline" className="text-xs md:text-sm capitalize">
						{property.listingType}
					</Badge>
				</div>
			</div>

			{/* Image Gallery */}
			<div className="relative mb-8 md:mb-12 rounded-2xl overflow-hidden">
				<div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
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
						<div className="w-full h-full flex items-center justify-center bg-gray-200">
							<Home className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
						</div>
					)}

					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200">
								<ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
							</button>
							<button
								onClick={nextImage}
								className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200">
								<ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
							</button>
						</>
					)}

					{/* Image Counter */}
					{images.length > 1 && (
						<div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs md:text-sm">
							{currentImageIndex + 1} / {images.length}
						</div>
					)}

					{/* Action Buttons */}
					<div className="absolute top-4 right-4 flex gap-2">
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200"
							onClick={handleSaveToggle}>
							<Heart
								className={`h-4 w-4 md:h-5 md:w-5 ${
									isLikedByUser ? "fill-red-500 text-red-500" : ""
								}`}
							/>
						</Button>
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200">
							<Share2 className="h-4 w-4 md:h-5 md:w-5" />
						</Button>
					</div>
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="flex gap-2 mt-4 overflow-x-auto py-2">
						{images.map((img, idx) => (
							<div
								key={idx}
								className={`relative h-16 w-16 md:h-20 md:w-20 min-w-[4rem] md:min-w-[5rem] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
									currentImageIndex === idx
										? "ring-3 ring-blue-500 ring-offset-2"
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
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6 md:space-y-8">
					{/* Price Section */}
					<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
						<div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
							<div>
								<span className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-700">
									{property.listingType === "sale"
										? `₹${formatPrice(property.price)}`
										: `₹${property.pricing?.basePrice}`}{" "}
								</span>
								{property.listingType !== "sale" && (
									<span className="ml-2 text-base md:text-lg text-gray-600">
										/
										{property.listingType === "rent" ? "month" : "lease period"}
									</span>
								)}
								{property.pricing?.priceNegotiable && (
									<div className="text-sm md:text-base text-blue-600 mt-2 font-medium">
										💬 Price Negotiable
									</div>
								)}
							</div>
							<div className="flex gap-3">
								<Button
									size="lg"
									className="bg-green-600 hover:bg-green-700 px-6">
									<Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
									<span className="text-sm md:text-base">Call</span>
								</Button>
								<Button variant="outline" size="lg" className="px-6">
									<MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
									<span className="text-sm md:text-base">Message</span>
								</Button>
							</div>
						</div>

						{property.pricing && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-200">
								{property.pricing.maintenanceCharges && (
									<div className="text-center p-3 bg-white rounded-lg border border-blue-100">
										<div className="text-xs md:text-sm text-gray-600 font-medium">
											Maintenance
										</div>
										<div className="font-semibold text-base md:text-lg">
											₹
											{formatPrice(Number(property.pricing.maintenanceCharges))}
											<span className="text-xs text-gray-500">/month</span>
										</div>
									</div>
								)}
								{property.pricing.securityDeposit && (
									<div className="text-center p-3 bg-white rounded-lg border border-blue-100">
										<div className="text-xs md:text-sm text-gray-600 font-medium">
											Security Deposit
										</div>
										<div className="font-semibold text-base md:text-lg">
											₹{formatPrice(Number(property.pricing.securityDeposit))}
										</div>
									</div>
								)}
								{property.pricing.brokeragePercentage && (
									<div className="text-center p-3 bg-white rounded-lg border border-blue-100">
										<div className="text-xs md:text-sm text-gray-600 font-medium">
											Brokerage
										</div>
										<div className="font-semibold text-base md:text-lg">
											{property.pricing.brokeragePercentage}%
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Property Overview */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">
							Property Overview
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
							{[
								{ icon: Bed, label: "Bedrooms", value: property.bedrooms || 0 },
								{
									icon: Bath,
									label: "Bathrooms",
									value: property.bathrooms || 0,
								},
								{
									icon: Square,
									label: "Area",
									value: `${property.area.value} ${property.area.unit}`,
								},
								{ icon: Car, label: "Parking", value: property.parking || 0 },
								...(property.balconies
									? [
											{
												icon: TreePine,
												label: "Balconies",
												value: property.balconies,
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
											},
									  ]
									: []),
								{
									icon: Calendar,
									label: "Age",
									value: `${property.age} years`,
								},
								{ icon: Home, label: "Furnishing", value: property.furnished },
							].map((item, index) => (
								<div
									key={index}
									className="flex flex-col items-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
									<item.icon className="h-5 w-5 md:h-6 md:w-6 text-blue-500 mb-2" />
									<span className="text-xs md:text-sm text-gray-600 font-medium mb-1">
										{item.label}
									</span>
									<span className="font-semibold text-sm md:text-base text-gray-900">
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Description */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
							Description
						</h2>
						<p className="text-gray-700 leading-relaxed text-base md:text-lg">
							{property.description}
						</p>
					</div>

					{/* Amenities */}
					{property.amenities && property.amenities.length > 0 && (
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
							<h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">
								Amenities
							</h2>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
								{property.amenities.map((amenity, idx) => (
									<div
										key={idx}
										className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
										{renderAmenityIcon(amenity)}
										<span className="text-sm md:text-base text-gray-700 capitalize">
											{amenity}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Additional Features */}
					{property.features && (
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
							<h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">
								Features
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
								{Object.entries(property.features).map(([key, value]) => {
									if (value === null || value === undefined || value === "")
										return null;

									const label = key
										.replace(/([A-Z])/g, " $1")
										.replace(/^./, (str) => str.toUpperCase());
									const displayValue =
										typeof value === "boolean" ? (value ? "Yes" : "No") : value;

									return (
										<div
											key={key}
											className="bg-gray-50 p-4 rounded-lg border border-gray-100">
											<h3 className="text-sm font-medium text-gray-600 mb-1">
												{label}
											</h3>
											<p className="font-semibold text-gray-900 text-base capitalize">
												{displayValue}
											</p>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Location & Nearby Places */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">
							Location Details
						</h2>

						<div className="mb-6 p-4 md:p-6 bg-blue-50 rounded-xl border border-blue-100">
							<div className="flex items-start gap-3">
								<MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-500 mt-1 flex-shrink-0" />
								<div>
									<p className="text-base md:text-lg text-gray-800 font-medium mb-2">
										{property.address.area}, {property.address.city}
									</p>
									<p className="text-sm md:text-base text-gray-600">
										{property.address.street}, {property.address.state} -{" "}
										{property.address.zipCode}
									</p>
									{property.address.landmark && (
										<p className="text-sm md:text-base text-gray-600 mt-2">
											<span className="font-medium">Landmark:</span>{" "}
											{property.address.landmark}
										</p>
									)}
								</div>
							</div>
						</div>

						{property.nearbyPlaces &&
							Object.entries(property.nearbyPlaces).some(
								([_, places]) => Array.isArray(places) && places.length > 0
							) && (
								<>
									<h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">
										Nearby Places
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
										{Object.entries(property.nearbyPlaces).map(
											([type, places]) => {
												if (!Array.isArray(places) || places.length === 0)
													return null;

												return (
													<div
														key={type}
														className="bg-gray-50 p-4 rounded-xl border border-gray-100">
														<div className="flex items-center gap-2 mb-3">
															{renderNearbyIcon(type)}
															<h4 className="font-semibold text-gray-800 capitalize">
																{type}
															</h4>
														</div>
														<ul className="space-y-2">
															{places.slice(0, 3).map((place, idx) => (
																<li
																	key={idx}
																	className="flex justify-between items-center text-sm md:text-base">
																	<span className="text-gray-700">
																		{place.name}
																	</span>
																	<span className="text-gray-500 font-medium">
																		{place.distance} {place.unit || "km"}
																	</span>
																</li>
															))}
														</ul>
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
				<div className="lg:col-span-1 space-y-6 md:space-y-8">
					{/* Contact Info Card */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
						<h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
							<Contact className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
							Contact Information
						</h2>

						<div className="space-y-4 md:space-y-6">
							<div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
								<h3 className="text-sm font-medium text-gray-600 mb-1">
									Contact Person
								</h3>
								<p className="font-semibold text-lg text-gray-900">
									{property.contact?.name}
								</p>
								<p className="text-sm text-blue-600 font-medium capitalize">
									{property.contact?.type}
								</p>
							</div>

							<div className="bg-green-50 p-4 rounded-xl border border-green-100">
								<h3 className="text-sm font-medium text-gray-600 mb-1">
									Phone Number
								</h3>
								<p className="font-semibold text-lg text-gray-900 flex items-center gap-2">
									<Phone className="h-4 w-4 text-green-500" />
									{property.contact?.phone}
								</p>
							</div>

							{property.contact?.whatsapp && (
								<div className="bg-green-50 p-4 rounded-xl border border-green-100">
									<h3 className="text-sm font-medium text-gray-600 mb-1">
										WhatsApp
									</h3>
									<p className="font-semibold text-lg text-green-600">
										{property.contact.whatsapp}
									</p>
								</div>
							)}

							<div className="flex flex-col gap-3">
								<Button className="w-full bg-green-600 hover:bg-green-700 py-3 text-base">
									<Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
									Call Now
								</Button>
								<Button variant="outline" className="w-full py-3 text-base">
									<MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
									Send Message
								</Button>
							</div>
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