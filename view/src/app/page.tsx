"use client";

import { RamenGallery } from "@/components/RamenGallery";
import { MagazineModal } from "@/components/magazineModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { compressImage } from "@/lib/compressImage";
import { getUrl } from "@/lib/utils";
import type { RamenGalleryList } from "@/types/RamenGallery";
import { postSchema } from "@/types/post";
import type { Post } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
	const [userId, setUserId] = useState<number | null>(null);
	const [userName, setUserName] = useState<string | null>(null);
	const [isFile, setIsFile] = useState<boolean>(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [iconUrl, setIconUrl] = useState<string | null>(null);
	const [gallery, setGallery] = useState<RamenGalleryList>([]);

	const form = useForm<Post>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			user_id: 0,
			store_name: "",
			ramen_name: "",
			file: null,
			deliciousness_id: 3,
			portion_id: 3,
			thick_id: 3,
			texture_id: 3,
			soup_id: 3,
		},
	});

	useEffect(() => {
		const userID = localStorage.getItem("userID");
		const userName = localStorage.getItem("userName");
		const userIDNum = Number(userID);
		if (userID) {
			setUserId(userIDNum);
			setUserName(userName);
		} else {
			setUserId(null);
		}
	}, []);

	useEffect(() => {
		if (!userId) return;

		// userId をフォームにセット
		form.setValue("user_id", userId);

		// 非同期関数で API を呼び出す
		const fetchRamen = async () => {
			try {
				const response = await fetch(getUrl(`/v1/ramen?user_id=${userId}`), {
					headers: {
						"Content-Type": "application/json",
					},
				});
				const responseIcon = await fetch(getUrl(`/v1/users/${userId}`), {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok || !responseIcon.ok) {
					console.error("APIエラー:", response.status);
					return;
				}
				const data = await response.json();
				const iconData = await responseIcon.json();
				setGallery(data);
				setIconUrl(iconData.data.icon_url);
			} catch (error) {
				console.error("Fetchエラー:", error);
			}
		};

		fetchRamen();
	}, [userId, form]);

	const fileDelete = () => {
		setIsFile(false);
		setPreviewUrl(null);
		form.setValue("file", null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleClick = () => {
		fileDelete();
	};

	const onSubmit = async (data: Post) => {
		if (data.file === null) {
			throw new Error("ファイルが選択されていません");
		}
		const compressedFile = await compressImage(data.file);
		const formData = new FormData();

		// 必要なフィールドを FormData に追加
		formData.append("user_id", data.user_id.toString());
		formData.append("store_name", data.store_name);
		formData.append("name", data.ramen_name);
		formData.append("deliciousness_id", data.deliciousness_id.toString());
		formData.append("portion_id", data.portion_id.toString());
		formData.append("noodle_thickness_id", data.thick_id.toString());
		formData.append("noodle_texture_id", data.texture_id.toString());
		formData.append("soup_richness_id", data.soup_id.toString());

		// ファイルの追加
		if (compressedFile) {
			formData.append("file", compressedFile, compressedFile.name);
		}

		try {
			await fetch(getUrl("/v1/ramen"), {
				method: "POST",
				body: formData,
			});
			window.location.reload();
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
							<Card className={`${isFile ? "hidden" : "m-4"}`}>
								<div className="flex flex-initial justify-evenly items-center">
									{iconUrl && (
										<img
											src={iconUrl}
											alt="アイコン"
											className="w-24 h-24 object-cover rounded-full border-0 shadow-lg"
										/>
									)}
									<div className="flex flex-col items-center">
										<div className="p-2 font-extrabold text-gray-800">{userName}</div>
										<MagazineModal userId={userId} />{" "}
										<FormField
											control={form.control}
											name="file"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="relative">
															{/* カスタムボタンとして画像を表示 */}
															<label
																htmlFor="file-input"
																className="cursor-pointer w-20 h-20 bg-gray-200 rounded-full"
															>
																<Card className="flex items-center justify-center p-1 w-28 h-10 bg-gray-800 m-1 text-white text-center">
																	投稿
																</Card>
															</label>
															{/* 実際のファイル入力は非表示 */}
															<Input
																id="file-input"
																type="file"
																accept="image/*"
																className="hidden"
																onChange={(e) => {
																	const files = e.target.files;
																	field.onChange(files);
																	if (files && files.length !== 0) {
																		setIsFile(true);
																		// 選択されたファイルのプレビューURLを生成
																		setPreviewUrl(URL.createObjectURL(files[0]));
																	}
																}}
																ref={fileInputRef}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</Card>

							{isFile ? (
								<div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
									{/* プレビュー画像を表示 */}
									<div className="flex flex-col items-center mb-6">
										{previewUrl && (
											<img
												src={previewUrl}
												alt="プレビュー画像"
												className="w-40 h-40 object-cover rounded-2xl border-4 border-gray-300 shadow-lg"
											/>
										)}
										<p className="mt-4 text-lg font-medium text-gray-800">
											ラーメン情報を入力
										</p>
									</div>
									<div className="space-y-6 p-4 m-4">
										<FormField
											control={form.control}
											name="store_name"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														お店の名前
													</FormLabel>
													<FormControl>
														<Input
															placeholder="お店の名前"
															{...field}
															className="w-full text-gray-800 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
														/>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="ramen_name"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														ラーメンの名前
													</FormLabel>
													<FormControl>
														<Input
															placeholder="ラーメンの名前"
															{...field}
															className="w-full text-gray-800 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
														/>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="deliciousness_id"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														おいしさ
													</FormLabel>
													<FormControl>
														<div>
															<Input
																type="range"
																min={1}
																max={5}
																placeholder="美味しさ"
																{...field}
																className="w-full accent-indigo-500"
															/>
															<div className="flex justify-between text-xs text-gray-600 mt-2">
																<span>まずい</span>
																<span>美味しい</span>
															</div>
														</div>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="portion_id"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														量
													</FormLabel>
													<FormControl>
														<div>
															<Input
																type="range"
																min={1}
																max={5}
																placeholder="量"
																{...field}
																className="w-full accent-indigo-500"
															/>
															<div className="flex justify-between text-xs text-gray-600 mt-2">
																<span>少なめ</span>
																<span>多い</span>
															</div>
														</div>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="thick_id"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														太さ
													</FormLabel>
													<FormControl>
														<div>
															<Input
																type="range"
																min={1}
																max={5}
																placeholder="太さ"
																{...field}
																className="w-full accent-indigo-500"
															/>
															<div className="flex justify-between text-xs text-gray-600 mt-2">
																<span>細い</span>
																<span>太い</span>
															</div>
														</div>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="texture_id"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														麺の硬さ
													</FormLabel>
													<FormControl>
														<div>
															<Input
																type="range"
																min={1}
																max={5}
																placeholder="コシ"
																{...field}
																className="w-full accent-indigo-500"
															/>
															<div className="flex justify-between text-xs text-gray-600 mt-2">
																<span>柔らかい</span>
																<span>固い</span>
															</div>
														</div>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="soup_id"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel className="mb-2 font-semibold text-gray-700">
														あっさり・こってり
													</FormLabel>
													<FormControl>
														<div>
															<Input
																type="range"
																min={1}
																max={5}
																placeholder="こってり"
																{...field}
																className="w-full accent-indigo-500"
															/>
															<div className="flex justify-between text-xs text-gray-600 mt-2">
																<span>あっさり</span>
																<span>こってり</span>
															</div>
														</div>
													</FormControl>
													<FormMessage className="mt-1 text-sm text-red-500" />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex justify-between mt-8">
										<Button
											type="submit"
											className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
										>
											Submit
										</Button>
										<Button
											onClick={handleClick}
											className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
										>
											キャンセル
										</Button>
									</div>
								</div>
							) : (
								<RamenGallery gallery={gallery} />
							)}
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
