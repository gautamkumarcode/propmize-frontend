import dynamic from "next/dynamic";


const ProfilePage = dynamic(() => import("./Profile"), {
	ssr: true,
});

const ProfileHOC = () => {
	return <ProfilePage />;
};

export default ProfileHOC;
