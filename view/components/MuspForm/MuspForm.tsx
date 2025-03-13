"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { IconBrandYoutube, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PostJobsRequest } from "../../client/client";
import type { PostJobsRequestType } from "../../client/client";
import classes from "./MuspForm.module.css";

interface MuspFormProps {
	onSubmit: (videoID: string) => void;
}

export function MuspForm({ onSubmit }: MuspFormProps) {
	const [isFocused, setIsFocused] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<PostJobsRequestType>({
		resolver: zodResolver(PostJobsRequest),
		defaultValues: {
			user_id: "",
			youtube_url: "",
		},
	});

	const watchYoutubeUrl = watch("youtube_url");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = localStorage.getItem("userID");
			if (storedUserId) {
				setValue("user_id", storedUserId);
				console.log("Stored user_id:", storedUserId);
			}
		}
	}, [setValue]);

	// フォーム送信時の処理
	const handleFormSubmit = async (data: PostJobsRequestType) => {
		console.log("送信データ:", data);

		onSubmit(data.youtube_url); // `MuspHome` に動画IDを渡す
		setValue("youtube_url", ""); // 入力欄をクリア
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<input type="hidden" {...register("user_id")} />

			<TextInput
				placeholder="https://www.youtube.com"
				radius="xl"
				error={errors.youtube_url?.message}
				{...register("youtube_url")}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				rightSection={
					watchYoutubeUrl?.length > 0 && (
						<IconX
							style={{ cursor: "pointer" }}
							onClick={() => setValue("youtube_url", "")}
						/>
					)
				}
				styles={{
					input: {
						borderColor: errors.youtube_url && !isFocused ? "red" : "#ccc",
					},
					label: {
						fontWeight: 500,
						marginBottom: "0.5rem",
					},
				}}
				className={classes.input}
			/>

			<Group justify="center" mt="xl" mb={50}>
				<IconBrandYoutube stroke={1.5} color="transparent" />
				<Button
					className={classes.button}
					type="submit"
					variant="gradient"
					gradient={{ from: "pink", to: "violet", deg: 90 }}
					disabled={!watchYoutubeUrl} // 未入力の場合はボタンを無効化
				>
					<div className={classes.label}>"Add Music!"</div>
				</Button>
				<a href="https://www.youtube.com/">
					<ActionIcon size="lg" color="gray" variant="subtle">
						<IconBrandYoutube stroke={1.5} color="red" />
					</ActionIcon>
				</a>
			</Group>
		</form>
	);
}
