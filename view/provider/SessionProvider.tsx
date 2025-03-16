"use client";
import { isShowLoginModalAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { storage } from "@/helper/localStorageHelper";

export interface SessionProviderProps {
	children: React.ReactNode;
}

// クラアントのローカルストレージでデータ保持してます
export const SessionProvider = ({ children }: SessionProviderProps) => {
	const [_, setIsShowLoginModal] = useAtom(isShowLoginModalAtom);
	const userID = storage.get<string>("userID", ""); // デフォルト値を設定

	useEffect(() => {
		if (window.location.pathname === "/login") {
			return;
		}

		if (userID === "") {
			console.log("Please Login");
			setIsShowLoginModal(true);
			return;
		}

		console.log("Already Login, User ID: ", userID);
	}, [userID, setIsShowLoginModal]);

	return <>{children}</>;
};
export default SessionProvider;
