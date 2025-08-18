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
}

export default function BasicDetailsStep({ form, nextStep }: StepProps) {
	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Property Title</FormLabel>
						<FormControl>
							<Input placeholder="Luxury Apartment in Mumbai" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Input placeholder="Describe the property..." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="propertyType"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Property Type</FormLabel>
						<select {...field} className="border rounded p-2 w-full">
							<option value="apartment">Apartment</option>
							<option value="house">House</option>
							<option value="villa">Villa</option>
							<option value="plot">Plot</option>
							<option value="commercial">Commercial</option>
							<option value="office">Office</option>
						</select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="listingType"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Listing Type</FormLabel>
						<select {...field} className="border rounded p-2 w-full">
							<option value="sale">Sale</option>
							<option value="rent">Rent</option>
							<option value="lease">Lease</option>
						</select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="flex justify-end">
				<Button type="button" onClick={nextStep}>
					Next
				</Button>
			</div>
		</div>
	);
}
