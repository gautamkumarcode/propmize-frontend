"use client";

import { Card } from "@/components/ui/card";
import { Camera, Check, Contact, Home, MapPin } from "lucide-react";
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
		{ number: 3, title: "Media & Pricing", icon: Camera },
		{ number: 4, title: "Contact & Notes", icon: Contact },
		{ number: 5, title: "Review", icon: Check },
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
		<div className="min-h-screen relative">
			<WhatsAppButton />

			<div className="max-w-5xl mx-auto  sm:px-2 lg:px-8">
				<div className="space-y-4 ">
					{/* Header */}
					<div className=" flex flex-col lg:justify-center lg:items-center rounded-lg mb-6">
						<h2 className="text-xl font-semibold text-blue-800">
							{isEditMode ? `Editing Property` : "Create New Property"}
						</h2>
						<p className="text-blue-600">
							{isEditMode
								? "Update your property details below"
								: "Fill in the details to list your property"}
						</p>
					</div>

					{/* Responsive Steps and Form */}
					<div className="flex flex-col  gap-8 items-start ">
						{/* Stepper: horizontal scroll on mobile, vertical on desktop */}
						<Card className="py-6 px-4 shadow-lg w-full max-w-3xl mx-auto bg-white rounded-2xl">
							<div className="flex items-center justify-between relative w-full">
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
													${isActive ? "text-blue-700" : isCompleted ? "text-green-600" : "text-gray-500"}
												`}>
												{step.title}
											</span>
										</div>
									);
								})}
							</div>
						</Card>

						{/* Form Content */}
						<div className="flex-1 w-full mt-6 md:mt-0">
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
