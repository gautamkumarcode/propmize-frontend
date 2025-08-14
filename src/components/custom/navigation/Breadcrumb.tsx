"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
	className?: string;
}

export default function Breadcrumb({ className = "" }: BreadcrumbProps) {
	const navigation = useNavigation();
	const pathname = navigation.pathname;

	// Generate breadcrumb items from path
	const generateBreadcrumbs = () => {
		const pathSegments = pathname
			.split("/")
			.filter((segment) => segment !== "");
		const breadcrumbs = [];

		// Always start with home
		breadcrumbs.push({
			name: "Home",
			path: "/buyer/dashboard",
			icon: Home,
		});

		// Generate breadcrumbs from path segments
		let currentPath = "";
		pathSegments.forEach((segment, index) => {
			currentPath += `/${segment}`;

			// Format segment name
			const name = segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			breadcrumbs.push({
				name,
				path: currentPath,
			});
		});

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	// Don't show breadcrumbs on home page
	if (pathname === "/buyer/dashboard" || pathname === "/") {
		return null;
	}

	return (
		<nav
			className={`flex items-center space-x-1 text-sm text-gray-600 mb-4 ${className}`}>
			{breadcrumbs.map((item, index) => {
				const isLast = index === breadcrumbs.length - 1;
				const IconComponent = item.icon;

				return (
					<div key={item.path} className="flex items-center">
						{index > 0 && (
							<ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
						)}
						{isLast ? (
							<span className="text-gray-900 font-medium">
								{IconComponent && (
									<IconComponent className="h-4 w-4 inline mr-1" />
								)}
								{item.name}
							</span>
						) : (
							<Link
								href={item.path}
								className="hover:text-blue-600 transition-colors">
								{IconComponent && (
									<IconComponent className="h-4 w-4 inline mr-1" />
								)}
								{item.name}
							</Link>
						)}
					</div>
				);
			})}
		</nav>
	);
}
