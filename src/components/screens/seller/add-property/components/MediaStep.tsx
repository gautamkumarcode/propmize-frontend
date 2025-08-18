"use client";

import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	nextStep: () => void;
	prevStep: () => void;
}

export default function MediaStep({ form, nextStep, prevStep }: StepProps) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "images",
	});

	return (
		<div className="space-y-6">
			<FormLabel>Images</FormLabel>
			{fields.map((field, index) => (
				<FormField
					key={field.id}
					control={form.control}
					name={`images.${index}` as any}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="Image URL" {...field} />
							</FormControl>
							<Button
								type="button"
								variant="destructive"
								onClick={() => remove(index)}>
								Remove
							</Button>
						</FormItem>
					)}
				/>
			))}
			<Button type="button" onClick={() => append("")}>
				Add Image
			</Button>

			<FormField
				control={form.control}
				name="virtualTour"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Virtual Tour Link</FormLabel>
						<FormControl>
							<Input placeholder="https://..." {...field} />
						</FormControl>
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
