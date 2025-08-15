// Base API service class
export class APIService {
	private baseURL: string;
	private headers: Record<string, string>;

	constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
		this.baseURL = baseURL;
		this.headers = {
			"Content-Type": "application/json",
			...defaultHeaders,
		};
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;

		const config: RequestInit = {
			...options,
			headers: {
				...this.headers,
				...options.headers,
			},
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
		const queryString = params
			? `?${new URLSearchParams(params).toString()}`
			: "";

		return this.request<T>(`${endpoint}${queryString}`, {
			method: "GET",
		});
	}

	async post<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, {
			method: "DELETE",
		});
	}

	setAuthToken(token: string) {
		this.headers["Authorization"] = `Bearer ${token}`;
	}

	removeAuthToken() {
		delete this.headers["Authorization"];
	}
}
