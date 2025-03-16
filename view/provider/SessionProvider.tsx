"use client";
import { userIDAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { storage } from "@/helper/localStorageHelper";

export interface SessionProviderProps {
	children: React.ReactNode;
}

// クラアントのローカルストレージでデータ保持してます
export const SessionProvider = ({ children }: SessionProviderProps) => {
	const userID = storage.get<string>("userID", ""); // デフォルト値を設定

	useEffect(() => {
		if (window.location.pathname === "/login") {
			return;
		}

		if (userID === "") {
			console.log("Please Login");
			window.location.href = "/login";
			return;
		}

		console.log("Already Login, User ID: ", userID);
	}, [userID]);

	return <>{children}</>;
};
export default SessionProvider;
