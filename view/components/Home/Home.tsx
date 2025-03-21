"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { api } from "@/client/api";
import type { PostVideoRequestType } from "@/client/client";
import { youtubeApi } from "@/client/youtube.api";
import type {
	ErrorResponseType,
	VideoDetailsResponseType,
} from "@/client/youtube.client";

import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";
import { LoginModal } from "./LoginModal/LoginModal";
import { MuspForm } from "./MuspForm/MuspForm";

import { convertToVideoDict } from "@/dto/toVideoDict";
import { convertToVideoDictEntry } from "@/dto/toVideoDictEntry";
import { storage } from "@/helper/localStorageHelper";

import { isShowLoginModalAtom } from "@/jotai/atom";
import {
	audioQueueAtom,
	currentIndexAtom,
	songMapAtom,
} from "@/jotai/audioPlayer/atoms";
import { wavURLAtom } from "@/jotai/audioPlayer/selectors";
import type { SongData } from "@/jotai/audioPlayer/types";
import type { ApplicationCardProps } from "./ApplicationGrid/ApplicationCard/ApplicationCard";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export function Home() {
	const [isShowLoginModal] = useAtom(isShowLoginModalAtom);
	const [_, setAudioQueue] = useAtom(audioQueueAtom);
	const [__, setSongMap] = useAtom(songMapAtom);
	const [___, setCurrentIndex] = useAtom(currentIndexAtom);
	const [wavURL] = useAtom(wavURLAtom);

	const [videoDict, setVideoDict] = useState<Record<string, any>>({});

	// 初回読み込み
	useEffect(() => {
		handleReload();
	}, []);

	useEffect(() => {
		setCurrentIndex(-1);
	}, [setCurrentIndex]);

	// videoDictが更新されたらJotai stateを更新
	const [cardProps, setCardProps] = useState<ApplicationCardProps[]>([]);

	useEffect(() => {
		const ids = Object.keys(videoDict);
		const songMap: Record<string, SongData> = {};
		const cards: ApplicationCardProps[] = [];

		ids.forEach((id, index) => {
			const video = videoDict[id];
			const is_ready =
				video.vocal_wav_url !== "http://example.com" &&
				video.inst_wav_url !== "http://example.com";

			songMap[id] = {
				title: "", // title取得処理が別なのであとで埋められるならOK
				thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
				wav: {
					vocal: video.vocal_wav_url,
					inst: video.inst_wav_url,
				},
			};

			cards.push({
				youtube_id: id,
				is_ready,
				index,
				all_ids: ids,
			});
		});

		setAudioQueue(ids);
		setSongMap(songMap);
		setCardProps(cards);
	}, [videoDict, setAudioQueue, setSongMap]);

	const handleReload = () => {
		const userID = storage.get("userID", "");
		if (!userID) return;

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
			});
	};

	const handleAddVideo = (url: string) => {
		const userID = storage.get("userID", "");
		if (!userID) return;

		const data: PostVideoRequestType = {
			user_id: userID,
			youtube_url: url,
		};

		api
			.postVideo(data, { headers: { "X-API-KEY": apiKey } })
			.then((res) => {
				if (res.status_code === 201) {
					setVideoDict((prev) => ({
						...prev,
						...convertToVideoDictEntry(res),
					}));
				}
			})
			.catch((err) => console.error(err));
	};

	return (
		<>
			{isShowLoginModal && <LoginModal />}
			{!isShowLoginModal && <ReloadButton onClick={handleReload} />}
			<MuspForm onSubmit={handleAddVideo} />
			<ApplicationGrid videos={cardProps} />
		</>
	);
}
