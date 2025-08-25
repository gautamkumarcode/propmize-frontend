"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";
import NearbyPlaceFields from "./NearbyPlaceFields";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	nextStep: () => void;
	prevStep: () => void;
}

const places = ["schools", "hospitals", "malls", "transport"];
const distanceUnits = ["meter", "km"];

export default function NearbyPlacesStep({
	form,
	nextStep,
	prevStep,
}: StepProps) {
	return (
		<div className="space-y-6">
			{places.map((place) => (
				<NearbyPlaceFields
					key={place}
					form={form}
					place={place}
					distanceUnits={distanceUnits}
				/>
			))}
			<div className="flex justify-between">
				<Button type="button" onClick={prevStep}>
					Back
				</Button>
				<Button type="button" onClick={nextStep}>
					Next
				</Button>
			</div>
		</div>
	);
}
