import bundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NODE_ENV === "production";
const baseUrl = isProd ? "https://musp-dev.shaoba.tech" : "";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
	assetPrefix: baseUrl, // ✅ 変更
	output: "export",
	trailingSlash: true, // ✅ 追加
};

export default withBundleAnalyzer(nextConfig);
