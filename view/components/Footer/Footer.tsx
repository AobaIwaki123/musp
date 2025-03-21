"use client";

import { wavURLAtom } from "@/jotai/audioPlayer/selectors";
import { useAtom } from "jotai";
import { AudioFooter } from "./AudioFooter/AudioFooter";
import { DefaultFooter } from "./DefaultFooter/DefaultFooter";

export function Footer() {
	const [wavURL] = useAtom(wavURLAtom);

	return (
		<>
			<DefaultFooter />
			{wavURL && <AudioFooter key={wavURL} />}
		</>
	);
}
