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
			"https://ffb2902c311dbfc922885cc906b9ee9e52bf12925eef9eefd248de1-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3j-Uyn6Lg7CW7Ct7od93sE8y7CXKR6OeSnaKh-cGcRR9PvFNWJjEPRbJXcU7aaol4QuWzeDne_8jrw3oufbblInu08kmNJFA_BaKLselcCie5zwFquKonJe3_CoYgWueHtYhQwJN9XweVKyB58wbQDxsolXeQmKchDK4LMwksj0tRp3In4RtajUd5BS3U4ophY_yAu-3AsxQhplelr5ut_wWE9HPqxAsSWW7SeaN365nCVkLbb7E4f93fsuV306n27lDQBTLTU0oM2_JqGSM6_zG67U52stxRmPumSfl3S5DQ5m_lIjJJP6vkLK45vnQQxYCwCSMVSMwIxM4sdgd1a1nGnMb5idkdD6Kti_UD-vUte1DJbxWtbyAsDMHSNZdI1OFvgJINo0gYfy9WhJ4eXylJoZ8IO8-nwHma-lX9NjF24hu9ZaX3goP7_jQ5PqFrgqLd_mQ_4nxRA-hWjzCOdm5w8mm0dqOK--EKeu-C8OcUyJ8bOdzthhUX-mjQ2Lzp8O_UY4ccyT_6lhXzVZWJ9FaXM1DkcVShE8Xxtt6T3Bcadu4G-XhWQUfuVxlPssaZeqYwxXoADZ5BpBL6op8MqQ0eN0guWoK5YkWPs8ji6yrPeM_nExDL5IMTO0PkPgU6AwOoUZRE5sx9BLkcWzRiP7YF1ALfdoQLWbamTBRLBKaD2MRGLuja1YsH2sG7i98bKDg8IVmct_ikLDJhLqzFICa2gLEXKqyxtrFBOv80xDHYvA74z3aTjrMKewILv8EOT62-ZEBlkjbKdoujXS6Xb3OVNTtm_XJSuvVap8bSTB6w6c0ykapsIy1Ps1MThCEyyt48pch8d-tS80vXjHRln5WVriOHyk1agD2sayEuCmJaXNGkYFxhBO_jQ4CLQZNUAFZthHSU0bukHnP3K9jyMSzF7PytDgYvCiDT_HxFSPktVOX_AzOG0VMq641a0VTQwQ_VnEFX3EBpIJMHlmLBpvMSbKJ8fBx3fz7_SeW10-mpn_S7tPrA2KbPUh4rgWCMVGpHt3hDXjy8vIZsvW5BEIMDnf10C4RsQz5jCgxY_wgBG0DsrKcz5V4Gsj_vq9RAS3CC4TYPOcRyPEiL5wUr7A3RL63VikXUZyWphIQ122NcS6hZUMvM6ogWYYqlQ6IMqZ8wSPZU5kvJvpqb8&isca=1";
		const wav2 =
			"https://ff454a8b4fc75b0557f43634bb6240eaf40da2cfe661a14537b7a22-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3iTfi33cx4mfgfbCXLSN8oQpBsLHMQtjxPKNgX4PEeRhY7RSNOh-9PN699jInvCXBJd0B_u26e3pDYTBDb2tzvG_DWqwEbm5EU6Zuln7xJXsPa113qI43JTgm8bAglzzAhMymmuQ-Kvfk58cV6iepk8-KsUxIWwgWV5MQSHBRHxlpOfdlab41jtpL7kt8TKfsESUK0_5QOd3ThBE4yJ9gI5by411osRL0UV4Bhp-QT7wXoQnh9ybntmhHxl5TiUL5Bn54imwlE7jce5mq3eeCQ2JjV9Wl-Y9euG0vgXjQzvQXk41wWmANr00Mj8mHYF9I1RvfsBn0201bYGtM_gwH437h5zpH_Qz4gHOzTujOiTdBAdmns93TyXoMSRqe9rBeuNXrmyOlzjGRbZwAOS9oBJSU5lPEJ2RK7hzSmzeZ8lfbDbHGI-Y3RyOdf4HKd-aArF638Rexb2a2XW7knH5wPKMLWuczAzohJZjFY_nN0lgQuTDpErOW9_YQWtL-SYyNsoPUcb-Xgw0uAqi6y15zycu4CHt3CTFaYMy4DyDpm6MQk8xEWYMBnJZ6s44faJN7OvrI9N0ZXS3-oOP1VtoyzoUPhjyn182RsUUAQPQpuWaz1fCHQld4Nzx6WrFZLgigEaTELOr5r1-F00GbMbj_H_T-tqMRi-n0OMW0fFQSaU2JqGlgp1LcgSudCPW4g4a1jXdBI3GhZ90AlrFxeT3c3foF37esCLDeGXycH84d223GJQjYZel1nBvj0biBB8rSQF-Np1uNza5OAp8yBOIXz1Pvl9j1zmabU-HUnnQWKgljRDRdltwJDegrUooYjRKdTualB5zHc38cv5Z2EZBx0-ik_FjmXprwYUCAvbglE3xcixEFmSE96NpTlETFD69M2LzVcNxst5zXDbYslblZ_BOqTntJcuXEkXJkfm6WmNR0cf5exLSsYSzv0t4Q5byNt1KAXVlhRHRDdRp3hDC1gmEzBq5hh4vNPH4Q7-XP3aoVm7QnJDd3E4iD9cCsZRuWn-e33Jf1iKZEVfidafbRylcur4IPM8JUc3ItarmZTJOT5OgdkhJXQRwyhwVA8VG1F2fh_cK4RfrNxxary83EBOwMXs3cY5hD8fWwmwxr0myr470KCaelJ73jqC5Z-R8BwuqEFB7igJxE9D3dc&isca=1";
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
