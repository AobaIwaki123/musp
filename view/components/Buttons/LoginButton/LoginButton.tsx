"use client";
import { storage } from "@/helper/localStorageHelper";
import { signInOrUp } from "@/lib/login/signInAndUp";
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithPopup } from "@firebase/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { GoogleButton } from "../GoogleButton/GoogleButton";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const provider = new GoogleAuthProvider();

async function signUp() {
	const auth = getAuth();

	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			const user = result.user;

			// ユーザー登録
			signInOrUp(user);
		})
		.catch((error) => {
			console.log("error", error);
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
}

async function testSignUp() {
	storage.set("userID", "testuser");

	window.location.href = "/";
}

export const LoginButton = () => {
	const app = initializeApp(firebaseConfig);

	return <GoogleButton onClick={signUp}>Googleでサインイン</GoogleButton>;
};
