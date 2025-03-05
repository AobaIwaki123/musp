import { LoginButton } from "@/components/LoginButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
	return (
		<div>
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
				<Card className="w-[350px]">
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-bold text-primary">
							推し麺ノート
						</CardTitle>
						<CardDescription>ボタンを押してラーメンを推そう！！！</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-center">
							<LoginButton />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
