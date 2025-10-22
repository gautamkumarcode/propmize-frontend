import { useAppStore } from "@/store/app-store";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "../../services/analyticsService";
import { QueryKeys } from "../queryClient";

// Get seller dashboard analytics
export const useSellerDashboard = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: QueryKeys.dashboardAnalytics,
		queryFn: () => AnalyticsService.getDashboardAnalytics(),
		enabled: isAuthenticated,
		select: (data) => data.data,
	});
};

// get All property analytics for seller
export const useSellerAllPropertyAnalytics = (selectedPeriod: string) => {
	const { isAuthenticated } = useAppStore();
	return useQuery({
		queryKey: QueryKeys.sellerPropertyAnalytics,
		enabled: isAuthenticated,
		queryFn: () => AnalyticsService.getSellerPropertyAnalytics(selectedPeriod),
		select: (data) => data.data,
	});
};
