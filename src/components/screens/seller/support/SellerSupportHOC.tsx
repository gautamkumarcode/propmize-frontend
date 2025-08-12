import dynamic from "next/dynamic";
import { Suspense } from "react";

const SellerSupport = dynamic(
	() => import("@/components/screens/seller/support/SellerSupport"),
	{
		loading: () => (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		),
		ssr: true,
	}
);

export default function SellerSupportHOC() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			}>
			<SellerSupport />
		</Suspense>
	);
}
