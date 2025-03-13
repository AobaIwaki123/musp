"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Group, TextInput } from "@mantine/core";
import {
	IconBrandYoutube,
	IconClipboardCheck,
	IconMusicPlus,
	IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PostJobsRequest } from "../../../client/client";
import type { PostJobsRequestType } from "../../../client/client";
import { LoadWabButton } from "../../Buttons/LoadWabButton/LoadWabButton";
import { ModeIconWrapper } from "../../Icons/ModeIconWrapper/ModeIconWrapper";
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

	const handlePaste = async () => {
		try {
			const clipboardText = await navigator.clipboard.readText();
			setValue("youtube_url", clipboardText);
		} catch (error) {
			console.error("Failed to read clipboard:", error);
		}
	};

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
				<a href="https://www.youtube.com/">
					<ActionIcon size="lg" color="gray" variant="subtle">
						<ModeIconWrapper
							icon={IconBrandYoutube}
							darkColor="red"
							lightColor="red"
							size={30}
						/>
					</ActionIcon>
				</a>
				<ActionIcon
					size="lg"
					color="gray"
					variant="subtle"
					onClick={handlePaste}
				>
					<ModeIconWrapper
						icon={IconClipboardCheck}
						darkColor="skyblue"
						lightColor="skyblue"
						size={30}
					/>
				</ActionIcon>
				<ActionIcon
					type="submit"
					size="lg"
					color="red"
					variant="subtle"
					disabled={!watchYoutubeUrl} // 未入力の場合はボタンを無効化
				>
					<ModeIconWrapper
						icon={IconMusicPlus}
						darkColor={watchYoutubeUrl ? "pink" : "gray"}
						lightColor={watchYoutubeUrl ? "pink" : "gray"}
						size={30}
					/>
				</ActionIcon>
				<LoadWabButton />
			</Group>
		</form>
	);
}
