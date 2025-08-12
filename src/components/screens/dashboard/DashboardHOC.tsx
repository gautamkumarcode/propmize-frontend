import dynamic from "next/dynamic";

type Props = {};

const DashboardPage = dynamic(() => import("./Dashboard"), {
	ssr: true,
});

const DashboardHOC = (props: Props) => {
	return <DashboardPage />;
};

export default DashboardHOC;
