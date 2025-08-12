"use client";

import SellerLayout from "@/components/layout/SellerLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Calendar,
	Clock,
	Eye,
	Filter,
	Mail,
	MessageSquare,
	Phone,
	Search,
	Star,
	TrendingUp,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";

interface Lead {
	id: string;
	name: string;
	email: string;
	phone: string;
	property: string;
	propertyType: string;
	budget: string;
	status: "New" | "Contacted" | "Qualified" | "Unqualified" | "Converted";
	priority: "High" | "Medium" | "Low";
	source: string;
	lastActivity: string;
	rating: number;
	notes: string;
}

export default function SellerLeads() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

	const [leads] = useState<Lead[]>([
		{
			id: "L001",
			name: "Arjun Sharma",
			email: "arjun.sharma@email.com",
			phone: "+91-9876543210",
			property: "2 BHK Apartment in Gurgaon",
			propertyType: "Apartment",
			budget: "₹50-60 Lakhs",
			status: "New",
			priority: "High",
			source: "Website",
			lastActivity: "2 hours ago",
			rating: 5,
			notes: "Very interested, wants to visit this weekend",
		},
		{
			id: "L002",
			name: "Priya Patel",
			email: "priya.patel@email.com",
			phone: "+91-9876543211",
			property: "3 BHK Villa in Mumbai",
			propertyType: "Villa",
			budget: "₹1-1.2 Crores",
			status: "Contacted",
			priority: "Medium",
			source: "Social Media",
			lastActivity: "1 day ago",
			rating: 4,
			notes: "Responded positively, scheduled call for tomorrow",
		},
		{
			id: "L003",
			name: "Rahul Verma",
			email: "rahul.verma@email.com",
			phone: "+91-9876543212",
			property: "1 BHK Flat in Bangalore",
			propertyType: "Apartment",
			budget: "₹25-30 Lakhs",
			status: "Qualified",
			priority: "High",
			source: "Referral",
			lastActivity: "3 days ago",
			rating: 5,
			notes: "Serious buyer, pre-approved for loan",
		},
		{
			id: "L004",
			name: "Sunita Gupta",
			email: "sunita.gupta@email.com",
			phone: "+91-9876543213",
			property: "2 BHK Apartment in Delhi",
			propertyType: "Apartment",
			budget: "₹40-45 Lakhs",
			status: "Unqualified",
			priority: "Low",
			source: "Website",
			lastActivity: "1 week ago",
			rating: 2,
			notes: "Budget doesn't match property price",
		},
		{
			id: "L005",
			name: "Amit Singh",
			email: "amit.singh@email.com",
			phone: "+91-9876543214",
			property: "3 BHK Penthouse in Pune",
			propertyType: "Penthouse",
			budget: "₹80-90 Lakhs",
			status: "Converted",
			priority: "High",
			source: "Agent",
			lastActivity: "2 weeks ago",
			rating: 5,
			notes: "Deal closed successfully",
		},
	]);

	const stats = [
		{ label: "Total Leads", value: "127", change: "+12%", icon: Users },
		{ label: "This Month", value: "23", change: "+8%", icon: Calendar },
		{ label: "Conversion Rate", value: "18%", change: "+3%", icon: TrendingUp },
		{
			label: "Response Rate",
			value: "87%",
			change: "+5%",
			icon: MessageSquare,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "new":
				return "bg-blue-100 text-blue-800";
			case "contacted":
				return "bg-yellow-100 text-yellow-800";
			case "qualified":
				return "bg-green-100 text-green-800";
			case "unqualified":
				return "bg-red-100 text-red-800";
			case "converted":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const filteredLeads = leads.filter(
		(lead) =>
			(statusFilter === "all" ||
				lead.status.toLowerCase() === statusFilter.toLowerCase()) &&
			(searchQuery === "" ||
				lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.property.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }).map((_, index) => (
			<Star
				key={index}
				className={`w-4 h-4 ${
					index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
				}`}
			/>
		));
	};

	return (
		<SellerLayout>
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-8">
						{/* Header */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									Lead Management
								</h1>
								<p className="text-gray-600 mt-2">
									Manage and track your property inquiries
								</p>
							</div>
							<div className="flex space-x-3 mt-4 md:mt-0">
								<Button variant="outline">
									<Filter className="w-4 h-4 mr-2" />
									Export Leads
								</Button>
								<Button>
									<Users className="w-4 h-4 mr-2" />
									Import Leads
								</Button>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{stats.map((stat, index) => {
								const IconComponent = stat.icon;
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
												<p className="text-sm text-green-600">{stat.change}</p>
											</div>
											<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
												<IconComponent className="w-6 h-6 text-blue-600" />
											</div>
										</div>
									</Card>
								);
							})}
						</div>

						{/* Filters and Search */}
						<Card className="p-6">
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<Input
										placeholder="Search leads by name, email, or property..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									<Button
										variant={statusFilter === "all" ? "default" : "outline"}
										size="sm"
										onClick={() => setStatusFilter("all")}>
										All ({leads.length})
									</Button>
									<Button
										variant={statusFilter === "new" ? "default" : "outline"}
										size="sm"
										onClick={() => setStatusFilter("new")}>
										New ({leads.filter((l) => l.status === "New").length})
									</Button>
									<Button
										variant={
											statusFilter === "contacted" ? "default" : "outline"
										}
										size="sm"
										onClick={() => setStatusFilter("contacted")}>
										Contacted (
										{leads.filter((l) => l.status === "Contacted").length})
									</Button>
									<Button
										variant={
											statusFilter === "qualified" ? "default" : "outline"
										}
										size="sm"
										onClick={() => setStatusFilter("qualified")}>
										Qualified (
										{leads.filter((l) => l.status === "Qualified").length})
									</Button>
								</div>
							</div>
						</Card>

						{/* Leads Table */}
						<Card className="overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Lead
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Property
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Budget
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Status
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Priority
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Rating
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Last Activity
											</th>
											<th className="text-left py-3 px-6 font-semibold text-gray-900">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredLeads.map((lead) => (
											<tr
												key={lead.id}
												className="border-b hover:bg-gray-50 cursor-pointer"
												onClick={() => setSelectedLead(lead)}>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<Avatar className="w-10 h-10 mr-3">
															<div className="w-full h-full bg-blue-100 flex items-center justify-center">
																<User className="w-5 h-5 text-blue-600" />
															</div>
														</Avatar>
														<div>
															<p className="font-semibold text-gray-900">
																{lead.name}
															</p>
															<p className="text-sm text-gray-600">
																{lead.email}
															</p>
															<p className="text-sm text-gray-600">
																{lead.phone}
															</p>
														</div>
													</div>
												</td>
												<td className="py-4 px-6">
													<p className="font-medium text-gray-900">
														{lead.property}
													</p>
													<p className="text-sm text-gray-600">
														{lead.propertyType}
													</p>
												</td>
												<td className="py-4 px-6">
													<p className="font-medium text-gray-900">
														{lead.budget}
													</p>
													<p className="text-xs text-gray-500">
														Source: {lead.source}
													</p>
												</td>
												<td className="py-4 px-6">
													<Badge className={getStatusColor(lead.status)}>
														{lead.status}
													</Badge>
												</td>
												<td className="py-4 px-6">
													<Badge className={getPriorityColor(lead.priority)}>
														{lead.priority}
													</Badge>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														{renderStars(lead.rating)}
														<span className="ml-2 text-sm text-gray-600">
															{lead.rating}/5
														</span>
													</div>
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center text-sm text-gray-600">
														<Clock className="w-4 h-4 mr-1" />
														{lead.lastActivity}
													</div>
												</td>
												<td className="py-4 px-6">
													<div className="flex space-x-2">
														<Button size="sm" variant="outline">
															<Phone className="w-4 h-4" />
														</Button>
														<Button size="sm" variant="outline">
															<Mail className="w-4 h-4" />
														</Button>
														<Button size="sm" variant="outline">
															<Eye className="w-4 h-4" />
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{filteredLeads.length === 0 && (
								<div className="text-center py-12">
									<Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										No leads found
									</h3>
									<p className="text-gray-600">
										Try adjusting your search or filter criteria
									</p>
								</div>
							)}
						</Card>

						{/* Lead Detail Modal (simplified) */}
						{selectedLead && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
								<Card className="max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
									<div className="p-6">
										<div className="flex items-center justify-between mb-6">
											<h2 className="text-2xl font-bold text-gray-900">
												Lead Details
											</h2>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setSelectedLead(null)}>
												Close
											</Button>
										</div>

										<div className="space-y-6">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Name
													</label>
													<p className="text-gray-900">{selectedLead.name}</p>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Email
													</label>
													<p className="text-gray-900">{selectedLead.email}</p>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Phone
													</label>
													<p className="text-gray-900">{selectedLead.phone}</p>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Budget
													</label>
													<p className="text-gray-900">{selectedLead.budget}</p>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Property of Interest
												</label>
												<p className="text-gray-900">{selectedLead.property}</p>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Notes
												</label>
												<p className="text-gray-900">{selectedLead.notes}</p>
											</div>

											<div className="flex space-x-4">
												<Button className="flex-1">
													<Phone className="w-4 h-4 mr-2" />
													Call Now
												</Button>
												<Button variant="outline" className="flex-1">
													<Mail className="w-4 h-4 mr-2" />
													Send Email
												</Button>
												<Button variant="outline" className="flex-1">
													<MessageSquare className="w-4 h-4 mr-2" />
													Message
												</Button>
											</div>
										</div>
									</div>
								</Card>
							</div>
						)}
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
