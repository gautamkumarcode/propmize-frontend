import { UserService } from "@/lib/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../services/authService";
import {
	ApiResponse,
	AuthResponse,
	LoginCredentials,
	RegisterData,
	User,
} from "../../types/api";
import { QueryKeys } from "../queryClient";

// Define proper error interface for HTTP errors
interface HttpError {
	response?: {
		status: number;
		data?: {
			message?: string;
			error?: string;
		};
	};
	message?: string;
}

// Type guard to check if error is an HttpError
function isHttpError(error: unknown): error is HttpError {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as HttpError).response?.status === "number"
	);
}

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (credentials: LoginCredentials) =>
			AuthService.login(credentials),
		retry: false, // Disable retry for auth mutations
		onSuccess: (data: ApiResponse<AuthResponse>) => {
			// Cache user data immediately
			queryClient.setQueryData(QueryKeys.profile, data.data.user);

			// Show success message (you can replace with your preferred toast library)

			// Invalidate and refetch auth queries to ensure fresh data
			queryClient.invalidateQueries({ queryKey: QueryKeys.auth });
			queryClient.invalidateQueries({ queryKey: QueryKeys.profile });

			// Force refetch of profile to ensure UI updates
			queryClient.refetchQueries({ queryKey: QueryKeys.profile });

			// Check what's in storage after login
			setTimeout(() => {}, 500);
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Login failed";
			console.error("Login failed:", errorMessage);
			console.error("Full error:", error);
		},
	});
};

export const useRegister = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: RegisterData) => AuthService.register(userData),
		retry: false, // Disable retry for auth mutations
		onSuccess: (data: ApiResponse<AuthResponse>) => {
			// Cache user data immediately
			queryClient.setQueryData(QueryKeys.profile, data.data.user);
			console.log("Account created successfully!");

			// Invalidate and refetch auth queries to ensure fresh data
			queryClient.invalidateQueries({ queryKey: QueryKeys.auth });
			queryClient.invalidateQueries({ queryKey: QueryKeys.profile });

			// Force refetch of profile to ensure UI updates
			queryClient.refetchQueries({ queryKey: QueryKeys.profile });
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Registration failed";
			console.error("Registration failed:", errorMessage);
		},
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => AuthService.logout(),
		onSuccess: () => {
			// Clear all cached data
			queryClient.clear();
		},
		onError: (error: unknown) => {
			// Still clear cache even if API call fails
			queryClient.clear();
		},
	});
};

export const useProfile = () => {
	const isAuth = AuthService.isAuthenticated();

	return useQuery({
		queryKey: QueryKeys.profile,
		queryFn: async () => {
			const result = await AuthService.getProfile();
			return result;
		},
		enabled: isAuth,
		select: (data) => {
			return data.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes (reduced from 10)
		retry: (failureCount, error: unknown) => {
			// Don't retry if it's an auth error (401/403)
			if (
				isHttpError(error) &&
				(error.response?.status === 401 || error.response?.status === 403)
			) {
				return false;
			}
			return failureCount < 2; // Retry up to 2 times for other errors
		},
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: (email: string) => AuthService.forgotPassword(email),
		onSuccess: () => {
			console.log("Password reset link sent to your email");
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Failed to send reset link";
			console.error(errorMessage);
		},
	});
};

export const useResetPassword = () => {
	return useMutation({
		mutationFn: ({ token, password }: { token: string; password: string }) =>
			AuthService.resetPassword(token, password),
		onSuccess: () => {
			console.log("Password reset successfully");
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Password reset failed";
			console.error(errorMessage);
		},
	});
};

export const useVerifyEmail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (token: string) => AuthService.verifyEmail(token),
		onSuccess: () => {
			console.log("Email verified successfully");

			// Refresh user profile to get updated verification status
			queryClient.invalidateQueries({ queryKey: QueryKeys.profile });
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Email verification failed";
			console.error(errorMessage);
		},
	});
};

export const useResendVerification = () => {
	return useMutation({
		mutationFn: () => AuthService.resendVerification(),
		onSuccess: () => {
			console.log("Verification email sent");
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Failed to send verification email";
			console.error(errorMessage);
		},
	});
};

// Update profile hook
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (profileData: FormData) => {
			console.log("Profile data received:", profileData);

			// Debug: Log FormData contents if it's FormData
			if (profileData instanceof FormData) {
				console.log("FormData contents:");
				for (const [key, value] of profileData.entries()) {
					console.log(key, value);
				}
			}

			return UserService.updateProfile(profileData);
		},
		onSuccess: (data: ApiResponse<User>) => {
			queryClient.setQueryData(QueryKeys.profile, data.data);
			queryClient.invalidateQueries({ queryKey: QueryKeys.profile });
		},
		onError: (error: unknown) => {
			const errorMessage =
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Failed to update profile";
			console.error("Failed to update profile:", errorMessage);
		},
	});
};
