import PropertyDetailsHOC from "@/components/screens/propertyDetails/PropertyDetailsHOC";

type Props = {
	searchParams?: { [key: string]: string | string[] | undefined };
};

const page = ({ searchParams }: Props) => {
	const propertyId =
		typeof searchParams?.id === "string"
			? searchParams.id
			: Array.isArray(searchParams?.id)
			? searchParams.id[0] ?? ""
			: "";

	return <PropertyDetailsHOC propertyId={propertyId} />;
};

export default page;
