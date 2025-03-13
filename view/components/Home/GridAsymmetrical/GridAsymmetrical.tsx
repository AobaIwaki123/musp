"use client";

import { Container, Grid } from "@mantine/core";
import { useAtom } from "jotai";
import { isHalfWidthAtom } from "../../../jotai/atom";
import { ApplicationCard } from "../ApplicationCard/ApplicationCard";

export interface Video {
	videoID: string;
}

export interface GridAsymmetricalProps {
	videos: Video[];
}

export function GridAsymmetrical({ videos }: GridAsymmetricalProps) {
	const [isHalfWidth, setIsHalfWidth] = useAtom(isHalfWidthAtom);

	return (
		<Container my="md">
			<Grid>
				{videos.map((data) => (
					<Grid.Col
						span={{ base: isHalfWidth ? 6 : 12, xs: 4 }}
						key={data.videoID}
					>
						<ApplicationCard videoID={data.videoID} />
					</Grid.Col>
				))}
			</Grid>
		</Container>
	);
}
