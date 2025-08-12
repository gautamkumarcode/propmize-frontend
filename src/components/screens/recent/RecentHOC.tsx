import dynamic from "next/dynamic";

type Props = {};

const RecentPage = dynamic(() => import("./Recent"), {
	ssr: true,
});

const RecentHOC = (props: Props) => {
	return <RecentPage />;
};

export default RecentHOC;
