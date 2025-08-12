import dynamic from "next/dynamic";

type Props = {};

const SellerProfilePage = dynamic(() => import("./SellerProfile"), {
	ssr: true,
});

const SellerProfileHOC = (props: Props) => {
	return <SellerProfilePage />;
};

export default SellerProfileHOC;
