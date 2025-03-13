import { FooterSocial } from "../components/FooterSocial/FooterSocial";
import { HeaderSimple } from "../components/HeaderSimple/HeaderSimple";
import { MuspHome } from "../components/MuspHome/MuspHome";
import { PasteButton } from "../components/PasteButton/PasteButton";
import { ReloadButton } from "../components/ReloadButton/ReloadButton";
import { Welcome } from "../components/Welcome/Welcome";

export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<HeaderSimple />
			<Welcome />
			<PasteButton />
			<MuspHome />
			<FooterSocial />
		</>
	);
}
