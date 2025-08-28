// Razorpay Payment Integration
interface RazorpayOptions {
	key: string;
	amount: number;
	currency: string;
	name: string;
	description: string;
	order_id: string;
	handler: (response: unknown) => void;
	prefill?: {
		name?: string;
		email?: string;
		contact?: string;
	};
	theme?: {
		color?: string;
	};
}

declare global {
	interface Window {
		Razorpay: {
			new (options: RazorpayOptions): {
				open(): void;
				on(eventName: string, callback: (response: unknown) => void): void;
				close(): void;
			};
		};
	}
}

export class RazorpayService {
	private keyId: string;

	constructor(keyId: string) {
		this.keyId = keyId;
	}

	loadRazorpayScript(): Promise<boolean> {
		return new Promise((resolve) => {
			if (window.Razorpay) {
				resolve(true);
				return;
			}

			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	}

	async createOrder(amount: number, currency: string = "INR"): Promise<string> {
		try {
			const response = await fetch("/api/payments/create-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: amount * 100, // Convert to paisa
					currency,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create order");
			}

			return await response.json();
		} catch (error) {
			console.error("Error creating Razorpay order:", error);
			throw error;
		}
	}

	async processPayment(options: Omit<RazorpayOptions, "key">): Promise<void> {
		const isLoaded = await this.loadRazorpayScript();

		if (!isLoaded) {
			throw new Error("Failed to load Razorpay script");
		}

		const razorpayOptions: RazorpayOptions = {
			...options,
			key: this.keyId,
		};

		const razorpay = new window.Razorpay(razorpayOptions);
		razorpay.open();
	}

	async verifyPayment(
		orderId: string,
		paymentId: string,
		signature: string
	): Promise<boolean> {
		try {
			const response = await fetch("/api/payments/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					order_id: orderId,
					payment_id: paymentId,
					signature,
				}),
			});

			if (!response.ok) {
				throw new Error("Payment verification failed");
			}

			const result = await response.json();
			return result.verified;
		} catch (error) {
			console.error("Error verifying payment:", error);
			throw error;
		}
	}
}
