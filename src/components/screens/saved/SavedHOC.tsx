import dynamic from "next/dynamic";

const SavedPage = dynamic(() => import("./Saved"), {
	ssr: true,
});

const SavedHOC = () => {
	return <SavedPage />;
};

export default SavedHOC;
