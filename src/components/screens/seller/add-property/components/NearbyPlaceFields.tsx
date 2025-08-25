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
import {
	FieldPath,
	UseFormReturn,
	useFieldArray,
} from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface NearbyPlaceFieldsProps {
	form: UseFormReturn<PropertyFormData>;
	place: "schools" | "hospitals" | "malls" | "transport"; // Explicitly define allowed literal strings
	distanceUnits: string[];
}

interface NearbyPlaceItem {
	name: string;
	distance: string;
	unit: "meter" | "km";
}

export default function NearbyPlaceFields({
	form,
	place,
	distanceUnits,
}: NearbyPlaceFieldsProps) {
	const { fields, append, remove } = useFieldArray<PropertyFormData, `nearbyPlaces.${typeof place}`>({
		control: form.control,
		name: `nearbyPlaces.${place}`,
	});

	return (
		<div className="bg-white border rounded-2xl p-2 shadow-sm  ">
			<div className="flex items-center justify-between mb-5">
				<FormLabel className="text-lg font-semibold text-primary">
					{place.charAt(0).toUpperCase() + place.slice(1)}
				</FormLabel>
				<Button
					type="button"
					size="sm"
					variant="default"
					className="font-semibold"
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
							name={`nearbyPlaces.${place}.${idx}.name`}
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
								name={`nearbyPlaces.${place}.${idx}.distance`}
								render={({ field }) => (
									<>
										<Input
											type="number"
											placeholder="Distance"
											min={0}
											step={0.1}
											className="w-24 border-none rounded-none h-[44px] px-4 text-sm focus:ring-0 focus:border-none focus:bg-primary/5 transition"
											// Ensure value is a string for uncontrolled component
											value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										<FormMessage />
									</>
								)}
							/>
							<FormField
								control={form.control}
								name={`nearbyPlaces.${place}.${idx}.unit`}
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
}
