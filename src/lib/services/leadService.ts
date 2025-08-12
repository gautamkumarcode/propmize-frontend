import apiClient from "../api";
import { ApiResponse, Lead, LeadCreateData } from "../types/api";

export class LeadService {
	/**
	 * Create a new lead inquiry
	 */
	static async createLead(
		leadData: LeadCreateData
	): Promise<ApiResponse<Lead>> {
		const response = await apiClient.post("/leads", leadData);
		return response.data;
	}

	/**
	 * Get all leads for a seller
	 */
	static async getMyLeads(
		filters: {
			status?: "new" | "contacted" | "qualified" | "converted" | "rejected";
			page?: number;
			limit?: number;
			sortBy?: "createdAt" | "status";
			sortOrder?: "asc" | "desc";
		} = {}
	): Promise<ApiResponse<Lead[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/leads/my-leads?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get leads for a specific property (for sellers)
	 */
	static async getPropertyLeads(
		propertyId: string,
		filters: {
			status?: "new" | "contacted" | "qualified" | "converted" | "rejected";
			page?: number;
			limit?: number;
		} = {}
	): Promise<ApiResponse<Lead[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/leads/property/${propertyId}?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get buyer's inquiries
	 */
	static async getMyInquiries(
		filters: {
			status?: "pending" | "responded" | "closed";
			page?: number;
			limit?: number;
		} = {}
	): Promise<ApiResponse<Lead[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/leads/my-inquiries?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get a specific lead by ID
	 */
	static async getLead(leadId: string): Promise<ApiResponse<Lead>> {
		const response = await apiClient.get(`/leads/${leadId}`);
		return response.data;
	}

	/**
	 * Update lead status (for sellers)
	 */
	static async updateLeadStatus(
		leadId: string,
		status: "new" | "contacted" | "qualified" | "converted" | "rejected",
		notes?: string
	): Promise<ApiResponse<Lead>> {
		const response = await apiClient.put(`/leads/${leadId}/status`, {
			status,
			notes,
		});
		return response.data;
	}

	/**
	 * Add notes to a lead (for sellers)
	 */
	static async addLeadNotes(
		leadId: string,
		notes: string
	): Promise<ApiResponse<Lead>> {
		const response = await apiClient.put(`/leads/${leadId}/notes`, { notes });
		return response.data;
	}

	/**
	 * Delete a lead
	 */
	static async deleteLead(leadId: string): Promise<ApiResponse> {
		const response = await apiClient.delete(`/leads/${leadId}`);
		return response.data;
	}

	/**
	 * Get lead analytics for seller
	 */
	static async getLeadAnalytics(
		filters: {
			period?: "week" | "month" | "quarter" | "year";
			propertyId?: string;
		} = {}
	): Promise<ApiResponse> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/leads/analytics?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Export leads to CSV (for sellers)
	 */
	static async exportLeads(
		filters: {
			status?: string;
			propertyId?: string;
			startDate?: string;
			endDate?: string;
		} = {}
	): Promise<Blob> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(`/leads/export?${params.toString()}`, {
			responseType: "blob",
		});

		return response.data;
	}
}
