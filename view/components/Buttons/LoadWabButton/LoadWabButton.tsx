"use client";

import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { wavFileAtom } from "../../../jotai/atom";

export function LoadWabButton() {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const url =
		"https://ffe7a565374517c9384c238839699a16592186817ff13c8f4ac98e0-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3gmG9fFZR94US_LcY3830skGJ16imokziQPHr0dI9cKKspszjZDkeCob2X4q3D4eYQbv1gE88Amhe5rJLYrJqxsv-kfpK5Gs2BF1ksvq7SsE8c-cntXG1Vx1kkGulYRPQj4DXLwXsWA7OhzG_jHmulhm0391PT8TXig6vnJ2jnj1fLFMUXwiMdQDaBZX-OGWU3MKrJICjxdrDQrVn6f_gs_8jXkO4DE1KeLgTQLlsWnno5vzdw4bbnBQ48QCjJUPwfFhsQMYQgUfhKh-0NAI7Gc9yBdbpj7Imrt0hxhPtb76vnm26jjgQ9QAM7N4pZFbD01EZ4UZDgTxQRqWLYmUWCHg0EzhaWt6AXevzC6EjhWTJxciLoAtUID63YId8xL11qxoQLydk5wAkjOcXpMhdHWNPiVkBTgCDCVHCLPx92Ea_pAqLJWZvmypw_sdai1bTkM3TRJ11NDp6f5Lg1vLoKQChLCqnxZx5tUhlzewN8rO9H1GAsHky8P0flFL5MkJUH-0RUyiE9PKecKznpb37BH1MDguwIgIpS7n3uvUFOl2NNlvvsYGL6cFMKY8iz74YvqTRcIskRePHz7Zof4RoDmCzQnwAPNAu8q4BL7dbQ-S1lfetSmt9F7w0aFevRWDZW9Inr9T6W-wPNdwQ7l1rc_4jjcle5ZKdEJ7obHSg7ofBk__gbZ5f3u6egKZMdzdstqTQZAKsfrSfXVWgi5oO-vYUNyfxMRObtBvmBtOQAxmLm2alDbUGYjzaS2jyx2sKzjAqmj1ZvgxTbXfcDK53w2_DUYwKqf09jXuXuMTI8nAI3ZdVhC_S9pz6oFIG4opfmKhMt3tFrBtC6_X8REb1ENkeByr8F5dT3GRlQbwR_IH7Dacq1dMw11bhFZ7dpWBWjOS3OKSyNtjylVgsho9o7iiTViOOMfzcWi17AfUyQ81GmMnG3Xp31__2xMvpTlrXPwpdDL7IwUvFgf7sgyJlj57eR5cXFKTzhR3KeOs7CYaZFyOif0wE-D4gktnGbAjc0s7PrzuZV7hFMW_hoSo51WnYgyG7mEtICqr-xVLxgfAmIP1i-VGW0yYdhZTjoviAHIu-NfLPVG0QVVIIzv4vyJsAD9A2ScqRp1YOj3llz_II_u7giRRBYT-TcJ529iBl_l2VfP55jVrrd4n-B8&isca=1";
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
