import dynamic from "next/dynamic";

const SupportPage = dynamic(() => import("./Support"), {
	ssr: true,
});

const SupportHOC = () => {
	return <SupportPage />;
};

export default SupportHOC;
