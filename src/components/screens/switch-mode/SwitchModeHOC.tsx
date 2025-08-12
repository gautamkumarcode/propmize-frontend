import dynamic from "next/dynamic";

type Props = {};

const SwitchModePage = dynamic(() => import("./SwitchMode"), {
	ssr: true,
});

const SwitchModeHOC = (props: Props) => {
	return <SwitchModePage />;
};

export default SwitchModeHOC;
