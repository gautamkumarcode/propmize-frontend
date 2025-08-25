import dynamic from "next/dynamic";

const PropertyDetailsPage = dynamic(() => import("./PropertyDetails"), {
	ssr: true,
});

type PropertyDetailsHOCProps = {
	propertyId: string;
};

const PropertyDetailsHOC = ({ propertyId }: PropertyDetailsHOCProps) => {
	return <PropertyDetailsPage propertyId={propertyId} />;
};

export default PropertyDetailsHOC;
