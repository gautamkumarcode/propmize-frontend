"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateProperty } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { PropertyFormData } from "../validation/propertySchema";
import { propertySchema } from "../validation/propertySchema";
import BasicDetailsStep from "./BasicDetailsStep";
import ContactNotesStep from "./ContactNotesStep";
import LocationNearbyStep from "./LocationNearbyStep";
import MediaStep from "./MediaStep";
import PricingLegalStep from "./PricingLegalStep";
import PropertyDetailsFeaturesStep from "./PropertyDetailsFeaturesStep";
import ReviewStep from "./ReviewStep";

interface PropertyFormProps {
	onSubmit: SubmitHandler<PropertyFormData>;
	currentStep: number;
	nextStep: () => void;
	prevStep: () => void;
}

export default function PropertyForm({
	onSubmit,
	currentStep,
	nextStep,
	prevStep,
}: PropertyFormProps) {
	const form = useForm<PropertyFormData, any, PropertyFormData>({
		resolver: zodResolver(propertySchema) as any,
		defaultValues: {
			title: "",
			description: "",
			propertyType: "apartment",
			listingType: "sale",
			currency: "INR",
			area: { value: "", unit: "sqft" },
			bedrooms: "",
			bathrooms: "",
			balconies: "",
			parking: "",
			furnished: "unfurnished",
			floor: "",
			totalFloors: "",
			age: "",
			images: [],
			videos: [],
			amenities: [],
			address: {
				street: "",
				area: "",
				city: "",
				state: "",
				zipCode: "",
				country: "India",
				landmark: "",
				coordinates: undefined,
			},
			pricing: {
				basePrice: { value: "", unit: "Lakh" },
				maintenanceCharges: { value: "", unit: "Lakh" },
				securityDeposit: { value: "", unit: "Lakh" },
				priceNegotiable: true,
			},
			availability: {
				immediatelyAvailable: true,
				possessionDate: new Date(),
				leaseDuration: 0,
			},
			nearbyPlaces: {
				schools: [{ name: "", distance: "", unit: "km" }],
				hospitals: [{ name: "", distance: "", unit: "km" }],
				malls: [{ name: "", distance: "", unit: "km" }],
				transport: [{ name: "", distance: "", unit: "km" }],
			},
			contact: {
				name: "",
				phone: "",
				whatsapp: "",
				type: "owner",
			},
			features: {
				facing: "north",
				flooringType: "",
				waterSupply: "",
				powerBackup: false,
				servantRoom: false,
				poojaRoom: false,
				studyRoom: false,
				storeRoom: false,
				garden: false,
				swimmingPool: false,
				gym: false,
				lift: false,
				security: false,
			},

			notes: "",
		},
	});

	const stepFields = {
		"1": ["title", "description", "propertyType", "listingType"],
		"2": ["address", "nearbyPlaces"],
		"3": [
			"bedrooms",
			"bathrooms",
			"area.value",
			"furnished",
			"parking",
			"floor",
			"totalFloors",
			"age",
			"amenities",
			"features.facing",
			"features.flooringType",
			"features.waterSupply",
			"features.powerBackup",
			"features.servantRoom",
			"features.poojaRoom",
			"features.studyRoom",
			"features.storeRoom",
			"features.garden",
			"features.swimmingPool",
			"features.gym",
			"features.lift",
			"features.security",

			"legal.loanAvailable",
		],
		"4": ["images", "videos"],
		"5": ["pricing", "availability", "legal"],
		"6": ["contact", "tags", "notes"],
	};

	// ✅ Validation wrapper to run before parent nextStep
	const validateAndNext = async () => {
		const fields = stepFields[String(currentStep) as keyof typeof stepFields];
		const isValid = await form.trigger(fields as Array<keyof PropertyFormData>);
		if (isValid) nextStep();
	};

	const createProperty = useCreateProperty();

	const submit: SubmitHandler<PropertyFormData> = (data) => {
		console.log(data, "comming");
		// Pass the form data directly, as the pricing object must match the expected type
		createProperty.mutate(data);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(submit)} className="space-y-8">
				<Card className="p-6">
					{currentStep === 1 && <BasicDetailsStep form={form} />}
					{currentStep === 2 && <LocationNearbyStep form={form} />}
					{currentStep === 3 && <PropertyDetailsFeaturesStep form={form} />}
					{currentStep === 4 && <MediaStep form={form} />}
					{currentStep === 5 && <PricingLegalStep form={form} />}

					{currentStep === 6 && <ContactNotesStep form={form} />}
					{currentStep === 7 && <ReviewStep form={form} prevStep={prevStep} />}
				</Card>

				<div className="flex justify-between mt-8">
					<Button
						disabled={currentStep === 1}
						className="bg-white text-gray-800"
						type="button"
						onClick={prevStep}
						variant="outline">
						Back
					</Button>
					<Button
						type={currentStep === 7 ? "submit" : "button"}
						onClick={currentStep === 7 ? undefined : validateAndNext}
						className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
						{currentStep === 7 ? "Submit Property" : "Next"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
