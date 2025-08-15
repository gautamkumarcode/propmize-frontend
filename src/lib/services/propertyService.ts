import apiClient from "../api";
import {
	ApiResponse,
	Property,
	PropertyCreateData,
	PropertyFilters,
} from "../types/api";

export class PropertyService {
	/**
	 * Get all properties with filters and pagination
	 */
	static async getProperties(
		filters: PropertyFilters = {}
	): Promise<ApiResponse<Property[]>> {
		const params = new URLSearchParams();

		// Add filters as query parameters
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (typeof value === "object" && !Array.isArray(value)) {
					// Handle nested objects like area
					Object.entries(value).forEach(([nestedKey, nestedValue]) => {
						if (nestedValue !== undefined) {
							params.append(`${key}.${nestedKey}`, String(nestedValue));
						}
					});
				} else if (Array.isArray(value)) {
					// Handle arrays
					value.forEach((item) => params.append(key, String(item)));
				} else {
					params.append(key, String(value));
				}
			}
		});

		const response = await apiClient.get(`/properties?${params.toString()}`);
		return response.data;
	}

	/**
	 * Get a single property by ID
	 */
	static async getProperty(id: string): Promise<ApiResponse<Property>> {
		const response = await apiClient.get(`/properties/${id}`);
		return response.data;
	}

	/**
	 * Create a new property
	 */
	static async createProperty(
		propertyData: PropertyCreateData
	): Promise<ApiResponse<Property>> {
		// Create FormData for file upload
		const formData = new FormData();

		// Add all property fields
		Object.entries(propertyData).forEach(([key, value]) => {
			if (key === "images" && Array.isArray(value)) {
				// Handle image files
				value.forEach((file, index) => {
					formData.append(`images`, file);
				});
			} else if (typeof value === "object") {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, String(value));
			}
		});

		const response = await apiClient.post("/properties", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	}

	/**
	 * Update a property
	 */
	static async updateProperty(
		id: string,
		updateData: Partial<PropertyCreateData>
	): Promise<ApiResponse<Property>> {
		const formData = new FormData();

		Object.entries(updateData).forEach(([key, value]) => {
			if (key === "images" && Array.isArray(value)) {
				value.forEach((file) => {
					formData.append("images", file);
				});
			} else if (typeof value === "object") {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, String(value));
			}
		});

		const response = await apiClient.put(`/properties/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	}

	/**
	 * Delete a property
	 */
	static async deleteProperty(id: string): Promise<ApiResponse<Property>> {
		const response = await apiClient.delete(`/properties/${id}`);
		return response.data;
	}

	/**
	 * Get user's properties (seller's properties)
	 */
	static async getMyProperties(
		filters: PropertyFilters = {}
	): Promise<ApiResponse<Property[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/properties/my-properties?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get featured properties
	 */
	static async getFeaturedProperties(): Promise<ApiResponse<Property[]>> {
		const response = await apiClient.get("/properties/featured");
		return response.data;
	}

	/**
	 * Get premium properties
	 */
	static async getPremiumProperties(): Promise<ApiResponse<Property[]>> {
		const response = await apiClient.get("/properties/premium");
		return response.data;
	}

	/**
	 * Get properties by location
	 */
	static async getPropertiesByLocation(
		city: string,
		state?: string
	): Promise<ApiResponse<Property[]>> {
		const params = new URLSearchParams({ city });
		if (state) params.append("state", state);

		const response = await apiClient.get(
			`/properties/location?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Search properties
	 */
	static async searchProperties(
		query: string,
		filters: PropertyFilters = {}
	): Promise<ApiResponse<Property[]>> {
		const params = new URLSearchParams({ q: query });

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/properties/search?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Like/Unlike a property
	 */
	static async toggleLike(propertyId: string): Promise<ApiResponse<Property>> {
		const response = await apiClient.post(`/properties/${propertyId}/like`);
		return response.data;
	}

	/**
	 * Get liked properties
	 */
	static async getLikedProperties(): Promise<ApiResponse<Property[]>> {
		const response = await apiClient.get("/properties/liked");
		return response.data;
	}

	/**
	 * Report a property
	 */
	static async reportProperty(
		propertyId: string,
		reason: string
	): Promise<ApiResponse<Property>> {
		const response = await apiClient.post(`/properties/${propertyId}/report`, {
			reason,
		});
		return response.data;
	}

	/**
	 * Get property analytics (for sellers)
	 */
	static async getPropertyAnalytics(propertyId: string): Promise<ApiResponse<unknown>> {
		const response = await apiClient.get(`/properties/${propertyId}/analytics`);
		return response.data;
	}
}
