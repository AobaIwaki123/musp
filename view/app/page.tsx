import { FooterSocial } from "../components/FooterSocial/FooterSocial";
import { HeaderSimple } from "../components/HeaderSimple/HeaderSimple";
import { MuspHome } from "../components/MuspHome/MuspHome";
import { ReloadButton } from "../components/ReloadButton/ReloadButton";
import { Welcome } from "../components/Welcome/Welcome";
import { ClipboardPasteButton } from "../components/ClipBoardPaste/ClipBoardPaste";

export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<HeaderSimple />
			<Welcome />
			<ClipboardPasteButton/>
			<MuspHome />
			<FooterSocial />
		</>
	);
}
