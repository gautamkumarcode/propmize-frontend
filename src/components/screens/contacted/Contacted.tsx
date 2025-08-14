"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Bath,
	Bed,
	Calendar,
	MapPin,
	MessageSquare,
	Phone,
	Square,
	User,
} from "lucide-react";
import { useState } from "react";

export default function Contacted() {
	const [contacts, setContacts] = useState([
		{
			id: 1,
			property: {
				title: "3BHK Luxury Apartment",
				location: "Koramangala, Bangalore",
				price: "₹1.2 Cr",
				beds: 3,
				baths: 3,
				area: "1450 sq ft",
				image: "/api/placeholder/300/200",
			},
			owner: {
				name: "Suresh Sharma",
				phone: "+91 98765 43210",
				avatar: "/api/placeholder/40/40",
			},
			contactDate: "2024-01-15T10:30:00",
			status: "Responded",
			lastMessage:
				"Property is available for viewing. When would you like to visit?",
			messageCount: 5,
		},
		{
			id: 2,
			property: {
				title: "2BHK Modern Flat",
				location: "Whitefield, Bangalore",
				price: "₹85 Lakh",
				beds: 2,
				baths: 2,
				area: "1200 sq ft",
				image: "/api/placeholder/300/200",
			},
			owner: {
				name: "Priya Reddy",
				phone: "+91 87654 32109",
				avatar: "/api/placeholder/40/40",
			},
			contactDate: "2024-01-14T15:45:00",
			status: "Pending",
			lastMessage: "Interested in viewing this property",
			messageCount: 1,
		},
		{
			id: 3,
			property: {
				title: "4BHK Villa with Garden",
				location: "HSR Layout, Bangalore",
				price: "₹2.5 Cr",
				beds: 4,
				baths: 4,
				area: "2800 sq ft",
				image: "/api/placeholder/300/200",
			},
			owner: {
				name: "Rakesh Kumar",
				phone: "+91 76543 21098",
				avatar: "/api/placeholder/40/40",
			},
			contactDate: "2024-01-12T09:15:00",
			status: "Not Interested",
			lastMessage:
				"Thank you for your interest, but the property is no longer available.",
			messageCount: 3,
		},
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Responded":
				return "bg-green-100 text-green-800";
			case "Pending":
				return "bg-yellow-100 text-yellow-800";
			case "Not Interested":
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

	const handleMessage = (contactId: number) => {
		console.log("Opening messages for contact:", contactId);
	};

	return (
		<BuyerLayout>
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
									<p className="text-gray-600 mt-1">
										{contacts.length} property owners contacted
									</p>
								</div>
								<div className="flex space-x-2">
									<Badge variant="secondary">
										{contacts.filter((c) => c.status === "Responded").length}{" "}
										Responded
									</Badge>
									<Badge variant="secondary">
										{contacts.filter((c) => c.status === "Pending").length}{" "}
										Pending
									</Badge>
								</div>
							</div>
						</div>

						{/* Contacts List */}
						{contacts.length > 0 ? (
							<div className="space-y-4">
								{contacts.map((contact) => (
									<Card key={contact.id} className="overflow-hidden">
										<div className="flex flex-col lg:flex-row">
											<div className="lg:w-80">
												<img
													src={contact.property.image}
													alt={contact.property.title}
													className="w-full h-48 lg:h-full object-cover"
												/>
											</div>

											<div className="flex-1 p-6">
												<div className="flex items-start justify-between mb-4">
													<div className="flex-1">
														<div className="flex items-center justify-between mb-2">
															<h3 className="text-xl font-semibold text-gray-900">
																{contact.property.title}
															</h3>
															<Badge className={getStatusColor(contact.status)}>
																{contact.status}
															</Badge>
														</div>
														<p className="text-gray-600 flex items-center mb-2">
															<MapPin className="w-4 h-4 mr-1" />
															{contact.property.location}
														</p>
														<p className="text-lg font-semibold text-blue-600 mb-3">
															{contact.property.price}
														</p>

														<div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
															<span className="flex items-center">
																<Bed className="w-4 h-4 mr-1" />
																{contact.property.beds} Beds
															</span>
															<span className="flex items-center">
																<Bath className="w-4 h-4 mr-1" />
																{contact.property.baths} Baths
															</span>
															<span className="flex items-center">
																<Square className="w-4 h-4 mr-1" />
																{contact.property.area}
															</span>
														</div>
													</div>
												</div>

												<div className="border-t pt-4">
													<div className="flex items-start justify-between mb-3">
														<div className="flex items-center space-x-3">
															<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
																<User className="w-5 h-5 text-gray-600" />
															</div>
															<div>
																<p className="font-medium text-gray-900">
																	{contact.owner.name}
																</p>
																<p className="text-sm text-gray-600">
																	{contact.owner.phone}
																</p>
															</div>
														</div>
														<div className="text-right text-sm text-gray-500">
															<div className="flex items-center">
																<Calendar className="w-4 h-4 mr-1" />
																{formatContactDate(contact.contactDate)}
															</div>
															<div className="flex items-center mt-1">
																<MessageSquare className="w-4 h-4 mr-1" />
																{contact.messageCount} messages
															</div>
														</div>
													</div>

													<div className="bg-gray-50 rounded-lg p-3 mb-4">
														<p className="text-sm text-gray-700">
															<span className="font-medium">Last message:</span>{" "}
															{contact.lastMessage}
														</p>
													</div>

													<div className="flex items-center space-x-3">
														<Button
															size="sm"
															onClick={() => handleCall(contact.owner.phone)}
															variant="outline">
															<Phone className="w-4 h-4 mr-1" />
															Call
														</Button>
														<Button
															size="sm"
															onClick={() => handleMessage(contact.id)}>
															<MessageSquare className="w-4 h-4 mr-1" />
															Message
														</Button>
														<Button size="sm" variant="outline">
															View Property
														</Button>
													</div>
												</div>
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
					</div>
				</div>
			</div>
		</BuyerLayout>
	);
}
