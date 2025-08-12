import dynamic from "next/dynamic";

type Props = {};

const ContactedPage = dynamic(() => import("./Contacted"), {
	ssr: true,
});

const ContactedHOC = (props: Props) => {
	return <ContactedPage />;
};

export default ContactedHOC;
