import dynamic from "next/dynamic";

const ContactedPage = dynamic(() => import("./Contacted"), {
	ssr: true,
});

const ContactedHOC = () => {
	return <ContactedPage />;
};

export default ContactedHOC;
