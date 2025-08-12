import dynamic from "next/dynamic";

type Props = {};

const SupportPage = dynamic(() => import("./Support"), {
	ssr: true,
});

const SupportHOC = (props: Props) => {
	return <SupportPage />;
};

export default SupportHOC;
