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

const priceUnits = ["Hundred", "Thousand", "Lakh", "Crore"];
const priceFields = [
	{ name: "basePrice", label: "Base Price", min: 0 },
	{ name: "maintenanceCharges", label: "Maintenance Charges", min: 0 },
	{ name: "securityDeposit", label: "Security Deposit", min: 0 },
];

export default function PricingLegalStep({ form }: StepProps) {
	return (
		<div className="space-y-6">
			{/* Pricing Fields */}
			{priceFields.map((input) => (
				<div key={input.name} className="flex flex-col gap-1">
					<FormLabel>{input.label}</FormLabel>
					<div className="flex w-full items-center bg-background border rounded-lg overflow-hidden">
						<FormField
							control={form.control}
							name={`pricing.${input.name}.value` as any}
							render={({ field }) => (
								<FormItem className="w-full m-0">
									<FormControl>
										<Input
											type="number"
											min={input.min}
											{...field}
											className="border-none rounded-none h-[40px] px-3 focus:ring-0 focus:border-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`pricing.${input.name}.unit` as any}
							render={({ field: unitField }) => (
								<FormItem className="m-0">
									<FormControl>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="border-none rounded-none h-[40px] px-4 text-muted-foreground font-medium flex items-center justify-between gap-2">
													<span>{unitField.value || "Unit"}</span>
													<ChevronDown className="w-4 h-4 text-muted-foreground" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{priceUnits.map((unit) => (
													<DropdownMenuItem
														key={unit}
														onSelect={() => unitField.onChange(unit)}>
														{unit}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>
			))}
			<div className="flex items-center gap-8">
				<FormField
					control={form.control}
					name="pricing.priceNegotiable"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2">
							<FormLabel>Price Negotiable</FormLabel>
							<input
								type="checkbox"
								checked={field.value || false}
								onChange={(e) => field.onChange(e.target.checked)}
							/>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
