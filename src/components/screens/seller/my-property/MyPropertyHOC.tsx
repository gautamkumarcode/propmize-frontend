import dynamic from "next/dynamic";

const MyPropertyPage = dynamic(() => import("./MyProperty"), {
	ssr: true,
});

const MyPropertyHOC = () => {
	return <MyPropertyPage />;
};

export default MyPropertyHOC;
