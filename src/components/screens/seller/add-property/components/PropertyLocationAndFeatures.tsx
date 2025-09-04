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

interface PropertyLocationAndFeaturesProps {
	form: UseFormReturn<PropertyFormData>;
	isEditMode?: string | false | null;
}

type AddressFieldKey = `address.${keyof PropertyFormData["address"]}`;
type FeatureFieldKey = `features.${keyof PropertyFormData["features"]}`;

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

export default function PropertyLocationAndFeatures({
	form,
}: PropertyLocationAndFeaturesProps) {
	const amenities = form.watch("amenities") || [];
	const propertyType = form.watch("propertyType");

	const isResidential =
		propertyType === "apartment" ||
		propertyType === "house" ||
		propertyType === "villa";

	const isCommercial =
		propertyType === "commercial" || propertyType === "office";
	const isPlot = propertyType === "plot";

	return (
		<div className="space-y-6 bg-white rounded-xl shadow p-6 border-t-4 border-purple-500">
			{/* Address Fields */}

			{[
				{
					key: "street",
					label: "Street",
				},
				{
					key: "area",
					label: "Area",
				},
				{
					key: "city",
					label: "City",
				},
				{
					key: "state",
					label: "State",
				},
				{
					key: "zipCode",
					label: "Zip Code",
				},
				{
					key: "country",
					label: "Country",
				},
				{
					key: "landmark",
					label: "Landmark (optional)",
				},
			].map(({ key, label }) => (
				<FormField
					key={key}
					control={form.control}
					name={`address.${key}` as AddressFieldKey}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700">
								{label.includes("(optional)") ? label : `${label} `}
								<span style={{ color: "red" }}>
									{!label.includes("(optional)") ? "*" : ""}
								</span>
							</FormLabel>
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
									className="h-[40px] px-3 py-2 text-xs"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}

			{/* Facing Dropdown */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{!isPlot && (
					<FormField
						control={form.control}
						name="features.facing"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700">
									Facing
								</FormLabel>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="w-full flex justify-between items-center h-[40px] px-3 py-2 text-xs font-normal">
											<span>
												{field.value
													? field.value.charAt(0).toUpperCase() +
													  field.value.slice(1)
													: "Select Facing"}
											</span>
											<ChevronDown className="w-4 h-4 text-muted-foreground" />
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
				)}

				{/* Flooring Type & Water Supply (residential only) */}
				{isResidential && (
					<>
						<FormField
							control={form.control}
							name="features.flooringType"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-gray-700">
										Flooring Type
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter Flooring Type (e.g. Marble, Tile, Wood)"
											{...field}
											className="w-full rounded-lg border border-input bg-background h-[40px] px-3 py-2 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="features.waterSupply"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold text-gray-700">
										Water Supply
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter Water Supply (e.g. Municipal, Borewell)"
											{...field}
											className="w-full rounded-lg border border-input bg-background h-[40px] px-3 py-2 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}
			</div>

			{/* Boolean Features - Grid of Pills (all types except plot) */}
			{!isPlot && (
				<div>
					<div className="text-md font-semibold text-gray-800 mb-2">
						Other Features
					</div>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
						{featureBooleans.map((feat) => (
							<FormField
								key={feat.name}
								control={form.control}
								name={`features.${feat.name}` as FeatureFieldKey}
								render={({ field }) => (
									<FormItem>
										<label className="flex items-center gap-2 cursor-pointer  ">
											<input
												type="checkbox"
												checked={field.value || false}
												onChange={(e) => field.onChange(e.target.checked)}
												className="accent-blue-500 w-4 h-4"
											/>
											<span className="text-sm font-semibold text-gray-700">
												{feat.label}
											</span>
										</label>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</div>
				</div>
			)}

			{/* Amenities Selection (residential & commercial) */}
			{!isPlot && (
				<div className="">
					<h3 className="text-md font-semibold text-gray-800 mb-2">
						Select Amenities
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
								<span className="text-sm font-semibold text-gray-700">
									{amenity}
								</span>
							</label>
						))}
					</div>
					{form.formState.errors.amenities && (
						<div className="text-xs text-red-600 mt-2">
							{form.formState.errors.amenities.message}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
