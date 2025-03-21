"use client";

import { api } from "@/client/api";
import type {
	PostVideoRequestType,
	VideoIDAndWavURLType,
} from "@/client/client";
import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import type { VideoDict } from "@/dto/toVideoDict";
import { convertToVideoDict } from "@/dto/toVideoDict";
import { convertToVideoDictEntry } from "@/dto/toVideoDictEntry";
import { storage } from "@/helper/localStorageHelper";
import {
	isShowLoginModalAtom,
	isVocalAtom,
	videoIDAtom,
	wavURLAtom,
} from "@/jotai/atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";
import { LoginModal } from "./LoginModal/LoginModal";
import { MuspForm } from "./MuspForm/MuspForm";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export function Home() {
	const [isShowLoginModal] = useAtom(isShowLoginModalAtom);
	const [videoID, setVideoID] = useAtom(videoIDAtom);
	const [isVocal, setIsVocal] = useAtom(isVocalAtom);
	const [wavURL, setWavURL] = useAtom(wavURLAtom);

	const [videoIDAndWavURLList, setVideoIDAndWavURLList] = useState<
		VideoIDAndWavURLType[]
	>([]);
	const [videoDict, setVideoDict] = useState<VideoDict>({});

	useEffect(() => {
		handleReload();
	}, []);

	useEffect(() => {
		if (videoID) {
			handlePlayVideo(videoID);
		}
	}, [videoID]);

	const handlePlayVideo = (key: string) => {
		const vocalWavURL = videoDict[key]?.vocal_wav_url;
		const instWavURL = videoDict[key]?.inst_wav_url;
		setWavURL(isVocal ? vocalWavURL : instWavURL);
	};

	const handleAddVideo = (url: string) => {
		const userID = storage.get("userID", "");
		if (!userID) {
			return;
		}

		const data: PostVideoRequestType = {
			user_id: userID,
			youtube_url: url,
		};

		api
			.postVideo(data, {
				headers: { "X-API-KEY": apiKey },
			})
			.then((res) => {
				if (res.status_code === 201) {
					setVideoDict((prevDict) => {
						return { ...prevDict, ...convertToVideoDictEntry(res) };
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handleReload = () => {
		const userID = storage.get("userID", "");
		if (!userID) {
			return;
		}
		api
			.getUser_id({
				params: { user_id: userID },
				headers: { "X-API-KEY": apiKey },
			})
			.then((res) => {
				setVideoDict(convertToVideoDict(res.data));
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
	};

	return (
		<>
			{isShowLoginModal && <LoginModal />}
			{!isShowLoginModal && <ReloadButton onClick={handleReload} />}
			<MuspForm onSubmit={handleAddVideo} />
			<ApplicationGrid videos={videoIDAndWavURLList} />
		</>
	);
}
