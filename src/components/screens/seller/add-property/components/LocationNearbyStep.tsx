"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
}

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
		.map((key) => form.getFieldState(`address.${key}` as any).error?.message)
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
					name={`address.${key}` as any}
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
				{places.map((place) => {
					const { fields, append, remove } = useFieldArray<PropertyFormData>({
						control: form.control,
						name: `nearbyPlaces.${place}` as any,
					});
					return (
						<div
							key={place}
							className="bg-white border rounded-2xl p-2 shadow-sm  ">
							<div className="flex items-center justify-between mb-5">
								<FormLabel className="text-lg font-semibold text-primary">
									{place.charAt(0).toUpperCase() + place.slice(1)}
								</FormLabel>
								<Button
									type="button"
									size="sm"
									variant="default"
									className="font-semibold"
									onClick={() => append({ name: "", distance: 0, unit: "km" })}>
									+ Add {place.slice(0, -1)}
								</Button>
							</div>
							<div className="space-y-4">
								{fields.length === 0 && (
									<div className="text-sm text-muted-foreground italic">
										No {place} added yet.
									</div>
								)}
								{fields.map((field, idx) => (
									<div
										key={field.id}
										className="w-full flex flex-col md:flex-row gap-2 items-center bg-white/80 rounded-xl   border-muted/40">
										<FormField
											control={form.control}
											name={`nearbyPlaces.${place}.${idx}.name` as any}
											render={({ field }) => (
												<>
													<Input
														placeholder="Name"
														className="min-w-[16rem] lg:w-[25rem] w-full text-sm bg-background/80 border border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition mx-0"
														{...field}
													/>
													<FormMessage />
												</>
											)}
										/>
										<div className="flex items-center  bg-background border border-input rounded-lg overflow-hidden shadow-sm">
											<FormField
												control={form.control}
												name={`nearbyPlaces.${place}.${idx}.distance` as any}
												render={({ field }) => (
													<>
														<Input
															type="number"
															placeholder="Distance"
															min={0}
															step={0.1}
															className="w-24 border-none rounded-none h-[44px] px-4 text-sm focus:ring-0 focus:border-none focus:bg-primary/5 transition"
															{...field}
														/>
														<FormMessage />
													</>
												)}
											/>
											<FormField
												control={form.control}
												name={`nearbyPlaces.${place}.${idx}.unit` as any}
												render={({ field }) => (
													<>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	className="border-none rounded-none h-[44px] px-5 text-muted-foreground font-medium flex items-center justify-between gap-2 hover:bg-primary/10 focus:bg-primary/10 transition">
																	<span className="text-sm">
																		{field.value || "Unit"}
																	</span>
																	<svg
																		width="16"
																		height="16"
																		viewBox="0 0 16 16"
																		fill="none"
																		xmlns="http://www.w3.org/2000/svg">
																		<path
																			d="M4 6L8 10L12 6"
																			stroke="currentColor"
																			strokeWidth="1.5"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		/>
																	</svg>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																{distanceUnits.map((unit) => (
																	<DropdownMenuItem
																		key={unit}
																		onSelect={() => field.onChange(unit)}>
																		{unit}
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
														<FormMessage />
													</>
												)}
											/>
										</div>
										<Button
											type="button"
											size="icon"
											variant="ghost"
											className="text-destructive hover:bg-destructive/10 w-12"
											onClick={() => remove(idx)}>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
