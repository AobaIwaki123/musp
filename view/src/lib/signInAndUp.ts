import { getUrl } from "@/lib/utils";
import type { User as FirebaseUser } from "@firebase/auth";

const storeStorageUser = (uid: string) => {
	localStorage.setItem("userID", uid);
};

const storeStorageUserName = (name: string) => {
	localStorage.setItem("userName", name);
};

type responseJson = {
	message: string;
	data: {
		id: string;
	};
};

export const signInOrUp = async (firebaseUser: FirebaseUser) => {
	try {
		const res = await fetch(getUrl("v1/users"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				google_id: firebaseUser.uid,
				nickname: firebaseUser.displayName || "default_nickname", // ニックネームを追加
				icon_url: firebaseUser.photoURL || "default_icon_url", // アイコン画像の URL を追加
			}),
		});

		if (res.status === 200) {
			console.log("ユーザーが存在します");
		} else if (res.status === 201) {
			console.log("ユーザーを作成しました");
		} else if (res.status === 422) {
			console.log("リクエストが不正です", res);
			return;
		} else {
			console.log("予期せぬエラーが発生しました", res);
			return;
		}

		const responseJson = (await res.json()) as responseJson;
		const uid = responseJson.data.id;
		storeStorageUser(uid);
		storeStorageUserName(firebaseUser.displayName || "User Name");

		toRoot();
		return uid;
	} catch (error) {
		console.error("エラーが発生しました:", error);
	}
};

const toRoot = () => {
	window.location.href = "/";
};
