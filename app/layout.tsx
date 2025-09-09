import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
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

export default function Layout({ children }: { children: React.ReactNode }) {
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
				{children}
			</body>
		</html>
	);
}
