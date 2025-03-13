import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Home } from "@/components/Home/Home";
import { Welcome } from "@/components/Home/Welcome/Welcome";
import { CustomSlider } from "@/components/Footer/AudioFooter/ButtomSeekBar/ProgressSlider";
export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<Header />
			<Welcome />
			<Home />
			<Footer />
		</>
	);
}
