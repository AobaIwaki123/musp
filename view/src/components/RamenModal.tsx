"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type React from "react";
import { useEffect, useRef } from "react";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";

import type { RamenGallery } from "@/types/RamenGallery";

type RamenModalProps = RamenGallery & {
	isOpenModal: boolean;
	setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function RamenModal({
	isOpenModal,
	setIsOpenModal,
	id,
	name,
	description,
	image_url,
	parameters,
}: RamenModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const chartAxisList = ["うまい", "こってり", "バリカタ", "大盛り", "こってり"];
	const parameterValues = Object.values(parameters); // 順序が固定であることを前提

	const labelMapping: {
		[key: string]: string; // どんな文字列キーでもstring型の値を返す
	} = {
		deliciousness_id: "うまい",
		noodle_texture_id: "バリカタ",
		noodle_thickness_id: "ちぢれ",
		portion_id: "大盛り",
		soup_richness_id: "こってり",
	};

	const radarData = Object.entries(parameters).map(([key, value]) => ({
		// labelMappingに対応があれば日本語、なければ元のkey
		subject: labelMapping[key] ?? key,
		value,
	}));

	// モーダル外クリックで閉じる処理
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				setIsOpenModal(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setIsOpenModal]);

	// モーダル表示中は背面スクロールを禁止
	useEffect(() => {
		if (isOpenModal) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
	}, [isOpenModal]);

	if (!isOpenModal) return null;

	return (
		<div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50">
			<div
				ref={modalRef}
				className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[95vh] md:max-h-[90vh] w-[97vw] md:w-[80vw] p-4 md:p-10 md:pb-20 bg-slate-100 border-2 border-neutral-950 shadow-lg rounded-xl overflow-auto"
			>
				<Card className="border rounded-xl shadow-lg">
					<CardContent className="flex flex-col items-center p-6">
						{image_url ? (
							<img
								src={image_url}
								alt={name}
								className="w-60 h-40 object-cover rounded-lg mb-4"
							/>
						) : (
							<div className="w-60 h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
								<span className="text-gray-500">No Image</span>
							</div>
						)}
						<h2 className="text-lg font-bold mb-2">{name}</h2>
						<p className="mb-4 text-center">{description}</p>
						<RadarChart
							cx={150}
							cy={150}
							outerRadius={80}
							width={300}
							height={300}
							data={radarData}
						>
							<PolarGrid />
							<PolarAngleAxis dataKey="subject" />
							<PolarRadiusAxis domain={[0, 5]} />
							<Radar
								name={name}
								dataKey="value"
								stroke="#8884d8"
								fill="#8884d8"
								fillOpacity={0.6}
							/>
						</RadarChart>
						<Button onClick={() => setIsOpenModal(false)} className="mt-4">
							Close
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
