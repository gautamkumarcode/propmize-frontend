import { SellerPropertyAnalytics } from "@/types/property";
import apiClient from "../api";
import { ApiResponse, Lead } from "../types/api";

// Analytics types
export interface SellerDashboardData {
	stats: {
		totalProperties: number;
		totalViews: number;
		totalLeads: number;
	};
	recentLeads: Lead[];
	topProperties: Array<{
		id: string;
		title: string;
		views: number;
		leads: number;
	}>;
}

export class AnalyticsService {
	/**
	 * Get dashboard analytics for seller
	 */
	static async getDashboardAnalytics(): Promise<
		ApiResponse<SellerDashboardData>
	> {
		const response = await apiClient.get(`/analytics/seller-dashboard`);
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

	/**
	 * Get detailed analytics for all properties of a seller
	 */
	static async getSellerPropertyAnalytics(
		selectedPeriod: string
	): Promise<ApiResponse<SellerPropertyAnalytics>> {
		const response = await apiClient.get(
			`/analytics/seller/properties?period=${selectedPeriod}`
		);
		return response.data;
	}
}
