import { ReloadButton } from "../components/Buttons/ReloadButton/ReloadButton";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { AudioPlayer } from "../components/Home/AudioPlayer/AudioPlayer";
import { Home } from "../components/Home/Home";
import { Welcome } from "../components/Home/Welcome/Welcome";

export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<Header />
			<Welcome />
			<AudioPlayer />
			<Home />
			<Footer />
		</>
	);
}
