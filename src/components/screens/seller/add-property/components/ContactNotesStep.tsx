"use client";

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

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
}

export default function ContactNotesStep({ form }: StepProps) {
	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="contact.name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Contact Name</FormLabel>
						<FormControl>
							<Input placeholder="Owner/Agent Name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="contact.phone"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Contact Phone</FormLabel>
						<FormControl>
							<Input placeholder="Phone Number" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="contact.whatsapp"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Contact WhatsApp</FormLabel>
						<FormControl>
							<Input placeholder="WhatsApp Number (optional)" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="contact.type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Contact Type</FormLabel>
						<select {...field} className="border rounded p-2 w-full">
							<option value="owner">Owner</option>
							<option value="agent">Agent</option>
							<option value="builder">Builder</option>
						</select>
						<FormMessage />
					</FormItem>
				)}
			/>
			{/* <FormField
				control={form.control}
				name="tags"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Tags</FormLabel>
						<FormControl>
							<Input placeholder="Comma separated tags" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/> */}
			<FormField
				control={form.control}
				name="notes"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Notes</FormLabel>
						<FormControl>
							<Input placeholder="Additional notes" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
