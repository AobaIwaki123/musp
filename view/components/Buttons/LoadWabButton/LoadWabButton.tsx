"use client";

import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { wavFileAtom } from "../../../jotai/atom";

export function LoadWabButton() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const url =
		"https://ff5e9bf3fa2ef8d008baa0bfa7e2a0ec2b89099ba39ef458d8483f4-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3gLH_cigxgk5S6uLJZMdK1UWUvo1WnuHQTeaxc4K7n-TtKj4qUcqYYZxnIaPsheyQsBe885wE6nT_ueZyP_1IE2RzCrG_KsPp-lLhOB3DHGb7Tp5kUOkiCy4z6GZNHx4pLamno7G56NfMICEElSI5Twdt7OPNUj2qHb2xoUw1a14kb2TQZvrrmJc1_sXnCFPyGC5RMVqINDBLXhlO1TBHLzTvB9IIADQ-UxoYbDEOqYEMW35gr5oZecy_k8FsHRQbaUTr36oYQaRs1pk3oEE6w0tpwwjW0eZABZVJ-wrJ4z4l8_eX7EPuJG57Y-j_57ffu3uiUeSy0QNYaH6eaKwSFNQAaiBRp0ndxSQmvAvlYdrTrZIcOySZHuDR3e26SPWFZaeui0h_yhYpdXEfiCYwkjiD26vE-tT6O0iKoreC_QTnhEVJfCzMjgjM56zCPCyGwZBw-VcVI5rR0ukoeFJgtqEsEE29p5cO3Sx_021LhV_pyktUtqzCAVwUn-vwo-mPYLwKd12qfdG3_KGAstLMJScdOJ8ZsAi66Qyc29V1SRVJUb3G3i6Vq9FQlpTGMvZzHmUHLju6pCOgo-ZCJPyL_yRWahaaIRy3UeCwFDotyL9O4yKQtXLGqPNQO10sBly5rQ7mwoME55V0mzCx4ZEM2wLG7ue7L-Vz7emDmvrNeSLF_V9Eyo1h7nrhGNTp_Q5hUyFonl5048VyjatlWDCrXNf2J1c3TifNmF3mez2KFTrAWpaDV7kFHSh4YlehyKRKl8NLck7xZSmSF81F8wFBTZ0nosnnXPS6F7oo-P8f22a29jtz7R6_f3cHZNnnkRUWQyWfv4iq6-0kqAyZhkz_rYZlz2qur7P6OsbMKdcaQATWDet0FfYMIUq180589jcyhXiSG1KRtNGubgY27gOg2MdSiUVrXdpqoJbjm_Xe-tkRRNzFoS5fImeUoqg00tPlBH3bQ0xNSlx4F4a7tOid2BuOrWattP4Se8QIUaIGtX8QUv2SXYca05fMKyI2mmsxvyB3WGdFE0i5e6I_1Iq3tLtk5sRG_mfofWs05-0zMDv0JLEQmAecfElRLssDW94esrYSgZkyhO_NWanMXcKSa_uA4CzdnmqMBaBbBT7flztrCO32FPmTOJanJGSbFZAfW2SR8QZHGSNXJTqJY&isca=1";
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
