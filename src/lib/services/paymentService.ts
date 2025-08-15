import apiClient from "../api";
import { ApiResponse, PaymentCreateData } from "../types/api";

// Additional types for payments
export interface Plan {
	id: string;
	name: string;
	description: string;
	price: number;
	duration: number; // in days
	features: string[];
	isPopular: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Payment {
	id: string;
	userId: string;
	planId: string;
	amount: number;
	currency: string;
	status: "pending" | "completed" | "failed" | "cancelled";
	paymentMethod: "razorpay" | "stripe";
	transactionId?: string;
	razorpayOrderId?: string;
	razorpayPaymentId?: string;
	razorpaySignature?: string;
	createdAt: Date;
	updatedAt: Date;
	plan?: Plan;
}

export interface PaymentIntent {
	orderId: string;
	amount: number;
	currency: string;
	key: string; // Razorpay key
}

export class PaymentService {
	/**
	 * Get all available plans
	 */
	static async getPlans(): Promise<ApiResponse<Plan[]>> {
		const response = await apiClient.get("/plans");
		return response.data;
	}

	/**
	 * Get a specific plan by ID
	 */
	static async getPlan(planId: string): Promise<ApiResponse<Plan>> {
		const response = await apiClient.get(`/plans/${planId}`);
		return response.data;
	}

	/**
	 * Create a payment intent (for Razorpay)
	 */
	static async createPaymentIntent(
		paymentData: PaymentCreateData
	): Promise<ApiResponse<PaymentIntent>> {
		const response = await apiClient.post(
			"/payments/create-intent",
			paymentData
		);
		return response.data;
	}

	/**
	 * Verify and complete payment
	 */
	static async verifyPayment(verificationData: {
		orderId: string;
		paymentId: string;
		signature: string;
	}): Promise<ApiResponse<Payment>> {
		const response = await apiClient.post("/payments/verify", verificationData);
		return response.data;
	}

	/**
	 * Get payment history for current user
	 */
	static async getPaymentHistory(
		filters: {
			status?: "pending" | "completed" | "failed" | "cancelled";
			page?: number;
			limit?: number;
			startDate?: string;
			endDate?: string;
		} = {}
	): Promise<ApiResponse<Payment[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/payments/history?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Get a specific payment by ID
	 */
	static async getPayment(paymentId: string): Promise<ApiResponse<Payment>> {
		const response = await apiClient.get(`/payments/${paymentId}`);
		return response.data;
	}

	/**
	 * Cancel a pending payment
	 */
	static async cancelPayment(paymentId: string): Promise<ApiResponse<Payment>> {
		const response = await apiClient.post(`/payments/${paymentId}/cancel`);
		return response.data;
	}

	/**
	 * Get current subscription status
	 */
	static async getSubscriptionStatus(): Promise<
		ApiResponse<{
			isActive: boolean;
			currentPlan?: Plan;
			expiresAt?: Date;
			daysRemaining?: number;
		}>
	> {
		const response = await apiClient.get("/payments/subscription-status");
		return response.data;
	}

	/**
	 * Generate invoice for a payment
	 */
	static async generateInvoice(paymentId: string): Promise<Blob> {
		const response = await apiClient.get(`/payments/${paymentId}/invoice`, {
			responseType: "blob",
		});
		return response.data;
	}

	/**
	 * Request refund for a payment
	 */
	static async requestRefund(
		paymentId: string,
		reason: string
	): Promise<ApiResponse<Payment>> {
		const response = await apiClient.post(`/payments/${paymentId}/refund`, {
			reason,
		});
		return response.data;
	}
}
