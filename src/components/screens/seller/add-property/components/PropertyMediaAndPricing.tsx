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

interface PropertyMediaAndPricingProps {
	form: UseFormReturn<PropertyFormData>;
	isEditMode?: string | false | null;
}

type PricingFieldNames = "basePrice" | "maintenanceCharges" | "securityDeposit";
type PricingValueFieldKey = `pricing.${PricingFieldNames}`;

export default function PropertyMediaAndPricing({
	form,
}: PropertyMediaAndPricingProps) {
	const listingType = form.watch("listingType");
	const propertyType = form.watch("propertyType");

	const isForRent = listingType === "rent" || listingType === "lease";
	const isForSale = listingType === "sale";

	const priceFields = [
		{ name: "basePrice", label: "Monthly Rent", min: 0 },
		{ name: "maintenanceCharges", label: "Maintenance Charges", min: 0 },
		{ name: "securityDeposit", label: "Security Deposit", min: 0 },
	];
	// Define pricing fields based on listing type

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
								className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
									dragActive
										? "border-primary bg-primary/10"
										: "border-muted bg-background"
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
								<span className="text-sm text-muted-foreground mb-2">
									Drag & drop images here, or click to select
								</span>
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
							{selectedImages.map((file, index) => (
								<div key={file.name + index} className="relative group">
									<img
										src={URL.createObjectURL(file)}
										alt={file.name}
										className="h-32 w-full object-cover rounded-lg border shadow-sm"
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
										{file.name}
									</span>
								</div>
							))}
						</div>
						<div className="text-xs text-muted-foreground mt-2">
							You can upload up to 10 images. Supported formats: JPG, PNG, WEBP.
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
													const value = e.target.valueAsNumber;
													field.onChange(value);
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

			{/* Price Negotiable Field */}
			<div className="flex items-center gap-8">
				<FormField
					control={form.control}
					name="pricing.priceNegotiable"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2">
							<FormLabel className="text-sm font-semibold text-gray-700">
								Price Negotiable <span style={{ color: "red" }}>*</span>
							</FormLabel>
							<input
								type="checkbox"
								checked={field.value || false}
								onChange={(e) => field.onChange(e.target.checked)}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded aria-[checked]:bg-blue-600"
							/>
						</FormItem>
					)}
				/>
			</div>

			{propertyType !== "plot" && (
				<FormField
					control={form.control}
					name="legalInfo.ownershipType"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								Ownership Type <span style={{ color: "red" }}>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., Freehold, Leasehold"
									{...field}
									className="h-[40px] px-3 py-2 text-sm"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}
		</div>
	);
}
