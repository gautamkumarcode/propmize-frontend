import dynamic from "next/dynamic";
import Head from "next/head";

const NewProjectsPage = dynamic(() => import("./NewProjects"), {
	ssr: true,
});

const NewProjectsHOC = () => {
	return (
		<>
			<Head>
				<title>New Real Estate Projects | Propmize</title>
				<meta
					name="description"
					content="Discover the latest new residential projects, pre-launch properties, and ready-to-move homes. Find exclusive offers and premium amenities in upcoming real estate developments."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="keywords"
					content="new projects, pre-launch properties, residential projects, real estate developments, ready to move homes, property launch"
				/>

				{/* Open Graph Meta Tags */}
				<meta
					property="og:title"
					content="New Real Estate Projects | Propmize"
				/>
				<meta
					property="og:description"
					content="Discover latest residential projects with exclusive offers and premium amenities. Pre-launch and ready-to-move properties available."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Propmize" />

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="New Real Estate Projects | Propmize"
				/>
				<meta
					name="twitter:description"
					content="Discover latest residential projects with exclusive offers and premium amenities."
				/>

				{/* Additional Meta Tags */}
				<meta name="robots" content="index, follow" />
				<meta name="theme-color" content="#2563eb" />
			</Head>
			<NewProjectsPage />
		</>
	);
};

export default NewProjectsHOC;