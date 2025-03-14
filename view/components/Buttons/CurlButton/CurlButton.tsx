import { Button } from "@mantine/core";

import { api } from "@/client/api";

export function CurlButton() {
	const handleClick = async () => {
		try {
			const response = await api.postVideo({
				youtube_url: "https://www.youtube.com/watch?v=3Uem84SdteM",
				user_id: "1",
			});
			console.log("response:", response);
		} catch (error) {
			console.error("Failed to post video:", error);
		}
	};

	return (
		<Button variant="contained" color="primary" onClick={handleClick}>
			Curl
		</Button>
	);
}
