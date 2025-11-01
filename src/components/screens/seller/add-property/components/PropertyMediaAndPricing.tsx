import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";
import NearbyPlaceFields from "./NearbyPlaceFields";

interface PropertyMediaAndPricingProps {
	form: UseFormReturn<PropertyFormData>;
	isEditMode?: string | false | null;
}

type PricingFieldNames = "basePrice" | "maintenanceCharges" | "securityDeposit";
type PricingValueFieldKey = `pricing.${PricingFieldNames}`;

const places = ["schools", "hospitals", "malls", "transport"];
const distanceUnits = ["meter", "km"];

export default function PropertyMediaAndPricing({
	form,
}: PropertyMediaAndPricingProps) {
	const listingType = form.watch("listingType");
	const propertyType = form.watch("propertyType");

	const isForRent = listingType === "rent" || listingType === "lease";
	const isForSale = listingType === "sale";

	const priceFields = [
		{ name: "basePrice", label: "Monthly Rent" },
		{ name: "maintenanceCharges", label: "Maintenance Charges" },
		{ name: "securityDeposit", label: "Security Deposit" },
	];

	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		const newImages = [...selectedImages, ...files];
		setSelectedImages(newImages);
		form.setValue("images", newImages);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragActive(false);
		const files = Array.from(event.dataTransfer.files).filter((f) =>
			f.type.startsWith("image/")
		);
		const newImages = [...selectedImages, ...files];
		setSelectedImages(newImages);
		form.setValue("images", newImages);
	};

	const handleRemoveImage = (index: number) => {
		const newImages = selectedImages.filter((_, i) => i !== index);
		setSelectedImages(newImages);
		form.setValue("images", newImages);
	};

	// Get image URL for display - handles both File objects and string URLs
	const getImageUrl = (image: File | string): string => {
		if (typeof image === "string") {
			return image; // Return the URL string for existing images
		}
		return URL.createObjectURL(image); // Create object URL for new files
	};

	// Get image name for display
	const getImageName = (image: File | string): string => {
		if (typeof image === "string") {
			return image.split("/").pop() || "image"; // Extract filename from URL
		}
		return image.name; // Get name from File object
	};

	return (
		<div className="space-y-6 bg-white rounded-xl shadow p-6 border-t-4 border-green-500">
			{/* Images Upload Section */}
			<FormField
				control={form.control}
				name="images"
				render={() => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Upload Images <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<FormControl>
							<div
								className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors   ${
									dragActive
										? "border-gray-800 bg-primary/10"
										: "border-gray-400 bg-background"
								}`}
								onDrop={handleDrop}
								onDragOver={(e) => {
									e.preventDefault();
									setDragActive(true);
								}}
								onDragLeave={() => setDragActive(false)}
								style={{ cursor: "pointer" }}
								onClick={() => inputRef.current && inputRef.current.click()}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-muted-foreground mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l4-4a2 2 0 012.828 0l2.828 2.828a2 2 0 002.828 0L20 8m-4 4v4m0 0h-4m4 0h4"
									/>
								</svg>

								<div className="text-xs text-muted-foreground mt-2 flex flex-col items-center justify-center">
									<span className="">
										Drag & drop images here, or click to select
									</span>
									You can upload up to 10 images. Supported formats: JPG, PNG,
									WEBP.
								</div>
								<input
									ref={inputRef}
									type="file"
									accept="image/*"
									multiple
									className="absolute inset-0 opacity-0 cursor-pointer"
									style={{ zIndex: 2, pointerEvents: "none" }}
									onChange={handleImageChange}
									tabIndex={-1}
								/>
							</div>
						</FormControl>
						<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{form.watch("images")?.map((image, index) => (
								<div
									key={getImageName(image) + index}
									className="relative group">
									<img
										src={getImageUrl(image)}
										alt={getImageName(image)}
										className="h-48 w-full object-contain rounded-lg border shadow-sm"
									/>
									<button
										type="button"
										className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
										onClick={() => handleRemoveImage(index)}
										title="Remove">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
									<span className="absolute bottom-2 left-2 bg-black/60 text-xs text-white px-2 py-1 rounded">
										{getImageName(image)}
									</span>
								</div>
							))}
						</div>

						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Simple Price Field (for sale properties) */}
			{isForSale && (
				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								Sale Price (₹) <span style={{ color: "red" }}>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter sale price"
									type="number"
									className="  hide-number-arrows"
									{...field}
									onChange={(e) => {
										field.onChange(e);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}

			{/* Structured Pricing Fields (for rent/lease properties) */}
			{isForRent &&
				priceFields.map((input) => (
					<div key={input.name} className="flex flex-col gap-1">
						<FormLabel className="text-sm font-semibold text-gray-700">
							{input.label}(in rs) <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<div className="flex w-full items-center bg-background border rounded-lg overflow-hidden">
							<FormField
								control={form.control}
								name={`pricing.${input.name}` as PricingValueFieldKey}
								render={({ field }) => (
									<FormItem className="w-full m-0">
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) => {
													field.onChange(e);
												}}
												className="border-none rounded-none h-[40px] px-3 focus:ring-0 focus:border-none hide-number-arrows"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				))}

			<FormField
				control={form.control}
				name="contact.name"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Contact Name <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<FormControl>
							<Input
								placeholder="Owner/Agent Name"
								{...field}
								className="h-[40px] px-3 py-2 text-xs"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="contact.phone"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Contact Phone <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<FormControl>
							<Input
								placeholder="Phone Number"
								{...field}
								className="h-[40px] px-3 py-2 text-xs"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="contact.whatsapp"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Contact WhatsApp
						</FormLabel>
						<FormControl>
							<Input
								placeholder="WhatsApp Number (optional)"
								{...field}
								className="h-[40px] px-3 py-2 text-xs"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="contact.type"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Contact Type <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<select
							{...field}
							className="border rounded-lg h-[40px] px-3 py-2 w-full text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
							<option value="owner">Owner</option>
							<option value="agent">Agent</option>
							<option value="builder">Builder</option>
						</select>
						<FormMessage />
					</FormItem>
				)}
			/>

			{propertyType !== "plot" && (
				<>
					<h3 className="text-md font-semibold text-gray-800 mb-4 mt-6">
						Nearby Places
					</h3>
					{places.map((place) => (
						<NearbyPlaceFields
							key={place}
							form={form}
							place={place as "schools" | "hospitals" | "malls" | "transport"}
							distanceUnits={distanceUnits}
						/>
					))}
				</>
			)}

			<h3 className="text-md font-semibold text-gray-800 mb-4 mt-6">
				Additional Notes
			</h3>
			<FormField
				control={form.control}
				name="notes"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Notes
						</FormLabel>
						<FormControl>
							<Input
								placeholder="Additional notes"
								{...field}
								className="h-[40px] px-3 py-2 text-xs"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}