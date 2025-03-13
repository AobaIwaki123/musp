import { ReloadButton } from "../components/Buttons/ReloadButton/ReloadButton";
import { Header } from "../components/Header/Header";
import { Home } from "../components/Home/Home";
import { Welcome } from "../components/Home/Welcome/Welcome";
import { Footer } from "../components/Footer/Footer";

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
