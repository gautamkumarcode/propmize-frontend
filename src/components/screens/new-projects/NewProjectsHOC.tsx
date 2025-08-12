import dynamic from "next/dynamic";

type Props = {};

const NewProjectsPage = dynamic(() => import("./NewProjects"), {
	ssr: true,
});

const NewProjectsHOC = (props: Props) => {
	return <NewProjectsPage />;
};

export default NewProjectsHOC;
