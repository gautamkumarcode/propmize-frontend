import dynamic from "next/dynamic";



const ProfilePage = dynamic(() => import("../../profile/Profile"), {
	ssr: true,
});

const BuyerProfileHOC = () => {
	return <ProfilePage />;
};

export default BuyerProfileHOC;
