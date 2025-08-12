"use client";

import { MessageCircle, Search } from "lucide-react";
import { useConversations } from "../../../lib/react-query/hooks/useChat";
import { Conversation } from "../../../lib/services/chatService";
import { Button } from "../../ui/button";

interface ConversationsSidebarProps {
	selectedConversationId?: string;
	onConversationSelect: (
		conversationId: string,
		otherUserId: string,
		otherUserName: string
	) => void;
	className?: string;
}

export default function ConversationsSidebar({
	selectedConversationId,
	onConversationSelect,
	className = "",
}: ConversationsSidebarProps) {
	const { data: conversationsData, isLoading, isError } = useConversations();

	const conversations = conversationsData?.data || [];

	const formatTime = (date: Date) => {
		const now = new Date();
		const messageDate = new Date(date);
		const diffHours = Math.floor(
			(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
		);

		if (diffHours < 1) {
			const diffMinutes = Math.floor(
				(now.getTime() - messageDate.getTime()) / (1000 * 60)
			);
			return diffMinutes < 1 ? "Just now" : `${diffMinutes}m ago`;
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else {
			return messageDate.toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
			});
		}
	};

	const getOtherParticipant = (
		conversation: Conversation,
		currentUserId: string | undefined
	) => {
		return conversation.participants.find((p) => p._id !== currentUserId);
	};

	if (isLoading) {
		return (
			<div
				className={`w-full lg:w-80 bg-white border-r flex items-center justify-center ${className}`}>
				<div className="text-gray-500">Loading conversations...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div
				className={`w-full lg:w-80 bg-white border-r flex items-center justify-center ${className}`}>
				<div className="text-red-500">Failed to load conversations</div>
			</div>
		);
	}

	return (
		<div
			className={`w-full lg:w-80 bg-white border-r flex flex-col ${className}`}>
			{/* Header */}
			<div className="p-4 border-b">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900">Messages</h2>
					<Button variant="ghost" size="sm">
						<MessageCircle className="h-5 w-5" />
					</Button>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<input
						type="text"
						placeholder="Search conversations..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>
			</div>

			{/* Conversations List */}
			<div className="flex-1 overflow-y-auto">
				{conversations.length === 0 ? (
					<div className="p-8 text-center">
						<MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p className="text-gray-500 text-sm">No conversations yet</p>
						<p className="text-gray-400 text-xs mt-1">
							Start a conversation by messaging someone
						</p>
					</div>
				) : (
					conversations.map((conversation) => {
						const otherParticipant = getOtherParticipant(
							conversation,
							"current-user-id"
						); // You'll need to get current user ID
						const isSelected = conversation._id === selectedConversationId;

						return (
							<div
								key={conversation._id}
								onClick={() =>
									otherParticipant &&
									onConversationSelect(
										conversation._id,
										otherParticipant._id,
										otherParticipant.name
									)
								}
								className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
									isSelected ? "bg-blue-50 border-blue-200" : ""
								}`}>
								<div className="flex items-center space-x-3">
									{/* Avatar */}
									<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-white font-semibold">
											{otherParticipant?.name?.charAt(0)?.toUpperCase() || "?"}
										</span>
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-1">
											<h3 className="font-medium text-gray-900 truncate">
												{otherParticipant?.name || "Unknown User"}
											</h3>
											<span className="text-xs text-gray-500">
												{conversation.lastMessage
													? formatTime(conversation.lastMessage.createdAt)
													: ""}
											</span>
										</div>

										<div className="flex items-center justify-between">
											<p className="text-sm text-gray-600 truncate">
												{conversation.lastMessage?.content ||
													"Start a conversation"}
											</p>
											{conversation.unreadCount > 0 && (
												<span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
													{conversation.unreadCount}
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
