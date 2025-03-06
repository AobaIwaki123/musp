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

export default function Home() {
	const [userName, setUserName] = useState<string | null>(null);
	const [iconUrl, setIconUrl] = useState<string | null>(null);
	const [gallery, setGallery] = useState<RamenGalleryList>([]);

	const form = useForm<Post>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			youtube_url: "",
		},
	});

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		form.setValue("youtube_url", event.target.value);
	}

	useEffect(() => {
		// https://img.youtube.com/vi/9P3kxfons2E/maxresdefault.jpg

			const ramen = {
				job_id: "id",
				image_url: "https://img.youtube.com/vi/9P3kxfons2E/maxresdefault.jpg",
				download_url: "https://ff165812c525b3fab7bbb99f7c6ec3a64f87c9ad97d4c5407d20ce8-apidata.googleusercontent.com/download/storage/v1/b/musp/o/daa89557-8498-4880-928b-d83137b3330f%2Fvocals.wav?jk=AVyuY3iF134qsPnaW8gOeL6kt7htPMgkgiNEQVOcbDaRN93I3PWoGMg5-2t3DlU9WN4gzelsffFyomE7c7RhcghOZaD7fSvYXF3IqELWlGHY3YVKRsvAnKVFvHQv_SNiJsUfh-XQHAlP99qkpxgc7_oblX_CfiPYZb5AmiNYRpcUwy3siPgDyqZq0mhd7FAqmNV5gS5K3FnZj9Ypbg_eeVLp2HHmEG5omw2-dvvMUZ-yZei-CkPJdYEqUr_H1KtbTNLrBJSL1lZZqJSnCT2fi8sofWVMfV-MtA7zUGqbrdtIjLWKlvIn4YzDqdVhXQ6yjDrSLalSMGUTYmvgGS8j8200zTF3VELkY-eBCqrzPkiU-Rhk2sEVfDfYJrmecro9k4u467Zo2kyYgsS7jPBsl5mkuuMTcxwcFaz6mgsq-h6_9S88Qavsa3FHxRlGLYQ-7BzOEop81VVusbaQeUzCnGQBe9MYZSReH1-KRc2Qmm-eNfVCgHDkHc_sQ2lCPkWjYM3hvBQ5ET84yUtUgv0gU_tzH7FZSR_k5Ht3TcLTM_nKb0e1hyPwNhxSpEqnLLuxADnnptxB2FpdDODyCdUhqZ_0gdHzOQ3oriCf7lCri75B5vH__IgGoIYK3BRyM2N1BzkAaWJu0f3UsPZT5frcA8-WXIJYMlQl4Y3tHj4POn5fbYMEg3MaWumNJfzqVOCWYw69EJlE4_JGM9o6tNFyt1mcBD3l5sw0NnM45rkCSmAYap9RHx0tZVN8KBu2ZvNSjy15_NBL1U4tFTt_q6pRIKLUABFpm19QWzeDjUR3XRkKxlThvgzwXFqKYub5EE1OBILoFMwvqPdVMoUm2-Obqe90wrKvSOE-wT2xO8hlobJ5sCCGTvAOzESr9uFzKZNaehaa9MAzlk-r89uPQYgQOHkY5iWp34iyMGMfU8LXSyT89CC6ykKIZHr6w0yIa35Fyj5zIaiM_6UnUpliKwf3ztvh6OASyMOKPiEquM7F1ptEziAUWX35WY6NrFkX3g2VUteZ5jns6FVoFPK4eyQvrWHKlWQJOM8MIOTes5XSs9cFw-77hrSBKtdGkO8XtWIdM7tdcAxD3h9Yse_ZtrGFKR4lrWaDzlSLEIKLTmc0nWnoz5-E2hxF8_3OSZr14E_Wkv5PLjlN0ZrVguOl3tJzY7xKmg&isca=1",
			}
			setGallery([ramen, ramen, ramen, ramen, ramen, ramen,]);
	}
	, []);

	const onSubmit = async (data: Post) => {
		try {
			const response = await fetch('http://localhost:8000/api/v1/jobs', {
				method: 'POST',
				headers: {
					'accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					youtube_url: data.youtube_url
				})
			});
			// window.location.reload();
			console.log("Request sent");
			

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
									{iconUrl && (
										<img
											src={iconUrl}
											alt="アイコン"
											className="w-24 h-24 object-cover rounded-full border-0 shadow-lg"
										/>
									)}
									<div className="flex flex-col flex-auto items-center">
										<div className="p-2 font-extrabold text-gray-800">{userName}</div>
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

							<RamenGallery gallery={gallery} />
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
