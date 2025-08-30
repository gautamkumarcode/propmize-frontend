"use client";

import { Badge } from "@/components/ui/badge";
import {
	ClipboardList,
	Home,
	Image as ImageIcon,
	IndianRupee,
	MapPin,
	User
} from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	isEditMode?: string | false | null;
}

export default function ReviewStep({ form, isEditMode }: StepProps) {
	const values = form.getValues();

	// Map file objects to their URLs
	const mappedFiles = values?.images?.map((file) => {
		if (isEditMode) {
			return `${process.env.NEXT_PUBLIC_API_URL_IMG}/${file}`;
		}
		return URL.createObjectURL(file);
	});

	

	return (
		<div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
				Review Your Property Listing
			</h2>
			<div className="space-y-8">
				{/* Basic Details */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
					<div className="flex items-center gap-2 mb-4">
						<Home className="text-blue-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">
							Basic Details
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem label="Title" value={values.title} />
						<DetailItem label="Description" value={values.description} />
						<DetailItem label="Property Type" value={values.propertyType} />
						<DetailItem label="Listing Type" value={values.listingType} />
						<DetailItem label="Currency" value={values.currency} />
						<DetailItem
							label="Area"
							value={`${values.area?.value} ${values.area?.unit}`}
						/>
						<DetailItem label="Bedrooms" value={values.bedrooms} />
						<DetailItem label="Bathrooms" value={values.bathrooms} />
						<DetailItem label="Balconies" value={values.balconies} />
						<DetailItem label="Parking" value={values.parking} />
						<DetailItem label="Furnished" value={values.furnished} />
						<DetailItem label="Floor No." value={values.floor} />
						<DetailItem label="Total Floors" value={values.totalFloors} />
						<DetailItem label="Property Age" value={values.age} />
					</div>
				</div>

				{/* Location Details */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-purple-500">
					<div className="flex items-center gap-2 mb-4">
						<MapPin className="text-purple-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">
							Location Details
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem label="Street" value={values.address?.street} />
						<DetailItem label="Area" value={values.address?.area} />
						<DetailItem label="City" value={values.address?.city} />
						<DetailItem label="State" value={values.address?.state} />
						<DetailItem label="Zip Code" value={values.address?.zipCode} />
						<DetailItem label="Country" value={values.address?.country} />
						<DetailItem label="Landmark" value={values.address?.landmark} />
					</div>
				</div>

				{/* Property Features */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-green-500">
					<div className="flex items-center gap-2 mb-4">
						<ClipboardList className="text-green-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">
							Property Features
						</h3>
					</div>
					{values.features ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<DetailItem label="Facing" value={values.features.facing} />
							<DetailItem
								label="Flooring Type"
								value={values.features.flooringType}
							/>
							<DetailItem
								label="Water Supply"
								value={values.features.waterSupply}
							/>
							{Object.entries(values.features).map(([key, val]) => {
								if (["facing", "flooringType", "waterSupply"].includes(key)) {
									return null;
								}
								return (
									<DetailItem
										key={key}
										label={key.replace(/([A-Z])/g, " $1").trim()}
										value={
											typeof val === "boolean" ? (val ? "Yes" : "No") : val
										}
									/>
								);
							})}
						</div>
					) : (
						<span className="text-muted-foreground text-base">
							No features specified
						</span>
					)}
				</div>

				{/* Amenities */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-yellow-500">
					<div className="flex items-center gap-2 mb-4">
						<ClipboardList className="text-yellow-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">Amenities</h3>
					</div>
					<div className="flex flex-wrap gap-2">
						{values.amenities && values.amenities.length > 0 ? (
							values.amenities.map((amenity: string, idx: number) => (
								<Badge key={idx} variant="secondary" className="text-base">
									{amenity}
								</Badge>
							))
						) : (
							<span className="text-muted-foreground text-base">
								No amenities selected
							</span>
						)}
					</div>
				</div>

				{/* Media */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-red-500">
					<div className="flex items-center gap-2 mb-4">
						<ImageIcon className="text-red-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">Images</h3>
					</div>
					<div className="flex flex-wrap gap-3 mb-6">
						{Array.isArray(values.images) && values.images.length > 0 ? (
							values.images.map((file: File, idx: number) => (
								<div key={idx} className="relative group">
									<img
										src={mappedFiles ? mappedFiles[idx] : ""}
										alt={file.name}
										className="h-24 w-24 object-cover rounded-lg border shadow-md transition-transform group-hover:scale-105"
									/>
									<span className="absolute bottom-1 right-1 bg-white/80 text-sm px-2 py-0.5 rounded shadow">
										{file.name}
									</span>
								</div>
							))
						) : (
							<span className="text-muted-foreground text-base">
								No images uploaded
							</span>
						)}
					</div>

					{/* <div className="flex items-center gap-2 mb-4">
						<VideoIcon className="text-red-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">Videos</h3>
					</div> */}
					{/* <div className="flex flex-wrap gap-3">
						{Array.isArray(values.videos) && values.videos.length > 0 ? (
							values.videos.map((file: File, idx: number) => (
								<div key={idx} className="relative group">
									<video
										src={URL.createObjectURL(file)}
										controls
										className="h-24 w-36 object-cover rounded-lg border shadow-md transition-transform group-hover:scale-105"
									/>
									<span className="absolute bottom-1 right-1 bg-white/80 text-sm px-2 py-0.5 rounded shadow">
										{file.name}
									</span>
								</div>
							))
						) : (
							<span className="text-muted-foreground text-base">
								No videos uploaded
							</span>
						)}
					</div> */}
				</div>

				{/* Pricing & Legal */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-teal-500">
					<div className="flex items-center gap-2 mb-4">
						<IndianRupee className="text-teal-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">
							Pricing & Legal
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem
							label="Base Price"
							value={`${values.pricing?.basePrice?.value || ""} ${
								values.pricing?.basePrice?.unit || ""
							}`}
						/>
						<DetailItem
							label="Maintenance Charges"
							value={`${values.pricing?.maintenanceCharges?.value || ""} ${
								values.pricing?.maintenanceCharges?.unit || ""
							}`}
						/>
						<DetailItem
							label="Security Deposit"
							value={`${values.pricing?.securityDeposit?.value || ""} ${
								values.pricing?.securityDeposit?.unit || ""
							}`}
						/>
						<DetailItem
							label="Price Negotiable"
							value={values.pricing?.priceNegotiable ? "Yes" : "No"}
						/>
						<DetailItem
							label="Ownership Type"
							value={values.legalInfo?.ownershipType}
						/>
					</div>
				</div>

				{/* Contact & Notes */}
				<div className="bg-white rounded-xl shadow p-6 border-t-4 border-orange-500">
					<div className="flex items-center gap-2 mb-4">
						<User className="text-orange-500" size={22} />
						<h3 className="font-semibold text-xl text-gray-800">
							Contact & Notes
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem label="Contact Name" value={values.contact?.name} />
						<DetailItem label="Contact Phone" value={values.contact?.phone} />
						<DetailItem
							label="Contact WhatsApp"
							value={values.contact?.whatsapp}
						/>
						<DetailItem label="Contact Type" value={values.contact?.type} />
						<DetailItem label="Notes" value={values.notes} />
					</div>

					<h4 className="font-semibold text-lg mt-6 mb-3 text-gray-800">
						Nearby Places
					</h4>
					{values.nearbyPlaces ? (
						<div className="space-y-2">
							{Object.entries(values.nearbyPlaces).map(
								([key, places]: [
									string,
									{ name: string; distance: string; unit: string }[]
								]) => (
									<div key={key}>
										<span className="font-semibold capitalize text-md text-gray-700">
											{key}:
										</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{Array.isArray(places) && places.length > 0 ? (
												places.map(
													(
														place: {
															name: string;
															distance: string;
															unit: string;
														},
														idx: number
													) => (
														<Badge
															key={idx}
															variant="outline"
															className="text-sm">
															{place.name} ({place.distance} {place.unit})
														</Badge>
													)
												)
											) : (
												<span className="text-muted-foreground text-sm">
													None
												</span>
											)}
										</div>
									</div>
								)
							)}
						</div>
					) : (
						<span className="text-muted-foreground text-base">
							No nearby places added
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

interface DetailItemProps {
  label: string;
  value: string | number | boolean | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div>
    <span className="text-md font-semibold text-gray-700">{label}:</span>
    <span className="text-base text-gray-800 ml-2">{value ?? "-"}</span>
  </div>
);
