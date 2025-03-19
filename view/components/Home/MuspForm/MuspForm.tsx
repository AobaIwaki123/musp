"use client";

import { userIDAtom } from "@/jotai/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

import { AddMusicIcon } from "@/components/Icons/AddMusicIcon/AddMusicIcon";
import { PasteIcon } from "@/components/Icons/PasteIcon/PasteIcon";
import { YouTubeIcon } from "@/components/Icons/YouTubeIcon/YouTubeIcon";
import { useForm } from "react-hook-form";

import { PostVideoRequest } from "@/client/client";
import type { PostVideoRequestType } from "@/client/client";

import classes from "./MuspForm.module.css";
interface MuspFormProps {
	onSubmit: (videoID: string) => void;
}

export function MuspForm({ onSubmit }: MuspFormProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [userID, setUserID] = useAtom(userIDAtom);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<PostVideoRequestType>({
		resolver: zodResolver(PostVideoRequest),
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
			if (userID) {
				setValue("user_id", userID);
			}
		}
	}, [setValue, userID]);

	// フォーム送信時の処理
	const handleFormSubmit = async (data: PostVideoRequestType) => {
		onSubmit(data.youtube_url); // `Home` に動画IDを渡す
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
				<YouTubeIcon />
				<PasteIcon handlePaste={handlePaste} />
				<AddMusicIcon watchYoutubeUrl={watchYoutubeUrl} />
			</Group>
		</form>
	);
}
