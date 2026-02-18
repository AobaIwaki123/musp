"use client";
import { storage } from "@/helper/localStorageHelper";
import { signInOrUp } from "@/lib/login/signInAndUp";
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithPopup } from "@firebase/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { GoogleButton } from "../GoogleButton/GoogleButton";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpsIs903Zk8xZtXxw4671DhVg4XAj8XxY",
  authDomain: "musp-8f9bd.firebaseapp.com",
  projectId: "musp-8f9bd",
  storageBucket: "musp-8f9bd.firebasestorage.app",
  messagingSenderId: "866327989325",
  appId: "1:866327989325:web:982dd0d485f7c4a0fae004",
  measurementId: "G-ZVGTSY36K1"
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
