"use client";

import { toast } from "@/hooks/use-toast";
import { useLogout } from "@/lib/react-query/hooks/useAuth";
import { useAuthStore } from "@/store/app-store";
import {
	Bell,
	Home,
	LogIn,
	LogOut,
	MessageCircle,
	Search,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
	activeTab?: "properties" | "chat" | "analytics";
	onTabChange?: (tab: "properties" | "chat" | "analytics") => void;
	onShowAuthModal?: () => void;
}

export default function Navbar({
	activeTab = "properties",
	onTabChange,
	onShowAuthModal,
}: NavbarProps) {
	const [notifications] = useState(3); // Mock notification count
	const [showUserMenu, setShowUserMenu] = useState(false);
	const { user, isAuthenticated, setUser, setAuthenticated } = useAuthStore();
	const router = useRouter();
	const logoutMutation = useLogout();

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

	const navItems = [
		{
			id: "properties" as const,
			label: "Properties",
			icon: Home,
		},
		{
			id: "chat" as const,
			label: "Messages",
			icon: MessageCircle,
		},
		{
			id: "analytics" as const,
			label: "Analytics",
			icon: Search,
		},
	];

	return (
		<nav className="bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center space-x-8">
					<h1
						onClick={() => router.push("/")}
						className="text-2xl font-bold text-blue-600">
						Propmize
					</h1>

					{/* Navigation Tabs */}
					{/* <div className="hidden md:flex space-x-6">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;
							return (
								<button
									key={item.id}
									onClick={() => onTabChange?.(item.id)}
									className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
										isActive
											? "bg-blue-100 text-blue-700"
											: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
									}`}>
									<Icon size={18} />
									<span className="font-medium">{item.label}</span>
								</button>
							);
						})}
					</div> */}
				</div>

				{/* Right Side Actions */}
				<div className="flex items-center space-x-4">
					{/* Add Property Button */}

					{/* Notifications */}
					<button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
						<Bell size={20} />
						{notifications > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{notifications}
							</span>
						)}
					</button>

					{/* User Menu */}
					{isAuthenticated ? (
						<div className="relative">
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
										onClick={() => router.push("/profile")}
										className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
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

			{/* Mobile Navigation */}
			<div className="md:hidden mt-4 flex space-x-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = activeTab === item.id;
					return (
						<button
							key={item.id}
							onClick={() => onTabChange?.(item.id)}
							className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
								isActive
									? "bg-blue-100 text-blue-700"
									: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
							}`}>
							<Icon size={16} />
							<span>{item.label}</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
