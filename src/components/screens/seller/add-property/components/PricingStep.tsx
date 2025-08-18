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

export default function PricingStep({ form, nextStep, prevStep }: StepProps) {
	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="pricing.basePrice"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Base Price</FormLabel>
						<FormControl>
							<Input type="number" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="pricing.maintenanceCharges"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Maintenance Charges</FormLabel>
						<FormControl>
							<Input type="number" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="pricing.priceNegotiable"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Negotiable?</FormLabel>
						<input
							type="checkbox"
							name={field.name}
							ref={field.ref}
							checked={field.value}
							onChange={e => field.onChange(e.target.checked)}
							onBlur={field.onBlur}
						/>
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
