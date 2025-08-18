"use client";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PropertyFormData } from "@/types/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { propertySchema } from "../validation/propertySchema";
import BasicDetailsStep from "./BasicDetailsStep";
import LocationStep from "./LocationStep";
import MediaStep from "./MediaStep";
import PricingStep from "./PricingStep";
import PropertyDetailsStep from "./PropertyDetails";
import ReviewStep from "./ReviewStep";

interface PropertyFormProps {
	onSubmit: (data: PropertyFormData) => void;
	defaultValues?: Partial<PropertyFormData>;
}

export default function PropertyForm({
	onSubmit,
	defaultValues,
}: PropertyFormProps) {
	const form = useForm<PropertyFormData>({
		resolver: zodResolver(propertySchema),
		defaultValues: {
			propertyType: "apartment",
			listingType: "sale",
			currency: "INR",
			address: {
				country: "India",
			},
			area: {
				unit: "sqft",
			},
			furnished: "unfurnished",
			pricing: {
				basePrice: "0",
				priceNegotiable: true,
			},
			availability: {
				immediatelyAvailable: true,
			},
			legalInfo: {
				ownershipType: "freehold",
			},
			...defaultValues,
		},
	});

	const [step, setStep] = useState<number>(1);

	const nextStep = async () => {
		// Validate current step before proceeding
		const fields = stepFields[String(step) as keyof typeof stepFields];
		const isValid = await form.trigger(fields as any);
		if (isValid) {
			setStep(step + 1);
		}
	};

	const prevStep = () => {
		setStep(step - 1);
	};

	const stepFields: {
		"1": string[];
		"2": string[];
		"3": string[];
		"4": string[];
		"5": string[];
		"6": string[];
	} = {
		"1": ["title", "description", "propertyType", "listingType"],
		"2": ["address"],
		"3": [
			"bedrooms",
			"bathrooms",
			"area",
			"furnished",
			"parking",
			"floor",
			"totalFloors",
			"age",
			"amenities",
		],
		"4": ["images", "videos", "virtualTour"],
		"5": ["pricing", "availability", "legalInfo"],
		"6": ["contact"],
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<Card className="p-6">
					{step === 1 && <BasicDetailsStep form={form} nextStep={nextStep} />}
					{step === 2 && (
						<LocationStep form={form} nextStep={nextStep} prevStep={prevStep} />
					)}
					{step === 3 && (
						<PropertyDetailsStep
							form={form}
							nextStep={nextStep}
							prevStep={prevStep}
						/>
					)}
					{step === 4 && (
						<MediaStep form={form} nextStep={nextStep} prevStep={prevStep} />
					)}
					{step === 5 && (
						<PricingStep form={form} nextStep={nextStep} prevStep={prevStep} />
					)}
					{step === 6 && <ReviewStep form={form} prevStep={prevStep} />}
				</Card>
			</form>
		</Form>
	);
}
