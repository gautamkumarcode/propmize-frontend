import dynamic from "next/dynamic";

const SellerPlansPage = dynamic(() => import("./SellerPlans"), {
	ssr: true,
});

const SellerPlansHOC = () => {
	return <SellerPlansPage />;
};

export default SellerPlansHOC;
