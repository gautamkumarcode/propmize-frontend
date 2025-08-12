import dynamic from "next/dynamic";

type Props = {};

const SellerPlansPage = dynamic(() => import("./SellerPlans"), {
	ssr: true,
});

const SellerPlansHOC = (props: Props) => {
	return <SellerPlansPage />;
};

export default SellerPlansHOC;
