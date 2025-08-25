"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";
import NearbyPlaceFields from "./NearbyPlaceFields"; // New import

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
}

type AddressFieldKey = `address.${keyof PropertyFormData["address"]}`;

const places = ["schools", "hospitals", "malls", "transport"];
const distanceUnits = ["meter", "km"];

export default function LocationNearbyStep({ form }: StepProps) {
	// Debug: collect all address field errors
	const addressKeys = [
		"street",
		"area",
		"city",
		"state",
		"zipCode",
		"country",
		"coordinates",
		"landmark",
	];
	const addressErrors = addressKeys
		.map(
			(key) =>
				form.getFieldState(`address.${key}` as AddressFieldKey).error?.message
		)
		.filter(Boolean);

	return (
		<div className="space-y-6">
			{/* Debug: show all address field errors */}
			{addressErrors.length > 0 && (
				<div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs">
					<div className="font-bold mb-1">Address Field Errors:</div>
					<ul className="list-disc ml-5">
						{addressErrors.map((err, idx) => (
							<li key={idx}>{err}</li>
						))}
					</ul>
				</div>
			)}
			{/* Address Fields */}
			{[
				{ key: "street", label: "Street" },
				{ key: "area", label: "Area" },
				{ key: "city", label: "City" },
				{ key: "state", label: "State" },
				{ key: "zipCode", label: "Zip Code" },
				{ key: "country", label: "Country" },
				{ key: "coordinates", label: "Coordinates (optional)" },
				{
					key: "landmark",
					label: "Landmark (optional)",
				},
			].map(({ key, label }) => (
				<FormField
					key={key}
					control={form.control}
					name={`address.${key}` as AddressFieldKey}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{label}</FormLabel>
							<FormControl>
								<Input
									placeholder={label}
									{...field}
									value={
										typeof field.value === "string" ||
										typeof field.value === "number"
											? field.value
											: ""
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}

			{/* Nearby Places Fields - Modern Card UI */}
			<div className="space-y-4">
				{places.map((place) => (
					<NearbyPlaceFields
						key={place}
						form={form}
						place={place}
						distanceUnits={distanceUnits}
					/>
				))}
			</div>
		</div>
	);
}
