"use client";

import { wavURLAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { AudioFooter } from "./AudioFooter/AudioFooter";
import { DefaultFooter } from "./DefaultFooter/DefaultFooter";

export function Footer() {
	const [wavURL, _] = useAtom(wavURLAtom);

	return (
		<>
			<DefaultFooter />
			{wavURL && <AudioFooter key={wavURL}/>}
		</>
	);
}
