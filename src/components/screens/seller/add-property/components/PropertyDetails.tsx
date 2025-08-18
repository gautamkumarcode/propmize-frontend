"use client";

import { Button } from "@/components/ui/button";
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

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	nextStep: () => void;
	prevStep: () => void;
}

export default function PropertyDetailsStep({
	form,
	nextStep,
	prevStep,
}: StepProps) {
	return (
		<div className="space-y-6">
			{[
				"bedrooms",
				"bathrooms",
				"balconies",
				"parking",
				"floor",
				"totalFloors",
				"age",
			].map((fieldName) => (
				<FormField
					key={fieldName}
					control={form.control}
					name={fieldName as any}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{fieldName}</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}

			<FormField
				control={form.control}
				name="area.value"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Area</FormLabel>
						<FormControl>
							<Input type="number" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="furnished"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Furnished</FormLabel>
						<select {...field} className="border rounded p-2 w-full">
							<option value="unfurnished">Unfurnished</option>
							<option value="semi-furnished">Semi-Furnished</option>
							<option value="furnished">Furnished</option>
						</select>
					</FormItem>
				)}
			/>

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
