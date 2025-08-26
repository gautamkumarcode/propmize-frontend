"use client";

import { Card } from "@/components/ui/card";
import { Camera, Check, Contact, Home, MapPin } from "lucide-react";
import { useState } from "react";
import PropertyForm from "./components/PropertyMultiStepForm";

// Removed outdated PropertyForm interface. Use PropertyFormData from propertySchema.ts

export default function AddProperty() {
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
		<div className="min-h-screen py-10">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-10">
					{/* Header */}
					<div className="text-center">
						<h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
							Add New Property
						</h1>
						<p className="text-gray-700 mt-3 text-lg">
							Create a compelling listing to attract potential buyers
						</p>
					</div>

					{/* Responsive Steps and Form */}
					<div className="flex flex-col md:flex-row gap-8 items-start">
						{/* Stepper: horizontal scroll on mobile, vertical on desktop */}
						<Card className="p-4 shadow-md w-full md:w-[220px] md:p-6 md:mx-auto">
							<div className="w-full">
								<div className="flex md:flex-col flex-row items-center justify-center w-full overflow-x-auto scrollbar-hide">
									{steps.map((step, index) => {
										const IconComponent = step.icon;
										const isActive = currentStep === step.number;
										const isCompleted = currentStep > step.number;
										return (
											<div
												key={step.number}
												className={`flex md:flex-col flex-row items-center md:mb-6 min-w-[80px] relative`}>
												<div className="flex flex-col items-center z-10">
													<div
														className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out
																	${isActive
																		? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
																		: isCompleted
																		? "bg-green-500 text-white border-green-500"
																		: "bg-gray-100 text-gray-500 border-gray-300"
																	}`}>
														<IconComponent className="w-5 h-5" />
													</div>
													<span
														className={`mt-3 text-sm font-medium text-center min-w-max
																	${isActive
																		? "text-blue-800"
																		: isCompleted
																		? "text-green-700"
																		: "text-gray-500"
																	}`}>
														{step.title}
													</span>
												</div>
												{index < steps.length - 1 && (
													<div
														className={`absolute md:static top-1/2 left-full -translate-y-1/2 md:translate-y-0 md:left-auto md:top-auto 
																	md:w-1 md:h-10 w-10 h-1 mx-2 md:mx-0 rounded-full transition-all duration-300 ease-in-out
																	${isCompleted ? "bg-green-400" : "bg-gray-300"}
																	${isActive ? "md:!bg-blue-300" : ""}`
																}>
																</div>
												)}
											</div>
										);
									})}
								</div>
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
