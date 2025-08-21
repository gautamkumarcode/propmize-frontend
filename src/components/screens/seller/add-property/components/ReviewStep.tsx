"use client";

import { Badge } from "@/components/ui/badge";
import {
	Home,
	Image as ImageIcon,
	IndianRupee,
	MapPin,
	User,
	Video as VideoIcon,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
}

export default function ReviewStep({ form }: StepProps) {
	const values = form.getValues();

	return (
		<div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
			<h2 className="text-2xl font-bold mb-6 text-center">
				Review Your Property Listing
			</h2>
			<div className="space-y-8">
				{/* Images Preview */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow">
					<div className="flex items-center gap-2 mb-2">
						<ImageIcon className="text-blue-500" size={22} />
						<h3 className="font-semibold text-lg">Images</h3>
					</div>
					<div className="flex flex-wrap gap-3">
						{Array.isArray(values.images) && values.images.length > 0 ? (
							values.images.map((file: File, idx: number) => (
								<div key={idx} className="relative group">
									<img
										src={URL.createObjectURL(file)}
										alt={file.name}
										className="h-24 w-24 object-cover rounded-lg border shadow-md transition-transform group-hover:scale-105"
									/>
									<span className="absolute bottom-1 right-1 bg-white/80 text-xs px-2 py-0.5 rounded shadow">
										{file.name}
									</span>
								</div>
							))
						) : (
							<span className="text-muted-foreground">No images uploaded</span>
						)}
					</div>
				</div>

				{/* Videos Preview */}
				<div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 shadow">
					<div className="flex items-center gap-2 mb-2">
						<VideoIcon className="text-indigo-500" size={22} />
						<h3 className="font-semibold text-lg">Videos</h3>
					</div>
					<div className="flex flex-wrap gap-3">
						{Array.isArray(values.videos) && values.videos.length > 0 ? (
							values.videos.map((file: File, idx: number) => (
								<div key={idx} className="relative group">
									<video
										src={URL.createObjectURL(file)}
										controls
										className="h-24 w-36 object-cover rounded-lg border shadow-md transition-transform group-hover:scale-105"
									/>
									<span className="absolute bottom-1 right-1 bg-white/80 text-xs px-2 py-0.5 rounded shadow">
										{file.name}
									</span>
								</div>
							))
						) : (
							<span className="text-muted-foreground">No videos uploaded</span>
						)}
					</div>
				</div>

				{/* Main Details */}
				<div className="bg-white rounded-xl shadow p-6">
					<div className="flex items-center gap-2 mb-4">
						<Home className="text-green-500" size={22} />
						<h3 className="font-semibold text-lg">Basic Details</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">Title:</span> {values.title}
						</div>
						<div>
							<span className="font-medium">Type:</span> {values.propertyType}
						</div>
						<div>
							<span className="font-medium">Listing:</span> {values.listingType}
						</div>
						<div>
							<span className="font-medium">Furnished:</span> {values.furnished}
						</div>
						<div>
							<span className="font-medium">Area:</span> {values.area?.value}{" "}
							{values.area?.unit}
						</div>
						<div>
							<span className="font-medium">Bedrooms:</span> {values.bedrooms}
						</div>
						<div>
							<span className="font-medium">Bathrooms:</span> {values.bathrooms}
						</div>
						<div>
							<span className="font-medium">Parking:</span> {values.parking}
						</div>
						<div>
							<span className="font-medium">Floor:</span> {values.floor}
						</div>
						<div>
							<span className="font-medium">Total Floors:</span>{" "}
							{values.totalFloors}
						</div>
						<div>
							<span className="font-medium">Age:</span> {values.age}
						</div>
					</div>
					<div className="mt-4 text-sm text-gray-700">
						<span className="font-medium">Description:</span>{" "}
						{values.description}
					</div>
				</div>

				{/* Address */}
				<div className="bg-white rounded-xl shadow p-6">
					<div className="flex items-center gap-2 mb-4">
						<MapPin className="text-pink-500" size={22} />
						<h3 className="font-semibold text-lg">Address</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">Street:</span>{" "}
							{values.address?.street}
						</div>
						<div>
							<span className="font-medium">Area:</span> {values.address?.area}
						</div>
						<div>
							<span className="font-medium">City:</span> {values.address?.city}
						</div>
						<div>
							<span className="font-medium">State:</span>{" "}
							{values.address?.state}
						</div>
						<div>
							<span className="font-medium">Zip:</span>{" "}
							{values.address?.zipCode}
						</div>
						<div>
							<span className="font-medium">Country:</span>{" "}
							{values.address?.country}
						</div>
						<div>
							<span className="font-medium">Landmark:</span>{" "}
							{values.address?.landmark}
						</div>
					</div>
				</div>

				{/* Pricing */}
				<div className="bg-white rounded-xl shadow p-6">
					<div className="flex items-center gap-2 mb-4">
						<IndianRupee className="text-yellow-500" size={22} />
						<h3 className="font-semibold text-lg">Pricing</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">Base Price:</span>{" "}
							{values.pricing?.basePrice?.value}{" "}
							{values.pricing?.basePrice?.unit}
						</div>
						<div>
							<span className="font-medium">Maintenance:</span>{" "}
							{values.pricing?.maintenanceCharges?.value}{" "}
							{values.pricing?.maintenanceCharges?.unit}
						</div>
						<div>
							<span className="font-medium">Security Deposit:</span>{" "}
							{values.pricing?.securityDeposit?.value}{" "}
							{values.pricing?.securityDeposit?.unit}
						</div>
						<div>
							<span className="font-medium">Negotiable:</span>{" "}
							<span
								className={
									values.pricing?.priceNegotiable
										? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
										: "bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
								}>
								{values.pricing?.priceNegotiable ? "Yes" : "No"}
							</span>
						</div>
					</div>
				</div>

				{/* Contact & Notes */}
				<div className="bg-white rounded-xl shadow p-6">
					<div className="flex items-center gap-2 mb-4">
						<User className="text-purple-500" size={22} />
						<h3 className="font-semibold text-lg">Contact & Notes</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">Name:</span> {values.contact?.name}
						</div>
						<div>
							<span className="font-medium">Phone:</span>{" "}
							{values.contact?.phone}
						</div>
						<div>
							<span className="font-medium">Whatsapp:</span>{" "}
							{values.contact?.whatsapp}
						</div>
						<div>
							<span className="font-medium">Type:</span> {values.contact?.type}
						</div>
					</div>
					<div className="mt-4 text-sm text-gray-700">
						<span className="font-medium">Notes:</span> {values.notes}
					</div>
				</div>

				{/* Amenities */}
				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="font-semibold text-lg mb-4">Amenities</h3>
					<div className="flex flex-wrap gap-2">
						{values.amenities && values.amenities.length > 0 ? (
							values.amenities.map((amenity: string, idx: number) => (
								<Badge key={idx} variant="secondary">
									{amenity}
								</Badge>
							))
						) : (
							<span className="text-muted-foreground">
								No amenities selected
							</span>
						)}
					</div>
				</div>

				{/* Availability */}

				{/* Nearby Places */}
				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="font-semibold text-lg mb-4">Nearby Places</h3>
					{values.nearbyPlaces ? (
						<div className="space-y-2">
							{Object.entries(values.nearbyPlaces).map(
								([key, places]: [string, any]) => (
									<div key={key}>
										<span className="font-medium capitalize">{key}:</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{Array.isArray(places) && places.length > 0 ? (
												places.map((place: any, idx: number) => (
													<Badge key={idx} variant="outline">
														{place.name} ({place.distance} {place.unit})
													</Badge>
												))
											) : (
												<span className="text-muted-foreground">None</span>
											)}
										</div>
									</div>
								)
							)}
						</div>
					) : (
						<span className="text-muted-foreground">
							No nearby places added
						</span>
					)}
				</div>

				{/* Features */}
				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="font-semibold text-lg mb-4">Features</h3>
					{values.features ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							{Object.entries(values.features).map(
								([key, val]: [string, any]) => (
									<div key={key}>
										<span className="font-medium capitalize">{key}:</span>{" "}
										{typeof val === "boolean"
											? val
												? "Yes"
												: "No"
											: val ?? "-"}
									</div>
								)
							)}
						</div>
					) : (
						<span className="text-muted-foreground">No features specified</span>
					)}
				</div>

				{/* Coordinates */}

				{/* Step Actions */}
			</div>
		</div>
	);
}
