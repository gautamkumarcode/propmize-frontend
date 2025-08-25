"use client";

import AppLayout from "@/components/custom/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Camera, Contact, Home, MapPin } from "lucide-react";
import { useState } from "react";
import PropertyForm from "./components/PropertyMultiStepForm";

// Removed outdated PropertyForm interface. Use PropertyFormData from propertySchema.ts

export default function AddProperty() {
	const [currentStep, setCurrentStep] = useState(1);

	const steps = [
		{ number: 1, title: "Basic Details", icon: Home },
		{ number: 2, title: "Property Details", icon: MapPin },
		{ number: 3, title: "Features & Media", icon: Camera },
		{ number: 4, title: "Contact", icon: Contact },
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
		<AppLayout mode="seller">
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
							<Card className="p-4 shadow-md w-full md:min-w-[220px] md:w-auto md:p-6">
								<div className="w-full">
									<div className="flex md:flex-col flex-row items-center md:items-start justify-between md:justify-start w-full overflow-x-auto scrollbar-hide">
										{steps.map((step, index) => {
											const IconComponent = step.icon;
											const isActive = currentStep === step.number;
											const isCompleted = currentStep > step.number;
											return (
												<div
													key={step.number}
													className={`flex md:flex-col flex-row items-center md:mb-6 min-w-[80px]`}>
													<div className="flex flex-col items-center">
														<div
															className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200
																${
																	isActive
																		? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
																		: isCompleted
																		? "bg-blue-100 text-blue-600 border-blue-300"
																		: "bg-gray-200 text-gray-400 border-gray-300"
																}`}>
															<IconComponent className="w-5 h-5" />
														</div>
														<span
															className={`mt-2 text-xs font-semibold text-center max-w-[80px] truncate
																${
																	isActive
																		? "text-blue-700"
																		: isCompleted
																		? "text-blue-500"
																		: "text-gray-400"
																}`}>
															{step.title}
														</span>
													</div>
													{index < steps.length - 1 && (
														<div
															className={`md:w-1 md:h-8 w-8 h-1 mx-2 md:mx-0 rounded-full transition-all duration-200
																${isCompleted ? "bg-blue-400" : "bg-gray-200"}`}
														/>
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
		</AppLayout>
	);
}
