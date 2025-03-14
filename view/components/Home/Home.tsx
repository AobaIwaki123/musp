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
			"https://fff8cc7c12f51a9a96c1102c78c09a2081cc5ceb44a34bbc3bea374-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3gBbLUTJeJvLh_yll8Vyi4B87yVRuZUiLFYNoJiUy5U_yRBCEw482-Rlbhs-LffWEl6bsbaYk3wqD-QLNl0gTCzRi4WtS3gvvPbBDvAHtQXV44nM9igi3LP6q6M7qavAL33Ymfe9DHjX2CulKWL0rqx0ZiA0bkuKISxFzICbYWgMQheDV82iA-yB47Hg3xbbOzV5bgCnKJvo6-1rWhaZjkofwpMOyqOw5y0eyM-GpAuZII55ScJFaGDrs3GbXrcBrelqxvDf9iGZDL_mWrkugAC-7NQcNfWXyNzOyPc-Mvhn6lEh3mD0zOdksqcDsKqHeq3-42b-AnL4fRxi5N_rK8UFctqNIkICogt-g_FFB4ie6t2hxfEBMZgTd_zDJm-jn_fSNew43Lgx_XSxfivhnyaOqMBDlqBMhd4TlM8W5HfYl_CWkm8gWLW_mYyAGR0GAvtsJiRh8D2xnEvwJtH9DYYcZzF4bym6iQfYm-ytSSf0z_QuSOlYNCSvoLURzbqYLOFrvULF13SS78BddgEhIpLqAFr83YujESv8O1Fo6ZTKJfKaecULDkY93WNV3_PTGaQ17WpOiXz0drmfyNFuvLnb9glOQQuSWMXmLDnb6m3dZZNJHjUEzjUKemCMI_XB104VmcdR5GH1OqBNT0JXdWLOn2NM0JvXlsT74dKweHGtxerqrZp9ZqOhtXW-3MzNkkVFoIV8ynj2bhZvEpgcHkHASgX8yXs8X-MNRh0h5QAimoV3fIuLK0gkHhmRP5V95jGl1m3-AXZzwMUUBfYLPdQNNwR8qzK83ialzRbJ4jEI6NEM-zpEwRlAPfffG1BAieYrSo_gHXjJ7mzB0lM4Nb1WD4b-KQPKxULDlaa2in0_L_5Aj7Gm2BeCDbPZJ_jggo7NIQeoePE8rIlNF-zEy5_1L-xZqGjLh1bpITaPz62Odc7wB2bgvCYQWgKGxNcAqHv-M6SzixtQpSAjM68hAXJYHCJWfSCIkG1HhysyEIo-1lb0pzAp_nEMl9d7kPhquWlB13B0I9Af2O1V8AHmKYeuooOoc3680XTYXm5z3UhP6PDXcEZAH94erhFuyBrsEt5yC7JNzjcsVjUke2BZBupQWFiOtTudDkvtY3I_8shsG2H09sNwfquki3iHFnQpvha34qm4Q5GeNVrjIAi&isca=1";
		const wav2 =
			"https://ffd78dd6d155af57552f4c08363b1cecc1215d92e1f94dc47b833df-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3h14sRWd3MTBtRiEHtbETRlFeYAWk6YUif7hoRUbbVUYCkDDhG0WJnKtB1md5vuoGBTjqjlJYaBcHbCbAcUVYOxoHa6Rdra06fa4NUdy8Oo8z_trU_GHdm9BxHJ77ZzUEtfxsvcaOyEecW77tZGGc-1WeiV_NhnSxc3zsYJycqFX5t5a3KSukzdbTepdHWs0o5PXZ56Z1nhEF-h-8qcnCIDw1rrgR4_9HwL8qZthLUi_zIP16MnjPtgy2FwTt5j52kHlIVtD7573xXxAJhGXPLt7AuqaDUaYsXouaMykLJUBRAyM0auJ3dSgTgquN8YyP64eAm4CFHS1ZF5rpSjUf2xQM-QOoEf5Ka5dKu5QwNZySkwHjVIvpFPAej2iMJHualy9go1mgwtkoCwoJIYNjCuYbIi4jRC8n5iWAxhYIkVrFQHvxQp7sOHAgJBnYPi-Cuf4AbevN5IxGmDmzw73CutZyqFc3JvOwo5F8OUP-zH3sd6QeMNvT9N6ePBPOjUruJ3e-s5JEIOcEKicx1hv019DwfOKkCmQCFrz5u0Q584Ujg27jkd-ax5hg3WCAMPxWP8LNZDFf1aiv46E3v7SWDjz21NQdTBbiakryZb1Ff19Hnm9Si0TWprN1A9ZGLsdmpDkbKW1HVl52ZW0mGs6Jsz0-7ucKqL7QbpTyPP5Ezsig7GBLW8S8SS1mjZvlaPKYZdx5UYYmyii-gIk5Amv1VnKnf36A7xr5ikNbW1uClL9I-mba8LDbkK3vnDiCLfgLD_BsT5VoJv5nVKd4cG_qQ3wJoPupkUfQA-4rV1Chg82dwIQByAQ0S72O0idqO306AfTJK_dgnWM1Jos3CCQujTNHGBoHuZOsETcYZ1tfNDMaxznj4F6HsvaQuSbBh0Cpi2n7G06BalPHWzMBlbaLrmg80xcY-17vsE1j2zMbqVsIPLmug4VbNbgfAh5ZuV2MEquQkQsBPxbwvGy3L1dJY7ACcof3EIkEH1IAViAYLqRJsMlNbxvdNMoYTZ2BgsnTTeP_SBo7i66rQgt6-6ZAp0VZhYSELDwnMFbETtsnMvxtBclERMx9UTUzFx4Nq1cbqV2FbAV4PfiNs5WuiluV2si_yo3pcTXJ6CEeLfiU7Uu36Pcv7H_x92ck7FSnSX1YoUzCkoU7r7zfDFke_t&isca=1";
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
