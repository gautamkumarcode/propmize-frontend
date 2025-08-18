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

export default function LocationStep({ form, nextStep, prevStep }: StepProps) {
	return (
		<div className="space-y-6">
			{["street", "area", "city", "state", "zipCode", "country"].map(
				(fieldName) => (
					<FormField
						key={fieldName}
						control={form.control}
						name={`address.${fieldName}` as any}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{fieldName}</FormLabel>
								<FormControl>
									<Input placeholder={fieldName} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)
			)}

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
