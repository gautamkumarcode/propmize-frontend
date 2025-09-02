

import AppLayout from "@/components/custom/layout/AppLayout";
import { Toaster } from "@/components/ui/Toaster";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "../src/lib/providers/Providers";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Propmize - Modern Real Estate Platform",
	description:
		"Find your perfect property with AI-powered search and integrated services",
	icons: {
		icon: "/logo.svg", // Path from public folder
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{metadata.title as string}</title>
				<meta name="description" content={metadata.description ?? ""} />
				<link rel="icon" type="image/png" href="/logo.png" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<NextTopLoader
					color="#2563eb"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					easing="ease"
					speed={200}
					showSpinner={false}
					// disable circle loader

					zIndex={1600}
				/>
				<Toaster />
				<Providers>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
