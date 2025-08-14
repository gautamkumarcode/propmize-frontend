"use client";

import { getRouteByPath, routes, type Route } from "@/lib/routing/routes";
import { useAuthStore } from "@/store/app-store";
import { usePathname, useRouter } from "next/navigation";

export const useNavigation = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, user } = useAuthStore();

	// Get current route information
	const currentRoute = getRouteByPath(pathname);

	// Navigation functions
	const navigateTo = (path: string) => {
		router.push(path);
	};

	const navigateToRoute = (route: Route) => {
		navigateTo(route.path);
	};

	// Check if route requires authentication
	const isProtectedRoute = (path: string): boolean => {
		const route = getRouteByPath(path);
		return route?.protected ?? false;
	};

	// Handle authentication redirect
	const handleAuthRedirect = () => {
		if (!isAuthenticated && currentRoute?.protected) {
			router.push("/");
			return false;
		}
		return true;
	};

	// Quick navigation functions
	const goToDashboard = () => navigateTo("/buyer/dashboard");
	const goBuyerDashboard = () => navigateTo("/buyer/dashboard");
	const goToProfile = () => navigateTo("/profile");
	const goToSaved = () => navigateTo("/saved");
	const goToRecent = () => navigateTo("/recent");
	const goToContacted = () => navigateTo("/contacted");
	const goToNewProjects = () => navigateTo("/new-projects");
	const goToGuide = () => navigateTo("/guide");
	const goToSupport = () => navigateTo("/support");
	const goToSwitchMode = () => navigateTo("/switch-mode");

	// Seller navigation functions
	const goToSellerDashboard = () => navigateTo("/seller");
	const goToAddProperty = () => navigateTo("/seller/add-property");
	const goToSellerAnalytics = () => navigateTo("/seller/analytics");
	const goToSellerLeads = () => navigateTo("/seller/leads");
	const goToSellerPlans = () => navigateTo("/seller/plans");
	const goToSellerPremium = () => navigateTo("/seller/premium");
	const goToSellerProfile = () => navigateTo("/seller/profile");
	const goToSellerGuide = () => navigateTo("/seller/guide");
	const goToSellerSupport = () => navigateTo("/seller/support");

	// Check if current path matches a route
	const isCurrentRoute = (routePath: string): boolean => {
		return pathname === routePath;
	};

	// Get layout type for current route
	const getCurrentLayout = (): "buyer" | "seller" | "public" => {
		return currentRoute?.layout ?? "public";
	};

	// Check if user is on seller pages
	const isSellerMode = (): boolean => {
		return pathname.startsWith("/seller");
	};

	// Check if user is on buyer pages
	const isBuyerMode = (): boolean => {
		return !pathname.startsWith("/seller");
	};

	return {
		// Current state
		pathname,
		currentRoute,
		isAuthenticated,
		user,

		// Navigation functions
		navigateTo,
		navigateToRoute,
		router,

		// Quick navigation
		goToDashboard,
		goBuyerDashboard,
		goToProfile,
		goToSaved,
		goToRecent,
		goToContacted,
		goToNewProjects,
		goToGuide,
		goToSupport,
		goToSwitchMode,

		// Seller navigation
		goToSellerDashboard,
		goToAddProperty,
		goToSellerAnalytics,
		goToSellerLeads,
		goToSellerPlans,
		goToSellerPremium,
		goToSellerProfile,
		goToSellerGuide,
		goToSellerSupport,

		// Utility functions
		isCurrentRoute,
		isProtectedRoute,
		handleAuthRedirect,
		getCurrentLayout,
		isSellerMode,
		isBuyerMode,

		// Route data
		routes,
	};
};

export default useNavigation;
