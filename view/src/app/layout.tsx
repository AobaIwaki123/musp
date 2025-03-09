import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import SessionProvider from "@/provider/SessionProvider";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "oshi",
	description: "oshi ramen",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionProvider>
			<html lang="ja">
				<body
					className={`${inter.className} min-h-screen flex flex-col bg-amber-500 text-white`}
				>
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</body>
			</html>
		</SessionProvider>
	);
}
