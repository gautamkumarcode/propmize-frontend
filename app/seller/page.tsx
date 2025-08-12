"use client";

import SellerLayout from "@/components/layout/SellerLayout";
import {
	Building,
	Eye,
	IndianRupee,
	MessageSquare,
	TrendingUp,
	Users,
} from "lucide-react";

export default function SellerDashboard() {
	const stats = [
		{
			title: "Total Listings",
			value: "12",
			change: "+2 this month",
			icon: Building,
			color: "bg-blue-500",
		},
		{
			title: "Total Views",
			value: "1,247",
			change: "+15.3%",
			icon: Eye,
			color: "bg-green-500",
		},
		{
			title: "Inquiries",
			value: "89",
			change: "+12 new",
			icon: MessageSquare,
			color: "bg-yellow-500",
		},
		{
			title: "Revenue",
			value: "₹2.8L",
			change: "+8.2%",
			icon: IndianRupee,
			color: "bg-purple-500",
		},
	];

	const recentInquiries = [
		{
			id: 1,
			property: "3BHK Apartment in Koramangala",
			buyer: "Rajesh Kumar",
			time: "2 hours ago",
			status: "new",
		},
		{
			id: 2,
			property: "2BHK Villa in Whitefield",
			buyer: "Priya Sharma",
			time: "4 hours ago",
			status: "replied",
		},
		{
			id: 3,
			property: "Commercial Space in MG Road",
			buyer: "Tech Solutions Pvt Ltd",
			time: "1 day ago",
			status: "new",
		},
	];

	const topProperties = [
		{
			id: 1,
			title: "3BHK Apartment in Koramangala",
			views: 234,
			inquiries: 15,
			image: "/placeholder-property.jpg",
		},
		{
			id: 2,
			title: "2BHK Villa in Whitefield",
			views: 189,
			inquiries: 12,
			image: "/placeholder-property.jpg",
		},
		{
			id: 3,
			title: "Commercial Space in MG Road",
			views: 156,
			inquiries: 8,
			image: "/placeholder-property.jpg",
		},
	];

	return (
		<SellerLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
					<h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
					<p className="text-blue-100">
						Here's what's happening with your properties today
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<div
							key={index}
							className="bg-white rounded-lg p-6 shadow-sm border">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 font-medium">
										{stat.title}
									</p>
									<p className="text-2xl font-bold text-gray-900 mt-1">
										{stat.value}
									</p>
									<p className="text-sm text-green-600 mt-1">{stat.change}</p>
								</div>
								<div className={`${stat.color} rounded-full p-3`}>
									<stat.icon className="h-6 w-6 text-white" />
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Inquiries */}
					<div className="bg-white rounded-lg p-6 shadow-sm border">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-gray-900">
								Recent Inquiries
							</h2>
							<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
								View All
							</button>
						</div>
						<div className="space-y-4">
							{recentInquiries.map((inquiry) => (
								<div
									key={inquiry.id}
									className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
									<div className="flex-shrink-0">
										<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
											<Users className="h-5 w-5 text-blue-600" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{inquiry.property}
										</p>
										<p className="text-sm text-gray-600">{inquiry.buyer}</p>
										<p className="text-xs text-gray-500 mt-1">{inquiry.time}</p>
									</div>
									<div className="flex-shrink-0">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
												inquiry.status === "new"
													? "bg-red-100 text-red-800"
													: "bg-green-100 text-green-800"
											}`}>
											{inquiry.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Top Performing Properties */}
					<div className="bg-white rounded-lg p-6 shadow-sm border">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-gray-900">
								Top Performing Properties
							</h2>
							<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
								View All
							</button>
						</div>
						<div className="space-y-4">
							{topProperties.map((property) => (
								<div
									key={property.id}
									className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
											<Building className="h-6 w-6 text-gray-600" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{property.title}
										</p>
										<div className="flex items-center space-x-4 mt-1">
											<div className="flex items-center text-xs text-gray-500">
												<Eye className="h-3 w-3 mr-1" />
												{property.views} views
											</div>
											<div className="flex items-center text-xs text-gray-500">
												<MessageSquare className="h-3 w-3 mr-1" />
												{property.inquiries} inquiries
											</div>
										</div>
									</div>
									<div className="flex-shrink-0">
										<TrendingUp className="h-5 w-5 text-green-500" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg p-6 shadow-sm border">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
							<Building className="h-8 w-8 text-blue-600 mb-2" />
							<p className="font-medium text-gray-900">Add New Property</p>
							<p className="text-sm text-gray-600">
								List a new property for sale or rent
							</p>
						</button>
						<button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
							<TrendingUp className="h-8 w-8 text-green-600 mb-2" />
							<p className="font-medium text-gray-900">Upgrade to Premium</p>
							<p className="text-sm text-gray-600">
								Get more visibility for your listings
							</p>
						</button>
						<button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
							<MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
							<p className="font-medium text-gray-900">Manage Inquiries</p>
							<p className="text-sm text-gray-600">
								Respond to buyer inquiries
							</p>
						</button>
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
