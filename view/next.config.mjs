import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withBundleAnalyzer(nextConfig);
