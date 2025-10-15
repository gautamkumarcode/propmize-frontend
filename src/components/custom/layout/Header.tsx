"use client";

import Navbar from "@/components/custom/navbar/Navbar";
import { useNavigation } from "@/hooks/useNavigation";
import { iconMap } from "@/lib/routing/iconMap";
import { NavigationItem } from "@/lib/routing/routes";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HeaderProps {
	mode: "buyer" | "seller";
	onShowAuthModal: (redirectTo?: string) => void;
	navItems: NavigationItem[];
	bottomNavItems: NavigationItem[];
	isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({
	mode,
	onShowAuthModal,
	navItems,
	bottomNavItems,
	isAuthenticated,
}) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showBottomNav, setShowBottomNav] = useState(true);
	const pathname = usePathname();
	const navigation = useNavigation();

	// Determine which navigation items to use based on mode
	const currentNavItems = navItems;
	const currentBottomNavItems = bottomNavItems;

	useEffect(() => {
		let lastScrollY = 0;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Only trigger if scroll difference is significant (avoid micro-scrolls)
			if (Math.abs(currentScrollY - lastScrollY) < 5) return;

			// Show bottom nav when scrolling up or at the top
			if (currentScrollY < lastScrollY || currentScrollY < 50) {
				setShowBottomNav(true);
			} else if (currentScrollY > lastScrollY && currentScrollY > 50) {
				// Hide bottom nav when scrolling down
				setShowBottomNav(false);
			}

			lastScrollY = currentScrollY;
		};

		// Add scroll event listener
		window.addEventListener("scroll", handleScroll, { passive: true });

		// Cleanup
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{/* Enhanced Navbar */}
			<Navbar mode={mode} onShowAuthModal={onShowAuthModal} />

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
									.filter(
										(item) =>
											!item.isBottom &&
											(!item.route.protected || isAuthenticated)
									)
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
									.filter(
										(item) =>
											item.isBottom &&
											(!item.route.protected || isAuthenticated)
									)
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

			{/* Bottom Navigation - Mobile Only */}
			<div
				className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50 transition-transform duration-300 ${
					showBottomNav ? "translate-y-0" : "translate-y-full"
				}`}>
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
		</>
	);
};

export default Header;
