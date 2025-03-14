"use client";

import { RamenGallery } from "@/components/RamenGallery";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { getUrl } from "@/lib/utils";
import type { RamenGalleryList } from "@/types/RamenGallery";
import { postSchema } from "@/types/post";
import type { Post } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/client/api";
import { PostJobsRequest } from "@/client/client";
import type { PostJobsRequestType } from "@/client/client";
import type { GetInfoListResponseType } from "@/client/client";

export default function Home() {
	const [userID, setUserID] = useState<string | null>(null);
	const [userName, setUserName] = useState<string | null>(null);
	const [iconUrl, setIconUrl] = useState<string | null>(null);
	const [gallery, setGallery] = useState<GetInfoListResponseType>({ items: [] });

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
		
		form.setValue("user_id", userID);
	}, [userID]);

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


	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		form.setValue("youtube_url", event.target.value);
	}

	const onSubmit = async (data: Post) => {
		console.log(data);
		try {
			// User IDとYotube URLでCreate Jobを実行
			const res = await api.postJobs(data);
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col min-h-screen py-10 bg-gradient-to-t from-emerald-100 via-yellow-100 to-amber-100">
			{/* スマホサイズに制限するコンテナ */}
			<div className="w-full mx-auto">
				<div className="flex flex-col">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<Card className={"m-4"}>
								<div className="flex flex-initial justify-evenly items-center">
									<div className="flex flex-col flex-auto items-center">
										<div className="flex">
											{iconUrl && (
												<img
													src={iconUrl}
													alt="アイコン"
													className="w-8 h-8 object-cover rounded-full border-0 shadow-lg"
												/>
											)}
											<div className="p-2 font-extrabold text-gray-800">{userName}</div>
										</div>
											<FormItem className="flex flex-col flex-auto w-full space-y-4 p-4">
												{/* URLを入力するフォームを追加 */}
												<FormControl className="flex">
													<input
														type="text"
														onChange={handleChange}
														placeholder="URLを入力してください"
														className="flex-1 w-full p-2 border-2 border-gray-300 rounded-md"
													/>
												</FormControl>
												{/* 送信ボタン */}
												<FormControl>
													<button type="submit" 
													className="w-full p-2 bg-blue-500 text-white rounded-md"
													>
														送信</button>
												</FormControl>
											</FormItem>
									</div>
								</div>
							</Card>
							<Card className="m-4 p-4 text-center text-gray-800">
								<div className="text-lg text-gray-600 leading-relaxed">
									<p>曲の冒頭がインストのみの場合、</p>
									<p>しばらく無音が続くことがあります。</p>
								</div>
							</Card>
							<RamenGallery items={gallery.items} />
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
