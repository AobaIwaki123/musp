"use client";

import { api } from "@/client/api";
import type { PostVideoRequestType } from "@/client/client";
import { youtubeApi } from "@/client/youtube.api";
import type {
	ErrorResponseType,
	VideoDetailsResponseType,
} from "@/client/youtube.client";
import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import type { VideoDict } from "@/dto/toVideoDict";
import { convertToVideoDict } from "@/dto/toVideoDict";
import { convertToVideoDictEntry } from "@/dto/toVideoDictEntry";
import { storage } from "@/helper/localStorageHelper";
import {
	isShowLoginModalAtom,
	isVocalAtom,
	thumbnailAtom,
	titleAtom,
	videoIDAtom,
	wavURLAtom,
} from "@/jotai/atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import type { ApplicationCardProps } from "./ApplicationGrid/ApplicationCard/ApplicationCard";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";
import { LoginModal } from "./LoginModal/LoginModal";
import { MuspForm } from "./MuspForm/MuspForm";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export function Home() {
	const [isShowLoginModal] = useAtom(isShowLoginModalAtom);
	const [videoID, setVideoID] = useAtom(videoIDAtom);
	const [isVocal, setIsVocal] = useAtom(isVocalAtom);
	const [wavURL, setWavURL] = useAtom(wavURLAtom);
	const [thumbnail, setThumbnail] = useAtom(thumbnailAtom);
	const [title, setTitle] = useAtom(titleAtom);

	const [videoIDAndWavURLList, setVideoIDAndWavURLList] = useState<
		ApplicationCardProps[]
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
		getTitle(key);
		getThumbnail(key);
		const vocalWavURL = videoDict[key]?.vocal_wav_url;
		const instWavURL = videoDict[key]?.inst_wav_url;
		setWavURL(isVocal ? vocalWavURL : instWavURL);
	};

	const getThumbnail = (youtube_id: string) => {
		const url = `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;
		setThumbnail(url);
	};

	const getTitle = (youtube_id: string) => {
		if (!YOUTUBE_API_KEY) {
			throw new Error("YOUTUBE_API_KEY is not set");
		}
		youtubeApi
			.getVideos({
				queries: {
					key: YOUTUBE_API_KEY,
					part: "snippet",
					id: youtube_id,
				},
			})
			.then((res: VideoDetailsResponseType) => {
				if (!res.items) {
					throw new Error("No items found");
				}
				if (!res.items[0].snippet) {
					throw new Error("No snippet found");
				}
				if (!res.items[0].snippet.title) {
					throw new Error("No title found");
				}
				setTitle(res.items[0].snippet.title);
			})
			.catch((err: ErrorResponseType) => {
				console.error(err);
			});
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

	useEffect(() => {
		const converted: ApplicationCardProps[] = Object.entries(videoDict).map(
			([youtube_id, { vocal_wav_url, inst_wav_url }]) => {
				const is_ready =
					vocal_wav_url !== "http://example.com" &&
					inst_wav_url !== "http://example.com";
				return { youtube_id, is_ready };
			},
		);
		setVideoIDAndWavURLList(converted);
	}, [videoDict]);

	return (
		<>
			{isShowLoginModal && <LoginModal />}
			{!isShowLoginModal && <ReloadButton onClick={handleReload} />}
			<MuspForm onSubmit={handleAddVideo} />
			<ApplicationGrid videos={videoIDAndWavURLList} />
		</>
	);
}
