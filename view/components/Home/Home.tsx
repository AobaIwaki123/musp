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
			"https://ff9b85c364ee66faef22884084a47965f7ab7b08730b37aaeb6d8b3-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3hKXu5hZrKJSWA6uBIgJyBIU5QXq6eDCgnA1QO3UbA2lSjsFoQQueyYuN9obm8jKa93pTf-irEztUP3nQdMVzM5NhXm7q-Nw-r79GVFhtYGyD6bTLbXLLBDL-RZN_b6NZTSFAsscV11iw-5-_v7xsU44Cs6gniLHDjpnUXb4tNvC_4udUiwkO4cefLQ4HSLYtLo66YHuMkGYk7djcPYo11Ln3ka73iLeJn2gARTt3txZwt3r8evns1NEW-80WIrYXFfaGVzw6-XXLL3H59zenG4a1ngzNU-CztVQVM6dCRHJ5wew4iPJMRE1pNjmosutADJCowuX9AjJanSAQldpaUdSohcTU-PDe2pKeD9IZRVYdej3l0XR9OCUK81MJt0x_anpYJbCx_iJ08FYU7VL1WMVT4FgW8Uin5eHhrMbqr_fNY4tVtbwnRQ8T4OnW5d9ZCfuuSAWMws0FhhvRgHFs2Cor3YoG8V8t7aN7G8p_RPSPGcWvmg2QKla1xmoAtXXstLXNVdDxi_jqg3EJRpLC7PLOP_mg1UyD5vszi8Vd5LChEGCayVrYaAIbY-FWwInvOgTOex4lbGw7AIr_YAEjZIt8WXnJdoZyCZm0K3r6ne_pXiE9Sh-RUkod63OOOYMZUXR2IQYU9f306P_wTAHAWzMIeLESieEPq9F02Cq3V3Luz5zx3QXmuAbk0XHS3z0bkwr56M1dILMsAF7oPRubgv51bHw1v90Vu6h-6GgsLDSkP8M996rBMzjC5DTjYS6ZBCKwFRVf12iHoc4eARRKVCrZimPIsD92sMcEBHzaiN-mRYeYPzFJ4Oqdr2PwyyuVWSEIQ5ASm0iOB9gNsDTr86knwR7hvDD6ZVubX6NBKSGRQIMBP1J6ThTOF-cfT-tckABeb9RhTT3CQLAIG3B0Md4nhY8kOMjJjr1zI4AUVDtYxiUBXBEtOhFPzqjV6pY_FG3aZhQ_CMQTFTfE2C7G_jB6fe7raIAvQ9p6Tjrci3xzEzDNxmJ1bng6kLkRi625KHES6TCgCyAyif3bBuC9oCbt2VXlx1cPvY1P8n5MHBqO9emjELkKQUQaNPa-ZKWP_ehdjSpFO9cUeOIrStb-jW-6s6zXtbxs4wN111ZJym_ZMeu4IXkXRLwdwDGz5iCX5H-2trr5rbKz3tHaZs&isca=1";
		const wav2 =
			"https://ffcd31bf40a5953eebfab5572e5950923e49646dcc5ab228b1c156e-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3jqIJ565CF1KzWIKAch3sSXp0s8FzzVQVYppe_PpnELWQOdHewNUa_t9ppo_D7dNTdBQpyL-3YSRpz_diMqr4OklZIuLcvzEhDUXbGSWczXfmeb4lCU4KiakWHUdH_YT3-aFlSHl1LN8hnESMLaWBxAmH7LQC6A8zmi23fnk0cxJRfEGvRG9TKcvwm1b4_cBNWV7ExjI7H2zOLXly2YgfzkOH4Wk2L2rlbQRVA0h3xO8XaXcOoHs_J7PGPgOMSTT_Cvnf_765tx1HUDLUSU3vNVM0gIOa5g40V1vb4l3NV9FrsLqRyG_2pyNOzF_8iASqe6NU_uhDXHyeRJ_J8VJGoWfI87cgEqvfQRq8a3YVdZQCV2t3CQGzznoJ0-wXSyd3bgUl9blPsSMGDigItVUhL7EyFsKw1HwpAy1m2zxJG-Y4b81lgN3akfZUCQQTKmtDGQSyAw252d2_mmsvhYXngdfdx11PxvL0ipkDTdPO4Ue_aFpyhccTXKuhbhII9Iwn3dMKGn_JV26nk3OAOhT3H5W4SKuqVmwOO7G7CBuhBZ3sG5UHjeYXXXTBzlBoTIAKM-jCpRrSOKir4TE65iGCwSRURhjLWItJgVflwLSnZ_abnrv-ktyAVKXrsL-3zhfvoRa1ih539zFtd_QAfm0MptsIz9y2v-imzOYjySL19RzOUx9hrxt1DFyqPkxCIM3DmIjPLXaUMqr_Lu-O2MXk09JAFK7ilXfXJx7MkwftYk-L9OhcZMsWakNnBGUjMx5k8y1aW_rQ3NKtA21Cjst1Jk-g691r4s2zw73ODlbeSO338e5woZFx23DrcdGaV0i7vDuSPFCKLq1TfKiHFsTkFGDyxpfHkTN2v2k1YvAZ4QoHJIexC-KULrxnp9ZsUPDXsXtTa7GrZS8eAguFz0AFbOW_OYSVYl4Nz4xW9n0_b-83FwT6sLwqG5GnQ8HIErQhLYnNdhtbxn7cfRno3n4r1-u2EA6lE-gICeBgCO3M51YwShSfbZtq46LAhMIwigZl818H1oIMvaBnyMArYuGAovtOIQty7Mslwj3d069LQ7Y2ZR0t2yEEgfrKyrI2LhBBcjWr7oBZKJcvqTN4ugDx-AZi_6evNw9ecaJZV7qdAs3VeMQ_f9_H5KMk9vf24TXVSWkj2G6Iwj90RlpxJV&isca=1";
		const res: Video[] = [
			{ videoID: "hedyQY81WeY", wav_url: wav },
			{ videoID: "JQowMIY2bOw", wav_url: wav2 },
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
