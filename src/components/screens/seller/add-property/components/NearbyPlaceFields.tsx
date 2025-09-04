"use client";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
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
}: NearbyPlaceFieldsProps) {
	const { fields, append, remove } = useFieldArray<
		PropertyFormData,
		`nearbyPlaces.${typeof place}`
	>({
		control: form.control,
		name: `nearbyPlaces.${place}`,
	});

	const [adding, setAdding] = useState(false);
	const [newName, setNewName] = useState("");
	const [newDistance, setNewDistance] = useState("");
	const [newUnit, setNewUnit] = useState(distanceUnits[0]);

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

	const handleAdd = () => {
		if (!newName || !newDistance) return;
		append({
			name: newName,
			distance: newDistance,
			unit: newUnit as "meter" | "km",
		});
		setNewName("");
		setNewDistance("");
		setNewUnit(distanceUnits[0]);
		setAdding(false);
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<span className="text-lg">{placeIcons[place]}</span>
					<FormLabel className="text-lg font-semibold text-gray-800">
						{placeLabels[place]}
					</FormLabel>
				</div>
				{!adding && (
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="flex items-center gap-1 text-primary border-primary hover:bg-primary hover:text-white"
						onClick={() => setAdding(true)}>
						<Plus className="w-4 h-4" />
						Add {placeLabels[place].slice(0, -1)}
					</Button>
				)}
			</div>

			{/* Chipset */}
			<div className="flex flex-wrap gap-2 mb-4">
				{fields.length === 0 && (
					<span className="text-sm text-gray-500">
						No {placeLabels[place].toLowerCase()} added yet
					</span>
				)}

				{fields.map((field, idx) => (
					<div
						key={field.id}
						className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm">
						<span>
							{form.getValues(`nearbyPlaces.${place}.${idx}.name`)} •{" "}
							{form.getValues(`nearbyPlaces.${place}.${idx}.distance`)}{" "}
							{form.getValues(`nearbyPlaces.${place}.${idx}.unit`)}
						</span>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							className="h-6 px-2 text-xs text-red-600 hover:bg-red-100 rounded-full"
							onClick={() => remove(idx)}>
							Remove
						</Button>
					</div>
				))}
			</div>

			{/* Add New Chip */}
			{/* Add New Chip */}
			{adding && (
				<div className="flex flex-wrap gap-3 items-center">
					{/* Name Input */}
					<Input
						placeholder="Name"
						className="flex-1 min-w-[20rem] text-sm lg:w-[25rem]"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
					/>

					{/* Distance Input */}
					<div className="flex items-center">
						<Input
							placeholder="Distance"
							type="number"
							className="w-[7rem] text-sm hide-number-arrows rounded-l-lg rounded-r-none border-r-none"
							value={newDistance}
							onChange={(e) => setNewDistance(e.target.value)}
						/>

						{/* Unit Select */}
						<select
							className="border rounded-r-lg px-2 py-2 text-sm h-12 rounded-l-none bg-white text-gray-700 "
							value={newUnit}
							onChange={(e) => setNewUnit(e.target.value)}>
							{distanceUnits.map((unit) => (
								<option key={unit} value={unit}>
									{unit}
								</option>
							))}
						</select>
					</div>

					{/* Action Buttons */}
					<Button
						type="button"
						size="sm"
						onClick={handleAdd}
						className="bg-primary text-white w-[80px] hover:bg-primary/90 h-12">
						Add
					</Button>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={() => setAdding(false)}>
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
}
