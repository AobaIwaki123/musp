import { FooterSocial } from "../components/FooterSocial/FooterSocial";
import { GridAsymmetrical } from "../components/GridAsymmetrical/GridAsymmetrical";
import { HeaderSimple } from "../components/HeaderSimple/HeaderSimple";
import { MuspForm } from "../components/MuspForm/MuspForm";
import { ReloadButton } from "../components/ReloadButton/ReloadButton";
import { Welcome } from "../components/Welcome/Welcome";

export default function HomePage() {
	return (
		<>
			<ReloadButton />
			<HeaderSimple />
			<Welcome />
			<MuspForm />
			<GridAsymmetrical />
			<FooterSocial />
		</>
	);
}
