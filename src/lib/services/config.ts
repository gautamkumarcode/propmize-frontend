// Service Integration Configuration
// This file centralizes all third-party service configurations for easy management

export interface ServiceConfig {
	razorpay: {
		keyId: string;
		keySecret: string;
		webhookSecret: string;
		enabled: boolean;
	};
	msg91: {
		authKey: string;
		templateId: string;
		route: string;
		enabled: boolean;
	};
	openai: {
		apiKey: string;
		model: string;
		maxTokens: number;
		enabled: boolean;
	};
	firebase: {
		apiKey: string;
		authDomain: string;
		projectId: string;
		storageBucket: string;
		messagingSenderId: string;
		appId: string;
		vapidKey: string;
		enabled: boolean;
	};
	zoho: {
		crm: {
			clientId: string;
			clientSecret: string;
			enabled: boolean;
		};
		books: {
			clientId: string;
			clientSecret: string;
			organizationId: string;
			enabled: boolean;
		};
	};
	googleCloud: {
		projectId: string;
		bucketName: string;
		serviceAccountKey: string;
		enabled: boolean;
	};
}

// Development/Testing Configuration
export const devConfig: ServiceConfig = {
	razorpay: {
		keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_",
		keySecret: process.env.RAZORPAY_KEY_SECRET || "",
		webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
		enabled: false, // Enable when keys are provided
	},
	msg91: {
		authKey: process.env.MSG91_AUTH_KEY || "",
		templateId: process.env.MSG91_TEMPLATE_ID || "",
		route: process.env.MSG91_ROUTE || "4",
		enabled: false, // Enable when keys are provided
	},
	openai: {
		apiKey: process.env.OPENAI_API_KEY || "",
		model: "gpt-4-turbo-preview",
		maxTokens: 1000,
		enabled: false, // Enable when API key is provided
	},
	firebase: {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
		messagingSenderId:
			process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
		vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "",
		enabled: false, // Enable when Firebase is configured
	},
	zoho: {
		crm: {
			clientId: process.env.ZOHO_CRM_CLIENT_ID || "",
			clientSecret: process.env.ZOHO_CRM_CLIENT_SECRET || "",
			enabled: false, // Enable when Zoho CRM is configured
		},
		books: {
			clientId: process.env.ZOHO_BOOKS_CLIENT_ID || "",
			clientSecret: process.env.ZOHO_BOOKS_CLIENT_SECRET || "",
			organizationId: process.env.ZOHO_BOOKS_ORG_ID || "",
			enabled: false, // Enable when Zoho Books is configured
		},
	},
	googleCloud: {
		projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
		bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || "",
		serviceAccountKey: process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY || "",
		enabled: false, // Enable when Google Cloud is configured
	},
};

// Production Configuration (will use environment variables)
export const prodConfig: ServiceConfig = {
	razorpay: {
		keyId: process.env.RAZORPAY_KEY_ID || "",
		keySecret: process.env.RAZORPAY_KEY_SECRET || "",
		webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
		enabled: true,
	},
	msg91: {
		authKey: process.env.MSG91_AUTH_KEY || "",
		templateId: process.env.MSG91_TEMPLATE_ID || "",
		route: process.env.MSG91_ROUTE || "4",
		enabled: true,
	},
	openai: {
		apiKey: process.env.OPENAI_API_KEY || "",
		model: "gpt-4-turbo-preview",
		maxTokens: 1000,
		enabled: true,
	},
	firebase: {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
		messagingSenderId:
			process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
		vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "",
		enabled: true,
	},
	zoho: {
		crm: {
			clientId: process.env.ZOHO_CRM_CLIENT_ID || "",
			clientSecret: process.env.ZOHO_CRM_CLIENT_SECRET || "",
			enabled: true,
		},
		books: {
			clientId: process.env.ZOHO_BOOKS_CLIENT_ID || "",
			clientSecret: process.env.ZOHO_BOOKS_CLIENT_SECRET || "",
			organizationId: process.env.ZOHO_BOOKS_ORG_ID || "",
			enabled: true,
		},
	},
	googleCloud: {
		projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
		bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || "",
		serviceAccountKey: process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY || "",
		enabled: true,
	},
};

// Get configuration based on environment
export const getConfig = (): ServiceConfig => {
	return process.env.NODE_ENV === "production" ? prodConfig : devConfig;
};

// Service initialization functions
import { FirebaseNotificationService } from "../integrations/firebase";
import { GoogleCloudStorageService } from "../integrations/google-cloud-storage";
import { MSG91Service } from "../integrations/msg91";
import { OpenAIService } from "../integrations/openai";
import { RazorpayService } from "../integrations/razorpay";
import { ZohoBooksService, ZohoCRMService } from "../integrations/zoho";

const services: {
	razorpay?: RazorpayService;
	msg91?: MSG91Service;
	openai?: OpenAIService;
	firebase?: FirebaseNotificationService;
	zohoCRM?: ZohoCRMService;
	zohoBooks?: ZohoBooksService;
	googleCloudStorage?: GoogleCloudStorageService;
} = {};

// Initialize all services based on configuration
export const initializeServices = () => {
	const config = getConfig();

	// Initialize Razorpay
	if (config.razorpay.enabled && config.razorpay.keyId) {
		services.razorpay = new RazorpayService(config.razorpay.keyId);
	}

	// Initialize MSG91
	if (config.msg91.enabled && config.msg91.authKey) {
		services.msg91 = new MSG91Service(config.msg91.authKey);
	}

	// Initialize OpenAI
	if (config.openai.enabled && config.openai.apiKey) {
		services.openai = new OpenAIService(
			config.openai.apiKey,
			config.openai.model
		);
	}

	// Initialize Firebase
	if (config.firebase.enabled && config.firebase.apiKey) {
		services.firebase = new FirebaseNotificationService(config.firebase);
	}

	// Initialize Zoho CRM
	if (config.zoho.crm.enabled && config.zoho.crm.clientId) {
		services.zohoCRM = new ZohoCRMService(
			config.zoho.crm.clientId,
			config.zoho.crm.clientSecret
		);
	}

	// Initialize Zoho Books
	if (config.zoho.books.enabled && config.zoho.books.clientId) {
		services.zohoBooks = new ZohoBooksService(
			config.zoho.books.clientId,
			config.zoho.books.clientSecret,
			config.zoho.books.organizationId
		);
	}

	// Initialize Google Cloud Storage
	if (config.googleCloud.enabled && config.googleCloud.projectId) {
		services.googleCloudStorage = new GoogleCloudStorageService({
			bucketName: config.googleCloud.bucketName,
			projectId: config.googleCloud.projectId,
			credentials: JSON.parse(config.googleCloud.serviceAccountKey || "{}"),
		});
	}
};

// Export services for use throughout the application
export const getServices = () => services;

// Service status check
export const checkServiceStatus = () => {
	const config = getConfig();
	return {
		razorpay: config.razorpay.enabled && !!services.razorpay,
		msg91: config.msg91.enabled && !!services.msg91,
		openai: config.openai.enabled && !!services.openai,
		firebase: config.firebase.enabled && !!services.firebase,
		zohoCRM: config.zoho.crm.enabled && !!services.zohoCRM,
		zohoBooks: config.zoho.books.enabled && !!services.zohoBooks,
		googleCloudStorage:
			config.googleCloud.enabled && !!services.googleCloudStorage,
	};
};
