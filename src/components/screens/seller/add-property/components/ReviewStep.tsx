"use client";

import { Button } from "@/components/ui/button";

import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	prevStep: () => void;
}

export default function ReviewStep({ form, prevStep }: StepProps) {
	const values = form.getValues();

	return (
		<div className="space-y-6">
			<h2 className="text-lg font-bold">Review Your Property</h2>
			<pre className="bg-muted p-4 rounded">
				{JSON.stringify(values, null, 2)}
			</pre>

			<div className="flex justify-between">
				<Button type="button" onClick={prevStep}>
					Back
				</Button>
				<Button type="submit">Submit Property</Button>
			</div>
		</div>
	);
}
