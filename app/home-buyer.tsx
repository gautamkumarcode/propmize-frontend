"use client";

import AIPropertyChat from "@/components/features/AIPropertyChat";
import BuyerLayout from "@/components/layout/BuyerLayout";

export default function Home() {
	const handleNewChat = () => {
		console.log("Starting new chat");
		// Implement new chat logic
	};

	const handleDeleteChat = (chatId: string) => {
		console.log("Deleting chat:", chatId);
		// Implement delete chat logic
	};

	const handleChatHistory = () => {
		console.log("Opening chat history");
		// Implement chat history logic
	};

	return (
		<BuyerLayout>
			<div className="h-[calc(100vh-120px)]">
				<AIPropertyChat
					onNewChat={handleNewChat}
					onDeleteChat={handleDeleteChat}
					onChatHistory={handleChatHistory}
				/>
			</div>
		</BuyerLayout>
	);
}
