"use client";

import { api } from "@/client/api";
import type {
	PostVideoRequestType,
	VideoIDAndWavURLType,
} from "@/client/client";
import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import { storage } from "@/helper/localStorageHelper";
import { isShowLoginModalAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";
import { LoginModal } from "./LoginModal/LoginModal";
import { MuspForm } from "./MuspForm/MuspForm";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export function Home() {
	const [videoIDAndWavURLList, setVideoIDAndWavURLList] = useState<
		VideoIDAndWavURLType[]
	>([]);
	const [isShowLoginModal] = useAtom(isShowLoginModalAtom);

	useEffect(() => {
		handleReload();
	}, []);

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
					setVideoIDAndWavURLList((prevList) => [
						...prevList,
						{ youtube_id: res.youtube_id, wav_url: undefined },
					]);
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
				setVideoIDAndWavURLList(res.data);
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
