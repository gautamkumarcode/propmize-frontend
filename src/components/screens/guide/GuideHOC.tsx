import dynamic from "next/dynamic";

const GuidePage = dynamic(() => import("./Guide"), {
	ssr: true,
});

const GuideHOC = () => {
	return <GuidePage />;
};

export default GuideHOC;
