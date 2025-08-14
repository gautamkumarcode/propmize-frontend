import dynamic from "next/dynamic";
import { Suspense } from "react";

const SellerLeads = dynamic(
	() => import("@/components/screens/seller/leads/SellerLeads"),
	{
		loading: () => (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		),
		ssr: true,
	}
);

export default function SellerLeadsHOC() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			}>
			<SellerLeads />
		</Suspense>
	);
}
