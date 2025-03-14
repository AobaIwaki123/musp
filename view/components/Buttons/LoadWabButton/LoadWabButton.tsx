"use client";

import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { wavFileAtom } from "../../../jotai/atom";

export function LoadWabButton() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const url =
		"https://ffac567aa9cc43aed339c92a2dd1e7a86f96f4a20b60ac02ee6c80a-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0e35f7c1-48b1-40e0-8072-8a0381260c71%2Fvocals.wav?jk=AVyuY3iDe51V8JLQLvNK_8NZ0BBdP0506y16-vhmQ_jiYrmpCughdwCPNEgrry6yz7C8rB_b7Y-_vZF5BBFNr_dLIyxlSK9vSWhnYWAqWTLut5Og5yHKjXKIZjAJjvSrVewC3sPVNzPpVgaGmn9uo8PFPBt5kMeNLnIz4vIOeOOhjviX8j0p5oziq0pe89dhc5T09GW7ZOu_GcU5C3OKfuBKl-EVMmZ4nXhoCQ6TwuHBrdrXJaXFCdDQtrePeBVEAPrHyU--jZNnBNiJorh_MKiGPepq3MKJTuDbj-N79JJsxYuMHDrD_FqRuTGX5oZR9OjRCIasfJFO0tKFJLg6snH_Dfo769WFzmfoxHaLFGNygS8wCr8Lbuh4GjttZ24ztoxZKXXRVCubZBYVMuNxC4r5RoNn2fcfqURX-rqaiUaKCFhWXhgXwqc_3tJ6l8ZnoQk7cEt-Bdi9hPEob2BczsbdN8npD3zcJ1FcFJ22eOF_iSCwF9vx4wfNnp67I9uDJjDlf6AXublUOCbXqcnFEQR3Zt2R46PJwVgrtn0LQOx7i0Kg-pxfSMW4pd3YHw369oX2POKy-FyQx3tHpmpF56HrNoLn3D6q6Beb8yea5AZWylq649cDW728kB3NN2iXA2nyeTfP6jhEit3uYe4i1Pe9bXfIRtwTmlIGyk5A4S1F8x2PQ6R7Igf0_2CQ2woK0PWJhcHNbKoR7QVotBmmbRmfoYZssxcjbi_xDj-wmkQzBvudVO21Sncq0iCaGqv_WxUvzQFG8YCBx3EgAs3O2QHVOJlfR2tIUaBEFXG-wUkDj1Yilrr5o70TgBA5VQUjgx0QRlwHsvZUQLcId17n8w64HD6iDa4j6uNrU920th74hWe1RcvqbDUxKu9nLBPn9RtqQdF6LjTgcq73U84Qzllioag-fnVkVk1LLqCNfEFaH09nbDKzbelITkwpxTgjKpxnr4rZSJl-lv0S7R-gaNML9Fi08luVH9ZZRXVpYrt0b71gKE493rAzaj5ssQDc7YXNItBS09ULHTGersFBBebuzPnpnzmjeI4gcXP3vIywrLdsm71Hs2AofRRtPLTSzAJKPgbrKl-Vp3f3OB-walNLaCvXXFX2Fx0tLcudBOCryPF_zOi2jEnmLgB1xZ5cuvi_RTN_EIEY7vrtFCKOCgWw&isca=1";

	const handleLoadWav = () => {
		setWavFile(url); // 適当なWAV URLを設定
		console.log("WAV URL:", wavFile);
	};

	return (
		<Button variant="contained" color="primary" onClick={handleLoadWav}>
			Load WAV
		</Button>
	);
}
