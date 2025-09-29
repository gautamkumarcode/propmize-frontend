"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PropertyFilters } from "@/lib/types/api";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PropertySearchProps {
	onFilterChange: (filters: PropertyFilters, query?: string) => void;
	className?: string;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

export default function PropertySearch({
	onFilterChange,
	className = "",
	searchQuery,
	setSearchQuery,
}: PropertySearchProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState<PropertyFilters>({
		type: undefined,
		status: undefined,
		minPrice: undefined,
		maxPrice: undefined,
		bedrooms: undefined,
		bathrooms: undefined,
		city: undefined,
		search: undefined,
	});
	const [priceRange, setPriceRange] = useState([0, 10000000]);

	// Memoized callback to prevent infinite re-renders
	const handleFilterUpdate = useCallback(
		(updatedFilters: PropertyFilters, query: string) => {
			onFilterChange(updatedFilters, query);
		},
		[onFilterChange]
	);

	// Update filters when searchQuery changes externally
	useEffect(() => {
		setFilters((prev) => ({
			...prev,
			search: searchQuery || undefined,
		}));
	}, [searchQuery]);

	// Debounced search using useEffect
	useEffect(() => {
		const handler = setTimeout(() => {
			const filtersWithSearch = {
				...filters,
				search: searchQuery || undefined,
			};
			handleFilterUpdate(filtersWithSearch, searchQuery);
		}, 1000); // 1000ms debounce
		return () => {
			clearTimeout(handler);
		};
	}, [searchQuery, filters, handleFilterUpdate]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
	};

	// Handle filter changes
	const handleFilterChange = (key: keyof PropertyFilters, value: unknown) => {
		setFilters((prev) => {
			const processedValue = value === "any" ? undefined : value;
			return { ...prev, [key]: processedValue };
		});
	};

	// Handle price range change
	const handlePriceRangeChange = (values: number[]) => {
		setPriceRange(values);
		setFilters((prev) => ({
			...prev,
			minPrice: values[0] === 0 ? undefined : values[0],
			maxPrice: values[1] === 10000000 ? undefined : values[1],
		}));
	};

	// Apply filters immediately
	const applyFilters = () => {
		const filtersWithSearch = {
			...filters,
			search: searchQuery || undefined,
		};
		handleFilterUpdate(filtersWithSearch, searchQuery);
	};

	// Reset filters
	const resetFilters = () => {
		const resetFiltersState = {
			type: undefined,
			status: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			bedrooms: undefined,
			bathrooms: undefined,
			city: undefined,
			search: undefined,
		};
		setFilters(resetFiltersState);
		setSearchQuery("");
		setPriceRange([0, 10000000]);
		handleFilterUpdate(resetFiltersState, "");
	};

	// Format price for display
	const formatPrice = (price: number) => {
		if (price >= 10000000) {
			return `₹${(price / 10000000).toFixed(2)} Cr`;
		} else if (price >= 100000) {
			return `₹${(price / 100000).toFixed(2)} L`;
		} else if (price >= 1000) {
			return `₹${(price / 1000).toFixed(0)}K`;
		} else {
			return `₹${price}`;
		}
	};

	// Get active filters for display (exclude search from badges)
	const getActiveFilters = () => {
		const { search, ...otherFilters } = filters;
		return Object.entries(otherFilters).filter(
			([key, value]) => value !== undefined
		);
	};

	return (
		<div className={`w-full mb-8 ${className}`}>
			{/* Search Bar */}
			<div className="flex flex-col md:flex-row gap-4 mb-4">
				<div className="relative flex-1">
					<Input
						type="text"
						placeholder="Search by location, property name..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="pl-10 h-12 rounded-lg border-slate-300 focus:border-blue-500"
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						variant="outline"
						className="h-12 px-4 flex items-center gap-2">
						<SlidersHorizontal className="h-4 w-4" />
						Filters
					</Button>
					<Button onClick={applyFilters} className="h-12 px-6">
						Search
					</Button>
				</div>
			</div>

			{/* Filters Panel */}
			{isFilterOpen && (
				<div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 mb-6 animate-in fade-in-50 slide-in-from-top-5 duration-300">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-semibold">Filter Properties</h3>
						<Button
							variant="ghost"
							size="sm"
							onClick={resetFilters}
							className="text-slate-500 hover:text-slate-700">
							Reset All
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* Property Type */}
						<div className="space-y-2">
							<Label htmlFor="type">Property Type</Label>
							<Select
								value={filters.type || "any"}
								onValueChange={(value) => handleFilterChange("type", value)}>
								<SelectTrigger id="type">
									<SelectValue placeholder="Any type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any type</SelectItem>
									<SelectItem value="residential">Residential</SelectItem>
									<SelectItem value="commercial">Commercial</SelectItem>
									<SelectItem value="land">Land</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Property Status */}
						<div className="space-y-2">
							<Label htmlFor="status">For</Label>
							<Select
								value={filters.status || "any"}
								onValueChange={(value) => handleFilterChange("status", value)}>
								<SelectTrigger id="status">
									<SelectValue placeholder="Sale or Rent" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any</SelectItem>
									<SelectItem value="sale">Sale</SelectItem>
									<SelectItem value="rent">Rent</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Bedrooms */}
						<div className="space-y-2">
							<Label htmlFor="bedrooms">Bedrooms</Label>
							<Select
								value={filters.bedrooms?.toString() || "any"}
								onValueChange={(value) =>
									handleFilterChange(
										"bedrooms",
										value !== "any" ? parseInt(value) : undefined
									)
								}>
								<SelectTrigger id="bedrooms">
									<SelectValue placeholder="Any" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any</SelectItem>
									<SelectItem value="1">1+</SelectItem>
									<SelectItem value="2">2+</SelectItem>
									<SelectItem value="3">3+</SelectItem>
									<SelectItem value="4">4+</SelectItem>
									<SelectItem value="5">5+</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Bathrooms */}
						<div className="space-y-2">
							<Label htmlFor="bathrooms">Bathrooms</Label>
							<Select
								value={filters.bathrooms?.toString() || "any"}
								onValueChange={(value) =>
									handleFilterChange(
										"bathrooms",
										value !== "any" ? parseInt(value) : undefined
									)
								}>
								<SelectTrigger id="bathrooms">
									<SelectValue placeholder="Any" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any</SelectItem>
									<SelectItem value="1">1+</SelectItem>
									<SelectItem value="2">2+</SelectItem>
									<SelectItem value="3">3+</SelectItem>
									<SelectItem value="4">4+</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* City */}
						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							<Input
								id="city"
								placeholder="Enter city"
								value={filters.city || ""}
								onChange={(e) =>
									handleFilterChange("city", e.target.value || undefined)
								}
							/>
						</div>

						{/* Price Range */}
						<div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
							<div className="flex justify-between">
								<Label>Price Range</Label>
								<span className="text-sm text-slate-500">
									{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
								</span>
							</div>
							<Slider
								defaultValue={[0, 10000000]}
								value={priceRange}
								min={0}
								max={10000000}
								step={100000}
								onValueChange={handlePriceRangeChange}
								className="py-4"
							/>
						</div>
					</div>

					{/* Active Filters */}
					<div className="mt-6 flex flex-wrap gap-2">
						{/* Show search query as a badge if it exists */}
						{searchQuery && (
							<Badge
								variant="secondary"
								className="px-3 py-1.5 flex items-center gap-1.5">
								<span>Search: {searchQuery}</span>
								<X
									className="h-3.5 w-3.5 cursor-pointer"
									onClick={() => setSearchQuery("")}
								/>
							</Badge>
						)}
						{/* Show other active filters */}
						{getActiveFilters().map(([key, value]) => (
							<Badge
								key={key}
								variant="secondary"
								className="px-3 py-1.5 flex items-center gap-1.5">
								<span>
									{key === "minPrice"
										? `Min: ${formatPrice(value as number)}`
										: key === "maxPrice"
										? `Max: ${formatPrice(value as number)}`
										: key === "type"
										? `Type: ${value}`
										: key === "status"
										? `For: ${value}`
										: key === "bedrooms"
										? `${value}+ Beds`
										: key === "bathrooms"
										? `${value}+ Baths`
										: key === "city"
										? `City: ${value}`
										: `${key}: ${value}`}
								</span>
								<X
									className="h-3.5 w-3.5 cursor-pointer"
									onClick={() =>
										handleFilterChange(key as keyof PropertyFilters, undefined)
									}
								/>
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}