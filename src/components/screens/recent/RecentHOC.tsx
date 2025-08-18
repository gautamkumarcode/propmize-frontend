import dynamic from "next/dynamic";


const RecentPage = dynamic(() => import("./Recent"), {
	ssr: true,
});

const RecentHOC = () => {
	return <RecentPage />;
};

export default RecentHOC;
