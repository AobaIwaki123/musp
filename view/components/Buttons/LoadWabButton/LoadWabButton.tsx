"use client";

import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { wavFileAtom } from "../../../jotai/atom";

export function LoadWabButton() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const url =
		"https://ff13b06f92131c0e02ed46ae72c5746f3107b3dcc19f97798cc2abc-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3j0PhXlMC9PYFduQIFSW6_FpJ-65gVO5Kn0S5zic0e3WllllnbHVxAJOGMVgenBY8k9JLgcnqAKvR3Za_LradC4cZ9vzoN28JEgQ1WLtR0J7QJBISj3Ca5nn_PrawpKCR1AFy2CClmQs8lI0F2jW0qY_gMMLVmVcUu0HQtiKo7bc3WNnm_axxAGsYBfs5Un8R6gEtVoI8B-DsfjAyE4epgXCDhKBof2l8nZpudqFXOmSgrR2-jl2cMpdGoHnKl_n2QXYt7zP_88_zm59wdLVwh-uyxocVhkG7E-fHF9yXoOxAGoPold07GOyYByE8Gir5BAC0qLnA7I5TgYDfShIy6R2CUQSvaH0pGA8J70WQoQTQgFFPwoiI8RPlbM7WTxwmGFuazeLydXV_lj3B0WEsrorzDuxGEfpT-k4CVhPx8Y7o8mWzsmP6MO5H0wnKFRRtXznY33qVfw8Vr4guirjbV2Z9JCkJIPpiKMF1cvE-6g2E_HvoS-Ha4xa7_Ou1gmYMK3mKU4APZ7QkpmQC5bUbJxxjt-5JGVTBn_C2_-_-yw6nnmuZxz4JEX8wO1_cjbVGquEMx5_iaNFDRnEiDvJ8yf6V_7RTUFR1JOPuk9PgY2j7vrifm1ElAFaWMqujd9FV-9h9zs0P4TnUNFbFDtJlQq08f8OC2PaL8fo_oQQvATutlKJkdrzFwT2Spsprtfbdl9UiQjYRfqq6uUeK1eCdp9NYZrcXpf0CKdBPO11Ferp9FSXMHRRabV6nWunZF_n092A-IvI4DxB3t3neykbRW0_JwXif3VWVKSJnBstptDNkg7OsvXcI7-tI1MNb3TO856tf_kM_o6N1rmcd_zoMNyYLwJB_oGADdtatIjvBaT-2Q47IWolA2Pg1S14Eena6suVNRWoiLlvZn7Ex9otxPKFE2DcFNEH01GFdsrTMooQ4tVkdnd8Td9GNUdnWssR95I9D-7E8Od2a1FGskmMetRsYsL3WasX1vDfhwtfjVvd07rMV9jzigtPPaZMWApTKzjoHQFM5OAW3wP5uYtysDMJByyQ8p87gakDjyeJq46evItvnu5cy-bGO4QoBf4OkroC85qxjFuTjoXiF25K2JjjHrQu6NT4rgl7LvoJ20JFJ1rQji9th0Hrp4JrsW2W2f1tPYQe2yBcg-I76Jp&isca=1";
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
