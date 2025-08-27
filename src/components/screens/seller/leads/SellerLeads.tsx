"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDeleteLead, useMyLeads } from "@/lib/react-query/hooks/useLeads";
import { QueryKeys } from "@/lib/react-query/queryClient";
import { Lead } from "@/lib/types/api"; // Assuming Lead type is defined here
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	ChevronLeft,
	ChevronRight,
	Filter,
	RefreshCcw,
	Search,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SellerLeads() {
	const [currentPage, setCurrentPage] = React.useState(1);
	const [leadsPerPage, setLeadsPerPage] = React.useState(10);
	const [statusFilter, setStatusFilter] = React.useState<string | undefined>(
		undefined
	);
	const [searchQuery, setSearchQuery] = React.useState<string | undefined>(
		undefined
	);

	const { data, isLoading, isError } = useMyLeads({
		page: currentPage,
		limit: leadsPerPage,
		status: statusFilter === "all" ? undefined : (statusFilter as any),
		search: searchQuery,
	});

	const leads = data?.data;
	const totalPages = data?.meta?.totalPages || 1;
	const totalLeads = data?.meta?.total || 0;

	const deleteLeadMutation = useDeleteLead();
	const queryClient = useQueryClient();

	const handleDelete = async (leadId: string) => {
		try {
			await deleteLeadMutation.mutateAsync(leadId);
			// The onSuccess of useDeleteLead already invalidates queries, but we can add a toast here if needed
		} catch (error) {
			console.error("Failed to delete lead:", error);
		}
	};

	const handleRefresh = () => {
		queryClient.invalidateQueries({ queryKey: QueryKeys.myLeads });
	};

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
				Error loading leads. Please try again later.
			</div>
		);
	}

	return (
		<div className="  py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Seller Leads</CardTitle>
					<p className="text-gray-600">
						Manage inquiries from interested buyers.
					</p>
					<Button
						onClick={handleRefresh}
						variant="outline"
						size="sm"
						className="ml-auto">
						<RefreshCcw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</CardHeader>
				<CardContent>
					{/* Filters and Search */}
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search leads..."
								className="pl-10"
								value={searchQuery || ""}
								onChange={(e) => setSearchQuery(e.target.value || undefined)}
							/>
						</div>
						<Select
							value={statusFilter || "all"}
							onValueChange={(value) => {
								setStatusFilter(value);
								setCurrentPage(1);
							}}>
							<SelectTrigger className="w-[180px]">
								<Filter className="w-4 h-4 mr-2 text-gray-400" />
								<SelectValue placeholder="Filter by Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="new">New</SelectItem>
								<SelectItem value="contacted">Contacted</SelectItem>
								<SelectItem value="qualified">Qualified</SelectItem>
								<SelectItem value="converted">Converted</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{leads && leads.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Property</TableHead>
									<TableHead>Buyer</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leads.map((lead: Lead) => (
									<TableRow key={lead._id}>
										<TableCell>
											<Link
												href={`/property/${lead.property?._id}`}
												className="font-medium hover:text-blue-600">
												{lead.property?.title || "N/A"}
											</Link>
										</TableCell>
										<TableCell>{lead.buyer?.name || "N/A"}</TableCell>
										<TableCell>
											<Badge
												className={`capitalize ${
													lead.status === "new"
														? "bg-blue-100 text-blue-800"
														: lead.status === "contacted"
														? "bg-yellow-100 text-yellow-800"
														: lead.status === "qualified"
														? "bg-green-100 text-green-800"
														: lead.status === "converted"
														? "bg-purple-100 text-purple-800" // Added color for converted
														: lead.status === "rejected"
														? "bg-red-100 text-red-800" // Added color for rejected
														: "bg-gray-100 text-gray-800"
												}`}>
												{lead.status}
											</Badge>
										</TableCell>
										<TableCell>
											{format(new Date(lead.createdAt), "MMM d, yyyy")}
										</TableCell>
										<TableCell className="flex space-x-2">
											<Link href={`/seller/leads/${lead._id}`}>
												<Button variant="outline" size="sm">
													View Details
												</Button>
											</Link>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button variant="destructive" size="sm">
														Delete
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Are you absolutely sure?
														</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will
															permanently delete this lead and remove its data
															from our servers.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDelete(lead._id)}>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-center p-8">
							<p className="text-gray-500">No leads found.</p>
							<p className="text-gray-400 mt-2">
								New inquiries from buyers will appear here.
							</p>
						</div>
					)}

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex justify-center items-center space-x-2 mt-6">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm text-gray-700">
								Page {currentPage} of {totalPages}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages}>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
