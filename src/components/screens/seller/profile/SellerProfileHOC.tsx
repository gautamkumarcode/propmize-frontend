import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../../profile/Profile"), {
	ssr: true,
});

const SellerProfileHOC = () => {
	return <ProfilePage />;
};

export default SellerProfileHOC;
