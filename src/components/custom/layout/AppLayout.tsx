"use client";

import AuthModal from "@/components/custom/auth-modal/AuthModal";
import Header from "@/components/custom/layout/Header";
import NotificationListener from "@/components/custom/notifications/NotificationListener";
import {
	buyerBottomNavItems,
	buyerNavItems,
	sellerBottomNavItems,
	sellerNavItems,
} from "@/lib/routing/routes";
import { useAuthStore } from "@/store/app-store";
import React, { useEffect, useState } from "react";

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authRedirectTo, setAuthRedirectTo] = useState<string | undefined>();
	const { user, userMode } = useAuthStore(); // Get mode from global store or local storage
	const { isAuthenticated } = useAuthStore();

	// State to track if the component has mounted
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			{mounted && (
				<Header
					mode={userMode || "buyer"} // Default to buyer if not set
					onShowAuthModal={(redirectTo) => {
						setAuthRedirectTo(redirectTo);
						setShowAuthModal(true);
					}}
					navItems={userMode === "seller" ? sellerNavItems : buyerNavItems}
					bottomNavItems={
						userMode === "seller" ? sellerBottomNavItems : buyerBottomNavItems
					}
					isAuthenticated={isAuthenticated}
				/>
			)}

			{/* Main Content */}
			<main className="px-4">{children}</main>

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => {
					setShowAuthModal(false);
					setAuthRedirectTo(undefined);
				}}
				redirectTo={authRedirectTo}
			/>

			{/* Socket Notification Listener */}
			<NotificationListener />
		</div>
	);
};

export default AppLayout;
