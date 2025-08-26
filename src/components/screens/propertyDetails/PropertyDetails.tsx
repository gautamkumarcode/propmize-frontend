"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyResponse, useAuth, useProperty, useToggleLike } from "@/lib";
import {
	Bath,
	Bed,
	Building,
	Calendar,
	Car,
	ChevronLeft,
	ChevronRight,
	Clock,
	Contact,
	Dumbbell,
	Eye,
	Heart,
	Home,
	MapPin,
	Phone,
	Share2,
	Shield,
	Snowflake,
	Square,
	Star,
	TreePine,
	Wifi,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

interface PropertyDetailsProps {
	propertyId: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyId }) => {
	const params = useParams();
	const { user } = useAuth();
	const { data: propertyData, isLoading } = useProperty(
		(params.id ?? "") as string
	);

	const toggleLikeMutation = useToggleLike();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [imageError, setImageError] = useState(false);

	const property: PropertyResponse | null = propertyData || null;

	// Move all hooks to the top level (unconditionally)
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
			<div className="max-w-6xl mx-auto p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
					<div className="h-96 bg-gray-200 rounded mb-6"></div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="h-64 bg-gray-200 rounded col-span-2"></div>
						<div className="h-64 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);

	if (!property) return <div>Property not found</div>;

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
			wifi: <Wifi className="h-4 w-4" />,
			ac: <Snowflake className="h-4 w-4" />,
			gym: <Dumbbell className="h-4 w-4" />,
			park: <TreePine className="h-4 w-4" />,
			security: <Shield className="h-4 w-4" />,
			pool: <Snowflake className="h-4 w-4" />,
		};

		return amenityIcons[amenity.toLowerCase()] || <Star className="h-4 w-4" />;
	};

	const images = Array.isArray(property.images) ? property.images : [];
	const imageUrl =
		images.length > 0 && images[currentImageIndex] != null
			? `${process.env.NEXT_PUBLIC_API_URL_IMG}/${images[currentImageIndex]}`
			: "/placeholder-property.jpg";

	const statusColors = {
		active: "bg-green-100 text-green-800",
		sold: "bg-purple-100 text-purple-800",
		rented: "bg-blue-100 text-blue-800",
		inactive: "bg-gray-100 text-gray-800",
		pending: "bg-amber-100 text-amber-800",
	};

	return (
		<div className="max-w-6xl mx-auto p-4 md:p-6">
			{/* Header Section */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">{property.title}</h1>
				<div className="flex items-center gap-2 mb-4">
					<MapPin className="h-4 w-4 text-blue-500" />
					<span className="text-gray-600">
						{property.address.street}, {property.address.area},{" "}
						{property.address.city}, {property.address.state} -{" "}
						{property.address.zipCode}
					</span>
				</div>
				<div className="flex flex-wrap gap-2 mb-4">
					<Badge
						variant={
							["sale", "rent"].includes(property.status)
								? "default"
								: "secondary"
						}>
						{property.status.toUpperCase()}
					</Badge>
					{property.featured && (
						<Badge className="bg-purple-100 text-purple-800">FEATURED</Badge>
					)}
					{property.isPremium && (
						<Badge className="bg-amber-100 text-amber-800">PREMIUM</Badge>
					)}
					<Badge variant="outline">{property.propertyType}</Badge>
					<Badge variant="outline">{property.listingType}</Badge>
				</div>
			</div>

			{/* Image Gallery */}
			<div className="relative mb-8 rounded-xl overflow-hidden">
				<div className="relative h-80 md:h-96 bg-gray-100">
					{images.length > 0 ? (
						<Image
							fill
							src={imageError ? "/placeholder-property.jpg" : imageUrl}
							alt={property.title}
							className="object-cover"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-gray-200">
							<Home className="h-16 w-16 text-gray-400" />
						</div>
					)}

					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={nextImage}
								className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
								<ChevronRight className="h-5 w-5" />
							</button>
						</>
					)}

					{/* Image Counter */}
					{images.length > 1 && (
						<div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
							{currentImageIndex + 1} / {images.length}
						</div>
					)}

					{/* Action Buttons */}
					<div className="absolute top-4 right-4 flex gap-2">
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-white text-gray-700 hover:bg-gray-100"
							onClick={handleSaveToggle}>
							<Heart
								className={`h-5 w-5 ${
									isLikedByUser ? "fill-red-500 text-red-500" : ""
								}`}
							/>
						</Button>
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-white text-gray-700 hover:bg-gray-100">
							<Share2 className="h-5 w-5" />
						</Button>
					</div>
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="flex gap-2 mt-2 overflow-x-auto py-2">
						{images.map((img, idx) => (
							<div
								key={idx}
								className={`relative h-16 w-16 min-w-[4rem] rounded-md overflow-hidden cursor-pointer ${
									currentImageIndex === idx
										? "ring-2 ring-blue-500"
										: "opacity-70"
								}`}
								onClick={() => setCurrentImageIndex(idx)}>
								<Image
									fill
									src={`${process.env.NEXT_PUBLIC_API_URL_IMG}/${img}`}
									alt={`${property.title} ${idx + 1}`}
									className="object-cover"
								/>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2">
					{/* Price Section */}
					<div className="bg-blue-50 p-6 rounded-xl mb-6">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div>
								<span className="text-3xl font-bold text-green-700">
									₹{formatPrice(property.price)}
								</span>
								{property.listingType !== "sale" && (
									<span className="ml-2 text-gray-600">
										/
										{property.listingType === "rent" ? "month" : "lease period"}
									</span>
								)}
								{property.pricing?.priceNegotiable && (
									<div className="text-sm text-gray-600 mt-1">
										Price Negotiable
									</div>
								)}
							</div>
							<Button size="lg" className="bg-green-600 hover:bg-green-700">
								<Phone className="h-5 w-5 mr-2" />
								Contact Seller
							</Button>
						</div>

						{property.pricing && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
								{property.pricing.maintenanceCharges && (
									<div>
										<div className="text-sm text-gray-600">Maintenance</div>
										<div className="font-medium">
											₹{formatPrice(property.pricing.maintenanceCharges)}/month
										</div>
									</div>
								)}
								{property.pricing.securityDeposit && (
									<div>
										<div className="text-sm text-gray-600">
											Security Deposit
										</div>
										<div className="font-medium">
											₹{formatPrice(property.pricing.securityDeposit)}
										</div>
									</div>
								)}
								{property.pricing.brokeragePercentage && (
									<div>
										<div className="text-sm text-gray-600">Brokerage</div>
										<div className="font-medium">
											{property.pricing.brokeragePercentage}%
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Property Overview */}
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
						<h2 className="text-xl font-semibold mb-4">Property Overview</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
								<Bed className="h-6 w-6 text-blue-500 mb-2" />
								<span className="text-sm text-gray-600">Bedrooms</span>
								<span className="font-semibold">{property.bedrooms || 0}</span>
							</div>
							<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
								<Bath className="h-6 w-6 text-blue-500 mb-2" />
								<span className="text-sm text-gray-600">Bathrooms</span>
								<span className="font-semibold">{property.bathrooms || 0}</span>
							</div>
							<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
								<Square className="h-6 w-6 text-blue-500 mb-2" />
								<span className="text-sm text-gray-600">Area</span>
								<span className="font-semibold">
									{property.area.value} {property.area.unit}
								</span>
							</div>
							<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
								<Car className="h-6 w-6 text-blue-500 mb-2" />
								<span className="text-sm text-gray-600">Parking</span>
								<span className="font-semibold">{property.parking || 0}</span>
							</div>
							{property.balconies && (
								<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
									<TreePine className="h-6 w-6 text-blue-500 mb-2" />
									<span className="text-sm text-gray-600">Balconies</span>
									<span className="font-semibold">{property.balconies}</span>
								</div>
							)}
							{property.floor && (
								<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
									<Building className="h-6 w-6 text-blue-500 mb-2" />
									<span className="text-sm text-gray-600">Floor</span>
									<span className="font-semibold">
										{property.floor}
										{property.totalFloors ? ` of ${property.totalFloors}` : ""}
									</span>
								</div>
							)}
							<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
								<Calendar className="h-6 w-6 text-blue-500 mb-2" />
								<span className="text-sm text-gray-600">Age</span>
								<span className="font-semibold">{property.age} years</span>
							</div>
							<div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
								<Home className="h-6 w-6 text-blue-500 mb-2" />
								<span className="text-sm text-gray-600">Furnishing</span>
								<span className="font-semibold capitalize">
									{property.furnished}
								</span>
							</div>
						</div>
					</div>

					{/* Description */}
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
						<h2 className="text-xl font-semibold mb-4">Description</h2>
						<p className="text-gray-700 leading-relaxed">
							{property.description}
						</p>
					</div>

					{/* Amenities */}
					{property.amenities && property.amenities.length > 0 && (
						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
							<h2 className="text-xl font-semibold mb-4">Amenities</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{property.amenities.map((amenity, idx) => (
									<div key={idx} className="flex items-center gap-2 py-2">
										{renderAmenityIcon(amenity)}
										<span className="text-gray-700 capitalize">{amenity}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Additional Features */}
					{property.features && (
						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
							<h2 className="text-xl font-semibold mb-4">Features</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{property.features.facing && (
									<div>
										<h3 className="text-sm text-gray-600">Facing</h3>
										<p className="font-medium capitalize">
											{property.features.facing}
										</p>
									</div>
								)}
								{property.features.flooringType && (
									<div>
										<h3 className="text-sm text-gray-600">Flooring</h3>
										<p className="font-medium capitalize">
											{property.features.flooringType}
										</p>
									</div>
								)}
								{property.features.waterSupply && (
									<div>
										<h3 className="text-sm text-gray-600">Water Supply</h3>
										<p className="font-medium capitalize">
											{property.features.waterSupply}
										</p>
									</div>
								)}
								{property.features.powerBackup !== undefined && (
									<div>
										<h3 className="text-sm text-gray-600">Power Backup</h3>
										<p className="font-medium">
											{property.features.powerBackup
												? "Available"
												: "Not Available"}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Location & Nearby Places */}
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
						<h2 className="text-xl font-semibold mb-4">Location</h2>
						<div className="mb-4 p-4 bg-gray-50 rounded-lg">
							<p className="text-gray-700">
								{property.address.street}, {property.address.area}
								<br />
								{property.address.city}, {property.address.state}{" "}
								{property.address.zipCode}
								<br />
								{property.address.country}
								{property.address.landmark && (
									<>
										<br />
										<span className="text-sm text-gray-600">
											Landmark: {property.address.landmark}
										</span>
									</>
								)}
							</p>
						</div>

						{property.nearbyPlaces && (
							<>
								<h3 className="text-lg font-medium mb-3">Nearby Places</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{property.nearbyPlaces.schools &&
										property.nearbyPlaces.schools.length > 0 && (
											<div>
												<h4 className="font-medium text-gray-700 mb-2">
													Schools
												</h4>
												<ul className="space-y-2">
													{property.nearbyPlaces.schools
														.slice(0, 3)
														.map((school, idx) => (
															<li key={idx} className="text-sm text-gray-600">
																{school.name} ({school.distance}{" "}
																{school.unit || "km"})
															</li>
														))}
												</ul>
											</div>
										)}

									{property.nearbyPlaces.hospitals &&
										property.nearbyPlaces.hospitals.length > 0 && (
											<div>
												<h4 className="font-medium text-gray-700 mb-2">
													Hospitals
												</h4>
												<ul className="space-y-2">
													{property.nearbyPlaces.hospitals
														.slice(0, 3)
														.map((hospital, idx) => (
															<li key={idx} className="text-sm text-gray-600">
																{hospital.name} ({hospital.distance}{" "}
																{hospital.unit || "km"})
															</li>
														))}
												</ul>
											</div>
										)}

									{property.nearbyPlaces.malls &&
										property.nearbyPlaces.malls.length > 0 && (
											<div>
												<h4 className="font-medium text-gray-700 mb-2">
													Shopping Malls
												</h4>
												<ul className="space-y-2">
													{property.nearbyPlaces.malls
														.slice(0, 3)
														.map((mall, idx) => (
															<li key={idx} className="text-sm text-gray-600">
																{mall.name} ({mall.distance} {mall.unit || "km"}
																)
															</li>
														))}
												</ul>
											</div>
										)}

									{property.nearbyPlaces.transport &&
										property.nearbyPlaces.transport.length > 0 && (
											<div>
												<h4 className="font-medium text-gray-700 mb-2">
													Transport
												</h4>
												<ul className="space-y-2">
													{property.nearbyPlaces.transport
														.slice(0, 3)
														.map((transport, idx) => (
															<li key={idx} className="text-sm text-gray-600">
																{transport.name} ({transport.distance}{" "}
																{transport.unit || "km"})
															</li>
														))}
												</ul>
											</div>
										)}
								</div>
							</>
						)}
					</div>

					{/* Property History */}
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
						<h2 className="text-xl font-semibold mb-4">Property History</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-sm text-gray-600">Listed On</h3>
								<p className="font-medium">
									{new Date(property.createdAt).toLocaleDateString()}
								</p>
							</div>
							<div>
								<h3 className="text-sm text-gray-600">Views</h3>
								<p className="font-medium flex items-center gap-1">
									<Eye className="h-4 w-4" /> {property.views || 0}
								</p>
							</div>
							{property.expiresAt && (
								<div>
									<h3 className="text-sm text-gray-600">Expires On</h3>
									<p className="font-medium">
										{new Date(property.expiresAt).toLocaleDateString()}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="lg:col-span-1">
					{/* Contact Info Card */}
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6 mb-6">
						<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<Contact className="h-5 w-5" /> Contact Info
						</h2>

						<div className="space-y-4">
							<div>
								<h3 className="text-sm text-gray-600">Contact Person</h3>
								<p className="font-medium">{property.contact?.name}</p>
								<p className="text-sm text-gray-600 capitalize">
									{property.contact?.type}
								</p>
							</div>

							<div>
								<h3 className="text-sm text-gray-600">Phone</h3>
								<p className="font-medium flex items-center gap-2">
									<Phone className="h-4 w-4" /> {property.contact?.phone}
								</p>
							</div>

							{property.contact?.whatsapp && (
								<div>
									<h3 className="text-sm text-gray-600">WhatsApp</h3>
									<p className="font-medium text-green-600">
										{property.contact.whatsapp}
									</p>
								</div>
							)}

							<Button className="w-full bg-green-600 hover:bg-green-700">
								<Phone className="h-4 w-4 mr-2" /> Call Now
							</Button>

							<Button variant="outline" className="w-full">
								Message
							</Button>
						</div>
					</div>

					{/* Property Summary Card */}
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
						<h2 className="text-xl font-semibold mb-4">Property Summary</h2>

						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-gray-600">Property ID</span>
								<span className="font-medium">
									{property._id.substring(0, 8)}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">Type</span>
								<span className="font-medium capitalize">
									{property.propertyType}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">Listing Type</span>
								<span className="font-medium capitalize">
									{property.listingType}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">Furnishing</span>
								<span className="font-medium capitalize">
									{property.furnished}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">Age</span>
								<span className="font-medium">{property.age} years</span>
							</div>

							{property.legalInfo && (
								<>
									<div className="flex justify-between">
										<span className="text-gray-600">Ownership</span>
										<span className="font-medium capitalize">
											{property.legalInfo.ownershipType}
										</span>
									</div>

									{property.legalInfo.rera && (
										<div className="flex justify-between">
											<span className="text-gray-600">RERA</span>
											<span className="font-medium">
												{property.legalInfo.rera.number}{" "}
												{property.legalInfo.rera.approved
													? "(Approved)"
													: "(Pending)"}
											</span>
										</div>
									)}
								</>
							)}
						</div>
					</div>

					{/* Availability Card */}
					{property.availability && (
						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
							<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
								<Clock className="h-5 w-5" /> Availability
							</h2>

							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">Immediately Available</span>
									<span className="font-medium">
										{property.availability.immediatelyAvailable ? "Yes" : "No"}
									</span>
								</div>

								{property.availability.possessionDate && (
									<div className="flex justify-between">
										<span className="text-gray-600">Possession Date</span>
										<span className="font-medium">
											{new Date(
												property.availability.possessionDate
											).toLocaleDateString()}
										</span>
									</div>
								)}

								{property.availability.leaseDuration && (
									<div className="flex justify-between">
										<span className="text-gray-600">Lease Duration</span>
										<span className="font-medium">
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