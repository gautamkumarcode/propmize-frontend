// MSG91 OTP Authentication Service
export interface OTPResponse {
	message: string;
	type: "success" | "error";
	request_id?: string;
}

export class MSG91Service {
	private authKey: string;
	private baseURL = "https://api.msg91.com/api";

	constructor(authKey: string) {
		this.authKey = authKey;
	}

	async sendOTP(
		mobile: string,
		templateId: string,
		otp?: string
	): Promise<OTPResponse> {
		try {
			const url = `${this.baseURL}/v5/otp`;
			const params = new URLSearchParams({
				template_id: templateId,
				mobile: `91${mobile}`, // Adding India country code
				authkey: this.authKey,
			});

			if (otp) {
				params.append("otp", otp);
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params.toString(),
			});

			const data = await response.json();

			if (response.ok) {
				return {
					message: "OTP sent successfully",
					type: "success",
					request_id: data.request_id,
				};
			} else {
				return {
					message: data.message || "Failed to send OTP",
					type: "error",
				};
			}
		} catch (error) {
			console.error("MSG91 Send OTP Error:", error);
			return {
				message: "Network error occurred",
				type: "error",
			};
		}
	}

	async verifyOTP(
		mobile: string,
		otp: string,
		requestId?: string
	): Promise<OTPResponse> {
		try {
			const url = `${this.baseURL}/v5/otp/verify`;
			const params = new URLSearchParams({
				mobile: `91${mobile}`,
				otp,
				authkey: this.authKey,
			});

			if (requestId) {
				params.append("request_id", requestId);
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params.toString(),
			});

			const data = await response.json();

			if (response.ok && data.type === "success") {
				return {
					message: "OTP verified successfully",
					type: "success",
				};
			} else {
				return {
					message: data.message || "Invalid OTP",
					type: "error",
				};
			}
		} catch (error) {
			console.error("MSG91 Verify OTP Error:", error);
			return {
				message: "Network error occurred",
				type: "error",
			};
		}
	}

	async resendOTP(
		mobile: string,
		retryType: "text" | "voice" = "text"
	): Promise<OTPResponse> {
		try {
			const url = `${this.baseURL}/v5/otp/retry`;
			const params = new URLSearchParams({
				mobile: `91${mobile}`,
				retrytype: retryType,
				authkey: this.authKey,
			});

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params.toString(),
			});

			const data = await response.json();

			if (response.ok) {
				return {
					message: "OTP resent successfully",
					type: "success",
				};
			} else {
				return {
					message: data.message || "Failed to resend OTP",
					type: "error",
				};
			}
		} catch (error) {
			console.error("MSG91 Resend OTP Error:", error);
			return {
				message: "Network error occurred",
				type: "error",
			};
		}
	}
}
