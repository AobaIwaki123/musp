"use client";

import { videoIDAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { AudioFooter } from "./AudioFooter/AudioFooter";
import { DefaultFooter } from "./DefaultFooter/DefaultFooter";

export function Footer() {
	const [videoID] = useAtom(videoIDAtom);

	return (
		<>
			<DefaultFooter />
			{videoID && <AudioFooter key={videoID} />}
		</>
	);
}
