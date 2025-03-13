"use client";

import { wavFileAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { DefaultFooter } from "./DefaultFooter/DefaultFooter";
import { AudioPlayer } from "./AudioPlayer/AudioPlayer";

export function Footer() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);

  return (
    <>
      {wavFile ? <AudioPlayer /> : <DefaultFooter />}
    </>
  )
}
