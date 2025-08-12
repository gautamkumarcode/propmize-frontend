// Zoho Integration Services (CRM & Books)
interface ZohoTokenResponse {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
}

interface ZohoContact {
	id?: string;
	First_Name: string;
	Last_Name: string;
	Email: string;
	Phone: string;
	Lead_Source?: string;
	Description?: string;
}

interface ZohoLead {
	id?: string;
	First_Name: string;
	Last_Name: string;
	Email: string;
	Phone: string;
	Company: string;
	Lead_Source: string;
	Lead_Status: string;
	Description?: string;
}

interface ZohoInvoice {
	customer_id: string;
	invoice_number?: string;
	date: string;
	due_date: string;
	line_items: Array<{
		item_id?: string;
		name: string;
		description?: string;
		rate: number;
		quantity: number;
		tax_id?: string;
	}>;
	notes?: string;
	terms?: string;
}

export class ZohoCRMService {
	private clientId: string;
	private clientSecret: string;
	private accessToken: string | null = null;
	private baseURL = "https://www.zohoapis.in/crm/v2";

	constructor(clientId: string, clientSecret: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
	}

	async getAccessToken(
		authCode: string,
		redirectUri: string
	): Promise<ZohoTokenResponse> {
		try {
			const response = await fetch("https://accounts.zoho.in/oauth/v2/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "authorization_code",
					client_id: this.clientId,
					client_secret: this.clientSecret,
					code: authCode,
					redirect_uri: redirectUri,
				}).toString(),
			});

			if (!response.ok) {
				throw new Error("Failed to get access token");
			}

			const tokenData: ZohoTokenResponse = await response.json();
			this.accessToken = tokenData.access_token;
			return tokenData;
		} catch (error) {
			console.error("Zoho CRM Auth Error:", error);
			throw error;
		}
	}

	async refreshAccessToken(refreshToken: string): Promise<ZohoTokenResponse> {
		try {
			const response = await fetch("https://accounts.zoho.in/oauth/v2/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "refresh_token",
					client_id: this.clientId,
					client_secret: this.clientSecret,
					refresh_token: refreshToken,
				}).toString(),
			});

			if (!response.ok) {
				throw new Error("Failed to refresh access token");
			}

			const tokenData: ZohoTokenResponse = await response.json();
			this.accessToken = tokenData.access_token;
			return tokenData;
		} catch (error) {
			console.error("Zoho CRM Token Refresh Error:", error);
			throw error;
		}
	}

	async createLead(leadData: ZohoLead): Promise<any> {
		if (!this.accessToken) {
			throw new Error("Access token not available");
		}

		try {
			const response = await fetch(`${this.baseURL}/Leads`, {
				method: "POST",
				headers: {
					Authorization: `Zoho-oauthtoken ${this.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					data: [leadData],
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create lead");
			}

			return await response.json();
		} catch (error) {
			console.error("Zoho CRM Create Lead Error:", error);
			throw error;
		}
	}

	async updateLead(
		leadId: string,
		updateData: Partial<ZohoLead>
	): Promise<any> {
		if (!this.accessToken) {
			throw new Error("Access token not available");
		}

		try {
			const response = await fetch(`${this.baseURL}/Leads/${leadId}`, {
				method: "PUT",
				headers: {
					Authorization: `Zoho-oauthtoken ${this.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					data: [updateData],
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update lead");
			}

			return await response.json();
		} catch (error) {
			console.error("Zoho CRM Update Lead Error:", error);
			throw error;
		}
	}

	async getLeads(page: number = 1, perPage: number = 20): Promise<any> {
		if (!this.accessToken) {
			throw new Error("Access token not available");
		}

		try {
			const response = await fetch(
				`${this.baseURL}/Leads?page=${page}&per_page=${perPage}`,
				{
					headers: {
						Authorization: `Zoho-oauthtoken ${this.accessToken}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to get leads");
			}

			return await response.json();
		} catch (error) {
			console.error("Zoho CRM Get Leads Error:", error);
			throw error;
		}
	}
}

export class ZohoBooksService {
	private clientId: string;
	private clientSecret: string;
	private accessToken: string | null = null;
	private organizationId: string;
	private baseURL = "https://www.zohoapis.in/books/v3";

	constructor(clientId: string, clientSecret: string, organizationId: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.organizationId = organizationId;
	}

	async getAccessToken(
		authCode: string,
		redirectUri: string
	): Promise<ZohoTokenResponse> {
		try {
			const response = await fetch("https://accounts.zoho.in/oauth/v2/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "authorization_code",
					client_id: this.clientId,
					client_secret: this.clientSecret,
					code: authCode,
					redirect_uri: redirectUri,
				}).toString(),
			});

			if (!response.ok) {
				throw new Error("Failed to get access token");
			}

			const tokenData: ZohoTokenResponse = await response.json();
			this.accessToken = tokenData.access_token;
			return tokenData;
		} catch (error) {
			console.error("Zoho Books Auth Error:", error);
			throw error;
		}
	}

	async createInvoice(invoiceData: ZohoInvoice): Promise<any> {
		if (!this.accessToken) {
			throw new Error("Access token not available");
		}

		try {
			const response = await fetch(
				`${this.baseURL}/invoices?organization_id=${this.organizationId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Zoho-oauthtoken ${this.accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(invoiceData),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create invoice");
			}

			return await response.json();
		} catch (error) {
			console.error("Zoho Books Create Invoice Error:", error);
			throw error;
		}
	}

	async getInvoices(page: number = 1, perPage: number = 20): Promise<any> {
		if (!this.accessToken) {
			throw new Error("Access token not available");
		}

		try {
			const response = await fetch(
				`${this.baseURL}/invoices?organization_id=${this.organizationId}&page=${page}&per_page=${perPage}`,
				{
					headers: {
						Authorization: `Zoho-oauthtoken ${this.accessToken}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to get invoices");
			}

			return await response.json();
		} catch (error) {
			console.error("Zoho Books Get Invoices Error:", error);
			throw error;
		}
	}

	async createCustomer(customerData: {
		customer_name: string;
		company_name?: string;
		email: string;
		phone?: string;
		billing_address?: any;
	}): Promise<any> {
		if (!this.accessToken) {
			throw new Error("Access token not available");
		}

		try {
			const response = await fetch(
				`${this.baseURL}/contacts?organization_id=${this.organizationId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Zoho-oauthtoken ${this.accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(customerData),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create customer");
			}

			return await response.json();
		} catch (error) {
			console.error("Zoho Books Create Customer Error:", error);
			throw error;
		}
	}
}
