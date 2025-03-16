import { Modal, Button, Center } from "@mantine/core";
import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { useState } from "react";

export function LoginModal() {
	const [opened, _] = useState(true);

	return (
		<>
			{/* モーダル */}
			<Modal
				opened={opened}
				onClose={() => {}}
				withCloseButton={false} // ✨ 閉じるボタンを無効化
				overlayProps={{
					backgroundOpacity: 0.6, // ✨ 背景を暗くする
					blur: 3, // ✨ 背景をぼかす
				}}
				centered // ✨ モーダルを中央に配置
			>
				<Center>
					<LoginButton />
				</Center>
			</Modal>
		</>
	);
}

export default LoginModal;
