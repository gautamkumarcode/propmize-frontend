"use client";

import {
	Bell,
	BookOpen,
	Crown,
	Diamond,
	FileText,
	HelpCircle,
	Home,
	LogOut,
	Menu,
	MessageSquare,
	Plus,
	RotateCcw,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface SellerLayoutProps {
	children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();

	const sidebarItems = [
		{ icon: User, label: "My Profile", href: "/seller/profile" },
		{
			icon: RotateCcw,
			label: "Switch to Buyer Dashboard",
			href: "/switch-mode",
			isHighlighted: true,
		},
		{ icon: Crown, label: "Seller Premium Plans", href: "/seller/plans" },
		{ icon: BookOpen, label: "Guide & advice", href: "/seller/guide" },
		{ icon: HelpCircle, label: "Help & Support", href: "/seller/support" },
		{ icon: LogOut, label: "Logout", href: "/logout", isBottom: true },
	];

	const bottomNavItems = [
		{ icon: Home, label: "Home", href: "/seller" },
		{ icon: MessageSquare, label: "Leads & Inquiries", href: "/seller/leads" },
		{
			icon: Plus,
			label: "New Listing",
			href: "/seller/add-property",
			isCenter: true,
		},
		{ icon: Diamond, label: "My Premium Plans", href: "/seller/premium" },
		{ icon: FileText, label: "Analytics", href: "/seller/analytics" },
	];

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="flex items-center justify-between px-4 py-3">
					<div className="flex items-center">
						<button
							onClick={() => setSidebarOpen(true)}
							className="p-2 rounded-md hover:bg-gray-100">
							<Menu className="h-6 w-6 text-gray-600" />
						</button>
					</div>

					<div className="flex-1 text-center">
						<Link href="/seller" className="block">
							<h1 className="text-xl font-bold text-gray-900">
								E-State Platform
							</h1>
							<p className="text-sm text-gray-500">Seller Dashboard</p>
						</Link>
					</div>

					<div className="flex items-center">
						<button className="relative p-2 rounded-md hover:bg-gray-100">
							<Bell className="h-6 w-6 text-gray-600" />
							<span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
								5
							</span>
						</button>
					</div>
				</div>
			</header>

			{/* Sidebar Overlay */}
			{sidebarOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
					<div className="w-80 h-full bg-white shadow-lg">
						<div className="p-4 border-b">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold">Seller Menu</h2>
								<button
									onClick={() => setSidebarOpen(false)}
									className="p-2 rounded-md hover:bg-gray-100">
									×
								</button>
							</div>
						</div>

						<nav className="flex flex-col h-full">
							<div className="flex-1 py-4">
								{sidebarItems
									.filter((item) => !item.isBottom)
									.map((item) => {
										const isActive = pathname === item.href;
										return (
											<Link
												key={item.href}
												href={item.href}
												onClick={() => setSidebarOpen(false)}
												className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
													isActive
														? "bg-green-50 text-green-600 font-medium border-r-2 border-green-600"
														: item.isHighlighted
														? "bg-green-50 text-green-600 font-medium border-r-2 border-green-600"
														: ""
												}`}>
												<item.icon className="h-5 w-5 mr-3" />
												{item.label}
											</Link>
										);
									})}
							</div>

							<div className="border-t py-4">
								{sidebarItems
									.filter((item) => item.isBottom)
									.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setSidebarOpen(false)}
											className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
											<item.icon className="h-5 w-5 mr-3" />
											{item.label}
										</Link>
									))}
							</div>
						</nav>
					</div>
				</div>
			)}

			{/* Main Content */}
			<main className="container mx-auto px-4 py-6">{children}</main>

			{/* Bottom Navigation */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
				<div className="flex items-center justify-around py-2">
					{bottomNavItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
									item.isCenter
										? "bg-blue-600 text-white shadow-lg transform scale-110"
										: isActive
										? "text-blue-600 bg-blue-50"
										: "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
								}`}>
								<item.icon
									className={`h-6 w-6 mb-1 ${
										item.isCenter ? "text-white" : ""
									}`}
								/>
								<span
									className={`text-xs font-medium ${
										item.isCenter ? "text-white" : ""
									}`}>
									{item.label}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default SellerLayout;
