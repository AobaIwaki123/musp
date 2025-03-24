// Home.tsx
"use client";

import { useAtom } from "jotai";
import { isShowLoginModalAtom } from "@/jotai/atom";
import { LoginModal } from "./LoginModal/LoginModal";
import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import { MuspForm } from "./MuspForm/MuspForm";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";

import { useVideoData } from "@/hooks/useVideoData";
import { useAudioSync } from "@/hooks/useAudioSync";
import { useEffect } from "react";

export function Home() {
	const [isShowLoginModal] = useAtom(isShowLoginModalAtom);
	const { videoDict, reload, addVideo } = useVideoData();
	const cardProps = useAudioSync(videoDict);

	useEffect(() => {
		reload();
	}, [reload]);

	return (
		<>
			{isShowLoginModal && <LoginModal />}
			{!isShowLoginModal && <ReloadButton onClick={reload} />}
			<MuspForm onSubmit={addVideo} />
			<ApplicationGrid videos={cardProps} />
		</>
	);
}
