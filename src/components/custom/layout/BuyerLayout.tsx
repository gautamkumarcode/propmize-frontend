"use client";

import AuthModal from "@/components/custom/auth-modal/AuthModal";
import Navbar from "@/components/custom/navbar/Navbar";
import Breadcrumb from "@/components/custom/navigation/Breadcrumb";
import { iconMap } from "@/lib/routing/iconMap";
import { buyerBottomNavItems, buyerNavItems } from "@/lib/routing/routes";
import { X } from "lucide-react";
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

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Enhanced Navbar */}
			<Navbar
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onShowAuthModal={() => setShowAuthModal(true)}
				mode="buyer"
			/>

			{/* Mobile Menu Button - Only visible on mobile */}

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
								{buyerNavItems
									.filter((item) => !item.isBottom)
									.map((item) => {
										const isActive = pathname === item.route.path;
										const IconComponent =
											iconMap[item.icon as keyof typeof iconMap];
										return (
											<Link
												key={item.route.path}
												href={item.route.path}
												onClick={() => setSidebarOpen(false)}
												className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
													isActive
														? "bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600"
														: item.isHighlighted
														? "bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600"
														: ""
												}`}>
												{IconComponent && (
													<IconComponent className="h-5 w-5 mr-3" />
												)}
												{item.route.name}
											</Link>
										);
									})}
							</div>

							<div className="border-t py-4">
								{buyerNavItems
									.filter((item) => item.isBottom)
									.map((item) => {
										const IconComponent =
											iconMap[item.icon as keyof typeof iconMap];
										return (
											<Link
												key={item.route.path}
												href={item.route.path}
												onClick={() => setSidebarOpen(false)}
												className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
												{IconComponent && (
													<IconComponent className="h-5 w-5 mr-3" />
												)}
												{item.route.name}
											</Link>
										);
									})}
							</div>
						</nav>
					</div>
				</div>
			)}

			{/* Main Content */}
			<main>
				<div className="container mx-auto px-4 py-6 max-w-7xl">
					<Breadcrumb />
					{children}
				</div>
			</main>

			{/* Bottom Navigation - Mobile Only */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
				<div className="flex items-center justify-around py-2">
					{buyerBottomNavItems.map((item) => {
						const isActive = pathname === item.route.path;
						const IconComponent = iconMap[item.icon as keyof typeof iconMap];
						return (
							<Link
								key={item.route.path}
								href={item.route.path}
								className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
									item.isHighlighted
										? "bg-blue-600 text-white shadow-lg transform scale-110"
										: isActive
										? "text-blue-600 bg-blue-50"
										: "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
								}`}>
								{IconComponent && (
									<IconComponent
										className={`h-6 w-6 mb-1 ${
											item.isHighlighted ? "text-white" : ""
										}`}
									/>
								)}
								<span
									className={`text-xs font-medium ${
										item.isHighlighted ? "text-white" : ""
									}`}>
									{item.route.name}
								</span>
							</Link>
						);
					})}
				</div>
			</div>

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
};

export default BuyerLayout;
