"use client";

import { wavFileAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { AudioFooter } from "./AudioFooter/AudioFooter";
import { DefaultFooter } from "./DefaultFooter/DefaultFooter";

export function Footer() {
	const [wavFile, _] = useAtom(wavFileAtom);

	return <>{wavFile ? <AudioFooter /> : <DefaultFooter />}</>;
}
