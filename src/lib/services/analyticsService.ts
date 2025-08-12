import apiClient from "../api";
import { ApiResponse } from "../types/api";

// Analytics types
export interface AnalyticsData {
	properties: {
		total: number;
		active: number;
		sold: number;
		views: number;
		inquiries: number;
	};
	leads: {
		total: number;
		new: number;
		qualified: number;
		converted: number;
		conversionRate: number;
	};
	revenue: {
		total: number;
		thisMonth: number;
		lastMonth: number;
		growth: number;
	};
	traffic: {
		views: number;
		uniqueVisitors: number;
		topProperties: Array<{
			id: string;
			title: string;
			views: number;
		}>;
	};
	timeline: Array<{
		date: string;
		views: number;
		inquiries: number;
		conversions: number;
	}>;
}

export class AnalyticsService {
	/**
	 * Get dashboard analytics for seller
	 */
	static async getDashboardAnalytics(
		filters: {
			period?: "week" | "month" | "quarter" | "year";
			propertyIds?: string[];
		} = {}
	): Promise<ApiResponse<AnalyticsData>> {
		const params = new URLSearchParams();

		if (filters.period) params.append("period", filters.period);
		if (filters.propertyIds?.length) {
			filters.propertyIds.forEach((id) => params.append("propertyIds", id));
		}

		const response = await apiClient.get(
			`/analytics/dashboard?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get property-specific analytics
	 */
	static async getPropertyAnalytics(
		propertyId: string,
		period: "week" | "month" | "quarter" | "year" = "month"
	): Promise<
		ApiResponse<{
			views: number;
			uniqueViews: number;
			inquiries: number;
			likes: number;
			timeline: Array<{
				date: string;
				views: number;
				inquiries: number;
			}>;
			demographics: {
				locations: Array<{ city: string; count: number }>;
				interests: Array<{ category: string; count: number }>;
			};
		}>
	> {
		const response = await apiClient.get(
			`/analytics/properties/${propertyId}?period=${period}`
		);
		return response.data;
	}

	/**
	 * Get lead analytics
	 */
	static async getLeadAnalytics(
		filters: {
			period?: "week" | "month" | "quarter" | "year";
			propertyId?: string;
		} = {}
	): Promise<
		ApiResponse<{
			total: number;
			byStatus: Record<string, number>;
			conversionRate: number;
			averageResponseTime: number;
			timeline: Array<{
				date: string;
				leads: number;
				conversions: number;
			}>;
		}>
	> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/analytics/leads?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Export analytics report
	 */
	static async exportAnalyticsReport(filters: {
		type: "properties" | "leads" | "revenue";
		format: "csv" | "pdf";
		period?: "week" | "month" | "quarter" | "year";
		startDate?: string;
		endDate?: string;
	}): Promise<Blob> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/analytics/export?${params.toString()}`,
			{
				responseType: "blob",
			}
		);

		return response.data;
	}
}
