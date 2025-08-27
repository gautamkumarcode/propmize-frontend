"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMyInquiries } from "@/lib/react-query/hooks/useLeads";
import { Lead } from "@/lib/types/api";
import {
	Bath,
	Bed,
	Calendar,
	ChevronLeft,
	ChevronRight,
	MapPin,
	MessageSquare,
	Phone,
	Square,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Contacted() {
	const [currentPage, setCurrentPage] = useState(1);
	const [inquiriesPerPage, setInquiriesPerPage] = useState(10);

	const { data, isLoading, isError } = useMyInquiries({
		page: currentPage,
		limit: inquiriesPerPage,
	});

	const inquiries = data;
	const totalPages = 1;
	const totalInquiries = 0;
	const router = useRouter();

	const getStatusColor = (status: string) => {
		switch (status) {
			case "qualified":
			case "converted":
				return "bg-green-100 text-green-800";
			case "new":
			case "contacted":
				return "bg-yellow-100 text-yellow-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatContactDate = (dateString: string) => {
		const date = new Date(dateString);

		// Use consistent formatting to avoid hydration mismatch
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${day}/${month}/${year} at ${hours}:${minutes}`;
	};

	const handleCall = (phone: string) => {
		window.open(`tel:${phone}`);
	};

	const handleMessage = (contactId: string) => {
		router.push(`/chat/${contactId}`); // Assuming a chat route exists
	};

	return (
		<div className="min-h-screen bg-gray-50 py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-gray-900 flex items-center">
									<Phone className="w-6 h-6 mr-3 text-green-500" />
									Contacted Owners
								</h1>
								{isLoading ? (
									<p className="text-gray-600 mt-1">Loading contacts...</p>
								) : isError ? (
									<p className="text-red-600 mt-1">Error loading contacts.</p>
								) : (
									<p className="text-gray-600 mt-1">
										{totalInquiries} property owners contacted
									</p>
								)}
							</div>
							<div className="flex space-x-2">
								{!isLoading && !isError && (
									<>
										<Badge variant="secondary">
											{inquiries?.filter(
												(c) =>
													c.status === "qualified" || c.status === "converted"
											).length || 0}{" "}
											Responded
										</Badge>
										<Badge variant="secondary">
											{inquiries?.filter(
												(c) => c.status === "new" || c.status === "contacted"
											).length || 0}{" "}
											Pending
										</Badge>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Contacts List */}
					{isLoading ? (
						<p>Loading inquiries...</p>
					) : isError ? (
						<p>Error loading inquiries.</p>
					) : inquiries && inquiries.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{inquiries.map((contact: Lead) => (
								<Card
									key={contact._id}
									className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
									<img
										src={
											contact.property?.images[0] || "/api/placeholder/400/250"
										}
										alt={contact.property?.title || "Property Image"}
										className="w-full h-48 object-cover"
									/>
									<div className="p-5">
										<div className="flex items-start justify-between mb-3">
											<Link href={`/property/${contact.property?._id}`}>
												<h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-tight">
													{contact.property?.title || "N/A"}
												</h3>
											</Link>
											<Badge
												className={`${getStatusColor(
													contact.status || "new"
												)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
												{contact.status === "new" ||
												contact.status === "contacted"
													? "Pending"
													: contact.status}
											</Badge>
										</div>

										<p className="text-2xl font-bold text-blue-700 mb-3">
											{contact.property?.price || "N/A"}
										</p>

										<div className="flex items-center text-gray-600 text-sm mb-4 space-x-4">
											<span className="flex items-center">
												<MapPin className="w-4 h-4 mr-1" />{" "}
												{contact.property?.address.city},{" "}
												{contact.property?.address.state}
											</span>
										</div>

										<div className="grid grid-cols-3 gap-2 text-sm text-gray-700 border-t border-b py-3 mb-4">
											<span className="flex items-center">
												<Bed className="w-4 h-4 mr-1" />{" "}
												{contact.property?.bedrooms} Beds
											</span>
											<span className="flex items-center">
												<Bath className="w-4 h-4 mr-1" />{" "}
												{contact.property?.bathrooms} Baths
											</span>
											<span className="flex items-center">
												<Square className="w-4 h-4 mr-1" />{" "}
												{contact.property?.area?.value}{" "}
												{contact.property?.area?.unit}
											</span>
										</div>

										<div className="flex items-center space-x-3 mb-4">
											<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
												{contact.seller?.avatar ? (
													<img
														src={contact.seller.avatar}
														alt={contact.seller.name || "Seller"}
														className="w-full h-full object-cover"
													/>
												) : (
													<User className="w-5 h-5 text-gray-500" />
												)}
											</div>
											<div>
												<p className="font-medium text-gray-800">
													{contact.seller?.name || "Unknown Seller"}
												</p>
												<p className="text-xs text-gray-500 flex items-center">
													<Phone className="w-3 h-3 mr-1" />{" "}
													{contact.seller?.phone || "N/A"}
												</p>
											</div>
										</div>

										<div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700 mb-4">
											<p className="font-semibold mb-2">Last Message:</p>
											<p className="text-gray-700 mb-2">
												{contact.followUps?.[contact.followUps.length - 1]
													?.notes ||
													contact.message ||
													"No messages yet"}
											</p>
											<div className="flex items-center text-xs text-gray-500">
												<Calendar className="w-3 h-3 mr-1" />
												<span>
													{formatContactDate(
														contact.createdAt?.toString() || ""
													)}
												</span>
												<MessageSquare className="w-3 h-3 ml-4 mr-1" />
												<span>
													{(contact.message ? 1 : 0) +
														(contact.followUps?.length || 0)}{" "}
													messages
												</span>
											</div>
										</div>

										<div className="flex flex-wrap gap-2 justify-center">
											<Button
												size="sm"
												onClick={() => handleCall(contact.seller?.phone || "")}
												variant="outline"
												className="flex-1">
												<Phone className="w-4 h-4 mr-2" /> Call
											</Button>
											<Button
												size="sm"
												onClick={() => handleMessage(contact._id || "")}
												className="flex-1">
												<MessageSquare className="w-4 h-4 mr-2" /> Message
											</Button>
											<Link
												href={`/property/${contact.property?._id}`}
												className="flex-1">
												<Button size="sm" variant="outline" className="w-full">
													View Property
												</Button>
											</Link>
										</div>
									</div>
								</Card>
							))}
						</div>
					) : (
						<Card className="p-12 text-center">
							<Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No Contacts Yet
							</h3>
							<p className="text-gray-600 mb-6">
								Property owners you contact will appear here
							</p>
							<Button>Explore Properties</Button>
						</Card>
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
				</div>
			</div>
		</div>
	);
}
