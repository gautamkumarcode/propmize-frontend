"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import NavigationOverview from "@/components/custom/navigation/NavigationOverview";

export default function NavigationOverviewPage() {
	return (
		<BuyerLayout>
			<NavigationOverview
				title="All Available Pages"
				description="Navigate to any section of the application"
			/>
		</BuyerLayout>
	);
}
