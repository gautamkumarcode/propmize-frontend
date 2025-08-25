import dynamic from "next/dynamic";

type Props = {};

const ProfilePage = dynamic(() => import("./Profile"), {
	ssr: true,
});

const ProfileHOC = (/* props: Props */) => {
	return <ProfilePage />;
};

export default ProfileHOC;
