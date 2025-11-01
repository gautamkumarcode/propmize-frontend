"use client";

import { Badge } from "@/components/ui/badge";
import {
	Building,
	CheckCircle,
	ClipboardList,
	Home,
	Image as ImageIcon,
	IndianRupee,
	MapPin,
	Star,
	User,
	XCircle,
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
			return `${file}`;
		}
		return URL.createObjectURL(file);
	});

	const isForSale = values.listingType === "sale";

	const formatPrice = (price: number) => {
		if (!price) return "-";
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(price);
	};

	const renderSection = (
		title: string,
		icon: React.ReactNode,
		content: React.ReactNode,
		borderColor: string = "border-blue-500"
	) => (
		<div
			className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${borderColor} hover:shadow-xl transition-shadow`}>
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
					{icon}
				</div>
				<h3 className="font-semibold text-xl text-gray-800">{title}</h3>
			</div>
			{content}
		</div>
	);

	// const propertyData = {
	// 	...values,
	// 	images: values?.images?.[0] ? URL.createObjectURL(values.images[0]) : [],
	// };
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					Review Your Property Listing
				</h2>
				<p className="text-gray-600">
					Please review all details before submitting
				</p>
			</div>

			{/* <PropertyCard property={propertyData as unknown as PropertyResponse} /> */}

			<div className="space-y-6">
				{/* Basic Details */}
				{renderSection(
					"Basic Details",
					<Home className="text-blue-600" size={20} />,
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem label="Title" value={values.title} />
						<DetailItem label="Property Type" value={values.propertyType} />
						<DetailItem label="Listing Type" value={values.listingType} />
						<DetailItem label="Currency" value={values.currency} />
						<DetailItem
							label="Area"
							value={
								values.area?.value
									? `${values.area.value} ${values.area.unit}`
									: undefined
							}
						/>
						<DetailItem label="Bedrooms" value={values.bedrooms} />
						<DetailItem label="Bathrooms" value={values.bathrooms} />
						<DetailItem label="Furnished" value={values.furnished} />
						<DetailItem
							label="Floor"
							value={values.floor ? `Floor ${values.floor}` : undefined}
						/>
						<DetailItem label="Total Floors" value={values.totalFloors} />
						<DetailItem
							label="Property Age"
							value={values.age ? `${values.age} years` : undefined}
						/>
					</div>,
					"border-blue-500"
				)}

				{/* Description */}
				{values.description &&
					renderSection(
						"Description",
						<ClipboardList className="text-purple-600" size={20} />,
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-gray-700 leading-relaxed break-words">
								{values.description}
							</p>
						</div>,
						"border-purple-500"
					)}

				{/* Location Details */}
				{renderSection(
					"Location Details",
					<MapPin className="text-green-600" size={20} />,
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem label="Street" value={values.address?.street} />
						<DetailItem label="Area" value={values.address?.area} />
						<DetailItem label="City" value={values.address?.city} />
						<DetailItem label="State" value={values.address?.state} />
						<DetailItem label="Zip Code" value={values.address?.zipCode} />
						<DetailItem label="Country" value={values.address?.country} />
						<DetailItem label="Landmark" value={values.address?.landmark} />
					</div>,
					"border-green-500"
				)}

				{/* Pricing */}
				{renderSection(
					"Pricing Details",
					<IndianRupee className="text-amber-600" size={20} />,
					isForSale ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<DetailItem
								label="Sale Price"
								value={formatPrice(Number(values.price))}
							/>
							{/* <DetailItem
								label="Price Negotiable"
								value={values.pricing?.priceNegotiable ? "Yes" : "No"}
								isBoolean={true}
							/> */}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<DetailItem
								label="Monthly Rent"
								value={formatPrice(Number(values.pricing?.basePrice))}
							/>
							<DetailItem
								label="Maintenance"
								value={formatPrice(Number(values.pricing?.maintenanceCharges))}
							/>
							<DetailItem
								label="Security Deposit"
								value={formatPrice(Number(values.pricing?.securityDeposit))}
							/>
							{/* <DetailItem
								label="Price Negotiable"
								value={values.pricing?.priceNegotiable ? "Yes" : "No"}
								isBoolean={true}
							/> */}
						</div>
					),
					"border-amber-500"
				)}

				{/* Features */}
				{values.features &&
					Object.values(values.features).some(
						(val) => val !== undefined && val !== null && val !== ""
					) &&
					renderSection(
						"Property Features",
						<Star className="text-indigo-600" size={20} />,
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Object.entries(values.features).map(([key, value]) => {
								if (value === undefined || value === null || value === "")
									return null;

								const label = key
									.replace(/([A-Z])/g, " $1")
									.split(" ")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ");

								// Only show boolean icons for boolean features
								const isBooleanFeature = typeof value === "boolean";
								return (
									<DetailItem
										key={key}
										label={label}
										value={value}
										isBoolean={isBooleanFeature}
									/>
								);
							})}
						</div>,
						"border-indigo-500"
					)}

				{/* Amenities */}
				{values.amenities &&
					values.amenities.length > 0 &&
					renderSection(
						"Amenities",
						<CheckCircle className="text-emerald-600" size={20} />,
						<div className="flex flex-wrap gap-2">
							{values.amenities.map((amenity: string, idx: number) => (
								<Badge
									key={idx}
									variant="secondary"
									className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1">
									{amenity}
								</Badge>
							))}
						</div>,
						"border-emerald-500"
					)}

				{/* Images */}
				{values.images &&
					values.images.length > 0 &&
					renderSection(
						"Property Images",
						<ImageIcon className="text-rose-600" size={20} />,
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{values.images.map((file: File, idx: number) => (
								<div key={idx} className="relative group">
									<img
										src={mappedFiles ? mappedFiles[idx] : ""}
										alt={file.name}
										className="h-48 w-full object-contain rounded-lg border shadow-md transition-transform group-hover:scale-105"
									/>
									{/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" /> */}
									{/* <span className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
										{file.name}
									</span> */}
								</div>
							))}
						</div>,
						"border-rose-500"
					)}

				{/* Contact Information */}
				{renderSection(
					"Contact Information",
					<User className="text-orange-600" size={20} />,
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailItem label="Contact Name" value={values.contact?.name} />
						<DetailItem label="Contact Phone" value={values.contact?.phone} />
						<DetailItem label="WhatsApp" value={values.contact?.whatsapp} />
						<DetailItem label="Contact Type" value={values.contact?.type} />
					</div>,
					"border-orange-500"
				)}

				{/* Notes */}
				{values.notes &&
					renderSection(
						"Additional Notes",
						<ClipboardList className="text-gray-600" size={20} />,
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-gray-700 leading-relaxed">{values.notes}</p>
						</div>,
						"border-gray-500"
					)}

				{/* Nearby Places */}
				{values.nearbyPlaces &&
					Object.values(values.nearbyPlaces).some(
						(places) => Array.isArray(places) && places.length > 0
					) &&
					renderSection(
						"Nearby Places",
						<Building className="text-cyan-600" size={20} />,
						<div className="space-y-4">
							{Object.entries(values.nearbyPlaces).map(([key, places]) => {
								if (!Array.isArray(places) || places.length === 0) return null;

								return (
									<div key={key}>
										<h4 className="font-semibold text-gray-700 mb-2 capitalize">
											{key.replace(/([A-Z])/g, " $1").trim()}
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{places.map((place, idx) => (
												<Badge
													key={idx}
													variant="outline"
													className="bg-cyan-50 text-cyan-800 border-cyan-200 px-3 py-1">
													{place.name} ({place.distance} {place.unit})
												</Badge>
											))}
										</div>
									</div>
								);
							})}
						</div>,
						"border-cyan-500"
					)}
			</div>
		</div>
	);
}

interface DetailItemProps {
	label: string;
	value: string | number | boolean | undefined;
	isBoolean?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
	label,
	value,
	isBoolean = false,
}) => {
	// Check if value is explicitly undefined, null, empty string, or 0
	if (value === undefined || value === null || value === "" || value === 0) {
		return null;
	}

	return (
		<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
			<div className="min-w-[120px]">
				<span className="text-sm font-medium text-gray-600">{label}</span>
			</div>
			<div className="flex-1">
				{isBoolean ? (
					<div className="flex items-center gap-2">
						{value === true ? ( // Explicitly check for true
							<CheckCircle className="h-4 w-4 text-green-600" />
						) : (
							<XCircle className="h-4 w-4 text-red-600" />
						)}
						<span className="text-gray-800 font-medium">
							{value === true ? "Yes" : "No"} {/* Explicitly check for true */}
						</span>
					</div>
				) : (
					<span
						className="text-gray-800 font-medium break-words whitespace-pre-line"
						style={{ wordBreak: "break-word" }}>
						{value}
					</span>
				)}
			</div>
		</div>
	);
};