"use client";

import { Card } from "@/components/ui/card";
import { Camera, Check, Home, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import PropertyForm from "./components/PropertyMultiStepForm";
import WhatsAppButton from "./whatsappbutton/WhatsappButton";

// Removed outdated PropertyForm interface. Use PropertyFormData from propertySchema.ts

export default function AddProperty() {
	const searchParams = useSearchParams();
	const mode = searchParams.get("mode"); // 'create' or 'edit'
	const id = searchParams.get("id"); // property ID if in edit mode
	const isEditMode = mode === "edit" && id;
	const [currentStep, setCurrentStep] = useState(1);

	const steps = [
		{ number: 1, title: "Basic Details", icon: Home },
		{ number: 2, title: "Location & Features", icon: MapPin },
		{ number: 3, title: "Media & Pricing & Contact", icon: Camera },
		{ number: 4, title: "Review", icon: Check },
	];

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

	return (
		<div className="min-h-screen relative pt-4 pb-20 px-4 ">
			<WhatsAppButton />

			<div className="max-w-5xl mx-auto  sm:px-2 lg:px-8">
				<div className="space-y-2">
					{/* Header */}
					<div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-white rounded-xl border border-blue-100 shadow-sm mb-6">
						<div className="flex items-center mb-4 lg:mb-0">
							<div className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4 hidden lg:flex">
								{isEditMode ? (
									<svg
										className="w-6 h-6 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
									</svg>
								) : (
									<svg
										className="w-6 h-6 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
									</svg>
								)}
							</div>

							<div>
								<h2 className="text-xl font-bold text-gray-900">
									{isEditMode ? `Editing Property` : "Create New Property"}
								</h2>
								<p className="text-gray-600">
									{isEditMode
										? "Update your property details"
										: "Fill in the details to list your property"}
								</p>
							</div>
						</div>

						{/* Optional: Add progress indicator if multi-step form */}
						<div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
							<span className="text-sm font-medium text-gray-700 mr-2">
								Step 1 of 4
							</span>
							<div className="flex space-x-1">
								{[1, 2, 3, 4].map((step) => (
									<div
										key={step}
										className={`w-2 h-2 rounded-full ${
											step <= currentStep ? "bg-blue-600" : "bg-gray-300"
										}`}></div>
								))}
							</div>
						</div>
					</div>
					<div className="md:hidden flex items-center">
						<div className="text-lg font-semibold text-blue-600 mt-1 mr-2">
							{steps[currentStep - 1]?.title}
						</div>
					</div>

					{/* Responsive Steps and Form */}
					<div className="flex flex-col  gap-6 items-start  ">
						{/* Stepper: horizontal scroll on mobile, vertical on desktop */}
						<Card className="py-6 px-4 shadow-lg w-full  mx-auto bg-white rounded-2xl hidden md:flex lg:flex ">
							{/* Mobile View - Current Step Only */}

							{/* Desktop View - Full Stepper */}
							{steps.map((step, index) => {
								const IconComponent = step.icon;
								const isActive = currentStep === step.number;
								const isCompleted = currentStep > step.number;

								return (
									<div
										key={step.number}
										className="flex-1 flex flex-col items-center relative">
										{/* Connector Line - behind the circle */}
										{index < steps.length - 1 && (
											<div
												className={`absolute top-6 left-1/2 w-full h-1 z-0 md:ml-6 rounded-full transition-all duration-300 ease-in-out
                ${isCompleted ? "bg-green-400" : "bg-gray-300"}
                ${isActive ? "bg-blue-300" : ""}`}
												style={{ right: "-50%", left: "50%" }}></div>
										)}
										{/* Circle with Icon */}
										<div
											className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out
              ${
								isActive
									? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
									: isCompleted
									? "bg-green-500 text-white border-green-500"
									: "bg-gray-200 text-gray-500 border-gray-300"
							}
            `}>
											<IconComponent className="w-6 h-6" />
										</div>

										{/* Label */}
										<span
											className={`mt-2 text-xs md:text-sm font-medium text-center transition-colors
              ${
								isActive
									? "text-blue-700"
									: isCompleted
									? "text-green-600"
									: "text-gray-500"
							}
            `}>
											{step.title}
										</span>
									</div>
								);
							})}
						</Card>

						{/* Form Content */}
						<div className="flex-1 w-full lg:mt-6 md:mt-0">
							<PropertyForm
								currentStep={currentStep}
								nextStep={nextStep}
								prevStep={prevStep}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
