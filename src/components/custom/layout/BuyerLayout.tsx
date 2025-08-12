"use client";

import AuthModal from "@/components/custom/auth-modal/AuthModal";
import Navbar from "@/components/custom/navbar/Navbar";
import {
	BookOpen,
	Building,
	Eye,
	Heart,
	HelpCircle,
	LogOut,
	Menu,
	Phone,
	RotateCcw,
	User,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface BuyerLayoutProps {
	children: React.ReactNode;
}

const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [activeTab, setActiveTab] = useState<
		"properties" | "chat" | "analytics"
	>("properties");
	const pathname = usePathname();

	const sidebarItems = [
		{ icon: User, label: "My Profile", href: "/profile" },
		{
			icon: RotateCcw,
			label: "Switch to Seller Mode",
			href: "/switch-mode",
			isHighlighted: true,
		},
		{ icon: Heart, label: "Saved Properties", href: "/saved" },
		{ icon: Eye, label: "Recently Viewed", href: "/recent" },
		{ icon: Phone, label: "Contacted Owners", href: "/contacted" },
		{ icon: Building, label: "New Projects in My City", href: "/new-projects" },
		{ icon: BookOpen, label: "Buyer's Guide and advice", href: "/guide" },
		{ icon: HelpCircle, label: "Help & Support", href: "/support" },
		{ icon: LogOut, label: "Logout", href: "/logout", isBottom: true },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Enhanced Navbar */}
			<Navbar
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onShowAuthModal={() => setShowAuthModal(true)}
			/>

			{/* Mobile Menu Button - Only visible on mobile */}
			<div className="md:hidden bg-white px-4 py-2 border-b border-gray-200">
				<button
					onClick={() => setSidebarOpen(true)}
					className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
					<Menu className="h-5 w-5" />
					<span className="text-sm font-medium">Browse Categories</span>
				</button>
			</div>

			{/* Sidebar Overlay */}
			{sidebarOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
					<div className="w-80 h-full bg-white shadow-lg">
						<div className="p-4 border-b border-gray-200">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900">Browse</h2>
								<button
									onClick={() => setSidebarOpen(false)}
									className="p-2 rounded-full hover:bg-gray-100 transition-colors">
									<X className="h-5 w-5 text-gray-500" />
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
												className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
													isActive
														? "bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600"
														: item.isHighlighted
														? "bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600"
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
											className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
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
			<main>
				<div className="container mx-auto px-4 py-6 max-w-7xl">{children}</div>
			</main>

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
};

export default BuyerLayout;
