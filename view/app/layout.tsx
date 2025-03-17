import "@mantine/core/styles.css";

import { SessionProvider } from "@/provider/SessionProvider";
import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";
import React from "react";
import { theme } from "../theme";
export const metadata = {
	title: "Musp",
	description: "Musp",
};

export default function RootLayout({ children }: { children: any }) {
	return (
		<SessionProvider>
			<html lang="en" {...mantineHtmlProps}>
				<head>
					<ColorSchemeScript />
					<link rel="shortcut icon" href="/MuspIcon/MuspIcon-2.webp" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/icon512_rounded.png" />
					<meta
						name="viewport"
						content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
					/>
				</head>
				<body>
					<MantineProvider theme={theme}>{children}</MantineProvider>
				</body>
			</html>
		</SessionProvider>
	);
}
