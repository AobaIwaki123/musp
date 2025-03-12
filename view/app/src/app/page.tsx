"use client";

import { Container, Grid, Skeleton, MantineProvider } from '@mantine/core';
import { MusicGallery } from '@/components/music/MusicGallery';
import { useState, useEffect } from "react";
import type { GetInfoListResponseType } from "@/client/client";
import type { PostJobsRequestType } from "@/client/client";
import { PostJobsRequest } from "@/client/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/client/api";

export default function Home() {
	const [gallery, setGallery] = useState<GetInfoListResponseType>({ items: [] });
	const [userID, setUserID] = useState<string | null>(null);
	const [userName, setUserName] = useState<string | null>(null);
	const [iconUrl, setIconUrl] = useState<string | null>(null);

	const form = useForm<PostJobsRequestType>({
		resolver: zodResolver(PostJobsRequest),
		defaultValues: {
			user_id: "",
			youtube_url: "",
		},
	});

		useEffect(() => {
		const userID = localStorage.getItem("userID");
		const userName = localStorage.getItem("userName");
		const iconUrl = localStorage.getItem("iconUrl");

		if (!userID || !userName || !iconUrl) {
			console.log("ユーザー情報がありません [userID, userName, iconUrl]", userID, userName, iconUrl);
			return;
		}

		setUserID(userID);
		setUserName(userName);
		setIconUrl(iconUrl);
	}, []);

	useEffect(() => {
		if (!userID) {
			return;
		}

		const fetchInfo = async () => {
			const data = await api.getInfoUser_id({	params: { user_id: userID }});

			console.log("data", data);

			setGallery(data);
		};

		fetchInfo();
	}, [userID]);
const child = <Skeleton height={140} radius="md" animate={false} />;

	return (
		<MantineProvider>
			<Container my="md">
					<Grid>
						<Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 8 }}>{child}</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 8 }}>{child}</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 6 }}>{child}</Grid.Col>
					</Grid>
				</Container>
		</MantineProvider>
	);
}
