// Route configuration for the Propmize application
export interface Route {
	path: string;
	name: string;
	description: string;
	layout: "buyer" | "seller" | "public";
	icon?: string;
	protected?: boolean;
}

export interface NavigationItem {
	route: Route;
	icon: string;
	isHighlighted?: boolean;
	isBottom?: boolean;
}

export const routes: Record<string, Route> = {
	// Main routes
	home: {
		path: "/",
		name: "Landing",
		description: "Landing page to choose buyer or seller mode",
		layout: "public",
		protected: false,
	},
	buyerAssistant: {
		path: "/buyer/assistant",
		name: "Assistant",
		description: "Buyer dashboard with AI assistant",
		layout: "buyer",
		protected: false,
	},
	navigation: {
		path: "/navigation",
		name: "All Pages",
		description: "Overview of all available pages and navigation",
		layout: "buyer",
		protected: false,
	},

	// Buyer routes

	buyerProfile: {
		path: "/buyer/profile",
		name: "Profile",
		description: "Buyer profile and account settings",
		layout: "buyer",
		protected: true,
	},
	saved: {
		path: "/saved",
		name: "Saved",
		description: "Properties saved for later viewing",
		layout: "buyer",
		protected: true,
	},
	recent: {
		path: "/recent",
		name: "Recently Viewed",
		description: "Recently viewed properties",
		layout: "buyer",
		protected: true,
	},
	contacted: {
		path: "/contacted",
		name: "Contacted",
		description: "Properties where you contacted owners",
		layout: "buyer",
		protected: true,
	},

	switchMode: {
		path: "/",
		name: "Switch Mode",
		description: "Switch between buyer and seller modes",
		layout: "public",
		protected: false,
	},
	newProjects: {
		path: "/new-projects",
		name: "New Projects",
		description: "New projects in your city",
		layout: "buyer",
		protected: false,
	},
	guide: {
		path: "/guide",
		name: "Buyer's Guide",
		description: "Buyer's guide and advice",
		layout: "buyer",
		protected: false,
	},
	support: {
		path: "/support",
		name: "Help & Support",
		description: "Help and support center",
		layout: "buyer",
		protected: false,
	},
	myProperty: {
		path: "/seller/my-property",
		name: "My Property",
		description: "Manage your property listings",
		layout: "seller",
		protected: true,
	},
	properties: {
		path: "/property",
		name: "All listings",
		description: "Explore property listed  in my city ",
		layout: "public",
		protected: false,
	},

	// Seller routes
	seller: {
		path: "/seller",
		name: " Dashboard",
		description: "Seller dashboard with listings and analytics",
		layout: "seller",
		protected: true,
	},
	addProperty: {
		path: "/seller/add-property",
		name: "Sell / Rent Property",
		description: "List your property & reach genuine buyers/tenants",
		layout: "seller",
		protected: true,
	},
	addPropertyOnWhatsapp: {
		path: "#",
		name: "Sell / Rent Property on WhatsApp",
		description: "Create a new property listing via WhatsApp",
		layout: "seller",
		protected: true,
	},
	sellerAnalytics: {
		path: "/seller/analytics",
		name: "Analytics",
		description: "Property and lead analytics",
		layout: "seller",
		protected: true,
	},
	sellerLeads: {
		path: "/seller/leads",
		name: "Leads",
		description: "Manage property inquiry leads",
		layout: "seller",
		protected: true,
	},
	sellerPlans: {
		path: "/seller/plans",
		name: "Plans",
		description: "Subscription plans and billing",
		layout: "seller",
		protected: true,
	},
	sellerPremium: {
		path: "/seller/premium",
		name: "Premium",
		description: "Premium features and services",
		layout: "seller",
		protected: true,
	},
	sellerProfile: {
		path: "/seller/profile",
		name: "Profile",
		description: "Seller profile and settings",
		layout: "seller",
		protected: true,
	},
	sellerGuide: {
		path: "/seller/guide",
		name: "Seller Guide",
		description: "Guide for selling properties",
		layout: "seller",
		protected: true,
	},
	sellerSupport: {
		path: "/seller/support",
		name: "Support",
		description: "Seller support and help",
		layout: "seller",
		protected: true,
	},
};

// Helper functions for routing
export const getRouteByPath = (path: string): Route | undefined => {
	return Object.values(routes).find((route) => route.path === path);
};

export const getBuyerRoutes = (): Route[] => {
	return Object.values(routes).filter((route) => route.layout === "buyer");
};

export const getSellerRoutes = (): Route[] => {
	return Object.values(routes).filter((route) => route.layout === "seller");
};

export const getProtectedRoutes = (): Route[] => {
	return Object.values(routes).filter((route) => route.protected);
};

export const getPublicRoutes = (): Route[] => {
	return Object.values(routes).filter((route) => !route.protected);
};

// Navigation items for different layouts
export const buyerNavItems: NavigationItem[] = [
	// { route: routes.buyerProfile, icon: "User" },
	{
		route: {
			path: "/seller",
			name: "Switch to Seller Mode",
			description: "Switch mode",
			layout: "buyer",
		},
		icon: "RotateCcw",
		isHighlighted: true,
	},
	{ route: routes.buyerAssistant, icon: "Home" },
	{ route: routes.properties, icon: "Building" },

	{ route: routes.saved, icon: "Heart" },
	{ route: routes.recent, icon: "Eye" },
	{ route: routes.contacted, icon: "Phone" },
	{ route: routes.newProjects, icon: "Building" },
	{ route: routes.guide, icon: "BookOpen" },
	{ route: routes.support, icon: "HelpCircle" },
];

export const sellerNavItems: NavigationItem[] = [
	// { route: routes.sellerProfile, icon: "User" },
	{
		route: {
			path: "/buyer/assistant",
			name: "Switch to Buyer Dashboard",
			description: "Switch mode",
			layout: "seller",
		},
		icon: "RotateCcw",
		isHighlighted: true,
	},
	{ route: routes.addProperty, icon: "Plus" },
	{ route: routes.myProperty, icon: "Building" },
	{ route: routes.properties, icon: "Building" },
	{ route: routes.sellerAnalytics, icon: "BarChart3" },
	{ route: routes.sellerLeads, icon: "MessageSquare" },
	// { route: routes.addPropertyOnWhatsapp, icon: "Plus" },
	{ route: routes.sellerPlans, icon: "Crown" },
	{ route: routes.sellerGuide, icon: "BookOpen" },
	{ route: routes.sellerSupport, icon: "HelpCircle" },

	// { route: routes.sellerPremium, icon: "Diamond" },
];

export const sellerBottomNavItems: NavigationItem[] = [
	{ route: routes.seller, icon: "Home" },
	{ route: routes.sellerLeads, icon: "MessageSquare" },
	{ route: routes.addProperty, icon: "Plus", isHighlighted: true },
	{ route: routes.sellerPremium, icon: "Diamond" },
	{ route: routes.sellerAnalytics, icon: "FileText" },
];

export const buyerBottomNavItems: NavigationItem[] = [
	{ route: routes.contacted, icon: "Phone" },
	{ route: routes.saved, icon: "Heart" },
	// Use a unique route for chat/messages, or remove duplicate
	{ route: routes.buyerAssistant, icon: "MessageSquare", isHighlighted: true },
	{ route: routes.newProjects, icon: "Building" },
	{ route: routes.properties, icon: "Building" },
];
