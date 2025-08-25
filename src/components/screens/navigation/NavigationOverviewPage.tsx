"use client";

import AppLayout from "@/components/custom/layout/AppLayout";
import NavigationOverview from "@/components/custom/navigation/NavigationOverview";

export default function NavigationOverviewPage() {
	return (
		<AppLayout mode="buyer">
			<NavigationOverview
				title="All Available Pages"
				description="Navigate to any section of the application"
			/>
		</AppLayout>
	);
}
