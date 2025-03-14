"use client";

import { Container, Grid } from "@mantine/core";
import { useAtom } from "jotai";
import { isHalfWidthAtom } from "../../../jotai/atom";
import { ApplicationCard } from "./ApplicationCard/ApplicationCard";

export interface Video {
	videoID: string;
	wav_url?: string | null; // wav_urlを追加（nullable）
}

interface ApplicationGridProps {
	videos: Video[];
}

export function ApplicationGrid({ videos }: ApplicationGridProps) {
	const [isHalfWidth, _] = useAtom(isHalfWidthAtom);

	return (
		<Container my="md">
			<Grid>
				{videos.map((data) => (
					<Grid.Col
						span={{ base: isHalfWidth ? 6 : 12, xs: 4 }}
						key={data.videoID}
					>
						<ApplicationCard {...data} />
					</Grid.Col>
				))}
			</Grid>
		</Container>
	);
}
