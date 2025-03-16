import { Card, Text, Title, Center, Container } from "@mantine/core";
import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";

export default function Home() {
	return (
		<Container
			size={400}
			className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100"
		>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Center>
					<Title order={2} className="text-3xl font-bold text-primary">
						Musp
					</Title>
				</Center>
				<Text align="center" color="dimmed" mt="sm">
					YouTubeの音楽をボーカルのみ抽出するアプリ
				</Text>
				<Center mt="md">
					<LoginButton />
				</Center>
			</Card>
		</Container>
	);
}
