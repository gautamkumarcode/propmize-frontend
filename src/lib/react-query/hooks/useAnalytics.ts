import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "../../services/analyticsService";
import { QueryKeys } from "../queryClient";

// Get seller dashboard analytics
export const useSellerDashboard = () => {
	return useQuery({
		queryKey: QueryKeys.dashboardAnalytics,
		queryFn: () => AnalyticsService.getDashboardAnalytics(),
		select: (data) => data.data,
	});
};


// get All property analytics for seller
export const useSellerAllPropertyAnalytics = (selectedPeriod:string) => {
	return useQuery({
		queryKey: QueryKeys.sellerPropertyAnalytics,
		queryFn: () => AnalyticsService.getSellerPropertyAnalytics(selectedPeriod),
		select: (data) => data.data,
	});
};	

