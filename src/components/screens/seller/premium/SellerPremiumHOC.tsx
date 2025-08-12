import dynamic from "next/dynamic";
import { Suspense } from "react";

const SellerPremium = dynamic(
	() => import("@/components/screens/seller/premium/SellerPremium"),
	{
		loading: () => (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		),
		ssr: false,
	}
);

export default function SellerPremiumHOC() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			}>
			<SellerPremium />
		</Suspense>
	);
}
