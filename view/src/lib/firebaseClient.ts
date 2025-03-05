// firebaseClient.ts
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// あなたのFirebaseプロジェクトの設定情報を記述
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_APIKEY,
	authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECTID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
	appId: process.env.NEXT_PUBLIC_APPID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

// すでに初期化されていない場合のみ初期化する
if (!getApps().length) {
	initializeApp(firebaseConfig);
}

export { getAuth };
