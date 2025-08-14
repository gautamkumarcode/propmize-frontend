import dynamic from "next/dynamic";

type Props = {};

const ProfilePage = dynamic(() => import("../../profile/Profile"), {
	ssr: true,
});

const BuyerProfileHOC = (props: Props) => {
	return <ProfilePage />;
};

export default BuyerProfileHOC;
