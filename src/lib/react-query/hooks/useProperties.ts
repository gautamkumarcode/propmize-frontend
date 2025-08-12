import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PropertyService } from "../../services/propertyService";
import { useSocket } from "../../socket/mockSocketContext";
import {
	ApiResponse,
	Property,
	PropertyCreateData,
	PropertyFilters,
} from "../../types/api";
import { QueryKeys } from "../queryClient";

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
		getNextPageParam: (lastPage, pages) => {
			const { meta } = lastPage as ApiResponse<Property[]>;
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
export const useProperty = (id: string) => {
	return useQuery({
		queryKey: QueryKeys.property(id),
		queryFn: () => PropertyService.getProperty(id),
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
		queryKey: QueryKeys.searchProperties(query, filters),
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

	return useMutation({
		mutationFn: (propertyData: PropertyCreateData) =>
			PropertyService.createProperty(propertyData),
		onSuccess: (data) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: QueryKeys.properties });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myProperties });

			console.log("Property created successfully!");
		},
		onError: (error: any) => {
			console.error(
				"Failed to create property:",
				error.response?.data?.message
			);
		},
	});
};

export const useUpdateProperty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<PropertyCreateData>;
		}) => PropertyService.updateProperty(id, data),
		onSuccess: (data, variables) => {
			// Update the specific property in cache
			queryClient.setQueryData(
				QueryKeys.property(variables.id),
				(old: any) => ({ ...old, data: data.data })
			);

			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: QueryKeys.properties });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myProperties });

			console.log("Property updated successfully!");
		},
		onError: (error: any) => {
			console.error(
				"Failed to update property:",
				error.response?.data?.message
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

			console.log("Property deleted successfully!");
		},
		onError: (error: any) => {
			console.error(
				"Failed to delete property:",
				error.response?.data?.message
			);
		},
	});
};

export const useToggleLike = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (propertyId: string) => PropertyService.toggleLike(propertyId),
		onSuccess: () => {
			// Invalidate liked properties
			queryClient.invalidateQueries({ queryKey: QueryKeys.likedProperties });

			// You might also want to update the property's like count in the cache
			console.log("Property like toggled successfully!");
		},
		onError: (error: any) => {
			console.error("Failed to toggle like:", error.response?.data?.message);
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
		onError: (error: any) => {
			console.error(
				"Failed to report property:",
				error.response?.data?.message
			);
		},
	});
};

// Real-time property updates hook
export function useRealTimeProperties() {
	const { socket } = useSocket();
	const queryClient = useQueryClient();
	const [newProperty, setNewProperty] = useState<Property | null>(null);
	const [updatedProperty, setUpdatedProperty] = useState<Property | null>(null);

	useEffect(() => {
		if (!socket) return;

		const handleNewProperty = (property: Property) => {
			setNewProperty(property);

			// Invalidate all property lists to include new property
			queryClient.invalidateQueries({ queryKey: ["properties"] });
		};

		const handlePropertyUpdate = (property: Property) => {
			setUpdatedProperty(property);

			// Update specific property in cache
			queryClient.setQueryData(["property", property._id], (old: any) => {
				if (!old) return old;
				return { ...old, data: property };
			});

			// Update property in all lists
			queryClient.setQueriesData({ queryKey: ["properties"] }, (old: any) => {
				if (!old) return old;
				return {
					...old,
					data: old.data.map((p: Property) =>
						p._id === property._id ? property : p
					),
				};
			});
		};

		const handlePropertyDeleted = (propertyId: string) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: ["property", propertyId] });

			// Update all lists to remove deleted property
			queryClient.setQueriesData({ queryKey: ["properties"] }, (old: any) => {
				if (!old) return old;
				return {
					...old,
					data: old.data.filter((p: Property) => p._id !== propertyId),
				};
			});
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
