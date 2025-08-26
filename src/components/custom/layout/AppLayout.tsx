"use client";

import AuthModal from "@/components/custom/auth-modal/AuthModal";
import Header from "@/components/custom/layout/Header";
import { useAuthStore } from "@/store/app-store";
import React, { useState } from "react";
import { buyerNavItems, sellerNavItems, buyerBottomNavItems, sellerBottomNavItems } from "@/lib/routing/routes";

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authRedirectTo, setAuthRedirectTo] = useState<string | undefined>();
	const { user, userMode } = useAuthStore(); // Get mode from global store or local storage


	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			<Header
				mode={userMode || "buyer"} // Default to buyer if not set
				onShowAuthModal={(redirectTo) => {
					setAuthRedirectTo(redirectTo);
					setShowAuthModal(true);
				}}
				navItems={userMode === "seller" ? sellerNavItems : buyerNavItems}
				bottomNavItems={userMode === "seller" ? sellerBottomNavItems : buyerBottomNavItems}
			/>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-6">
				{children}
			</main>

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
