"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAIChats } from "@/hooks/useAIChat";
import { useAuth } from "@/lib/providers/AuthProvider";
import { AIChat, aiChatService } from "@/services/aiChatService";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import logo from "../../../../public/logo.png";

type ChatSidebarProps = {
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	handleNewChat: () => void;
	handleSelectChat: (chatId: string) => void;
};

export const ChatSidebar = ({
	showSidebar,
	setShowSidebar,
	handleNewChat,
	handleSelectChat,
}: ChatSidebarProps) => {
	const { user } = useAuth();
	const scrollRef = useRef<HTMLDivElement>(null);

	// Use React Query for chat history - only fetch when sidebar is shown and user exists
	const {
		data: chatData,
		isLoading,
		error,
		refetch,
	} = useAIChats(1, 20, undefined);

	const chats = chatData?.success ? chatData.data.chats : [];
	const isError = !!error;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	};

	const getMessagePreview = (messages: { content: string }[]) => {
		if (!messages || messages.length === 0) return "No messages";
		const last = messages[messages.length - 1];
		return last?.content?.slice(0, 80) + "...";
	};

	const handleChatDelete = async (chatId: string, event: React.MouseEvent) => {
		// Prevent the chat selection when clicking delete
		event.stopPropagation();

		if (!user) return;

		if (confirm("Are you sure you want to delete this chat?")) {
			try {
				await aiChatService.deleteAIChat(chatId);

				// Refetch the chat list to update the UI
				refetch();

				// If this was the last chat or we need a new chat, handle it in the parent component
				// You might want to pass this logic up to the parent component
				console.log("Chat deleted successfully");
			} catch (error) {
				console.error("Error deleting chat:", error);
				alert("Failed to delete chat");
			}
		}
	};

	if (!showSidebar) return null;

	return (
		<div className="fixed inset-0 z-40">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/20 backdrop-blur-sm"
				onClick={() => setShowSidebar(false)}
			/>

			{/* Sidebar */}
			<div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<div className="flex items-center gap-2">
						<Image src={logo} alt="Propmize Logo" width={30} height={30} />
						<p className="text-blue-600 font-semibold">Propmize</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setShowSidebar(false)}
						aria-label="Close Sidebar">
						<X className="w-5 h-5" />
					</Button>
				</div>

				{/* New Chat */}
				<div className="p-3 border-b">
					<Button
						className="w-full flex items-center gap-2 justify-center"
						onClick={() => {
							handleNewChat();
							setShowSidebar(false);
						}}>
						<Plus className="w-4 h-4" /> New Chat
					</Button>
				</div>

				{/* Chat History */}
				<div className="flex-1 overflow-y-auto p-3 mb-14" ref={scrollRef}>
					{!user ? (
						<p className="text-center text-gray-600 mt-6">
							Login to see chat history
						</p>
					) : isLoading ? (
						<p className="text-center text-gray-600 mt-6">Loading...</p>
					) : isError ? (
						<p className="text-center text-red-500 mt-6">
							Failed to load chat history
						</p>
					) : chats.length === 0 ? (
						<p className="text-center text-gray-600 mt-6">No chats found</p>
					) : (
						chats.map((chat: AIChat) => (
							<div
								key={chat._id}
								onClick={() => {
									handleSelectChat(chat._id);
									setShowSidebar(false);
								}}
								className="p-3 mb-2 rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-100">
								<div className="flex justify-between items-center mb-1">
									<h3 className="font-medium text-sm truncate">
										{chat.title || "AI Chat"}
									</h3>
									<div className="flex items-center gap-2">
										<span className="text-xs text-gray-500">
											{formatDate(chat.updatedAt)}
										</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => handleChatDelete(chat._id, e)}
											className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
											aria-label="Delete chat">
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>
								<Badge variant="outline" className="text-xs mb-1">
									{chat.messages?.length || 0} messages
								</Badge>
								<p className="text-xs text-gray-600">
									{getMessagePreview(chat.messages)}
								</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};
