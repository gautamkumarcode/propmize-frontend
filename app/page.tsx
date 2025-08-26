"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/app-store";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const { setUserMode } = useAuthStore();
	const router = useRouter();

	const handleModeSelect = (mode: "buyer" | "seller") => {
		setUserMode(mode);
		// Redirect to the main application dashboard or home page
		router.push(`/${mode}`); // Adjust this route as necessary
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Mode</h1>
				<p className="text-gray-600 mb-8">Are you looking to buy/rent properties or to sell/list them?</p>

				<div className="space-y-4">
					<Button
						className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
						onClick={() => handleModeSelect("buyer")}
					>
						I want to Buy / Rent
					</Button>
					<Button
						className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
						onClick={() => handleModeSelect("seller")}
					>
						I want to Sell / List
					</Button>
				</div>
			</div>
		</div>
	);
}
