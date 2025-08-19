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
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
}

export default function BasicDetailsStep({ form }: StepProps) {
	const propertyTypes = [
		{ value: "apartment", label: "Apartment" },
		{ value: "house", label: "House" },
		{ value: "villa", label: "Villa" },
		{ value: "plot", label: "Plot" },
		{ value: "commercial", label: "Commercial" },
		{ value: "office", label: "Office" },
	];
	const listingTypes = [
		{ value: "sale", label: "Sale" },
		{ value: "rent", label: "Rent" },
		{ value: "lease", label: "Lease" },
	];

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
						<FormControl>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-full flex justify-between">
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
						<FormLabel>Listing Type</FormLabel>
						<FormControl>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-full flex justify-between">
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
	);
}
