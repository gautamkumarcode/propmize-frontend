

import { Toaster } from "@/components/ui/Toaster";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "../src/lib/providers/Providers";
import "./globals.css";
import AppLayout from "@/components/custom/layout/AppLayout";

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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
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
