import dynamic from "next/dynamic";

const NavigationOverviewPage = dynamic(
	() => import("./NavigationOverviewPage"),
	{
		ssr: true,
	}
);

const NavigationOverviewHOC = () => {
	return <NavigationOverviewPage />;
};

export default NavigationOverviewHOC;
