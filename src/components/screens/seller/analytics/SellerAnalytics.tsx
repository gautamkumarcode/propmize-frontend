"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSellerAllPropertyAnalytics } from "@/lib/react-query/hooks/useAnalytics";
import {
	BarChart3,
	Calendar,
	Download,
	Eye,
	Heart,
	MessageSquare,
	Phone,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface PropertyAnalytics {
	id: string;
	title: string;
	views: number;
	inquiries: number;
	favorites: number;
	calls: number;
	conversionRate: number;
	daysListed: number;
	status: "Active" | "Pending" | "Sold";
}

export default function SellerAnalytics() {
	const [selectedPeriod, setSelectedPeriod] = useState("30d");
	const [selectedProperty, setSelectedProperty] = useState<string>("all");

	// Use real-time analytics hook
	const { data: propertyAnalytic } =
		useSellerAllPropertyAnalytics(selectedPeriod);

	type WeeklyDay = {
		day: string;
		views: number;
		inquiries: number;
	};
	type MarketInsight = {
		title: string;
		value: string | number;
		insight: string;
		recommendation: string;
	};
	const propertyAnalytics = propertyAnalytic?.propertyAnalytics || [];
	const overallStats = propertyAnalytic?.overallStats || [];
	const weeklyData = propertyAnalytic?.periodData || [];
	const marketInsights: MarketInsight[] =
		propertyAnalytic?.marketInsights || [];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "sold":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getOverallStatsIcons = (Icon: string) => {
		const icons = {
			views: <Eye className="w-4 h-4 text-gray-500" />,
			inquiries: <MessageSquare className="w-4 h-4 text-gray-500" />,
			favorites: <Heart className="w-4 h-4 text-gray-500" />,
			calls: <Phone className="w-4 h-4 text-gray-500" />,
		};

		switch (Icon) {
			case "Eye":
				return icons.views;
			case "MessageSquare":
				return icons.inquiries;
			case "Heart":
				return icons.favorites;
			case "Phone":
				return icons.calls;

			case "TrendingUp":
				return <TrendingUp className="w-4 h-4 text-gray-500" />;
			default:
				return null;
		}
	};

	const getTrendIcon = (trend: string) => {
		return trend === "up" ? (
			<TrendingUp className="w-4 h-4 text-green-500" />
		) : (
			<TrendingDown className="w-4 h-4 text-red-500" />
		);
	};

	const getTrendColor = (trend: string) => {
		return trend === "up" ? "text-green-600" : "text-red-600";
	};

	return (
		<div className="min-h-screen bg-gray-50 py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{/* Header */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Analytics Dashboard
							</h1>
							<p className="text-gray-600 mt-2">
								Track your property performance and insights
							</p>
						</div>
						<div className="flex space-x-3 mt-4 md:mt-0">
							<select
								className="border border-gray-300 rounded-md px-3 py-2"
								value={selectedPeriod}
								onChange={(e) => setSelectedPeriod(e.target.value)}>
								<option value="7d">Last 7 days</option>
								<option value="30d">Last 30 days</option>
								<option value="90d">Last 3 months</option>
								<option value="1y">Last year</option>
							</select>
							<Button variant="outline">
								<Download className="w-4 h-4 mr-2" />
								Export Report
							</Button>
						</div>
					</div>

					{/* Overview Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{overallStats.map((stat, index: number) => {
							return (
								<Card key={index} className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">
												{stat.label}
											</p>
											<p className="text-3xl font-bold text-gray-900">
												{stat.value}
											</p>
											<div className="flex items-center mt-2">
												{getTrendIcon(stat?.trend ?? "")}
												<span
													className={`ml-1 text-sm ${getTrendColor(
														stat?.trend ?? ""
													)}`}>
													{stat.change}
												</span>
											</div>
										</div>
										<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
											{getOverallStatsIcons(stat.icon)}
										</div>
									</div>
								</Card>
							);
						})}
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-gray-900">
									Views & Inquiries
								</h2>
								{/* <Button variant="outline" size="sm">
									<Filter className="w-4 h-4 mr-2" />
									Filter
								</Button> */}
							</div>
							<div className="space-y-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">Total Views This Week</span>
									<span className="font-semibold">
										{weeklyData.reduce((acc, day) => acc + day.views, 0)}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">
										Total Inquiries This Week
									</span>
									<span className="font-semibold">
										{weeklyData.reduce((acc, day) => acc + day.inquiries, 0)}
									</span>
								</div>
								{/* Simplified chart representation */}
								<div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
									{weeklyData.length > 0 ? (
										<ResponsiveContainer width="100%" height={180}>
											<BarChart
												data={weeklyData}
												margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="day" />
												<YAxis />
												<Tooltip />
												<Legend />
												<Bar dataKey="views" fill="#3b82f6" name="Views" />
												<Bar
													dataKey="inquiries"
													fill="#6366f1"
													name="Inquiries"
												/>
											</BarChart>
										</ResponsiveContainer>
									) : (
										<div className="text-center">
											<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
											<p className="text-gray-500">No data available</p>
										</div>
									)}
								</div>
							</div>
						</Card>

						<Card className="p-6">
							<h2 className="text-xl font-bold text-gray-900 mb-6">
								Performance by Day
							</h2>
							<div className="space-y-4">
								{weeklyData.map((day: WeeklyDay, index: number) => (
									<div
										key={index}
										className="flex items-center justify-between">
										<span className="text-sm font-medium text-gray-600 w-12">
											{day.day}
										</span>
										<div className="flex-1 mx-4">
											<div className="bg-gray-200 rounded-full h-2">
												<div
													className="bg-blue-500 rounded-full h-2"
													style={{
														width: `${Math.min(day.views / 5, 100)}%`,
													}}
												/>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold text-gray-900">
												{day.views} views
											</p>
											<p className="text-xs text-gray-500">
												{day.inquiries} inquiries
											</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>

					{/* Property Performance */}
					<Card className="overflow-hidden">
						<div className="p-6 border-b">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold text-gray-900">
									Property Performance
								</h2>
								<select
									className="border border-gray-300 rounded-md px-3 py-2"
									value={selectedProperty}
									onChange={(e) => setSelectedProperty(e.target.value)}>
									<option value="all">All Properties</option>
									{propertyAnalytics.map((property) => (
										<option key={property.id} value={property.id}>
											{property.title}
										</option>
									))}
								</select>
							</div>
						</div>
						<div
							className="overflow-x-auto"
							style={{ maxHeight: "40vh", height: "40vh", overflowY: "auto" }}>
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Property
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Views
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Inquiries
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Favorites
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Calls
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Conversion
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Days Listed
										</th>
										<th className="text-left py-3 px-6 font-semibold text-gray-900">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{propertyAnalytics
										.filter(
											(property) =>
												selectedProperty === "all" ||
												property.id === selectedProperty
										)
										.map((property) => (
											<tr key={property.id} className="border-b">
												<td className="py-4 px-6">
													<div>
														<p className="font-semibold text-gray-900">
															{property.title}
														</p>
														<p className="text-sm text-gray-600">
															ID: {property.id}
														</p>
													</div>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<Eye className="w-4 h-4 text-gray-400 mr-2" />
														<span className="font-semibold">
															{property.views.toLocaleString()}
														</span>
													</div>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
														<span className="font-semibold">
															{property.inquiries}
														</span>
													</div>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<Heart className="w-4 h-4 text-gray-400 mr-2" />
														<span className="font-semibold">
															{property.favorites}
														</span>
													</div>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<Phone className="w-4 h-4 text-gray-400 mr-2" />
														<span className="font-semibold">
															{property.calls}
														</span>
													</div>
												</td>
												<td className="py-4 px-6">
													<span className="font-semibold text-green-600">
														{property.conversionRate}%
													</span>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<Calendar className="w-4 h-4 text-gray-400 mr-2" />
														<span>{property.daysListed} days</span>
													</div>
												</td>
												<td className="py-4 px-6">
													<Badge className={getStatusColor(property.status)}>
														{property.status}
													</Badge>
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</Card>

					{/* Market Insights */}
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Market Insights
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{marketInsights.map((insight: MarketInsight, index: number) => (
								<Card key={index} className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-900 mb-1">
												{insight.title}
											</h3>
											<p className="text-2xl font-bold text-blue-600">
												{insight.value}
											</p>
										</div>
										<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
											<TrendingUp className="w-5 h-5 text-blue-600" />
										</div>
									</div>
									<p className="text-gray-600 mb-3">{insight.insight}</p>
									<div className="bg-blue-50 rounded-lg p-3">
										<p className="text-sm text-blue-800">
											<strong>Recommendation:</strong> {insight.recommendation}
										</p>
									</div>
								</Card>
							))}
						</div>
					</div>

					{/* Actions */}
					<Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								Want More Detailed Analytics?
							</h2>
							<p className="text-gray-600 mb-6">
								Upgrade to Premium for advanced insights, competitor analysis,
								and personalized recommendations
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg">
									<TrendingUp className="w-5 h-5 mr-2" />
									Upgrade to Premium
								</Button>
								<Button variant="outline" size="lg">
									<Users className="w-5 h-5 mr-2" />
									Schedule Consultation
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
