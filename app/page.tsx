// app/(marketing)/layout.tsx or app/(marketing)/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Propmize - AI-Powered Real Estate Platform",
	description:
		"Discover your perfect property with AI-powered insights. Buy, rent, or sell properties with verified buyers and sellers in a trusted marketplace.",
	keywords:
		"real estate, property search, buy property, rent property, sell property, AI real estate, property marketplace",
	authors: [{ name: "Propmize" }],
	viewport: "width=device-width, initial-scale=1.0",

	// Open Graph
	openGraph: {
		title: "Propmize - AI-Powered Real Estate Platform",
		description:
			"Discover your perfect property with AI-powered insights. Connect with verified buyers and sellers in a trusted marketplace.",
		type: "website",
		siteName: "Propmize",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Propmize - AI Real Estate Platform",
			},
		],
		url: "https://propmize.com",
	},

	// Twitter
	twitter: {
		card: "summary_large_image",
		title: "Propmize - AI-Powered Real Estate Platform",
		description:
			"Discover your perfect property with AI-powered insights. Buy, rent, or sell properties easily.",
		images: ["/twitter-image.jpg"],
	},

	// Additional
	robots: "index, follow",
	themeColor: "#0066FF",
};

// Your page component remains the same
import LandingPage from "@/components/screens/landing/LandingPage";

export default function HomePage() {
	return <LandingPage />;
}
