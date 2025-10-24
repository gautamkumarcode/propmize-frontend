import dynamic from "next/dynamic";
import Head from "next/head";

const PropertyPage = dynamic(() => import("./Property"), {
	ssr: true,
});

const PropertyHOC = () => {
	return (
		<>
			<Head>
				<title>Find Your Dream Property | Propmize Real Estate</title>
				<meta
					name="description"
					content="Discover premium properties for sale and rent. Browse curated listings with advanced search filters to find your perfect home, apartment, or commercial space."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="keywords"
					content="properties for sale, real estate listings, homes for sale, apartments for rent, property search, buy property, rent property"
				/>

				{/* Open Graph Meta Tags */}
				<meta
					property="og:title"
					content="Find Your Dream Property | Propmize"
				/>
				<meta
					property="og:description"
					content="Discover premium properties for sale and rent. Browse curated listings with advanced search filters to find your perfect home."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Propmize" />

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Find Your Dream Property | Propmize"
				/>
				<meta
					name="twitter:description"
					content="Discover premium properties for sale and rent with advanced search filters."
				/>

				{/* Additional Meta Tags */}
				<meta name="robots" content="index, follow" />
				<meta name="theme-color" content="#1e40af" />

				{/* Canonical URL */}
				<link rel="canonical" href="https://propmize.com/properties" />
			</Head>
			<PropertyPage />
		</>
	);
};

export default PropertyHOC;