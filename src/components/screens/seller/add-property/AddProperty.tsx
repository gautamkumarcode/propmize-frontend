"use client";

import SellerLayout from "@/components/layout/SellerLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	ArrowLeft,
	ArrowRight,
	Camera,
	CheckCircle,
	DollarSign,
	Home,
	MapPin,
	Upload,
} from "lucide-react";
import React, { useState } from "react";

interface PropertyForm {
	// Basic Details
	title: string;
	description: string;
	propertyType: string;
	listingType: string;
	price: string;

	// Location
	address: string;
	city: string;
	state: string;
	pincode: string;

	// Property Details
	bedrooms: string;
	bathrooms: string;
	area: string;
	areaUnit: string;
	furnishing: string;
	parking: string;
	floor: string;
	totalFloors: string;

	// Amenities
	amenities: string[];

	// Contact
	contactName: string;
	contactPhone: string;
	contactEmail: string;
}

export default function AddProperty() {
	const [currentStep, setCurrentStep] = useState(1);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

	const [formData, setFormData] = useState<PropertyForm>({
		title: "",
		description: "",
		propertyType: "",
		listingType: "",
		price: "",
		address: "",
		city: "",
		state: "",
		pincode: "",
		bedrooms: "",
		bathrooms: "",
		area: "",
		areaUnit: "sqft",
		furnishing: "",
		parking: "",
		floor: "",
		totalFloors: "",
		amenities: [],
		contactName: "",
		contactPhone: "",
		contactEmail: "",
	});

	const steps = [
		{ number: 1, title: "Basic Details", icon: Home },
		{ number: 2, title: "Location", icon: MapPin },
		{ number: 3, title: "Property Details", icon: Home },
		{ number: 4, title: "Photos", icon: Camera },
		{ number: 5, title: "Pricing", icon: DollarSign },
		{ number: 6, title: "Review", icon: CheckCircle },
	];

	const propertyTypes = [
		"Apartment",
		"Villa",
		"House",
		"Plot",
		"Commercial",
		"Office",
	];

	const availableAmenities = [
		"Swimming Pool",
		"Gym",
		"Security",
		"Power Backup",
		"Lift",
		"Garden",
		"Parking",
		"Club House",
		"Children's Play Area",
		"24/7 Water Supply",
		"Wi-Fi",
		"Air Conditioning",
	];

	const handleInputChange = (field: keyof PropertyForm, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAmenityToggle = (amenity: string) => {
		setFormData((prev) => ({
			...prev,
			amenities: prev.amenities.includes(amenity)
				? prev.amenities.filter((a) => a !== amenity)
				: [...prev.amenities, amenity],
		}));
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		// In a real app, you would upload these files to a server
		const newImages = files.map((file) => URL.createObjectURL(file));
		setUploadedImages((prev) => [...prev, ...newImages]);
	};

	const removeImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
	};

	const nextStep = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900">Basic Details</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Property Title *
								</label>
								<Input
									placeholder="e.g., Spacious 2BHK Apartment"
									value={formData.title}
									onChange={(e) => handleInputChange("title", e.target.value)}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Property Type *
								</label>
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									value={formData.propertyType}
									onChange={(e) =>
										handleInputChange("propertyType", e.target.value)
									}>
									<option value="">Select Property Type</option>
									{propertyTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Listing Type *
								</label>
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									value={formData.listingType}
									onChange={(e) =>
										handleInputChange("listingType", e.target.value)
									}>
									<option value="">Select Listing Type</option>
									<option value="Sale">For Sale</option>
									<option value="Rent">For Rent</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description *
							</label>
							<textarea
								rows={4}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
								placeholder="Describe your property in detail..."
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
							/>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Location Details
						</h2>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Complete Address *
							</label>
							<textarea
								rows={3}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
								placeholder="House/Flat No, Building Name, Street..."
								value={formData.address}
								onChange={(e) => handleInputChange("address", e.target.value)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									City *
								</label>
								<Input
									placeholder="Enter city"
									value={formData.city}
									onChange={(e) => handleInputChange("city", e.target.value)}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									State *
								</label>
								<Input
									placeholder="Enter state"
									value={formData.state}
									onChange={(e) => handleInputChange("state", e.target.value)}
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								PIN Code *
							</label>
							<Input
								placeholder="6-digit PIN code"
								value={formData.pincode}
								onChange={(e) => handleInputChange("pincode", e.target.value)}
								className="max-w-xs"
							/>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Property Details
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Bedrooms
								</label>
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									value={formData.bedrooms}
									onChange={(e) =>
										handleInputChange("bedrooms", e.target.value)
									}>
									<option value="">Select</option>
									<option value="1">1 BHK</option>
									<option value="2">2 BHK</option>
									<option value="3">3 BHK</option>
									<option value="4">4 BHK</option>
									<option value="5+">5+ BHK</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Bathrooms
								</label>
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									value={formData.bathrooms}
									onChange={(e) =>
										handleInputChange("bathrooms", e.target.value)
									}>
									<option value="">Select</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5+">5+</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Built-up Area *
								</label>
								<div className="flex">
									<Input
										placeholder="Enter area"
										value={formData.area}
										onChange={(e) => handleInputChange("area", e.target.value)}
										className="rounded-r-none"
									/>
									<select
										className="border border-gray-300 rounded-l-none rounded-r-md px-3 py-2 border-l-0"
										value={formData.areaUnit}
										onChange={(e) =>
											handleInputChange("areaUnit", e.target.value)
										}>
										<option value="sqft">Sq Ft</option>
										<option value="sqm">Sq M</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Furnishing
								</label>
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									value={formData.furnishing}
									onChange={(e) =>
										handleInputChange("furnishing", e.target.value)
									}>
									<option value="">Select</option>
									<option value="Fully Furnished">Fully Furnished</option>
									<option value="Semi Furnished">Semi Furnished</option>
									<option value="Unfurnished">Unfurnished</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Parking
								</label>
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									value={formData.parking}
									onChange={(e) =>
										handleInputChange("parking", e.target.value)
									}>
									<option value="">Select</option>
									<option value="0">No Parking</option>
									<option value="1">1 Car</option>
									<option value="2">2 Cars</option>
									<option value="3+">3+ Cars</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Floor Number
								</label>
								<div className="grid grid-cols-2 gap-2">
									<Input
										placeholder="Floor"
										value={formData.floor}
										onChange={(e) => handleInputChange("floor", e.target.value)}
									/>
									<Input
										placeholder="Total Floors"
										value={formData.totalFloors}
										onChange={(e) =>
											handleInputChange("totalFloors", e.target.value)
										}
									/>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-4">
								Amenities
							</label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{availableAmenities.map((amenity) => (
									<label key={amenity} className="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={formData.amenities.includes(amenity)}
											onChange={() => handleAmenityToggle(amenity)}
											className="rounded border-gray-300"
										/>
										<span className="text-sm">{amenity}</span>
									</label>
								))}
							</div>
						</div>
					</div>
				);

			case 4:
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900">Upload Photos</h2>
						<p className="text-gray-600">
							Add high-quality photos to attract more buyers
						</p>

						<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
							<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Upload Property Photos
							</h3>
							<p className="text-gray-600 mb-4">
								Drag & drop photos here or click to browse
							</p>
							<input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								id="photo-upload"
							/>
							<label htmlFor="photo-upload">
								<Button type="button">
									<Camera className="w-4 h-4 mr-2" />
									Choose Photos
								</Button>
							</label>
						</div>

						{uploadedImages.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Uploaded Photos ({uploadedImages.length})
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{uploadedImages.map((image, index) => (
										<div key={index} className="relative group">
											<img
												src={image}
												alt={`Property ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg"
											/>
											<button
												onClick={() => removeImage(index)}
												className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												×
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				);

			case 5:
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Pricing & Contact
						</h2>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Expected Price *
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
									₹
								</span>
								<Input
									placeholder="Enter expected price"
									value={formData.price}
									onChange={(e) => handleInputChange("price", e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Contact Information
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Contact Name *
									</label>
									<Input
										placeholder="Your name"
										value={formData.contactName}
										onChange={(e) =>
											handleInputChange("contactName", e.target.value)
										}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number *
									</label>
									<Input
										placeholder="Your phone number"
										value={formData.contactPhone}
										onChange={(e) =>
											handleInputChange("contactPhone", e.target.value)
										}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email Address
								</label>
								<Input
									placeholder="Your email address"
									type="email"
									value={formData.contactEmail}
									onChange={(e) =>
										handleInputChange("contactEmail", e.target.value)
									}
								/>
							</div>
						</div>
					</div>
				);

			case 6:
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Review Your Listing
						</h2>
						<p className="text-gray-600">
							Please review all the details before submitting your property
							listing
						</p>

						<Card className="p-6">
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h3 className="font-semibold text-gray-900">
											Property Title
										</h3>
										<p className="text-gray-600">
											{formData.title || "Not specified"}
										</p>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">
											Type & Listing
										</h3>
										<p className="text-gray-600">
											{formData.propertyType} - {formData.listingType}
										</p>
									</div>
								</div>

								<div>
									<h3 className="font-semibold text-gray-900">Location</h3>
									<p className="text-gray-600">
										{formData.address}, {formData.city}, {formData.state} -{" "}
										{formData.pincode}
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<h3 className="font-semibold text-gray-900">
											Configuration
										</h3>
										<p className="text-gray-600">
											{formData.bedrooms} BHK, {formData.bathrooms} Bath
										</p>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">Area</h3>
										<p className="text-gray-600">
											{formData.area} {formData.areaUnit}
										</p>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">Price</h3>
										<p className="text-xl font-bold text-green-600">
											₹{formData.price}
										</p>
									</div>
								</div>

								<div>
									<h3 className="font-semibold text-gray-900">Photos</h3>
									<p className="text-gray-600">
										{uploadedImages.length} photos uploaded
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-gray-900">Contact</h3>
									<p className="text-gray-600">
										{formData.contactName} - {formData.contactPhone}
									</p>
								</div>
							</div>
						</Card>

						<div className="bg-blue-50 rounded-lg p-4">
							<p className="text-blue-800">
								<CheckCircle className="w-5 h-5 inline mr-2" />
								Your listing will be reviewed within 24-48 hours and will be
								live once approved.
							</p>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<SellerLayout>
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-8">
						{/* Header */}
						<div className="text-center">
							<h1 className="text-3xl font-bold text-gray-900">
								Add New Property
							</h1>
							<p className="text-gray-600 mt-2">
								Create a compelling listing to attract potential buyers
							</p>
						</div>

						{/* Progress Steps */}
						<Card className="p-6">
							<div className="flex items-center justify-between">
								{steps.map((step, index) => {
									const IconComponent = step.icon;
									return (
										<div key={step.number} className="flex items-center">
											<div className="flex flex-col items-center">
												<div
													className={`w-12 h-12 rounded-full flex items-center justify-center ${
														currentStep >= step.number
															? "bg-blue-600 text-white"
															: "bg-gray-200 text-gray-600"
													}`}>
													<IconComponent className="w-5 h-5" />
												</div>
												<span
													className={`mt-2 text-sm font-medium ${
														currentStep >= step.number
															? "text-blue-600"
															: "text-gray-500"
													}`}>
													{step.title}
												</span>
											</div>
											{index < steps.length - 1 && (
												<div
													className={`w-12 h-1 mx-4 ${
														currentStep > step.number
															? "bg-blue-600"
															: "bg-gray-200"
													}`}
												/>
											)}
										</div>
									);
								})}
							</div>
						</Card>

						{/* Form Content */}
						<Card className="p-8">{renderStepContent()}</Card>

						{/* Navigation Buttons */}
						<div className="flex justify-between">
							<Button
								variant="outline"
								onClick={prevStep}
								disabled={currentStep === 1}
								className="flex items-center">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Previous
							</Button>

							{currentStep < steps.length ? (
								<Button onClick={nextStep} className="flex items-center">
									Next
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							) : (
								<Button className="flex items-center bg-green-600 hover:bg-green-700">
									<CheckCircle className="w-4 h-4 mr-2" />
									Submit Listing
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
