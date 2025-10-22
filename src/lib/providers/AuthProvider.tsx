"use client";

import { useAppStore } from "@/store/app-store";
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
	// Use Zustand store as primary source
	const {
		user: storeUser,
		isAuthenticated: storeIsAuthenticated,
		setUser,
		setAuthenticated,
	} = useAppStore();

	const { data: user, isLoading, isError, refetch, isFetching } = useProfile();

	// Check if we have tokens but no user data
	const hasTokens =
		typeof window !== "undefined" &&
		(!!localStorage.getItem("accessToken") ||
			!!localStorage.getItem("refreshToken"));

	// Sync Zustand store with React Query data
	useEffect(() => {
		if (user) {
			// Only update if the user data has actually changed
			if (JSON.stringify(storeUser) !== JSON.stringify(user)) {
				setUser(user);
				setAuthenticated(true);
			}
		} else if (!isLoading && !isFetching && !user && hasTokens) {
			// We have tokens but no user - this might indicate an auth issue
			console.warn("Tokens present but no user data received");
		} else if (!isLoading && !isFetching && !user && !hasTokens) {
			// No tokens and no user - clear auth state
			setUser(null);
			setAuthenticated(false);
		}
	}, [
		user,
		isLoading,
		isFetching,
		storeUser,
		setUser,
		setAuthenticated,
		hasTokens,
	]);

	// Cleanup on error
	useEffect(() => {
		if (isError && !isLoading && !isFetching) {
			console.log("Cleaning up tokens due to auth error");
			safeLocalStorage.removeItem("accessToken");
			safeLocalStorage.removeItem("refreshToken");
			setUser(null);
			setAuthenticated(false);
		}
	}, [isError, isLoading, isFetching, setUser, setAuthenticated]);

	// Determine the final authentication state
	const finalIsAuthenticated =
		storeIsAuthenticated && !!storeUser && AuthService.isAuthenticated();
	const finalUser = storeUser;

	const contextValue: AuthContextType = {
		user: finalUser,
		isLoading: isLoading || isFetching,
		isAuthenticated: finalIsAuthenticated,
		isError,
		refetch,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

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

export function useRoleGuard(allowedRoles: ("buyer" | "seller" | "admin")[]) {
	const { user, isAuthenticated } = useAuth();

	const hasAccess = isAuthenticated && user && allowedRoles.includes(user.role);

	return {
		hasAccess,
		user,
		isAuthenticated,
	};
}