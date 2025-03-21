"use client";

import type { VideoIDAndWavURLType } from "@/client/client";
import { isHalfWidthAtom } from "@/jotai/atom";
import { Container, Grid } from "@mantine/core";
import { useAtom } from "jotai";
import { ApplicationCard } from "./ApplicationCard/ApplicationCard";
import type { ApplicationCardProps } from "../ApplicationGrid/ApplicationCard/ApplicationCard";

interface ApplicationGridProps {
	videos: ApplicationCardProps[];
}

export function ApplicationGrid({ videos }: ApplicationGridProps) {
	const [isHalfWidth, _] = useAtom(isHalfWidthAtom);

	return (
		<Container my="md">
			<Grid>
				{videos.map((data) => (
					<Grid.Col
						span={{ base: isHalfWidth ? 6 : 12, xs: 4 }}
						key={data.youtube_id}
					>
						<ApplicationCard {...data} />
					</Grid.Col>
				))}
			</Grid>
		</Container>
	);
}
