"use client";

			
import LogoImage from "@/assests/logo1.png";
import NotificationDropdown from "@/components/custom/notifications/NotificationDropdown";
import { toast } from "@/hooks/use-toast";
import { useNavigation } from "@/hooks/useNavigation";
import { useNotifications } from "@/hooks/useNotifications";
import { apiClient } from "@/lib";
import { useLogout } from "@/lib/react-query/hooks/useAuth";
import { iconMap } from "@/lib/routing/iconMap";
import { buyerNavItems, sellerNavItems } from "@/lib/routing/routes";
import { useAuthStore } from "@/store/app-store";
import { AxiosError } from "axios";
import { Bell, LogIn, LogOut, Text, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
	activeTab?: "properties" | "chat" | "analytics";
	onTabChange?: (tab: "properties" | "chat" | "analytics") => void;
	onShowAuthModal?: (redirectTo?: string) => void;
	mode?: "buyer" | "seller";
}

export default function Navbar({
	// activeTab = "properties",
	// onTabChange,
	onShowAuthModal,
	mode,
}: NavbarProps) {
	const [showNavDropdown, setShowNavDropdown] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const {
		user,
		isAuthenticated,
		userMode,
		setUser,
		setAuthenticated,
		setUserMode,
	} = useAuthStore();
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
	const navDropdownRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);

	// Handle click outside to close dropdowns
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
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
				toast({
					title: "Logged out",
					description: "You have been successfully logged out.",
				});
			},
			onError: (error: unknown) => {
				const axiosError = error as AxiosError;
				console.error("Logout error:", axiosError);
				// Force logout even if API call fails
				setUser(null);
				setAuthenticated(false);
			},
		});
	};

	 const handleModeSwitch = async (targetMode: "buyer" | "seller") => {
			const redirectTo =
				targetMode === "seller" ? "/seller" : "/buyer/assistant";

			// If user is authenticated, directly switch mode and navigate

			if (isAuthenticated) {
				try {
					const response = await apiClient.put(`/users/${user?._id}/role`, {
						role: targetMode === "seller" ? "seller" : "buyer",
					});

					if (response.data.success) {
						setUserMode(targetMode);
						router.push(redirectTo);
						setShowNavDropdown(false);
						toast({
							title: "Mode switched",
							description: `Switched to ${targetMode} mode successfully.`,
						});
					} else {
						toast({
							title: "Mode switch failed",
							description: `Failed to switch to ${targetMode} mode.`,
						});
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				}
			} else {
				// Only show auth modal if user is not authenticated
				onShowAuthModal?.(redirectTo);
				setShowNavDropdown(false);
			}
		};

		return (
			<>
				<nav className="bg-white border-b border-gray-200 lg:px-6 py-4 px-0 md:px-4">
					<div className="flex items-center justify-between">
						{/* Left Side - Logo Only */}
						<div className="flex items-center w-full">
							{/* <h1
							onClick={() => navigation.goBuyerDashboard()}
							className="text-2xl font-bold text-blue-600 cursor-pointer"> */}
							<Image
								onClick={() =>
									mode === "seller"
										? router.push("/seller")
										: router.push("/buyer/assistant")
								}
								src={LogoImage}
								alt="Propmize Logo"
								className="h-12 w-auto cursor-pointer object-contain text-green-600"
							/>
							{/* </h1> */}
						</div>

						{/* Right Side Actions */}
						<div className="flex items-center space-x-4">
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

							{/* Navigation Menu Button with Dropdown */}
							<div className="relative mr-4" ref={navDropdownRef}>
								<button
									onClick={() => setShowNavDropdown(!showNavDropdown)}
									className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
									{showNavDropdown ? (
										<X size={24} className="transition-all" />
									) : (
										<Text className="rotate-y-180" size={24} />
									)}
								</button>

								{/* Navigation Dropdown - positioned to the left of menu button */}
								{showNavDropdown && (
									<div className="absolute md:w-[25rem] w-[75vw] top-full -right-3 bottom-0 mt-1  bg-white border border-gray-200 rounded-lg shadow-lg z-[999] h-[90vh] overflow-y-scroll">
										<div className="py-2">
											<div className="px-4 py-2 border-b border-gray-200">
												{" "}
												{/* User Details */}
												{isAuthenticated && user && (
													<div
														onClick={() => {
															router.push(
																userMode === "seller"
																	? "/seller/profile"
																	: "/buyer/profile"
															);

															setShowNavDropdown(false);
														}}
														className="flex items-center space-x-3 py-2 cursor-pointer">
														{/* Avatar: fallback to initials if no avatar */}
														{user.avatar ? (
															<Image
																src={user.avatar}
																alt={user.name}
																className="w-10 h-10 rounded-full object-contain border border-gray-200"
																width={40}
																height={40}
															/>
														) : (
															<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-gray-200">
																{user.name?.[0] || "U"}
															</div>
														)}
														<div className="flex flex-col">
															<span className="font-semibold text-gray-800">
																{user.name}
															</span>
															{user.email && (
																<span className="text-xs text-gray-500">
																	{user.email}
																</span>
															)}
															<div className="flex gap-5 py-2">
																<span className="text-xs text-gray-500">
																	{userMode.charAt(0).toUpperCase() +
																		userMode.slice(1)}{" "}
																</span>
																<Link
																	className="text-xs text-blue-500 underline"
																	href={
																		userMode === "seller"
																			? "/seller/profile"
																			: "/buyer/profile"
																	}>
																	Manage Profile
																</Link>
															</div>
														</div>
													</div>
												)}
											</div>
											{/* Navigation Items */}
											{navItems
												.filter(
													(item) =>
														!item.isBottom &&
														(!item.route.protected || isAuthenticated)
												)
												.map((item, index) => {
													const IconComponent =
														iconMap[item.icon as keyof typeof iconMap];
													const isActive =
														navigation.pathname === item.route.path;

													// Handle mode switching items specially
													if (
														item.isHighlighted &&
														(item.route.path === "/seller" ||
															item.route.path === "/buyer/assistant")
													) {
														const targetMode =
															item.route.path === "/seller"
																? "seller"
																: "buyer";
														return (
															<button
																key={index}
																onClick={() => handleModeSwitch(targetMode)}
																className={`flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors ${
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
																	{item.route.description && (
																		<div className="text-xs text-gray-500">
																			{item.route.description}
																		</div>
																	)}
																</div>
																{item.isHighlighted && (
																	<span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
																		Switch
																	</span>
																)}
															</button>
														);
													}

													// Regular navigation items
													return (
														<Link
															key={index}
															href={item.route.path}
															onClick={() => setShowNavDropdown(false)}
															className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
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
																{item.route.description && (
																	<div className="text-xs text-gray-500">
																		{item.route.description}
																	</div>
																)}
															</div>
															{item.isHighlighted && (
																<span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
																	Switch
																</span>
															)}
														</Link>
													);
												})}
											{/* Divider */}
											<div className="border-t border-gray-200 my-2"></div>;
											{/* Profile Option */}
											{isAuthenticated && (
												<button
													onClick={() => {
														const profilePath =
															userMode === "seller"
																? "/seller/profile"
																: "/buyer/profile";
														router.push(profilePath);
														setShowNavDropdown(false);
													}}
													className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors text-gray-700">
													<User size={18} />
													<div>
														<div className="font-medium">Profile</div>
														<div className="text-xs text-gray-500">
															{user?.name || "User"}
														</div>
													</div>
												</button>
											)}
											{/* Authentication Actions */}
											{isAuthenticated ? (
												<button
													onClick={() => {
														handleLogout();
														setShowNavDropdown(false);
													}}
													className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors text-gray-700"
													disabled={logoutMutation.isPending}>
													<LogOut size={18} />
													<div>
														<div className="font-medium">
															{logoutMutation.isPending
																? "Signing out..."
																: "Logout"}
														</div>
														<div className="text-xs text-gray-500">
															Sign out of your account
														</div>
													</div>
												</button>
											) : (
												<button
													onClick={() => {
														onShowAuthModal?.();
														setShowNavDropdown(false);
													}}
													className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors text-gray-700">
													<LogIn size={18} />
													<div>
														<div className="font-medium">Login</div>
														<div className="text-xs text-gray-500">
															Sign in to your account
														</div>
													</div>
												</button>
											)}
											{/* Bottom Items */}
											{navItems
												.filter(
													(item) =>
														item.isBottom &&
														(!item.route.protected || isAuthenticated)
												)
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
															className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
																isActive
																	? "bg-blue-50 text-blue-700"
																	: "text-gray-700"
															}`}>
															{IconComponent && <IconComponent size={18} />}
															<div>
																<div className="font-medium">
																	{item.route.name.slice(0, 10)}
																</div>
																{item.route.description && (
																	<div className="text-xs text-gray-500">
																		{item.route.description}
																	</div>
																)}
															</div>
														</Link>
													);
												})}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</nav>
			</>
		);
}
