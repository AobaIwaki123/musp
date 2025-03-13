import { ReloadButton } from "../components/Buttons/ReloadButton/ReloadButton";
import { FooterSocial } from "../components/Footer/FooterSocial/FooterSocial";
import { HeaderSimple } from "../components/Header/HeaderSimple/HeaderSimple";
import { AudioPlayer } from "../components/Home/AudioPlayer/AudioPlayer";
import { MuspHome } from "../components/Home/MuspHome/MuspHome";
import { Welcome } from "../components/Home/Welcome/Welcome";

export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<HeaderSimple />
			<Welcome />
			<AudioPlayer />
			<MuspHome />
			<FooterSocial />
		</>
	);
}
