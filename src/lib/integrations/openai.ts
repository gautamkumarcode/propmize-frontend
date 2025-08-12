// OpenAI GPT-4 Integration for Property Chat
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface OpenAIResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: ChatMessage;
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

export class OpenAIService {
	private apiKey: string;
	private model: string;
	private baseURL = "https://api.openai.com/v1";

	constructor(apiKey: string, model: string = "gpt-4-turbo-preview") {
		this.apiKey = apiKey;
		this.model = model;
	}

	private getSystemPrompt(): string {
		return `You are an expert real estate assistant for E-State Platform, specialized in Indian property market. Your role is to:

1. Help users find properties based on their requirements
2. Provide market insights and pricing information
3. Suggest best locations for investment
4. Explain property features and amenities
5. Guide users through the buying/selling process

Key Guidelines:
- Always ask clarifying questions to understand user needs better
- Provide specific, actionable advice
- Use Indian currency (₹) and local measurements (sq ft, etc.)
- Mention popular Indian cities and localities
- Be helpful, professional, and knowledgeable
- If you need specific property data, mention that you'll search the database

Current context: You have access to property listings across major Indian cities including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, and others.`;
	}

	async generateChatResponse(
		userMessage: string,
		conversationHistory: ChatMessage[] = []
	): Promise<string> {
		try {
			const messages: ChatMessage[] = [
				{ role: "system", content: this.getSystemPrompt() },
				...conversationHistory.slice(-10), // Keep last 10 messages for context
				{ role: "user", content: userMessage },
			];

			const response = await fetch(`${this.baseURL}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					model: this.model,
					messages,
					max_tokens: 1000,
					temperature: 0.7,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
				}),
			});

			if (!response.ok) {
				throw new Error(`OpenAI API error: ${response.status}`);
			}

			const data: OpenAIResponse = await response.json();
			return (
				data.choices[0]?.message?.content ||
				"I apologize, but I couldn't generate a response. Please try again."
			);
		} catch (error) {
			console.error("OpenAI Service Error:", error);
			throw new Error("Failed to generate AI response");
		}
	}

	async generatePropertyDescription(propertyDetails: {
		type: string;
		location: string;
		price: number;
		area: number;
		features: string[];
	}): Promise<string> {
		try {
			const prompt = `Write an attractive property description for:
      
Type: ${propertyDetails.type}
Location: ${propertyDetails.location}
Price: ₹${propertyDetails.price.toLocaleString("en-IN")}
Area: ${propertyDetails.area} sq ft
Features: ${propertyDetails.features.join(", ")}

Make it engaging, highlight key selling points, and include location benefits.`;

			const response = await this.generateChatResponse(prompt);
			return response;
		} catch (error) {
			console.error("Property Description Generation Error:", error);
			throw error;
		}
	}

	async generateInvestmentAdvice(
		budget: number,
		location: string,
		propertyType: string
	): Promise<string> {
		try {
			const prompt = `Provide investment advice for:
      
Budget: ₹${budget.toLocaleString("en-IN")}
Preferred Location: ${location}
Property Type: ${propertyType}

Include market trends, growth potential, and specific recommendations.`;

			const response = await this.generateChatResponse(prompt);
			return response;
		} catch (error) {
			console.error("Investment Advice Generation Error:", error);
			throw error;
		}
	}
}
