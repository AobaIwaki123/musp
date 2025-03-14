"use client";

import { ReloadButton } from "@/components/Buttons/ReloadButton/ReloadButton";
import { useEffect, useState } from "react";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";
import type { Video } from "./ApplicationGrid/ApplicationGrid";
import { MuspForm } from "./MuspForm/MuspForm";

export function Home() {
	const [videoIDList, setVideoIDList] = useState<Video[]>([]);

	useEffect(() => {
		// const res = await api.getVideoAndWav(UserID);
		const res: Video[] = [
			{ videoID: "hedyQY81WeY", wav_url: null },
			{ videoID: "JQowMIY2bOw", wav_url: null },
			{ videoID: "k7eGPMCy_ms", wav_url: null },
			{ videoID: "B2teLF9l4aI", wav_url: null },
			{ videoID: "ibI6-kvD1nc", wav_url: null },
			{ videoID: "qP52sh7PzYA", wav_url: null },
			{ videoID: "f8k8vDcCEfc", wav_url: null },
			{ videoID: "vcp7XKBylkM", wav_url: null },
		];

		setVideoIDList(res);
	}, []);

	const handleAddVideo = (url: string) => {
		const extractVideoID = (url: string): string | null => {
			const regex =
				/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
			const match = url.match(regex);
			return match ? match[1] : null;
		};
		const videoID = extractVideoID(url);
		if (!videoID) {
			console.error("Invalid URL");
			return;
		}

		// TODO: API のレスポンスで VideoID と status code (200, 201) が返却される
		// 200: すでに存在 -> 何もしない
		// 201: 新規追加 -> 追加
		// その他: エラー -> エラーメッセージを表示
		// const videoID = api.postVideoID(url);

		setVideoIDList((prevList) => [...prevList, { videoID, wav_url: null }]);
	};

	const handleAddWav = () => {
		// const res = await api.getWav(videoIDList);
		const wav =
			"https://ff6d6fe089e0824b227531847ade17e74b143a96d852ca763e99c23-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3jMCtaW43pPtD5fd4DyG32SGadra1Dvzx9gYR3zdOPsKx4tWneUl-ptu_IBIMDBSXMsVm0dsApG3asoyBNzYTpH0CmcS_1yA9CREolmtSjRQhTsRhNF4sidsiJX7npqWqePMYVabyr72AlrR3D6CBDOQ_n40Seu-JJ4Zz2QXl67LAgsa5GprngotDvxh4dL5VikkJ2cDt2Q62YN9CsP-YTXL5Zz2XEWJGAFeHMqP8Cu2MKrcZKxhYM1I2UlCO39prGH3fDn8WwqT0x9PS2TZHXVtGxvpjOVNC0WWdIy3rwbgikUsbuCnHEgiKpmIPv_4pbFnrpUYQPsdQfpWEYTDLoNxhuRXZozJ3drjQLlVOnIyC_q6d14gHYIaRxNjNTKA6P1Se90CqAKfelE5Ko3xlj93H4QV5S91NeF0mDkRv7_vGPG8ezBg3LEKj5N67EzpHszy3NoG1hXOS10vQ4Z2WyD1OImhzfAsSi5LZ-_y2TMXpV903IXg0WiLoggdRDlPQ0Crwsy8Qq9woYCX1gVZYdnHn_qF61P9TUUbepYtFH-K4MOTL-MsoiiBgJ0-xK9T2fbeI5n-DQl1laZ6U8wNQxPrcLdbI88MVFzU9F7pyEeN4yP_vy_9K2h-w4nB5jvdUn8m27dGyy9H4Anj0vLBbz2NZAffcsKJIaRUMEGvt_zex83M_BKq31bJoCsULnheklZLarvFIblrEnWZpSgKYoUF2in8t0bW0mfkyX286Qn846DQ18Y-IZqDwOwb5h28Amqs_eYSEeBDHW1GG_ZrVnUZdA_5onygpy42tYsHb2Y3qgtVUDmKstCe6HBjZLmy_Dq0BHQiaR_Jkm6so0zG7EIS-21smUWDZezJE16HpWnl_56TXYxcxCkJ6hq3SkonckIQezc_7IgmKzCw3RbZUcpBz_3AIVC6sxF0rfJv8ZS2lxcFudE7_4_kMBvPNrjBiZIA3m7qaVQVgA6tEJ2wwBz2ltxQD5WYwHtgF31AHwiglUKTkZIRtalcmBCDemPakjancvIGoLciepJgsXkNlYnMRiN6SR65UulgTmbFfVADE4WzONN6595XqJL3t6PRjWuvVciAhoxyax6Pljpge1vMI4-tBayY_0DDmU9SCkXSVoL0ohLrsSxGb0KeKfZLLgO2sIfQkm9YM5rbqr_&isca=1";
		const res: Video[] = [
			{ videoID: "hedyQY81WeY", wav_url: wav },
			{ videoID: "JQowMIY2bOw", wav_url: wav },
			{ videoID: "k7eGPMCy_ms", wav_url: wav },
			{ videoID: "B2teLF9l4aI", wav_url: wav },
			{ videoID: "ibI6-kvD1nc", wav_url: wav },
			{ videoID: "qP52sh7PzYA", wav_url: wav },
			{ videoID: "f8k8vDcCEfc", wav_url: wav },
			{ videoID: "vcp7XKBylkM", wav_url: wav },
		];

		setVideoIDList(res);
	};

	return (
		<>
			<ReloadButton onClick={handleAddWav} />
			<MuspForm onSubmit={handleAddVideo} />
			<ApplicationGrid videos={videoIDList} />
		</>
	);
}
