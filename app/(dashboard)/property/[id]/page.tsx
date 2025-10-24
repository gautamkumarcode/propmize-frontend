// app/(dashboard)/property/[id]/page.tsx
import PropertyDetailsHOC from "@/components/screens/propertyDetails/PropertyDetailsHOC";
import { API_BASE_URL } from "@/lib/api";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

// Use 127.0.0.1 instead of localhost to force IPv4

async function fetchProperty(id: string) {
	try {
		const url = `${API_BASE_URL}/properties/${id}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error in fetchProperty:", error);
		return null;
	}
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	console.log("Property ID:", id);

	const data = await fetchProperty(id);
	return <PropertyDetailsHOC initialPropertyData={data?.data || data} />;
}

export async function generateMetadata({ params }: PageProps) {
	const { id } = await params;
	const data = await fetchProperty(id);
	const property = data?.data || data;

	if (!property) {
		return {
			title: "Property Details | Propmize",
			description: "Discover detailed property information on Propmize",
		};
	}

	return {
		title: `${property.title} - ${property.propertyType} for ${property.listingType} | Propmize`,
		description: property.description?.substring(0, 160),
		openGraph: {
			title: `${property.title} | Propmize`,
			description: property.description?.substring(0, 160),
			images: property.images?.[0] ? [property.images[0]] : [],
		},
	};
}
