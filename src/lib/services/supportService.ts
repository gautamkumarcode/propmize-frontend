import apiClient from "../api";
import { ApiResponse } from "../types/api";

// Support types
export interface SupportTicket {
	id: string;
	userId: string;
	subject: string;
	message: string;
	category:
		| "technical"
		| "billing"
		| "general"
		| "feature-request"
		| "bug-report";
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in-progress" | "resolved" | "closed";
	assignedTo?: string;
	attachments: Array<{
		id: string;
		filename: string;
		url: string;
		size: number;
	}>;
	responses: SupportResponse[];
	createdAt: Date;
	updatedAt: Date;
}

export interface SupportResponse {
	id: string;
	ticketId: string;
	senderId: string;
	senderType: "user" | "admin";
	message: string;
	attachments?: Array<{
		filename: string;
		url: string;
	}>;
	createdAt: Date;
}

export interface CreateTicketData {
	subject: string;
	message: string;
	category:
		| "technical"
		| "billing"
		| "general"
		| "feature-request"
		| "bug-report";
	priority: "low" | "medium" | "high" | "urgent";
	attachments?: File[];
}

export interface FAQ {
	id: string;
	question: string;
	answer: string;
	category: string;
	tags: string[];
	isPopular: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export class SupportService {
	/**
	 * Create a new support ticket
	 */
	static async createTicket(
		ticketData: CreateTicketData
	): Promise<ApiResponse<SupportTicket>> {
		const formData = new FormData();

		// Add ticket fields
		formData.append("subject", ticketData.subject);
		formData.append("message", ticketData.message);
		formData.append("category", ticketData.category);
		formData.append("priority", ticketData.priority);

		// Add attachments if any
		if (ticketData.attachments?.length) {
			ticketData.attachments.forEach((file, index) => {
				formData.append("attachments", file);
			});
		}

		const response = await apiClient.post("/support/tickets", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	}

	/**
	 * Get user's support tickets
	 */
	static async getMyTickets(
		filters: {
			status?: "open" | "in-progress" | "resolved" | "closed";
			category?: string;
			page?: number;
			limit?: number;
		} = {}
	): Promise<ApiResponse<SupportTicket[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/support/tickets/my-tickets?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get a specific ticket by ID
	 */
	static async getTicket(
		ticketId: string
	): Promise<ApiResponse<SupportTicket>> {
		const response = await apiClient.get(`/support/tickets/${ticketId}`);
		return response.data;
	}

	/**
	 * Add response to a ticket
	 */
	static async addTicketResponse(
		ticketId: string,
		message: string,
		attachments?: File[]
	): Promise<ApiResponse<SupportResponse>> {
		const formData = new FormData();
		formData.append("message", message);

		if (attachments?.length) {
			attachments.forEach((file) => {
				formData.append("attachments", file);
			});
		}

		const response = await apiClient.post(
			`/support/tickets/${ticketId}/responses`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	}

	/**
	 * Close a ticket
	 */
	static async closeTicket(ticketId: string): Promise<ApiResponse> {
		const response = await apiClient.put(`/support/tickets/${ticketId}/close`);
		return response.data;
	}

	/**
	 * Reopen a closed ticket
	 */
	static async reopenTicket(ticketId: string): Promise<ApiResponse> {
		const response = await apiClient.put(`/support/tickets/${ticketId}/reopen`);
		return response.data;
	}

	/**
	 * Rate support ticket resolution
	 */
	static async rateTicket(
		ticketId: string,
		rating: number,
		feedback?: string
	): Promise<ApiResponse> {
		const response = await apiClient.post(`/support/tickets/${ticketId}/rate`, {
			rating,
			feedback,
		});
		return response.data;
	}

	/**
	 * Get FAQ items
	 */
	static async getFAQs(
		filters: {
			category?: string;
			search?: string;
			popular?: boolean;
		} = {}
	): Promise<ApiResponse<FAQ[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(`/support/faqs?${params.toString()}`);
		return response.data;
	}

	/**
	 * Search FAQ items
	 */
	static async searchFAQs(query: string): Promise<ApiResponse<FAQ[]>> {
		const response = await apiClient.get(
			`/support/faqs/search?q=${encodeURIComponent(query)}`
		);
		return response.data;
	}

	/**
	 * Get FAQ categories
	 */
	static async getFAQCategories(): Promise<
		ApiResponse<
			Array<{
				category: string;
				count: number;
			}>
		>
	> {
		const response = await apiClient.get("/support/faqs/categories");
		return response.data;
	}

	/**
	 * Submit general contact form
	 */
	static async submitContactForm(formData: {
		name: string;
		email: string;
		subject: string;
		message: string;
		type: "inquiry" | "feedback" | "partnership" | "other";
	}): Promise<ApiResponse> {
		const response = await apiClient.post("/support/contact", formData);
		return response.data;
	}

	/**
	 * Get support statistics (for user dashboard)
	 */
	static async getSupportStats(): Promise<
		ApiResponse<{
			totalTickets: number;
			openTickets: number;
			averageResponseTime: number;
			satisfactionRating: number;
		}>
	> {
		const response = await apiClient.get("/support/stats");
		return response.data;
	}
}
