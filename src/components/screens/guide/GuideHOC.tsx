import dynamic from "next/dynamic";

type Props = {};

const GuidePage = dynamic(() => import("./Guide"), {
	ssr: true,
});

const GuideHOC = (props: Props) => {
	return <GuidePage />;
};

export default GuideHOC;
