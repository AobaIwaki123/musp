"use client";

import { Container, Grid } from "@mantine/core";
import { useAtom } from "jotai";
import { isHalfWidthAtom } from "../../jotai/isHalfWidth";
import { ApplicationCard } from "../ApplicationCard/ApplicationCard";

const mockData = [
	{ videoID: "hedyQY81WeY" },
	{ videoID: "JQowMIY2bOw" },
	{ videoID: "k7eGPMCy_ms" },
	{ videoID: "B2teLF9l4aI" },
	{ videoID: "ibI6-kvD1nc" },
	{ videoID: "qP52sh7PzYA" },
	{ videoID: "f8k8vDcCEfc" },
	{ videoID: "vcp7XKBylkM" },
];

export function GridAsymmetrical() {
	const [isHalfWidth, setIsHalfWidth] = useAtom(isHalfWidthAtom);

	return (
		<Container my="md">
			<Grid>
				{mockData.map((data) => (
					<Grid.Col
						span={{ base: isHalfWidth ? 12 : 6, xs: 4 }}
						key={data.videoID}
					>
						<ApplicationCard videoID={data.videoID} />
					</Grid.Col>
				))}
			</Grid>
		</Container>
	);
}
