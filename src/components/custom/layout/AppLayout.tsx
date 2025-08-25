"use client";

import AuthModal from "@/components/custom/auth-modal/AuthModal";
import Navbar from "@/components/custom/navbar/Navbar";
import { useNavigation } from "@/hooks/useNavigation";
import { iconMap } from "@/lib/routing/iconMap";
import { buyerBottomNavItems, buyerNavItems, sellerBottomNavItems, sellerNavItems } from "@/lib/routing/routes";
import { useAuthStore } from "@/store/app-store";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface AppLayoutProps {
	children: React.ReactNode;
	mode: "buyer" | "seller";
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, mode }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authRedirectTo, setAuthRedirectTo] = useState<string | undefined>();
	const pathname = usePathname();
	const navigation = useNavigation();

	// Determine which navigation items to use based on mode
	const currentNavItems = mode === "seller" ? sellerNavItems : buyerNavItems;
	const currentBottomNavItems =
		mode === "seller" ? sellerBottomNavItems : buyerBottomNavItems;

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Enhanced Navbar */}
			<Navbar
				mode={mode}
				onShowAuthModal={(redirectTo) => {
					setAuthRedirectTo(redirectTo);
					setShowAuthModal(true);
				}}
			/>

			{/* Sidebar Overlay */}
			{sidebarOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
					<div className="w-80 h-full bg-white shadow-lg">
						<div className="p-4 border-b">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold">
									{mode === "seller" ? "Seller Menu" : "Buyer Menu"}
								</h2>
								<button
									onClick={() => setSidebarOpen(false)}
									className="p-2 rounded-md hover:bg-gray-100">
									<X className="h-5 w-5 text-gray-500" />
								</button>
							</div>
						</div>

						<nav className="flex flex-col h-full">
							<div className="flex-1 py-4">
								{currentNavItems
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
												className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
													isActive
														? "bg-green-50 text-green-600 font-medium border-r-2 border-green-600"
														: item.isHighlighted
														? "bg-green-50 text-green-600 font-medium border-r-2 border-green-600"
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
								{currentNavItems
									.filter((item) => item.isBottom)
									.map((item) => {
										const IconComponent =
											iconMap[item.icon as keyof typeof iconMap];
										return (
											<Link
												key={item.route.path}
												href={item.route.path}
												onClick={() => setSidebarOpen(false)}
												className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
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
			<main className="container mx-auto px-4 py-6">
				{children}
			</main>

			{/* Bottom Navigation - Mobile Only */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
				<div className="flex items-center justify-around py-1">
					{currentBottomNavItems.map((item) => {
						const isActive = pathname === item.route.path;
						const IconComponent = iconMap[item.icon as keyof typeof iconMap];
						return (
							<Link
								key={item.route.path}
								href={item.route.path}
								className={`flex flex-col items-center py-2 px-2 min-w-0 flex-1 transition-all duration-200 ${
									item.isHighlighted
										? "bg-blue-600 text-white rounded-xl mx-1 shadow-md"
										: isActive
										? "text-blue-600"
										: "text-gray-500 hover:text-blue-600"
								}`}>
								{IconComponent && (
									<IconComponent
										className={`h-5 w-5 mb-1 ${
											item.isHighlighted ? "text-white" : ""
										}`}
									/>
								)}
								<span
									className={`text-[10px] font-medium leading-tight text-center ${
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
				onClose={() => {
					setShowAuthModal(false);
					setAuthRedirectTo(undefined);
				}}
				redirectTo={authRedirectTo}
			/>
		</div>
	);
};

export default AppLayout;
