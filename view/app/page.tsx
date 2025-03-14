import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Home } from "@/components/Home/Home";
import { Welcome } from "@/components/Home/Welcome/Welcome";

export default function HomePage() {
	return (
		<>
			<Header />
			<Welcome />
			<Home />
			<Footer />
		</>
	);
}
