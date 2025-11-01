"use client";

import { PropertyFormData } from "@/components/screens/seller/add-property/validation/propertySchema";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PropertyService } from "../../services/propertyService";
import { useSocket } from "../../socket/socketContext";
import {
	ApiResponse,
	PropertyFilters,
	PropertyResponse,
} from "../../types/api";

import { triggerToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import { QueryKeys } from "../queryClient";

// Define proper error interface for HTTP errors
interface HttpError {
	response?: {
		status: number;
		data?: {
			message?: string;
			error?: string;
		};
	};
	message?: string;
}

// Type guard to check if error is an HttpError
export function isHttpError(error: unknown): error is HttpError {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as HttpError).response?.status === "number"
	);
}

// Get all properties with filters
export const useProperties = (filters: PropertyFilters = {}) => {
	return useQuery({
		queryKey: ["properties", filters],
		queryFn: () => PropertyService.getProperties(filters),
		select: (data) => data.data,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
};

// Infinite scroll for properties
export const useInfiniteProperties = (filters: PropertyFilters = {}) => {
	return useInfiniteQuery({
		queryKey: ["properties", "infinite", filters],
		queryFn: ({ pageParam = 1 }) =>
			PropertyService.getProperties({ ...filters, page: pageParam }),
		getNextPageParam: (lastPage, _pages) => {
			const { meta } = lastPage as ApiResponse<PropertyResponse[]>;
			if (meta && meta.page && meta.totalPages && meta.page < meta.totalPages) {
				return meta.page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
		select: (data) => ({
			pages: data.pages.map((page) => page.data),
			pageParams: data.pageParams,
		}),
	});
};

// Get single property
export const useProperty = (id: string | null) => {
	return useQuery({
		queryKey: QueryKeys.property(id!),
		queryFn: () => PropertyService.getProperty(id!),
		select: (data) => data.data,
		enabled: !!id,
	});
};

// Get user's properties (seller)
export const useMyProperties = (filters: PropertyFilters = {}) => {
	return useQuery({
		queryKey: [QueryKeys.myProperties, filters],
		queryFn: () => PropertyService.getMyProperties(filters),
		select: (data) => data.data,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
	});
};

// Get featured properties
export const useFeaturedProperties = () => {
	return useQuery({
		queryKey: QueryKeys.featuredProperties,
		queryFn: () => PropertyService.getFeaturedProperties(),
		select: (data) => data.data,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get premium properties
export const usePremiumProperties = () => {
	return useQuery({
		queryKey: QueryKeys.premiumProperties,
		queryFn: () => PropertyService.getPremiumProperties(),
		select: (data) => data.data,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get liked properties
export const useLikedProperties = () => {
	return useQuery({
		queryKey: QueryKeys.likedProperties,
		queryFn: () => PropertyService.getLikedProperties(),
		select: (data) => data.data,
	});
};

// Get properties by location
export const usePropertiesByLocation = (city: string, state?: string) => {
	return useQuery({
		queryKey: QueryKeys.propertiesByLocation(city, state),
		queryFn: () => PropertyService.getPropertiesByLocation(city, state),
		select: (data) => data.data,
		enabled: !!city,
	});
};

// Search properties
export const useSearchProperties = (
	query: string,
	filters: PropertyFilters = {}
) => {
	return useQuery({
		queryKey: QueryKeys.searchProperties(
			query,
			filters as Record<string, unknown>
		),
		queryFn: () => PropertyService.searchProperties(query, filters),
		select: (data) => data.data,
		enabled: !!query,
	});
};

// Property analytics
export const usePropertyAnalytics = (propertyId: string) => {
	return useQuery({
		queryKey: QueryKeys.propertyAnalytics(propertyId),
		queryFn: () => PropertyService.getPropertyAnalytics(propertyId),
		select: (data) => data.data,
		enabled: !!propertyId,
	});
};

// Mutations
export const useCreateProperty = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation<
		ApiResponse<PropertyResponse>,
		HttpError,
		PropertyFormData
	>({
		mutationFn: (propertyData: PropertyFormData) =>
			PropertyService.createProperty(propertyData),
		onSuccess: (data) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: QueryKeys.properties });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myProperties });
			router.push("/seller/my-property");
			triggerToast({
				title: "Success!",
				description: data.message || "Property added successfully!",
				variant: "success",
			});
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to create property:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useUpdateProperty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PropertyFormData }) => {
			// Transform area to match PropertyCreateData
			const { area, features, ...rest } = data;
			const transformedArea =
				area && typeof area.value === "string"
					? {
							value: area.value,
							unit:
								area.unit === "sqm" ||
								area.unit === "hectare" ||
								area.unit === "sqft" ||
								area.unit === "acre"
									? area.unit
									: "sqft",
					  }
					: undefined;

			// Do not transform features; pass as original object
			const updateData = {
				...rest,
				...(transformedArea ? { area: transformedArea } : {}),
				...(features ? { features } : {}),
				...(rest.price !== undefined
					? {
							price: typeof rest.price === "string" ? rest.price : rest.price,
					  }
					: {}),
			};
			return PropertyService.updateProperty(id, updateData);
		},
		onSuccess: (data, variables) => {
			// Update the specific property in cache
			queryClient.setQueryData(
				QueryKeys.property(variables.id),
				(old: ApiResponse<PropertyResponse> | undefined) =>
					old ? { ...old, data: data.data } : data
			);

			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: QueryKeys.properties });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myProperties });

		},
		onError: (error: unknown) => {
			console.error(
				"Failed to update property:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useDeleteProperty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (propertyId: string) =>
			PropertyService.deleteProperty(propertyId),
		onSuccess: (_, propertyId) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: QueryKeys.property(propertyId) });

			// Invalidate lists
			queryClient.invalidateQueries({ queryKey: QueryKeys.properties });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myProperties });
			triggerToast({
				title: "Success!",
				description: "Property deleted successfully!",
				variant: "success",
			});
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to delete property:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useToggleLike = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (propertyId: string) => PropertyService.toggleLike(propertyId),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.likedProperties });
			queryClient.invalidateQueries({
				queryKey: QueryKeys.properties,
			});
			triggerToast({
				title: "Success!",
				description: data.message,
				variant: "success",
			});
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to toggle like:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useReportProperty = () => {
	return useMutation({
		mutationFn: ({
			propertyId,
			reason,
		}: {
			propertyId: string;
			reason: string;
		}) => PropertyService.reportProperty(propertyId, reason),
		onSuccess: () => {
			console.log("Property reported successfully!");
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to report property:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

// Real-time property updates hook
export function useRealTimeProperties() {
	const { socket } = useSocket();
	const queryClient = useQueryClient();
	const [newProperty, setNewProperty] = useState<PropertyResponse | null>(null);
	const [updatedProperty, setUpdatedProperty] =
		useState<PropertyResponse | null>(null);

	useEffect(() => {
		if (!socket) return;

		const handleNewProperty = (property: PropertyResponse) => {
			setNewProperty(property);

			// Invalidate all property lists to include new property
			queryClient.invalidateQueries({ queryKey: ["properties"] });
		};

		const handlePropertyUpdate = (property: PropertyResponse) => {
			setUpdatedProperty(property);

			// Update specific property in cache
			queryClient.setQueryData(
				["property", property._id],
				(old: ApiResponse<PropertyResponse> | undefined) => {
					if (!old) return old;
					return { ...old, data: property };
				}
			);

			// Update property in all lists
			queryClient.setQueriesData(
				{ queryKey: ["properties"] },
				(old: ApiResponse<PropertyResponse[]> | undefined) => {
					if (!old) return old;
					return {
						...old,
						data: old.data.map((p: PropertyResponse) =>
							p._id === property._id ? property : p
						),
					};
				}
			);
		};

		const handlePropertyDeleted = (propertyId: string) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: ["property", propertyId] });

			// Update all lists to remove deleted property
			queryClient.setQueriesData(
				{ queryKey: ["properties"] },
				(old: ApiResponse<PropertyResponse[]> | undefined) => {
					if (!old) return old;
					return {
						...old,
						data: old.data.filter(
							(p: PropertyResponse) => p._id !== propertyId
						),
					};
				}
			);
		};

		socket.on("property:created", handleNewProperty);
		socket.on("property:updated", handlePropertyUpdate);
		socket.on("property:deleted", handlePropertyDeleted);

		return () => {
			socket.off("property:created", handleNewProperty);
			socket.off("property:updated", handlePropertyUpdate);
			socket.off("property:deleted", handlePropertyDeleted);
		};
	}, [socket, queryClient]);

	return { newProperty, updatedProperty };
}

export function useRecentlyViewedProperties() {
	return useQuery({
		queryKey: QueryKeys.recentlyViewedProperties,
		queryFn: PropertyService.getRecentlyViewedProperties,
	});
}

export function useNewlyAddedProperties() {
	return useQuery({
		queryKey: QueryKeys.newlyAddedProperties,
		queryFn: PropertyService.getNewlyAddedProperties,
		select: (data) => data.data,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
}
