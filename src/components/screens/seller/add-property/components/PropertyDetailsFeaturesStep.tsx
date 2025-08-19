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
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

const featureBooleans = [
	{ name: "powerBackup", label: "Power Backup" },
	{ name: "servantRoom", label: "Servant Room" },
	{ name: "poojaRoom", label: "Pooja Room" },
	{ name: "studyRoom", label: "Study Room" },
	{ name: "storeRoom", label: "Store Room" },
	{ name: "garden", label: "Garden" },
	{ name: "swimmingPool", label: "Swimming Pool" },
	{ name: "gym", label: "Gym" },
	{ name: "lift", label: "Lift" },
	{ name: "security", label: "Security" },
];

const featureFacings = [
	"north",
	"south",
	"east",
	"west",
	"northeast",
	"northwest",
	"southeast",
	"southwest",
];

const AMENITIES_OPTIONS = [
	"Gym",
	"Swimming Pool",
	"Lift",
	"Security",
	"Power Backup",
	"Garden",
	"Children's Play Area",
	"Club House",
	"Parking",
	"CCTV",
	"Fire Safety",
	"Intercom",
	"WiFi",
	"Community Hall",
	"Jogging Track",
	"Sports Facility",
];

type PropertyDetailsFeaturesStepProps = {
	form: UseFormReturn<PropertyFormData>;
};

export default function PropertyDetailsFeaturesStep({
	form,
}: PropertyDetailsFeaturesStepProps) {
	const amenities = form.watch("amenities") || [];

	return (
		<div className="space-y-8">
			{/* Property Details - Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
								<FormLabel className="text-sm text-muted-foreground mb-1">
									{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder={`Enter ${
											fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
										} (e.g. 2)`}
										{...field}
										value={
											typeof field.value === "object" ? "" : field.value ?? ""
										}
										className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
			</div>

			{/* Area */}
			<FormField
				control={form.control}
				name="area.value"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm text-muted-foreground mb-1">
							Area (in Sq. Ft.)
						</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="Enter area (e.g. 1200)"
								{...field}
								className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Furnished Dropdown */}
			<FormField
				control={form.control}
				name="furnished"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm text-muted-foreground mb-1">
							Furnished
						</FormLabel>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full flex justify-between items-center px-3 py-2 text-sm font-normal">
									<span>
										{field.value
											? field.value.charAt(0).toUpperCase() +
											  field.value.slice(1)
											: "Select Furnishing"}
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
							<DropdownMenuContent align="start">
								{[
									{ value: "unfurnished", label: "Unfurnished" },
									{ value: "semi-furnished", label: "Semi-Furnished" },
									{ value: "furnished", label: "Furnished" },
								].map((opt) => (
									<DropdownMenuItem
										key={opt.value}
										onSelect={() => field.onChange(opt.value)}>
										{opt.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Facing Dropdown */}
			<FormField
				control={form.control}
				name="features.facing"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm text-muted-foreground mb-1">
							Facing
						</FormLabel>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full flex justify-between items-center px-3 py-2 text-sm font-normal">
									<span>
										{field.value
											? field.value.charAt(0).toUpperCase() +
											  field.value.slice(1)
											: "Select Facing"}
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
							<DropdownMenuContent align="start">
								{featureFacings.map((opt) => (
									<DropdownMenuItem
										key={opt}
										onSelect={() => field.onChange(opt)}>
										{opt.charAt(0).toUpperCase() + opt.slice(1)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Flooring Type */}
			<FormField
				control={form.control}
				name="features.flooringType"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm text-muted-foreground mb-1">
							Flooring Type
						</FormLabel>
						<FormControl>
							<Input
								placeholder="Enter Flooring Type (e.g. Marble, Tile, Wood)"
								{...field}
								className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Water Supply */}
			<FormField
				control={form.control}
				name="features.waterSupply"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm text-muted-foreground mb-1">
							Water Supply
						</FormLabel>
						<FormControl>
							<Input
								placeholder="Enter Water Supply (e.g. Municipal, Borewell)"
								{...field}
								className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Boolean Features - Grid of Pills */}
			<div>
				<div className="text-sm font-medium text-muted-foreground mb-2">
					Other Features
				</div>
				<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
					{featureBooleans.map((feat) => (
						<FormField
							key={feat.name}
							control={form.control}
							name={`features.${feat.name}` as any}
							render={({ field }) => (
								<FormItem>
									<label className="flex items-center gap-2 cursor-pointer ">
										<input
											type="checkbox"
											checked={field.value || false}
											onChange={(e) => field.onChange(e.target.checked)}
											className="accent-blue-500 w-4 h-4"
										/>
										<span className="text-sm ">{feat.label}</span>
									</label>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</div>
			</div>

			{/* Amenities Selection */}
			<div className="">
				<h3 className="text-sm font-medium text-muted-foreground mb-2">
					Select Amenities
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
					{AMENITIES_OPTIONS.map((amenity) => (
						<label
							key={amenity}
							className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={amenities.includes(amenity)}
								onChange={(e) => {
									if (e.target.checked) {
										form.setValue("amenities", [...amenities, amenity]);
									} else {
										form.setValue(
											"amenities",
											amenities.filter((a: string) => a !== amenity)
										);
									}
								}}
								className="accent-blue-500 h-4 w-4 rounded border-gray-300"
							/>
							<span className="text-sm">{amenity}</span>
						</label>
					))}
				</div>
			</div>
		</div>
	);
}
