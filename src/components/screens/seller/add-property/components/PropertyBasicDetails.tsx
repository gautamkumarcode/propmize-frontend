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
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
	isEditMode?: string | false | null;
}

export default function PropertyBasicDetails({ form, isEditMode }: StepProps) {
	const propertyType = form.watch("propertyType");
	const listingType = form.watch("listingType");

	const propertyTypes = [
		{ value: "apartment", label: "Apartment" },
		{ value: "house", label: "House" },
		{ value: "villa", label: "Villa" },
		{ value: "plot", label: "Plot" },
		{ value: "commercial", label: "Commercial" },
		{ value: "office", label: "Office" },
	];
	const listingTypes = [
		{ value: "sale", label: "For Sale" },
		{ value: "rent", label: "For Rent" },
		{ value: "lease", label: "For Lease" },
	];
	const currencyOptions = [
		{ value: "INR", label: "INR" },
		{ value: "USD", label: "USD" },
		{ value: "EUR", label: "EUR" },
	];
	const areaUnits = [
		{ value: "sqft", label: "Sq. Ft." },
		{ value: "sqm", label: "Sq. M." },
		{ value: "acre", label: "Acre" },
		{ value: "hectare", label: "Hectare" },
	];
	const furnishedOptions = [
		{ value: "furnished", label: "Furnished" },
		{ value: "semi-furnished", label: "Semi-Furnished" },
		{ value: "unfurnished", label: "Unfurnished" },
	];

	const isPlot = propertyType === "plot";
	const isResidential = ["apartment", "house", "villa"].includes(propertyType);
	const isCommercial = ["commercial", "office"].includes(propertyType);

	return (
		<div className="space-y-6 bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="propertyType"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								Property Type <span style={{ color: "red" }}>*</span>
							</FormLabel>
							<FormControl>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="w-full flex justify-between h-[40px] px-3 py-2 text-sm">
											<span>
												{propertyTypes.find((pt) => pt.value === field.value)
													?.label || "Select Type"}
											</span>
											<ChevronDown className="w-4 h-4 text-muted-foreground" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-full min-w-[180px]">
										{propertyTypes.map((pt) => (
											<DropdownMenuItem
												key={pt.value}
												onSelect={() => field.onChange(pt.value)}>
												{pt.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="listingType"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								Listing Type <span style={{ color: "red" }}>*</span>
							</FormLabel>
							<FormControl>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="w-full flex justify-between h-[40px] px-3 py-2 text-sm">
											<span>
												{listingTypes.find((lt) => lt.value === field.value)
													?.label || "Select Listing"}
											</span>
											<ChevronDown className="w-4 h-4 text-muted-foreground" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-full min-w-[180px]">
										{listingTypes.map((lt) => (
											<DropdownMenuItem
												key={lt.value}
												onSelect={() => field.onChange(lt.value)}>
												{lt.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-gray-700">
							Property Title <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<FormControl>
							<Input
								placeholder="Luxury Apartment in Mumbai"
								{...field}
								className="h-[40px] px-3 py-2 text-sm"
							/>
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
						<FormLabel className="text-sm font-semibold text-gray-700">
							Description <span style={{ color: "red" }}>*</span>
						</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Describe the property..."
								{...field}
								rows={5}
								className="min-h-[100px] px-3 py-2 text-sm"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<FormField
					control={form.control}
					name="area.value"
					render={({ field: valueField }) => (
						<FormField
							control={form.control}
							name="area.unit"
							render={({ field: unitField }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-gray-700">
										Area <span style={{ color: "red" }}>*</span>
									</FormLabel>
									<div className="flex">
										<FormControl>
											<Input
												type="number"
												placeholder="e.g., 1200"
												{...valueField}
												className="h-[40px] px-3 py-2 text-sm rounded-r-none border-r-0 flex-1 hide-number-arrows focus-within:border-gray-300 focus-within:ring-0"
											/>
										</FormControl>
										<FormControl>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														className="h-[40px] px-3 py-2 text-sm rounded-l-none border-l-0 w-[120px] bg-transparent hover:bg-transparent">
														<span className="truncate">
															{areaUnits.find(
																(au) => au.value === unitField.value
															)?.label || "Unit"}
														</span>
														<ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-[120px]">
													{areaUnits.map((au) => (
														<DropdownMenuItem
															key={au.value}
															onSelect={() => unitField.onChange(au.value)}>
															{au.label}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</FormControl>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name="age"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								Property Age (Years) <span style={{ color: "red" }}>*</span>
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="e.g., 5"
									{...field}
									className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="furnished"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								Furnishing Status
							</FormLabel>
							<FormControl>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="w-full flex justify-between h-[40px] px-3 py-2 text-sm">
											<span>
												{furnishedOptions.find((fo) => fo.value === field.value)
													?.label || "Select Status"}
											</span>
											<ChevronDown className="w-4 h-4 text-muted-foreground" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-full min-w-[180px]">
										{furnishedOptions.map((fo) => (
											<DropdownMenuItem
												key={fo.value}
												onSelect={() => field.onChange(fo.value)}>
												{fo.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{!isPlot && isResidential && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						control={form.control}
						name="bedrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700">
									Bedrooms
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="e.g., 3"
										{...field}
										className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bathrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700">
									Bathrooms
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="e.g., 2"
										{...field}
										className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="balconies"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700">
									Balconies
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="e.g., 1"
										{...field}
										className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{!isPlot && (
					<FormField
						control={form.control}
						name="parking"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700">
									Parking
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="e.g., 1"
										{...field}
										className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{!isPlot && (isResidential || isCommercial) && (
					<>
						{" "}
						<FormField
							control={form.control}
							name="floor"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-gray-700">
										Floor No.
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="e.g., 3"
											{...field}
											className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="totalFloors"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-gray-700">
										Total Floors
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="e.g., 10"
											{...field}
											className="h-[40px] px-3 py-2 text-sm hide-number-arrows"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}
			</div>
		</div>
	);
}