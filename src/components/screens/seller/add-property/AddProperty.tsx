"use client";

import SellerLayout from "@/components/custom/layout/SellerLayout";
import { Card } from "@/components/ui/card";
import { Camera, CheckCircle, DollarSign, Home, MapPin } from "lucide-react";
import { useState } from "react";
import PropertyForm from "./components/PropertyMultiStepForm";

// Removed outdated PropertyForm interface. Use PropertyFormData from propertySchema.ts

export default function AddProperty() {
	const [currentStep, setCurrentStep] = useState(1);

	const steps = [
		{ number: 1, title: "Basic Details", icon: Home },
		{ number: 2, title: "Location & Nearby", icon: MapPin },
		{ number: 3, title: "Property & Features", icon: Home },
		{ number: 4, title: "Media", icon: Camera },
		{ number: 5, title: "Pricing & Legal", icon: DollarSign },
		{ number: 6, title: "Contact & Notes", icon: Home },
		{ number: 7, title: "Review", icon: CheckCircle },
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
		<SellerLayout>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

						{/* Progress Steps */}
						<Card className="p-6 shadow-md">
							<div className="flex items-center justify-between">
								{steps.map((step, index) => {
									const IconComponent = step.icon;
									const isActive = currentStep === step.number;
									const isCompleted = currentStep > step.number;
									return (
										<div key={step.number} className="flex items-center">
											<div className="flex flex-col items-center">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
														isActive
															? "bg-blue-600 text-white border-blue-600 shadow-lg"
															: isCompleted
															? "bg-blue-100 text-blue-600 border-blue-300"
															: "bg-gray-200 text-gray-400 border-gray-300"
													}`}>
													<IconComponent className="w-5 h-5" />
												</div>
												<span
													className={`mt-2 text-xs font-semibold ${
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
													className={`w-8 h-1 mx-2 rounded-full ${
														isCompleted ? "bg-blue-400" : "bg-gray-200"
													}`}
												/>
											)}
										</div>
									);
								})}
							</div>
						</Card>

						{/* Form Content */}
						<PropertyForm
							currentStep={currentStep}
							nextStep={nextStep}
							prevStep={prevStep}
							onSubmit={() => {}}
						/>

						{/* Navigation Buttons */}
						{/* <div className="flex justify-between items-center mt-6">
							<Button
								variant="outline"
								onClick={prevStep}
								disabled={currentStep === 1}
								className="flex items-center gap-2 px-6 py-2 text-base rounded-lg shadow-sm">
								<ArrowLeft className="w-4 h-4" />
								Previous
							</Button>

							{currentStep < steps.length ? (
								<Button
									onClick={nextStep}
									className="flex items-center gap-2 px-6 py-2 text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md">
									Next
									<ArrowRight className="w-4 h-4" />
								</Button>
							) : (
								<Button className="flex items-center gap-2 px-6 py-2 text-base rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-md">
									<CheckCircle className="w-4 h-4" />
									Submit Listing
								</Button>
							)}
						</div> */}
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
