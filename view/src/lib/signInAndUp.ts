import { getUrl } from "@/lib/utils";
import type { User as FirebaseUser } from "@firebase/auth";
import { api } from "@/client/api";
import { appendOffsetOfLegend } from "recharts/types/util/ChartUtils";
import type { PostUserRequestType } from "@/client/client";

const storeStorageUser = (uid: string) => {
  localStorage.setItem("userID", uid);
};

const storeStorageUserName = (name: string) => {
  localStorage.setItem("userName", name);
};

const storeStorageIconUrl = (iconUrl: string) => {
  localStorage.setItem("iconUrl", iconUrl);
};

type responseJson = {
  message: string;
  data: {
    id: string;
  };
};

export const signInOrUp = async (firebaseUser: FirebaseUser) => {
  try {
    console.log("firebaseUser", firebaseUser);
    const google_id = firebaseUser.uid;
    const nickname = firebaseUser.displayName || "default_nickname";
    const icon_url = firebaseUser.photoURL || "default_icon_url";

		const data: PostUserRequestType = {
			google_id,
			nickname,
			icon_url,
		};

		console.log(data);
    const res = await api.postUsers(data);
    console.log(res);

    const user_id = res.user_id
    storeStorageUser(user_id);
    storeStorageUserName(nickname);
    storeStorageIconUrl(icon_url);

    toRoot();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

const toRoot = () => {
  window.location.href = "/";
};
