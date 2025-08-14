"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation";
import { iconMap } from "@/lib/routing/iconMap";
import { buyerNavItems } from "@/lib/routing/routes";
import { ArrowLeft, Grid } from "lucide-react";

interface NavigationOverviewProps {
	title?: string;
	description?: string;
	showBackButton?: boolean;
	onBack?: () => void;
}

export default function NavigationOverview({
	title = "Navigation",
	description = "Explore all available sections",
	showBackButton = false,
	onBack,
}: NavigationOverviewProps) {
	const navigation = useNavigation();

	const handleNavigation = (path: string) => {
		navigation.navigateTo(path);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					{showBackButton && (
						<Button
							variant="ghost"
							onClick={onBack}
							className="mb-2 -ml-2 text-gray-600 hover:text-gray-900">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
					)}
					<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
					<p className="text-gray-600 mt-1">{description}</p>
				</div>
				<div className="hidden md:block">
					<Grid className="h-8 w-8 text-blue-500" />
				</div>
			</div>

			{/* Navigation Grid */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{buyerNavItems
					.filter((item) => !item.isBottom) // Exclude logout and other bottom items
					.map((item, index) => {
						const IconComponent = iconMap[item.icon as keyof typeof iconMap];
						const isCurrentPage = navigation.pathname === item.route.path;

						return (
							<Card
								key={index}
								className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
									isCurrentPage
										? "ring-2 ring-blue-500 bg-blue-50"
										: item.isHighlighted
										? "ring-2 ring-green-500 bg-green-50"
										: "hover:ring-2 hover:ring-gray-300"
								}`}
								onClick={() => handleNavigation(item.route.path)}>
								<CardHeader className="pb-3">
									<div className="flex items-center space-x-3">
										<div
											className={`p-2 rounded-lg ${
												isCurrentPage
													? "bg-blue-500 text-white"
													: item.isHighlighted
													? "bg-green-500 text-white"
													: "bg-gray-100 text-gray-600"
											}`}>
											{IconComponent && <IconComponent className="h-5 w-5" />}
										</div>
										<div className="flex-1">
											<CardTitle className="text-lg font-medium">
												{item.route.name}
											</CardTitle>
											{item.isHighlighted && (
												<span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mt-1 inline-block">
													⚡ Switch Mode
												</span>
											)}
											{isCurrentPage && (
												<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mt-1 inline-block">
													📍 Current
												</span>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-gray-600">
										{item.route.description}
									</CardDescription>

									{/* Show path for reference */}
									<div className="mt-2 text-xs text-gray-400 font-mono">
										{item.route.path}
									</div>
								</CardContent>
							</Card>
						);
					})}
			</div>

			{/* Quick Actions */}
			<div className="mt-8 p-4 bg-gray-50 rounded-lg">
				<h3 className="text-lg font-semibold text-gray-900 mb-3">
					Quick Actions
				</h3>
				<div className="flex flex-wrap gap-2">
					<Button
						size="sm"
						onClick={() => navigation.goBuyerDashboard()}
						className="bg-blue-600 hover:bg-blue-700">
						🏠 Dashboard
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigation.goToProfile()}>
						👤 Profile
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigation.goToSaved()}>
						❤️ Saved
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigation.navigateTo("/switch-mode")}>
						🔄 Switch to Seller
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigation.goToSupport()}>
						❓ Help
					</Button>
				</div>
			</div>
		</div>
	);
}
