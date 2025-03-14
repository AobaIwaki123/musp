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
			"https://ffac02ceb4a0b0b255b45e5035d06d3e234b181dd78f124f256f6d7-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3jTx91lhAMub_SH-CA5KFMVwiuMDluq4u8kn4dZdm7pKgsMt5NIZwr-NHLFHFoPvKrm-7ERUK2_kn3DrnQnjZYvUbRlw_6UNuBLuyyT7qzMM72Jsj1J4kcEaRXyKqAlB_V68toOXRf9UvNKLZ5yaE-jxlDBkiEN4BStg6495clUK7EK4u9gNhK2oOd6nepVZw6GdfgiMMBRnAHJtZUIm6eWmE7-yvc_sTmNhGfRoIxoOeO9vfhoN-tHrplTNqGftVAtmBhK6G-zx0J_EYE7kHoeY8subxQrTtDKDA4o7vr-9rrShcB1rlZycKaitpF_3oUPc0zx9I_zhbDdujMJAM-lLLEu7nhcsH95znqbHk9jmb3BQvhI_xhtHFTd6ZqHYqNLfwqzC4qm7oJ9DLWYHDPDJlnjytnV9A1F2GxLnElLEy2LYPhFqsdDcKd0acIswN1qU2tt2-gc9AgBWLQYle9cxnc-qFRA9n6wmcYV1Hj7pPuHNbsmwuU-_E2TzMDxoRM_XNSN-qxmEgb_uj6W3N-A46BdjVMVlWNyZVYdRvDQojT_mNkWChWSYoklm3Wi4RLtQaXZygDGl-AsJ6JM8p8KCGG6EXTSZm2ixucEvUbYEs_aC1rj3oP_ICiu_K2dgeKXS-ItjI-qN1UfOe_ZNLNHj14hCbCrxiVkNLxw81RdFLhVhDFmeLjEOjPvUQncBRWZNx97LkJqaibIffwV20PpTWE11S1ucJIMHMKSgANwR6pEtblVDoPRuGAcvaWGayKJAGS0peZN0GHtntSjVbeUgSXMcm8_sM3J-A9Bn_-jNDjNsQ0lLKbyUfeSnDgic7SYf_3_i1ue8aEu0EFsvPf65f3Yj21ttvCtC_DEv_XNELgCgbsN5fVnE_iwzfL5Av4d2J653j6yE2S1KvQWvrKQGhx7GNXsaGdDySOwVuTUA4AasWk04zsAtRHGZwlc3KNngfVH6syb73iOT54yS-l_ORp98Y-EtpWJn8k2p25e8QR41WeuKzIOTKZwBqeoqZTgrs6pcsGMM5gNYIOdXroy2au8PT-zOR9IaZ-X6j0fGs7zGTglk4MQA_d1rQvcmWEoQDYNWlVhm_vE2XZLNaxqHs0UCievEaZAF8qHXhLNOyuJQJW9do4P0AfPcYpNr2NCatmz-G7JniWD-DMM&isca=1";
		const wav2 =
			"https://ff2c5a92a2a13c744a83b371a39cc13533ac9dc6404ebe72661df4d-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3jXfO7b0KOlG6xXTc-3OqZ7meW-fCbtTQ0ocinftICRahb8bLWnABfQUKwVFcGDqoEB13NWR0f21sQozRR7ZCJT_6QJ12qxPa1JRRMeTktcmImZk6HLjhEMtuXH99WlZn1z__KNOOLkaOQOLtNt04vDJl7ujp0yStv9QILiiULxswVIOidxs3tqqhdmv5gl5wywsMF3VwXOrVc3A_zlQGLc-cyHOMfvD3TUT8jm_9SJpUsr713oV4FHmwkukstZPC-0OEmfqLB16Hzcc_rZV1IYTj2sDjD_7I3l6T1f-W6V_1H9rVYU1FBiEO8qOePx07u6T4vqby8HoBOKSd1SbBcVyVJNj8rKnt1DBDvhZpmZIB7RL8qWUtF-3y1EJ-nOGFrKONuOK-3Q2q-Jf83wm9ADtEMDj9PtX1I3hnSOXBdTyGdVxkAWY8EIRiR4AMvS-D-EY37jyFMj8zbnsIkPC3UsJngwGlFz-gpNHauywgu_mQSW_GF-1sVgqQEVrT76NFkQUEw-SWZbmdwiAEpmTv1b6vFCBsf8M9xDl47-DF-PFu94wGYxdQLXDYEMSobxqIWIoNIpd_-6791umEcXL97N12DOm1BBANB_o4FEP9eIEAg9i_Rqgivxlya6F0pSJj5qupCMiGeUauFlVXYWI7rtfWqSy7cA903e75I_n2_Lv4Ue_TifJ2-8f5BlUwXJQtHalYi5h-NwQlpkX4xSD6LlvWYVWjKsuLqOS213memdoa86KORy4Oapcgf0jdqSp8TWDaWOcK4f1nWX0UJCOXL0halzhwPqISOvgJ0KbmjwshEt4_agk9dBxf9EA6Ab4kt2hKwNswbl_70aUshpGcBJ0quVDHR1cgXiMsXo14bshrmDnQtzKdL5ZEOtGEJvdOLuucuIfap32FTXU72fx4Sx4ju4H-4yEq2rC5cafUJXCogXFmp7bZcXLlW_vMGTePCHX1xYkbIdD1fxE2o_4H-_JxICDy2kUKipH5Mqrcpe_1XPZAcLHKq_IF5IftC_wM6qKD69q6q_HAth1zMPDdEqMeIDs5nUrwgdDy0w9o7X5a5o9f0QdGe8Hhq22etygouDkm6tI7mEK0rBJ6VvgtLmGWiK7_iCI94NX_Ntv21Gm0zEXJT_DCc_3XhKCU7bFK1YIDWObs73pYKfo9g&isca=1";
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
