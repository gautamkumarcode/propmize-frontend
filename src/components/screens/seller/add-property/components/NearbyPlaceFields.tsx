"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	FormField,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface NearbyPlaceFieldsProps {
	form: UseFormReturn<PropertyFormData>;
	place: "schools" | "hospitals" | "malls" | "transport";
	distanceUnits: string[];
	isEditMode?: string | false | null;
}

export default function NearbyPlaceFields({
	form,
	place,
	distanceUnits,
	isEditMode,
}: NearbyPlaceFieldsProps) {
	const { fields, append, remove } = useFieldArray<
		PropertyFormData,
		`nearbyPlaces.${typeof place}`
	>({
		control: form.control,
		name: `nearbyPlaces.${place}`,
	});

	const placeLabels = {
		schools: "Schools",
		hospitals: "Hospitals",
		malls: "Shopping Malls",
		transport: "Transportation",
	};

	const placeIcons = {
		schools: "🏫",
		hospitals: "🏥",
		malls: "🛍️",
		transport: "🚌",
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<span className="text-2xl">{placeIcons[place]}</span>
					<FormLabel className="text-lg font-semibold text-gray-800">
						{placeLabels[place]}
					</FormLabel>
				</div>
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="font-medium border-primary text-primary hover:bg-primary hover:text-white transition-colors"
					onClick={() =>
						append({
							name: "",
							distance: "",
							unit: distanceUnits[0] as "meter" | "km",
						})
					}>
					+ Add {place.slice(0, -1)}
				</Button>
			</div>

			<div className="space-y-4">
				{fields.length === 0 && (
					<div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
						<div className="text-gray-500 text-sm mb-2">
							No {placeLabels[place].toLowerCase()} added yet
						</div>
						<div className="text-xs text-gray-400">
							Click the button above to add one
						</div>
					</div>
				)}

				{fields.map((field, idx) => (
					<div
						key={field.id}
						className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4  group">
						{/* Name Field */}
						<FormField
							control={form.control}
							name={`nearbyPlaces.${place}.${idx}.name`}
							render={({ field }) => (
								<div className="flex-1 min-w-0">
									<Input
										placeholder={`${placeLabels[place].slice(0, -1)} name`}
										className="w-full text-sm bg-white border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
										{...field}
									/>
									<FormMessage className="text-xs mt-1" />
								</div>
							)}
						/>

						{/* Distance and Unit Fields */}
						<div className="flex w-full sm:w-auto">
							{/* Distance Input */}
							<FormField
								control={form.control}
								name={`nearbyPlaces.${place}.${idx}.distance`}
								render={({ field }) => (
									<div className="flex-1">
										<Input
											type="number"
											placeholder="Distance"
											min={0}
											step={0.1}
											className="rounded-r-none border-r-0 text-sm bg-white border-gray-300 focus:z-10 hide-number-arrows"
											value={
												field.value !== undefined && field.value !== null
													? String(field.value)
													: ""
											}
											onChange={(e) =>
												field.onChange(e.target.valueAsNumber || 0)
											}
										/>
										<FormMessage className="text-xs mt-1" />
									</div>
								)}
							/>

							{/* Unit Dropdown */}
							<FormField
								control={form.control}
								name={`nearbyPlaces.${place}.${idx}.unit`}
								render={({ field }) => (
									<div className="w-24">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="outline"
													className="w-full h-12 px-3 text-sm rounded-l-none border-gray-300 bg-white hover:bg-gray-50 focus:z-10">
													<span className="truncate">
														{field.value || "km"}
													</span>
													<svg
														width="14"
														height="14"
														viewBox="0 0 16 16"
														fill="none"
														className="ml-1 flex-shrink-0">
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
											<DropdownMenuContent align="end" className="w-24">
												{distanceUnits.map((unit) => (
													<DropdownMenuItem
														key={unit}
														onSelect={() => field.onChange(unit)}
														className="text-sm">
														{unit}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
										<FormMessage className="text-xs mt-1" />
									</div>
								)}
							/>
						</div>

						{/* Remove Button */}
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="h-12 w-12 text-red-400 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 border border-red-400"
							onClick={() => remove(idx)}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}