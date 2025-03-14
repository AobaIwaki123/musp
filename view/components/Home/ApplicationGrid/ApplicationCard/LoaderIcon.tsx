import { Center, Loader } from "@mantine/core";

export function LoaderIcon() {
	return (
		<Center
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				opacity: 0.8,
				transform: "translate(-50%, -50%)",
				zIndex: 2,
				width: 50, // サイズ調整
				height: 50, // 幅と高さを同じにすることで円形になる
				minWidth: 0, // Mantine のデフォルトの最小幅を無効化
				padding: 0, // 余白を削減
			}}
		>
			<Loader color="#9ad7ff" />
		</Center>
	);
}
