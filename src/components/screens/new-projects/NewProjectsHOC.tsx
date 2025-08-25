import dynamic from "next/dynamic";

const NewProjectsPage = dynamic(() => import("./NewProjects"), {
	ssr: true,
});

const NewProjectsHOC = () => {
	return <NewProjectsPage />;
};

export default NewProjectsHOC;
