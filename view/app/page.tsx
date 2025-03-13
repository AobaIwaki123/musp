import { FooterSocial } from "../components/FooterSocial/FooterSocial";
import { HeaderSimple } from "../components/HeaderSimple/HeaderSimple";
import { MuspHome } from "../components/MuspHome/MuspHome";
import { ReloadButton } from "../components/ReloadButton/ReloadButton";
import { Welcome } from "../components/Welcome/Welcome";

export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<HeaderSimple />
			<Welcome />
			<MuspHome />
			<FooterSocial />
		</>
	);
}
