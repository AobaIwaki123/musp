"use client";

import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { wavFileAtom } from "../../../jotai/atom";

export function LoadWabButton() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const url =
		"https://ffc071521321a85063f7c36afb98d4d637051d99bd22121f407c4c0-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3jcEWaJkZwT6jWUdkJi7ji25L9aHbRxBcPRVuptzVmC0XJ8zuzXmEno2i3HILHvOfHLFKzdhOEtr50iifiHeL3-1J2-2UpPds7CofOjcBxExd6pIL2JTVRHtiMLFK73q9Zbo9GHQcndGZtQgP0Kt9Xd5BqhyaFoCq3SkOtY2yqVj0-AYG977EgxuOUr4QgXjEw_YXRG8xK1LefefyJkbkMOpJPjfUztv5shceSuJQ6bysNBcK9PeEg1tkWztzc3dlhR98lNGAbPQhSu1uiXpHZIY91m-u4dkEX02HA0-TQnvvGlFAxHRI36DmgMgs_8CUw1AOoNzpl48WmcM1KNggnSoKIzqzd32A4J_JC6iFtIY2xFY0MVs7Ps0E6seTHaE8FkC4RrCtS-LjM9ND827QT8e6XzMROZYgKOQhGFS8fAnQpZAU5wEiInCwu-LMDVNs5vvLrgrqdpH_8Ccv3kphnTWCTxk53LGuhLhNtVWU6Xg-tyOSAUUm13OWYC5fv4EmL27tjGwr5oo6Tx4Njvr4mk5phDyjHJj8IdEKG7ma5JyreWlWJXyH-Q1hctzEdBPSQjVKYle4ifvPTojub55HM1iFhP_TxnwvFYHyp59ljuPneScUCiC52giEZs3ZGztAIZuS38GV0sv5eO5HdtToUQaOd1FyMx317jKA9aGiBM7x9-JJ3qYA_ec2fjmFJR98MyHdIyQ5aielY7vhAw0EtuzF0ICg9QdF9qGbKD3AugY0HsbgoaZaikVY1joeVdz0LiQLuvT2L0YI1g0ZIju7tY9kBiUtS9GpUbYRTym3PAP4r2NdfSbtRE0jTD3qXv1N-J5dCfrAnR0fNRvV9pj2c2IOhAEFSyWoQWJ7olMlRDxPCEXT8x3y_jJSQ0HNs_7qvPwCYdBCDBZhzS7DOayDM4mV5mflGsHBfWxXcdqq9xGTKqov5htNycvnbjI2Mt88rGyOoPWl5AyUAySDUb3zB58B6KIg8UiwwOTucMz6J_7b9odf6ZGE2hiDQfFPhSp0CCKRNfBKV8KQai9s5TAXnJL4q3MApHfkTIRH_V_oTfkoPFZurujMJAwNGXnjObL5y3EIjxFUNajnMJg2ywgTY37ehYKlvX7l-Pj5gewSWAecesCRNignIw_qtNqLRNrka35F7sErl2yXP6sWsN&isca=1";

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
