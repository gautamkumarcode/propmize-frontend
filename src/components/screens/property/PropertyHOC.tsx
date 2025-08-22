import dynamic from "next/dynamic";

const PropertyPage = dynamic(() => import("./Property"), {
	ssr: true,
});

const PropertyHOC = () => {
	return (
		<div>
			<PropertyPage />
		</div>
	);
};

export default PropertyHOC;
