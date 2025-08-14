"use client";

import NotificationDropdown from "@/components/custom/notifications/NotificationDropdown";
import { toast } from "@/hooks/use-toast";
import { useNavigation } from "@/hooks/useNavigation";
import { useNotifications } from "@/hooks/useNotifications";
import { useLogout } from "@/lib/react-query/hooks/useAuth";
import { iconMap } from "@/lib/routing/iconMap";
import { buyerNavItems, sellerNavItems } from "@/lib/routing/routes";
import { useAuthStore } from "@/store/app-store";
import {
	Bell,
	ChevronDown,
	LogIn,
	LogOut,
	Menu,
	User,
	UserCircleIcon,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
	activeTab?: "properties" | "chat" | "analytics";
	onTabChange?: (tab: "properties" | "chat" | "analytics") => void;
	onShowAuthModal?: () => void;
	mode?: "buyer" | "seller";
}

export default function Navbar({
	activeTab = "properties",
	onTabChange,
	onShowAuthModal,
	mode = "buyer",
}: NavbarProps) {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showNavModal, setShowNavModal] = useState(false);
	const [showNavDropdown, setShowNavDropdown] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const { user, isAuthenticated, userMode, setUser, setAuthenticated } =
		useAuthStore();
	const router = useRouter();
	const navigation = useNavigation();
	const logoutMutation = useLogout();

	// Notification management
	const {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		handleNotificationClick,
	} = useNotifications();

	// Choose navigation items based on mode
	const navItems = mode === "seller" ? sellerNavItems : buyerNavItems;

	// Refs for click outside detection
	const userMenuRef = useRef<HTMLDivElement>(null);
	const navDropdownRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);

	// Handle click outside to close dropdowns
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setShowUserMenu(false);
			}
			if (
				navDropdownRef.current &&
				!navDropdownRef.current.contains(event.target as Node)
			) {
				setShowNavDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				setUser(null);
				setAuthenticated(false);
				setShowUserMenu(false);
				toast({
					title: "Logged out",
					description: "You have been successfully logged out.",
				});
			},
			onError: (error: any) => {
				console.error("Logout error:", error);
				// Force logout even if API call fails
				setUser(null);
				setAuthenticated(false);
				setShowUserMenu(false);
			},
		});
	};

	const handleUserMenuToggle = () => {
		setShowUserMenu(!showUserMenu);
	};

	return (
		<>
			<nav className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center space-x-8">
						<h1
							onClick={() => navigation.goBuyerDashboard()}
							className="text-2xl font-bold text-blue-600 cursor-pointer">
							Propmize
						</h1>

						{/* Desktop Navigation Links */}
						<div className="hidden lg:flex space-x-6">
							{navItems
								.filter((item) => !item.isBottom && !item.isHighlighted)
								.slice(0, 5) // Show first 5 items
								.map((item, index) => {
									const IconComponent =
										iconMap[item.icon as keyof typeof iconMap];
									const isActive = navigation.pathname === item.route.path;
									return (
										<Link
											key={index}
											href={item.route.path}
											className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
												isActive
													? "bg-blue-100 text-blue-700"
													: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
											}`}>
											{IconComponent && <IconComponent size={18} />}
											<span className="font-medium text-sm">
												{item.route.name}
											</span>
										</Link>
									);
								})}

							{/* Switch Mode Button */}

							{/* More dropdown for remaining items */}
							{navItems.length > 5 && (
								<div className="relative" ref={navDropdownRef}>
									<button
										onClick={() => setShowNavDropdown(!showNavDropdown)}
										className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors">
										<span className="font-medium text-sm">More</span>
										<ChevronDown size={16} />
									</button>

									{showNavDropdown && (
										<div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
											<div className="py-2">
												{navItems
													.filter((item) => !item.isBottom)
													.slice(5) // Show remaining items
													.map((item, index) => {
														const IconComponent =
															iconMap[item.icon as keyof typeof iconMap];
														const isActive =
															navigation.pathname === item.route.path;
														return (
															<Link
																key={index}
																href={item.route.path}
																onClick={() => setShowNavDropdown(false)}
																className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
																	isActive
																		? "bg-blue-50 text-blue-700"
																		: "text-gray-700"
																} ${
																	item.isHighlighted
																		? "bg-green-50 text-green-700"
																		: ""
																}`}>
																{IconComponent && <IconComponent size={18} />}
																<div>
																	<div className="font-medium">
																		{item.route.name}
																	</div>
																	<div className="text-xs text-gray-500">
																		{item.route.description}
																	</div>
																</div>
															</Link>
														);
													})}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
						{navItems
							.filter((item) => item.isHighlighted)
							.map((item, index) => {
								const IconComponent =
									iconMap[item.icon as keyof typeof iconMap];
								return (
									<Link
										key={index}
										href={item.route.path}
										className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
										{IconComponent && <IconComponent size={18} />}
										<span className="font-medium text-sm">
											{item.route.name}
										</span>
									</Link>
								);
							})}

						{/* Mobile Menu Button */}
						<button
							onClick={() => setShowNavModal(true)}
							className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
							<Menu size={20} />
						</button>
					</div>

					{/* Right Side Actions */}
					<div className="flex items-center space-x-4">
						{/* Add Property Button */}

						{/* Notifications */}
						<div className="relative" ref={notificationRef}>
							<button
								onClick={() => setShowNotifications(!showNotifications)}
								className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
								<Bell size={20} />
								{unreadCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
										{unreadCount}
									</span>
								)}
							</button>

							{/* Notification Dropdown */}
							<NotificationDropdown
								isOpen={showNotifications}
								onClose={() => setShowNotifications(false)}
								notifications={notifications}
								onMarkAsRead={markAsRead}
								onMarkAllAsRead={markAllAsRead}
								onDeleteNotification={deleteNotification}
								onNotificationClick={handleNotificationClick}
							/>
						</div>

						{/* User Menu */}
						{isAuthenticated ? (
							<div className="relative" ref={userMenuRef}>
								<button
									onClick={handleUserMenuToggle}
									className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
									<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
										<User size={18} className="text-blue-600" />
									</div>
									<span className="hidden sm:block text-sm font-medium">
										{user?.name || "User"}
									</span>
								</button>

								{/* User Dropdown */}
								{showUserMenu && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
										<div
											onClick={() => {
												const profilePath =
													userMode === "seller"
														? "/seller/profile"
														: "/buyer/profile";
												router.push(profilePath);
												setShowUserMenu(false);
											}}
											className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
											<div className="font-medium">{user?.name || "User"}</div>
											<div className="text-gray-500">{user?.email}</div>
										</div>
										<button
											onClick={handleLogout}
											className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											disabled={logoutMutation.isPending}>
											<LogOut size={16} className="mr-2" />
											{logoutMutation.isPending ? "Signing out..." : "Logout"}
										</button>
									</div>
								)}
							</div>
						) : (
							<button
								onClick={onShowAuthModal}
								className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								<LogIn size={18} />
								<span className="hidden sm:block">Login</span>
							</button>
						)}
					</div>
				</div>
			</nav>

			{/* Mobile Navigation Modal */}
			{showNavModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
					<div className="fixed inset-y-0 left-0 w-80 bg-white shadow-lg">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">
								Navigation
							</h2>
							<button
								onClick={() => setShowNavModal(false)}
								className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<X className="h-5 w-5 text-gray-500" />
							</button>
						</div>

						{/* Modal Content */}
						<div className="flex flex-col h-full">
							<div className="flex-1 py-4 overflow-y-auto">
								{navItems
									.filter((item) => !item.isBottom)
									.map((item, index) => {
										const IconComponent =
											iconMap[item.icon as keyof typeof iconMap];
										const isActive = navigation.pathname === item.route.path;
										return (
											<Link
												key={index}
												href={item.route.path}
												onClick={() => setShowNavModal(false)}
												className={`flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors ${
													isActive
														? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
														: item.isHighlighted
														? "bg-green-50 text-green-700 border-r-2 border-green-600"
														: "text-gray-700"
												}`}>
												{IconComponent && (
													<IconComponent className="h-5 w-5 flex-shrink-0" />
												)}
												<div>
													<div className="font-medium">{item.route.name}</div>
													<div className="text-xs text-gray-500 mt-1">
														{item.route.description}
													</div>
												</div>
												{item.isHighlighted && (
													<span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
														Switch
													</span>
												)}
											</Link>
										);
									})}
							</div>

							{/* Modal Footer */}
							<div className="border-t border-gray-200 p-4">
								{navItems
									.filter((item) => item.isBottom)
									.map((item, index) => {
										const IconComponent =
											iconMap[item.icon as keyof typeof iconMap];
										return (
											<Link
												key={index}
												href={item.route.path}
												onClick={() => setShowNavModal(false)}
												className="flex items-center space-x-3 px-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
												{IconComponent && <IconComponent className="h-5 w-5" />}
												<span className="font-medium">{item.route.name}</span>
											</Link>
										);
									})}
							</div>
						</div>
						<div className="absolute bottom-8 right-1/2">
							<UserCircleIcon
								className="h-8 w-8 text-gray-500 cursor-pointer"
								onClick={navigation.goToProfile}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
