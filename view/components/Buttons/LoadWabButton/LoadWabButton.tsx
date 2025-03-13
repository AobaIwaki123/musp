"use client";

import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { wavFileAtom } from "../../../jotai/atom";

export function LoadWabButton() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const url = "https://ffa0debc28a6548e407d6685d141e88fc51a30b5a6cc1b36a889aca-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3jrA-JypnimmTj0tAyfVJuAGsBYp0nhOjzuyI4zvdbU0T8ur_Bdr7yqyLgIrM47wA29d9LbpkFYxML5FXIoeQX0x6mQ19VdAKywMzKVbNtVPRmdvzPffJrELnt9dJ-0zD8OdpkK1f0g2O16IJqt4vQ1jKIuUxcxJtXw0O42b3lJ4fgEELgQox96EPSL37Eop_aLz1HW5p8J6aT46EAv2CD1Eozwt1lkDJ_NVcdH3nwkxFaHhaG2ejRk0PvQDUOHclPKmd0afy8J4ShEQKqXujoeXwghPNF2uBPdMXB7kAgxzhSOKPOOI_ayLkazuqIHv_ey5kUF4VEOgiaficCiBfOtKxvUVpL2D4wl6qJzRPN3sC8RqFAsvgvrPn1kJLPilXGfFuUVhiq-VurDGenOuOP11LSayMRzRf68R497htBMiYr5BAexrqZByNHFO59Kuj0ppue29A8QAvexCEcCRzVVFrP4nJ9gBBKe7KfsGaFz8FtYLr9KhyPMCgGhTL9rDEm1WAshXSwQitfUjb1uYzwHVMgYAjztqPu-mXFz-v2dWx-Rx0Gb9UDgNJ8B7Tn_4rwYUFYOzLqD9PysKpQ4mHQjHPA7PJKcPnF1htQrtgVn-SX7PSF3sIgzSvTwNnWnztyZqvmgcBku9kXcl44r58jjK1UaI3Z3iEW6roG6WJZFdwP83rJG934aCEXLA2cHNHFMGjq2bs5OfQKkJCp_skpC-B3MTIsgvmQzjHPVC3r8DPDdKmQxIyLY4nvR5_fmMyGxLQ58teBEEociK8b_6x61--NGpGsEzMLIuwEFxtAikgWKsJFYV3M-Eg2swzKXKDv5y0QGNo3q4JGPKxBcWNdyi199B_efJaaoXSx5SfKISYZ0-n8SxS9x7u-Bt30GQ_aPTTHGSGfvIAtEiLhavcsDeac0zNmbQ9P2US-VuXdDX8RkDnr5qrVAkVq0e6HL6GrIg31C8uv5YLSNpJ0YAryxWjiWNj56kavx_QbvnGFF59yfg67cUqkIqqzBPzpHvzqsojzP0BJOryLgIP-tm_xjWkl062uzqznJhhWoG6Aa8r_Qx9tzz5GMwBFJj5YVcX3AuxMXEByFVOwYQR0j2kAYgMwRjQG8hEw-dsYb0D-YX7S6OCL6cXFoN8wPHDXMjj1ExeE0iemQsRIKoJad&isca=1";
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
