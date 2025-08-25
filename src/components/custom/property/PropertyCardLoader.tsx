const PropertyCardLoader = () => {
	return (
		<div className="block bg-white rounded-lg shadow-sm border animate-pulse">
			<div className="relative">
				{/* Property Image */}
				<div className="relative h-48 w-full bg-gray-200 rounded-t-lg"></div>

				{/* Property Details */}
				<div className="p-4">
					{/* Price and Type */}
					<div className="flex items-start justify-between mb-2">
						<div>
							<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
							<div className="h-6 bg-gray-200 rounded w-1/2"></div>
						</div>
						<div className="h-6 w-16 bg-gray-200 rounded-full"></div>
					</div>

					{/* Location */}
					<div className="flex items-center text-gray-600 mb-3">
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					</div>

					{/* Property Specs */}
					<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between pt-3 border-t border-gray-100">
						<div className="h-3 bg-gray-200 rounded w-1/4"></div>
						<div className="h-3 bg-gray-200 rounded w-1/4"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PropertyCardLoader;
