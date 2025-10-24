import { PropertyResponse } from "@/types";
import dynamic from "next/dynamic";
import Head from "next/head";

const PropertyDetailsPage = dynamic(() => import("./PropertyDetails"), {
	ssr: true,
});

interface PropertyDetailsHOCProps {
	// Props can be passed if you have initial property data from SSR
	initialPropertyData?: PropertyResponse | null;
}

const PropertyDetailsHOC = ({
	initialPropertyData,
}: PropertyDetailsHOCProps) => {
	// Dynamic meta tags based on property data
	const property = initialPropertyData;

	const pageTitle = property
		? `${property.title} - ${property.propertyType} for ${property.listingType} in ${property.address?.city} | Propmize`
		: "Property Details | Propmize Real Estate";

	const pageDescription = property
		? `Explore ${property.title} - ${property.bedrooms} BHK ${
				property.propertyType
		  } for ${property.listingType} in ${
				property.address?.city
		  }. ${property.description?.substring(0, 160)}...`
		: "Discover detailed property information, amenities, pricing, and contact details for your dream home on Propmize.";

	const pageKeywords = property
		? `${property.title}, ${property.propertyType}, ${property.listingType}, ${property.address?.city}, ${property.address?.area}, real estate, property for ${property.listingType}`
		: "property details, real estate, home details, property information, amenities, pricing";

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
				<meta name="keywords" content={pageKeywords} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* Open Graph Meta Tags */}
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={pageDescription} />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Propmize" />
				{property?.images?.[0] && (
					<meta property="og:image" content={property.images[0]} />
				)}
				{property && (
					<meta
						property="og:url"
						content={`https://propmize.com/property/${property._id}`}
					/>
				)}

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={pageTitle} />
				<meta name="twitter:description" content={pageDescription} />
				{property?.images?.[0] && (
					<meta name="twitter:image" content={property.images[0]} />
				)}

				{/* Additional Meta Tags */}
				<meta name="robots" content="index, follow" />
				<meta name="theme-color" content="#3B82F6" />

				{/* Canonical URL */}
				{property && (
					<link
						rel="canonical"
						href={`https://propmize.com/property/${property._id}`}
					/>
				)}

				{/* Structured Data for SEO */}
				{property && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify({
								"@context": "https://schema.org",
								"@type": "RealEstateListing",
								name: property.title,
								description: property.description,
								url: `https://propmize.com/property/${property._id}`,
								image: property.images?.[0] || "",
								listingType:
									property.listingType === "sale" ? "ForSale" : "ForRent",
								address: {
									"@type": "PostalAddress",
									streetAddress: property.address?.street,
									addressLocality: property.address?.city,
									addressRegion: property.address?.state,
									postalCode: property.address?.zipCode,
									addressCountry: "IN",
								},
								numberOfRooms: property.bedrooms,
								numberOfBathroomsTotal: property.bathrooms,
								floorSize: {
									"@type": "QuantitativeValue",
									value: property.area?.value,
									unitCode: property.area?.unit,
								},
								price:
									property.listingType === "sale"
										? property.price
										: property.pricing?.basePrice,
								priceCurrency: "INR",
							}),
						}}
					/>
				)}
			</Head>
			<PropertyDetailsPage initialPropertyData={initialPropertyData ?? null} />
		</>
	);
};

export default PropertyDetailsHOC;
