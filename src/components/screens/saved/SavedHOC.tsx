import dynamic from "next/dynamic";

type Props = {};

const SavedPage = dynamic(() => import("./Saved"), {
	ssr: true,
});

const SavedHOC = (props: Props) => {
	return <SavedPage />;
};

export default SavedHOC;
