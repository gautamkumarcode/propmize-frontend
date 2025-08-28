import dynamic from "next/dynamic";

const PropertyDetailsPage = dynamic(() => import("./PropertyDetails"), {
	ssr: true,
});


const PropertyDetailsHOC = () => {
	return <PropertyDetailsPage />;
};

export default PropertyDetailsHOC;
