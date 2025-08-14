"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Building,
	Calendar,
	Filter,
	MapPin,
	Percent,
	Phone,
	Star,
	Users,
} from "lucide-react";
import { useState } from "react";

export default function NewProjects() {
	const [projects, setProjects] = useState([
		{
			id: 1,
			name: "Prestige Lakeside Habitat",
			builder: "Prestige Group",
			location: "Whitefield, Bangalore",
			priceRange: "₹1.2 Cr - ₹2.8 Cr",
			configuration: "2, 3, 4 BHK",
			totalUnits: 850,
			availableUnits: 234,
			launchDate: "2024-01-01",
			possessionDate: "2026-12-31",
			status: "Pre-Launch",
			offers: ["Early Bird Discount: 5%", "Zero Registration Fee"],
			amenities: ["Swimming Pool", "Gym", "Clubhouse", "Kids Play Area"],
			image: "/api/placeholder/400/250",
			rating: 4.5,
			interested: 432,
		},
		{
			id: 2,
			name: "Brigade Cornerstone Utopia",
			builder: "Brigade Group",
			location: "Electronic City, Bangalore",
			priceRange: "₹95 L - ₹1.8 Cr",
			configuration: "2, 3 BHK",
			totalUnits: 612,
			availableUnits: 89,
			launchDate: "2024-02-15",
			possessionDate: "2027-06-30",
			status: "Launched",
			offers: ["Construction Linked Payment", "Free Car Parking"],
			amenities: ["Rooftop Garden", "Business Center", "Spa", "Library"],
			image: "/api/placeholder/400/250",
			rating: 4.3,
			interested: 298,
		},
		{
			id: 3,
			name: "Godrej Woodscapes",
			builder: "Godrej Properties",
			location: "Budigere Cross, Bangalore",
			priceRange: "₹1.5 Cr - ₹3.2 Cr",
			configuration: "3, 4 BHK",
			totalUnits: 1200,
			availableUnits: 756,
			launchDate: "2024-03-01",
			possessionDate: "2027-12-31",
			status: "Booking Open",
			offers: ["Subvention Scheme", "Assured Rental Returns: 8%"],
			amenities: ["Golf Course", "International School", "Hospital", "Mall"],
			image: "/api/placeholder/400/250",
			rating: 4.7,
			interested: 645,
		},
	]);

	const [filter, setFilter] = useState("all");

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Pre-Launch":
				return "bg-orange-100 text-orange-800";
			case "Launched":
				return "bg-green-100 text-green-800";
			case "Booking Open":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleInterest = (projectId: number) => {
		setProjects(
			projects.map((project) =>
				project.id === projectId
					? { ...project, interested: project.interested + 1 }
					: project
			)
		);
	};

	const handleContact = (projectId: number) => {
		console.log("Contacting for project:", projectId);
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
										<Building className="w-6 h-6 mr-3 text-purple-500" />
										New Projects in Bangalore
									</h1>
									<p className="text-gray-600 mt-1">
										{projects.length} new residential projects available
									</p>
								</div>
								<Button variant="outline">
									<Filter className="w-4 h-4 mr-2" />
									Filter Projects
								</Button>
							</div>
						</div>

						{/* Filter Tabs */}
						<div className="bg-white rounded-lg shadow-sm p-4">
							<div className="flex space-x-4">
								<Button
									variant={filter === "all" ? "default" : "outline"}
									size="sm"
									onClick={() => setFilter("all")}>
									All Projects
								</Button>
								<Button
									variant={filter === "pre-launch" ? "default" : "outline"}
									size="sm"
									onClick={() => setFilter("pre-launch")}>
									Pre-Launch
								</Button>
								<Button
									variant={filter === "launched" ? "default" : "outline"}
									size="sm"
									onClick={() => setFilter("launched")}>
									Launched
								</Button>
								<Button
									variant={filter === "ready-to-move" ? "default" : "outline"}
									size="sm"
									onClick={() => setFilter("ready-to-move")}>
									Ready to Move
								</Button>
							</div>
						</div>

						{/* Projects List */}
						<div className="space-y-6">
							{projects.map((project) => (
								<Card key={project.id} className="overflow-hidden">
									<div className="flex flex-col lg:flex-row">
										<div className="lg:w-96">
											<img
												src={project.image}
												alt={project.name}
												className="w-full h-64 lg:h-full object-cover"
											/>
										</div>

										<div className="flex-1 p-6">
											<div className="flex items-start justify-between mb-4">
												<div className="flex-1">
													<div className="flex items-center justify-between mb-2">
														<h3 className="text-2xl font-bold text-gray-900">
															{project.name}
														</h3>
														<Badge className={getStatusColor(project.status)}>
															{project.status}
														</Badge>
													</div>
													<p className="text-lg font-medium text-gray-700 mb-1">
														by {project.builder}
													</p>
													<p className="text-gray-600 flex items-center mb-2">
														<MapPin className="w-4 h-4 mr-1" />
														{project.location}
													</p>
													<div className="flex items-center space-x-4 mb-3">
														<div className="flex items-center">
															<Star className="w-4 h-4 text-yellow-500 mr-1" />
															<span className="text-sm font-medium">
																{project.rating}
															</span>
														</div>
														<div className="flex items-center text-sm text-gray-600">
															<Users className="w-4 h-4 mr-1" />
															{project.interested} interested
														</div>
													</div>
												</div>
											</div>

											<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
												<div>
													<p className="text-sm text-gray-500">Price Range</p>
													<p className="font-semibold text-blue-600">
														{project.priceRange}
													</p>
												</div>
												<div>
													<p className="text-sm text-gray-500">Configuration</p>
													<p className="font-semibold">
														{project.configuration}
													</p>
												</div>
												<div>
													<p className="text-sm text-gray-500">Total Units</p>
													<p className="font-semibold">{project.totalUnits}</p>
												</div>
												<div>
													<p className="text-sm text-gray-500">Available</p>
													<p className="font-semibold text-green-600">
														{project.availableUnits}
													</p>
												</div>
											</div>

											<div className="mb-4">
												<h4 className="font-medium text-gray-900 mb-2">
													Special Offers
												</h4>
												<div className="flex flex-wrap gap-2">
													{project.offers.map((offer, index) => (
														<Badge
															key={index}
															variant="secondary"
															className="text-xs">
															<Percent className="w-3 h-3 mr-1" />
															{offer}
														</Badge>
													))}
												</div>
											</div>

											<div className="mb-4">
												<h4 className="font-medium text-gray-900 mb-2">
													Key Amenities
												</h4>
												<div className="flex flex-wrap gap-2">
													{project.amenities
														.slice(0, 4)
														.map((amenity, index) => (
															<Badge
																key={index}
																variant="outline"
																className="text-xs">
																{amenity}
															</Badge>
														))}
													{project.amenities.length > 4 && (
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
														{new Date(project.launchDate).toLocaleDateString()}
													</div>
													<div className="flex items-center">
														<Building className="w-4 h-4 mr-1" />
														Possession:{" "}
														{new Date(
															project.possessionDate
														).toLocaleDateString()}
													</div>
												</div>
												<div className="flex items-center space-x-3">
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleInterest(project.id)}>
														Show Interest
													</Button>
													<Button
														size="sm"
														onClick={() => handleContact(project.id)}>
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
		</BuyerLayout>
	);
}
