"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNewlyAddedProperties } from "@/lib";
import {
	Building,
	Calendar,
	MapPin,
	Percent,
	Phone,
	Users,
} from "lucide-react";
import { useState } from "react";

export default function NewProjects() {
	const { data: newProjectsData, isLoading } = useNewlyAddedProperties();

	const [filter, setFilter] = useState("all");

	// Filter projects based on status
	const filteredProjects = (newProjectsData || []).filter((project) => {
		if (filter === "all") return true;
		if (filter === "pre-launch") return project.status === "Pre-Launch";
		if (filter === "launched") return project.status === "Launched";
		if (filter === "ready-to-move") return project.status === "Ready to Move";
		return true;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Pre-Launch":
				return "bg-orange-100 text-orange-800";
			case "Launched":
				return "bg-green-100 text-green-800";
			case "Booking Open":
				return "bg-blue-100 text-blue-800";
			case "Ready to Move":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Dummy interest handler
	const handleInterest = (projectId: string) => {
		alert("Interest shown for project: " + projectId);
	};

	const handleContact = (projectId: string) => {
		alert("Contact requested for project: " + projectId);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm p-4">
						<div className="flex lg:items-center justify-between lg:flex-row flex-col gap-4">
							<div>
								<h1 className="text-2xl font-bold text-gray-900 flex items-center">
									New Projects
								</h1>
								<p className="text-gray-600 mt-1">
									{filteredProjects.length} new residential projects available
								</p>
							</div>

							<div className="bg-white rounded-lg shadow-sm p-4 ">
								<div className="flex space-x-4 flex-wrap gap-4 justify-between">
									<Button
										variant={filter === "all" ? "default" : "outline"}
										size="sm"
										onClick={() => setFilter("all")}
										aria-label="Show all projects">
										All Projects
									</Button>
									<Button
										variant={filter === "pre-launch" ? "default" : "outline"}
										size="sm"
										onClick={() => setFilter("pre-launch")}
										aria-label="Show pre-launch projects">
										Pre-Launch
									</Button>
									<Button
										variant={filter === "launched" ? "default" : "outline"}
										size="sm"
										onClick={() => setFilter("launched")}
										aria-label="Show launched projects">
										Launched
									</Button>
									<Button
										variant={filter === "ready-to-move" ? "default" : "outline"}
										size="sm"
										onClick={() => setFilter("ready-to-move")}
										aria-label="Show ready to move projects">
										Ready to Move
									</Button>
								</div>
							</div>
							{/* Loading State */}
							{isLoading && (
								<div className="flex justify-center items-center py-12">
									<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
								</div>
							)}
							{/* Empty State */}
							{!isLoading && filteredProjects.length === 0 && (
								<div className="flex flex-col items-center py-16">
									<img
										src="/empty-state.svg"
										alt="No projects"
										className="w-32 h-32 mb-4"
									/>
									<h2 className="text-xl font-semibold text-gray-700 mb-2">
										No new projects found
									</h2>
									<p className="text-gray-500">
										Try changing your filter or check back later.
									</p>
								</div>
							)}
							{/* Projects List */}
							<div className="space-y-6">
								{filteredProjects.map((project) => (
									<Card key={project._id} className="overflow-hidden">
										<div className="flex flex-col lg:flex-row">
											<div className="lg:w-96 w-full">
												<img
													src={
														project.images && project.images.length > 0
															? project.images[0]
															: "/public/next.svg"
													}
													alt={project.title || "Property image"}
													className="w-full h-64 lg:h-full object-cover bg-gray-200"
													loading="lazy"
												/>
											</div>
											<div className="flex-1 p-6">
												<div className="flex items-start justify-between mb-4">
													<div className="flex-1">
														<div className="flex items-center justify-between mb-2">
															<h3 className="text-2xl font-bold text-gray-900">
																{project.title}
															</h3>
															<Badge className={getStatusColor(project.status)}>
																{project.status}
															</Badge>
														</div>
														<p className="text-lg font-medium text-gray-700 mb-1">
															by {project.postedBy?.name || "Unknown"}
														</p>
														<p className="text-gray-600 flex items-center mb-2">
															<MapPin className="w-4 h-4 mr-1" />
															{project.address?.city || ""},{" "}
															{project.address?.state || ""} -{" "}
															{project.address?.zipCode || ""}
														</p>
														<div className="flex items-center space-x-4 mb-3">
															<div className="flex items-center text-sm text-gray-600">
																<Users className="w-4 h-4 mr-1" />
																{project.likedBy?.length || 0} interested
															</div>
														</div>
													</div>
												</div>
												<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
													<div>
														<p className="text-sm text-gray-500">Price Range</p>
														<p className="font-semibold text-blue-600">
															{project.price || "N/A"}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">
															Configuration
														</p>
														<p className="font-semibold">
															{Array.isArray(project.features)
																? project.features.join(", ")
																: "N/A"}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Total Units</p>
														<p className="font-semibold">
															{project.totalUnits ?? "N/A"}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Available</p>
														<p className="font-semibold text-green-600">
															{project.availableUnits ?? "N/A"}
														</p>
													</div>
												</div>
												<div className="mb-4">
													<h4 className="font-medium text-gray-900 mb-2">
														Special Offers
													</h4>
													<div className="flex flex-wrap gap-2">
														{Array.isArray(project.offers) &&
														project.offers.length > 0 ? (
															project.offers.map((offer, index: number) => (
																<Badge
																	key={index}
																	variant="secondary"
																	className="text-xs">
																	<Percent className="w-3 h-3 mr-1" />
																	{offer}
																</Badge>
															))
														) : (
															<span className="text-xs text-gray-400">
																No offers
															</span>
														)}
													</div>
												</div>
												<div className="mb-4">
													<h4 className="font-medium text-gray-900 mb-2">
														Key Amenities
													</h4>
													<div className="flex flex-wrap gap-2">
														{Array.isArray(project.amenities) &&
														project.amenities.length > 0 ? (
															project.amenities
																.slice(0, 4)
																.map((amenity, index: number) => (
																	<Badge
																		key={index}
																		variant="outline"
																		className="text-xs">
																		{amenity}
																	</Badge>
																))
														) : (
															<span className="text-xs text-gray-400">
																No amenities
															</span>
														)}
														{Array.isArray(project.amenities) &&
															project.amenities.length > 4 && (
																<Badge variant="outline" className="text-xs">
																	+{project.amenities.length - 4} more
																</Badge>
															)}
													</div>
												</div>
												<div className="flex items-center justify-between pt-4 border-t">
													<div className="flex items-center space-x-4 text-sm text-gray-600">
														<div className="flex items-center">
															<Calendar className="w-4 h-4 mr-1" />
															Launch:{" "}
															{project.launchDate
																? (() => {
																		const date = new Date(project.launchDate);
																		const day = date
																			.getDate()
																			.toString()
																			.padStart(2, "0");
																		const month = (date.getMonth() + 1)
																			.toString()
																			.padStart(2, "0");
																		const year = date.getFullYear();
																		return `${day}/${month}/${year}`;
																  })()
																: "N/A"}
														</div>
														<div className="flex items-center">
															<Building className="w-4 h-4 mr-1" />
															Possession:{" "}
															{project.possessionDate
																? (() => {
																		const date = new Date(
																			project.possessionDate
																		);
																		const day = date
																			.getDate()
																			.toString()
																			.padStart(2, "0");
																		const month = (date.getMonth() + 1)
																			.toString()
																			.padStart(2, "0");
																		const year = date.getFullYear();
																		return `${day}/${month}/${year}`;
																  })()
																: "N/A"}
														</div>
													</div>
													<div className="flex items-center space-x-3">
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleInterest(project._id)}
															aria-label={`Show interest in ${project.title}`}>
															Show Interest
														</Button>
														<Button
															size="sm"
															onClick={() => handleContact(project._id)}
															aria-label={`Contact for ${project.title}`}>
															<Phone className="w-4 h-4 mr-1" />
															Contact
														</Button>
													</div>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
																		
