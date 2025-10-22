"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLeadAnalytics } from "@/lib/react-query/hooks/useLeads";
import { useAuthStore } from "@/store/app-store";
import { BarChart, CircleDollarSign, TrendingUp, Users } from "lucide-react";
import React from "react";

export default function SellerLeadAnalytics() {
	const [period, setPeriod] = React.useState<
		"week" | "month" | "quarter" | "year"
	>("month");

	const { isAuthenticated } = useAuthStore();
	const { data, isLoading, isError } = useLeadAnalytics({ period });

	const leadStats = data?.data;

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Card className="p-8 text-center">
					<Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Please Log In to View Lead Analytics
					</h3>
					<p className="text-gray-600 mb-6">
						You need to be logged in to see your lead analytics.
					</p>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center p-8 text-red-600">
				Error loading lead analytics. Please try again later.
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-2xl font-bold">Lead Analytics</CardTitle>
					<Select
						value={period}
						onValueChange={(value: "week" | "month" | "quarter" | "year") =>
							setPeriod(value)
						}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select Period" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">Last 7 Days</SelectItem>
							<SelectItem value="month">Last 30 Days</SelectItem>
							<SelectItem value="quarter">Last 3 Months</SelectItem>
							<SelectItem value="year">Last 12 Months</SelectItem>
						</SelectContent>
					</Select>
				</CardHeader>
				<CardContent>
					<p className="text-gray-600 mb-6">
						Overview of your lead performance.
					</p>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Leads
								</CardTitle>
								<Users className="h-4 w-4 text-gray-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{leadStats?.totalLeads || 0}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Converted Leads
								</CardTitle>
								<CircleDollarSign className="h-4 w-4 text-gray-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{leadStats?.converted || 0}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Conversion Rate
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-gray-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{leadStats?.conversionRate || "0.00"}%
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Leads by Status
								</CardTitle>
								<BarChart className="h-4 w-4 text-gray-500" />
							</CardHeader>
							<CardContent>
								{leadStats?.byStatus && leadStats.byStatus.length > 0 ? (
									<div className="space-y-1">
										{leadStats.byStatus.map(
											(item: { _id: string; count: number }) => (
												<div
													key={item._id}
													className="flex justify-between text-sm">
													<span>{item._id}:</span>
													<span className="font-medium">{item.count}</span>
												</div>
											)
										)}
									</div>
								) : (
									<p className="text-sm text-gray-500">No status data.</p>
								)}
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
