"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	nextStep: () => void;
	prevStep: () => void;
}

const places = ["schools", "hospitals", "malls", "transport"];

export default function NearbyPlacesStep({
	form,
	nextStep,
	prevStep,
}: StepProps) {
	return (
		<div className="space-y-6">
			{places.map((place) => {
				const { fields, append, remove } = useFieldArray<PropertyFormData>({
					control: form.control,
					name: `nearbyPlaces.${place}` as any,
				});
				return (
					<FormItem key={place}>
						<FormLabel>
							{place.charAt(0).toUpperCase() + place.slice(1)}
						</FormLabel>
						{fields.map((field, idx) => (
							<div key={field.id} className="flex gap-2 items-center mb-2">
								<FormField
									control={form.control}
									name={`nearbyPlaces.${place}.${idx}.name` as any}
									render={({ field }) => {
										// Get error for this field from formState.errors using type assertion
										const errors = form.formState.errors as any;
										const nameError =
											errors?.nearbyPlaces?.[place]?.[idx]?.name;
										return (
											<>
												<Input placeholder="Name" {...field} />
												{nameError && (
													<div className="text-xs text-red-600 mt-1">
														{nameError.message}
													</div>
												)}
											</>
										);
									}}
								/>
								<FormField
									control={form.control}
									name={`nearbyPlaces.${place}.${idx}.distance` as any}
									render={({ field }) => {
										const errors = form.formState.errors as any;
										const distanceError =
											errors?.nearbyPlaces?.[place]?.[idx]?.distance;
										return (
											<>
												<Input
													type="number"
													placeholder="Distance (km)"
													{...field}
												/>
												{distanceError && (
													<div className="text-xs text-red-600 mt-1">
														{distanceError.message}
													</div>
												)}
											</>
										);
									}}
								/>
								<Button
									type="button"
									variant="destructive"
									onClick={() => remove(idx)}>
									Remove
								</Button>
							</div>
						))}
						<Button
							type="button"
							onClick={() => append({ name: "", distance: 0 })}>
							Add {place.slice(0, -1)}
						</Button>
					</FormItem>
				);
			})}
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
