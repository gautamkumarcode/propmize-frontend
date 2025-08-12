"use client";

import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { User } from "../../types";
import { useProfile } from "../react-query/hooks/useAuth";
import { AuthService } from "../services/authService";
import { safeLocalStorage } from "../utils/storage";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	isError: boolean;
	refetch: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { data: user, isLoading, isError, refetch } = useProfile();

	const isAuthenticated = !!user && AuthService.isAuthenticated();

	// Debug logging
	useEffect(() => {
		console.log("AuthProvider state:", {
			user,
			isLoading,
			isError,
			isAuthenticated,
			hasToken: !!AuthService.getAccessToken(),
		});
	}, [user, isLoading, isError, isAuthenticated]);

	// Cleanup tokens on error
	useEffect(() => {
		if (isError && !isLoading) {
			console.log("Cleaning up tokens due to auth error");
			safeLocalStorage.removeItem("accessToken");
			safeLocalStorage.removeItem("refreshToken");
		}
	}, [isError, isLoading]);

	const contextValue: AuthContextType = {
		user: user || null,
		isLoading,
		isAuthenticated,
		isError,
		refetch,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

// Hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
	return function AuthenticatedComponent(props: P) {
		const { isAuthenticated, isLoading } = useAuth();

		if (isLoading) {
			return (
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
				</div>
			);
		}

		if (!isAuthenticated) {
			// Redirect to login or show login component
			return (
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Authentication Required
						</h2>
						<p className="text-gray-600">Please log in to access this page.</p>
					</div>
				</div>
			);
		}

		return <Component {...props} />;
	};
}

// Hook for role-based access control
export function useRoleGuard(allowedRoles: ("buyer" | "seller" | "admin")[]) {
	const { user, isAuthenticated } = useAuth();

	const hasAccess = isAuthenticated && user && allowedRoles.includes(user.role);

	return {
		hasAccess,
		user,
		isAuthenticated,
	};
}
