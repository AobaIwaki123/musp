import { getUrl } from "./utils";

export const getUserIcon = async (userId: number) => {
	// http://localhost:8000/v1/users/1
	return fetch(getUrl(`/v1/users/${userId}`), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => {
		if (res.status === 200) {
			return res.json().then((data) => data.icon_url || null);
		}

		return null;
	});
};
