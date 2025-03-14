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
			"https://ffac567aa9cc43aed339c92a2dd1e7a86f96f4a20b60ac02ee6c80a-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3iDe51V8JLQLvNK_8NZ0BBdP0506y16-vhmQ_jiYrmpCughdwCPNEgrry6yz7C8rB_b7Y-_vZF5BBFNr_dLIyxlSK9vSWhnYWAqWTLut5Og5yHKjXKIZjAJjvSrVewC3sPVNzPpVgaGmn9uo8PFPBt5kMeNLnIz4vIOeOOhjviX8j0p5oziq0pe89dhc5T09GW7ZOu_GcU5C3OKfuBKl-EVMmZ4nXhoCQ6TwuHBrdrXJaXFCdDQtrePeBVEAPrHyU--jZNnBNiJorh_MKiGPepq3MKJTuDbj-N79JJsxYuMHDrD_FqRuTGX5oZR9OjRCIasfJFO0tKFJLg6snH_Dfo769WFzmfoxHaLFGNygS8wCr8Lbuh4GjttZ24ztoxZKXXRVCubZBYVMuNxC4r5RoNn2fcfqURX-rqaiUaKCFhWXhgXwqc_3tJ6l8ZnoQk7cEt-Bdi9hPEob2BczsbdN8npD3zcJ1FcFJ22eOF_iSCwF9vx4wfNnp67I9uDJjDlf6AXublUOCbXqcnFEQR3Zt2R46PJwVgrtn0LQOx7i0Kg-pxfSMW4pd3YHw369oX2POKy-FyQx3tHpmpF56HrNoLn3D6q6Beb8yea5AZWylq649cDW728kB3NN2iXA2nyeTfP6jhEit3uYe4i1Pe9bXfIRtwTmlIGyk5A4S1F8x2PQ6R7Igf0_2CQ2woK0PWJhcHNbKoR7QVotBmmbRmfoYZssxcjbi_xDj-wmkQzBvudVO21Sncq0iCaGqv_WxUvzQFG8YCBx3EgAs3O2QHVOJlfR2tIUaBEFXG-wUkDj1Yilrr5o70TgBA5VQUjgx0QRlwHsvZUQLcId17n8w64HD6iDa4j6uNrU920th74hWe1RcvqbDUxKu9nLBPn9RtqQdF6LjTgcq73U84Qzllioag-fnVkVk1LLqCNfEFaH09nbDKzbelITkwpxTgjKpxnr4rZSJl-lv0S7R-gaNML9Fi08luVH9ZZRXVpYrt0b71gKE493rAzaj5ssQDc7YXNItBS09ULHTGersFBBebuzPnpnzmjeI4gcXP3vIywrLdsm71Hs2AofRRtPLTSzAJKPgbrKl-Vp3f3OB-walNLaCvXXFX2Fx0tLcudBOCryPF_zOi2jEnmLgB1xZ5cuvi_RTN_EIEY7vrtFCKOCgWw&isca=1";
		const wav2 =
			"https://ffffe34cfd4b50213b215d89bcf6c9bd4583691883c570aca0f33a7-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3hBUd8lgl4OyMSH3Sm6-zNAP5iwzyvCDwt0_IWYJHyAeq6eDaXL8H9ob2mwOUTr6GI1aMbLzTjjidKbgDxeOLhah7pSDZE_Cz4qju8F4b9m7j-2ITVXnyZYx-8eqEZGeHGEXFoUdxw0LY9AREE79sBmHCad_DIw6jvOnE7Ed6njWbHu5vD8AI4D6OD6J4xsRR_enOFUmrtmxugM4LW4QJiOJLz1OMojTCPiRAGI7_kGTq1_osrUnCNo-AOe6liOxhZE1kM7d2iHzHP7daKyE3oYgj8V7UD2Ly51H3D6XaL_zaPdxqvpiYDdUS5xNrrEWLE0bxCqUkRBBkOgSJTHzh2vwpm6I_UdIHBeJfkXhRddqkUFcTv4GW3JHIEXGMzk6EDhuiNDY2qSWbD0-J_TX6WBTaqNpvQt-WdMEfjQZofic9nef45_exq-ZmXzIEVwsveBzlcuxU7cVjBqVF6MTfwCpH4CdwOGRSXQU6qB9nKtb_fZ0GTyl7kgmHnj78dteOlZwL1cv5c04Mcqm2mZR6UARr-WN7Fqh_aEifzlSH02s9vXHFsXi1l2tfLptwFjuT-2sQ98UWbZ6zYfZe4oW3oJvQqtplH29BJl9Ha4FKUNNnJX-MvIOgGt0QL9VrF1wHKLelSgh7bj6UyRD_Za257viA1LS_Umt544U1Edy1IT8_v5hF7Xq5vVozVqyCU266FUbdGhkJacXMaXcp6m9QonvceWelEjwNLnrgVIsWKdT8z9OduRrzF6qdsPe5RhhmWhAwcOIDMjvgcFWjTf7qMv5c_7MAjT9UsYIlqj6D-Yl7EiiuA81mtUNa_7YWpILDoOH6nc_-mpaHMU6NQWjtdytlM9815l2uioODaGZwu1KpL46OlYtCDHHeqASZOFiQojqKgGPQGaJ6C89qZquNvKHETOVszyPdZKWUp9e9g-pZNxVeyDWJ2DZrS45Tls_0p2RRPNCiVbCq7tElV3VXNtTO0Xni-8wkpA65QsjkhhNZ2zsaPm29xL21ez-I5d47ISSjFq8y2w9qo4exCJLEZj_JlYX8ZGyuK175GrzY9sE6pcCtfD--1VFq5NJ1RQqmxQs29kPDjHishWvqaupn_AFTXYFyMKarHzr9VcOU-Vq3uWawAZbHY2vHokm4uqLyKu6g0TinQhVOAQPYQ&isca=1";
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
