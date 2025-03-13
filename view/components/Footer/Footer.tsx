"use client";

import { wavFileAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { DefaultFooter } from "./DefaultFooter/DefaultFooter";
import { AudioFooter } from "./AudioFooter/AudioFooter";

export function Footer() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);

  return <>{wavFile ? <AudioFooter /> : <DefaultFooter />}</>;
}
