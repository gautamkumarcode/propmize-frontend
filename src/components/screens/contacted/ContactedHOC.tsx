import dynamic from "next/dynamic";
import Head from "next/head";

const ContactedPage = dynamic(() => import("./Contacted"), {
	ssr: true,
});

const ContactedHOC = () => {
	return (
		<>
			<Head>
				<title>Contacted Owners | Propmize Real Estate</title>
				<meta
					name="description"
					content="Track and manage all your contacted property owners. View response status, communicate with sellers, and manage your real estate inquiries efficiently."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="keywords"
					content="contacted owners, property inquiries, real estate contacts, seller communication, lead management"
				/>
				<meta name="author" content="Propmize" />

				{/* Open Graph Meta Tags */}
				<meta property="og:title" content="Contacted Owners | Propmize" />
				<meta
					property="og:description"
					content="Manage your contacted property owners and track responses on Propmize real estate platform."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Propmize" />

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Contacted Owners | Propmize" />
				<meta
					name="twitter:description"
					content="Track and manage your real estate inquiries with contacted property owners."
				/>

				{/* Additional Meta Tags */}
				<meta name="robots" content="index, follow" />
				<meta name="theme-color" content="#3B82F6" />
			</Head>
			<ContactedPage />
		</>
	);
};

export default ContactedHOC;