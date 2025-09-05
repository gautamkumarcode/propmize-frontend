"use client";

import { PropertyResponse, useDeleteProperty, useMyProperties } from "@/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MyProperty = () => {
	const router = useRouter();
	const {
		data: myPropertyData,
		isLoading,
		isError,
	} = useMyProperties({ page: 1, limit: 10 });

	const deleteProperty = useDeleteProperty();

	const [showModal, setShowModal] = useState(false);
	const [selectedProperty, setSelectedProperty] =
		useState<PropertyResponse | null>(null);

	const handleEditClick = (property: PropertyResponse) => {
		router.push(`/seller/add-property?mode=edit&id=${property._id}`);
	};

	const handleAddPropertyClick = () => {
		router.push("/seller/add-property?mode=create");
	};

	const handleDeleteClick = (property: PropertyResponse) => {
		setSelectedProperty(property);
		setShowModal(true);
	};

	const handleConfirmDelete = () => {
		// Call your delete property mutation here, e.g.:
		deleteProperty.mutate(selectedProperty?._id as string);
		setShowModal(false);
		setSelectedProperty(null);
	};

	const handleCancelDelete = () => {
		setShowModal(false);
		setSelectedProperty(null);
	};

	if (isLoading)
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);

	if (isError)
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-red-600 mb-2">
						Failed to load properties
					</h2>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
						Try Again
					</button>
				</div>
			</div>
		);

	const properties = myPropertyData || [];

	console.log("My Properties:", properties);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
				<button
					onClick={handleAddPropertyClick}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fillRule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
					Add New Property
				</button>
			</div>

			{properties.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-lg shadow">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-16 w-16 mx-auto text-gray-400 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/>
					</svg>
					<h3 className="text-xl font-medium text-gray-600 mb-2">
						No properties found
					</h3>
					<p className="text-gray-500 mb-4">
						Get started by adding your first property
					</p>
					<button
						onClick={handleAddPropertyClick}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Add Property
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{properties.map((property: PropertyResponse) => (
						<div
							key={property._id}
							className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							{/* ...existing property card code... */}
							<div className="relative h-[20rem]">
								<Image
									src={property.images[0]}
									alt={property.title}
									className="w-full h-48 object-cover"
									// onError={(e) => {
									// 	e.currentTarget.style.display = "none";
									// 	const fallback = e.currentTarget
									// 		.nextElementSibling as HTMLElement;
									// 	if (fallback) fallback.classList.remove("hidden");
									// }}
									fill
									unoptimized
								/>
								{/* <div className="hidden absolute inset-0 bg-gray-200  items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-12 w-12 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 22V12h6v10"
										/>
									</svg>
								</div> */}
								<div className="absolute top-3 right-3">
									<span
										className={`px-2 py-1 rounded-full text-xs font-semibold ${
											property.status === "active"
												? "bg-green-100 text-green-800"
												: property.status === "pending"
												? "bg-yellow-100 text-yellow-800"
												: "bg-red-100 text-red-800"
										}`}>
										{property.status}
									</span>
								</div>
							</div>

							<div className="p-5">
								<h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
									{property.title}
								</h3>
								<p className="text-gray-600 mb-4 line-clamp-2">
									{property.description}
								</p>

								<div className="grid grid-cols-2 gap-2 mb-4 text-sm">
									<div className="flex items-center text-gray-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
											/>
										</svg>
										{property.propertyType}
									</div>
									<div className="flex items-center text-gray-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
											/>
										</svg>
										{property.listingType}
									</div>
									<div className="flex items-center text-gray-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										{property.area?.value} {property.area?.unit}
									</div>
									<div className="flex items-center text-gray-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										{property.address?.city}
									</div>
								</div>

								<div className="flex justify-between items-center mb-4">
									<div className="text-lg font-bold text-blue-600">
										{property.pricing?.basePrice}{" "}
										{property.pricing?.priceNegotiable && (
											<span className="text-sm font-normal text-gray-500 ml-1">
												(Negotiable)
											</span>
										)}
									</div>
									<div className="text-sm text-gray-500">
										{property.createdAt
											? new Date(property.createdAt).toLocaleDateString()
											: "-"}
									</div>
								</div>

								<div className="flex space-x-2">
									<button
										onClick={() => handleEditClick(property)}
										className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
										Edit
									</button>
									<button
										onClick={() => handleDeleteClick(property)}
										className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Confirmation Modal */}
			{showModal && selectedProperty && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-4">
						<h2 className="text-xl font-bold mb-4">Delete Property</h2>
						<p>
							Are you sure you want to delete{" "}
							<span className="font-semibold">{selectedProperty.title}</span>?
						</p>
						<div className="mt-6 flex justify-end space-x-2">
							<button
								onClick={handleCancelDelete}
								className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
								Cancel
							</button>
							<button
								onClick={handleConfirmDelete}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyProperty;
