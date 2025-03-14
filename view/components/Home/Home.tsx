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
			"https://ffca04961f33473322ed5d5cb495981a523b2840ff2ab014dfe8449-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3g8mBVxXI3F4DuGx6dHVYRWRrppnweBcz9FCfPrjCsi637ZZA90LIsm15NN9STcm0NWam0lQOUee_cntpHeJ-5vsqgbA70hbYmTfkK_jj7GqZ2_AFAnsH4bKbvXpH6KNvvNJXY9r_sua9ttQXEc78SohHyOmsNyqjSuuYnR1SxtNFjTCpjMnezVvVi-hZHM8ispptiRYIHMiRwYxPsxbBagxNiZLIEmP-4PcO3wY3ZA4jc9frA3pZlLyjEYQ_kWBstC-K8S_tvMVCXa9wq8PuNjp1ugOt5ZhVIwtyA_YJbIFNm2XEYgr2xOUrkuzRSJaD2PDiUZcvhuIgVhfLSqjCTHOuHQbKE2XXTa_gsXB86G7oopWvCB57KR2g-5NEZ6NGx4ssknjfJZTO6jCfGqbmMsz_2yYJnAcYDbh6AckhYHvhx54LyQuON6qiHSWTt3RGVUySWgnxbhwW7pB-tVKMsbYHVNbxOmVfVo8JVxkVLWpqcQ_9VeQxQ3bvpFkCXmVzUuMPOnrlYinsayr9GsoJoV0jG0JDz1rfNGnC88O3gYRfr0Q-YQGBcuslloLQdlXK4MsdD2Hm7XBpXpv9kIFb7DW1gu9C_J_FE27jCAKyDdQJYoZX0vZnZNFUNZE0j2GgkMelI3_vrGnMA7lpR20dibEtWj1UlgupVGP6kD-6_ihRmvc7s7E53shsvMUAzBZOlC6CdfvNFYhSM3LASVsrnB--1tVAnMQO3XJr0E4hq0Bog_zTVnjs20oW4CNpk4jPO_RO6Po0WfmdElQjKsjgNgspSa8afS8HuTcl7D59ZiAxLZg9z0fV3mkYIjQW3X-rfOHHQ2nxU4M8eH-F7umx6zirV1mqfqhTKAyyTrJzQbQcDaWlBon4_o8o71jlkr5o7cdsChgcJOeMCnGCRjz6qD41TsbE7h8deHg5vcFTYx9u9WYhIbq8GivYuyM0Zu2oMGebrgJ4u6tDCUeIuIRNVn42CPltVOMDHFQBfz4Ivk9Tf4e5JYtJ46qoiIN2_BV32C3YLKRThT_LI8rkELcrxxuhno3sEbb4eZefel_Pwdy-FVsV3XVg13DwFIIYh0Amp_vpakKDrVYsT-ufQTXs-cqGy8eGm0E_iaLXMJVni7gBujc7er8S9OvKf_yc6TWVZd4-O7BYNkGElTKaUA&isca=1";
		const wav2 =
			"https://ff75b1c05c7f0af28eea9d3a4b9eafc91759dd42c593d7dd0beff3c-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3hc95WBIWu5ApRe1ttN2KgGXTa8o9girHOtjRlZvGojInG0f_IYDU0ThBqLyHoglE7jrEoOSLsUhp7FqlJnhhMljyDtFxoJ_AsfpkHKnBvyr5GZdKGMPTB3WPC7ENGUwVvAF3FzOGc9rUU24nUGq8Dt6BYYoINFQgCAYkPis4kh8cgNTL7fv-8CQcBO6a2MOcelzvTylZMg7CVw7IyOyVckWq0sNX6VGh1HZHes_je0MZsJDTj4560pHYpmh7jBW7T-2dMsceWSmggxTdJ8TJrf4WNuFP2h2GeoIL9UdIr1XRnawFqxRfRJWfr7uzrKyj37f_mO-pjeSILslEzG1R2GBu-iPP-Sd-yF-0OwxqnbspMuq9wTdy_HO4lCRPVUNX3AK3RD_-DtWbfIh9AwogJsJXc8_wWMlmsnNkHqHo35Hs2vW0ajr2dqX34zJxbrrY7K3cwBNm8N8_jEZ6TflmrCS1ONRvhGFBiEgPoFKOGuAQJoiTyPDSQizkveZY0IyYh-rOcUAfswOzzoeSo4yXK4aweZMXsTmkMbrhxRHv8DR7GxWHDS_5JkW3DhhnkSlS7IhCFvU2o-plTVj4gXl99ZSuUaozdu_dZd-tMjMTYh92oR_4rO5QL5_fySvp-STuatjcYg4CzvFtfOukdBl0T4pbJ1DJKJzb1sxZp9R1yFgIjQpvPdngV7Nb5yRaO79xCwDF6WgdRCkDcelTZYl2voyiPepCFLlrMgkZN6sYlTrpSqwdxPxQozIKhQ82uX9ioXohPblUQlqmqE2VjLU9Sfv-BD8fwzn8jsOmQ4AFJwCki8gfkgU357WfjrlBngXPRGNu57aD3yxJP0VmSivfhiHaMzJosDXxgFTdgp1IlfKIvELWcIos_jB-4i2GD5jMgYQaTqCNHQB0bKJJXRRL72arlP5D_spw8xojnCDuUpAJ0qJIEfj3NT80cI_0liMEcnL8HWVGedDi3mOLridx9NW2qg1sC5Z2aPnxHdGJUUofvVOnUdjw52TDyqG54RdMKILfqxcnO3TmWl7E3JBKrrtlhdzfzNrHkQlYkmc9_7Cg91ptzgz8vqjQQuEnuVDTB8ECmDPUsPMQE1zopYQXpUyzrqoHjkE_DKgV1lv1jOQbjz52Ha3jsoTL1eQnnFzYoz8mYtBD2yOGbA4ITc&isca=1";
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
