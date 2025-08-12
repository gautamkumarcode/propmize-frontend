"use client";

import { MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../lib/providers/AuthProvider";
import {
	useMarkAsRead,
	useMessages,
	useRealTimeMessages,
	useSendMessage,
} from "../../../lib/react-query/hooks/useChat";
import { Message } from "../../../lib/services/chatService";
import { Button } from "../../ui/button";

interface ChatWindowProps {
	conversationId: string;
	otherUserId: string;
	otherUserName: string;
	className?: string;
}

export default function ChatWindow({
	conversationId,
	otherUserId,
	otherUserName,
	className = "",
}: ChatWindowProps) {
	const [message, setMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { user } = useAuth();

	// Hooks
	const { data: messagesData, isLoading } = useMessages(conversationId);
	const { newMessage } = useRealTimeMessages(conversationId);
	const sendMessageMutation = useSendMessage();
	const markAsReadMutation = useMarkAsRead();

	const messages = messagesData?.data || [];

	// Auto scroll to bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, newMessage]);

	// Mark messages as read
	useEffect(() => {
		if (conversationId && user) {
			markAsReadMutation.mutate(conversationId);
		}
	}, [conversationId, user, markAsReadMutation]);

	const handleSendMessage = () => {
		if (!message.trim()) return;

		sendMessageMutation.mutate({
			conversationId,
			receiverId: otherUserId,
			content: message,
		});

		setMessage("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const isMessageFromCurrentUser = (msg: Message) => {
		return msg.senderId === user?.id;
	};

	if (isLoading) {
		return (
			<div className={`flex items-center justify-center h-full ${className}`}>
				<div className="text-gray-500">Loading messages...</div>
			</div>
		);
	}

	return (
		<div className={`flex flex-col  ${className}`}>
			{/* Chat Header */}
			<div className="flex items-center justify-between p-4 border-b bg-white">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
						<span className="text-white font-semibold">
							{otherUserName?.charAt(0)?.toUpperCase() || "?"}
						</span>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900">{otherUserName}</h3>
						<p className="text-sm text-gray-500">
							{isTyping ? "Typing..." : "Online"}
						</p>
					</div>
				</div>
				<Button variant="ghost" size="sm">
					<MoreVertical className="h-5 w-5" />
				</Button>
			</div>

			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
				{messages.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<p>No messages yet. Start the conversation!</p>
					</div>
				) : (
					messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								isMessageFromCurrentUser(msg) ? "justify-end" : "justify-start"
							}`}>
							<div
								className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
									isMessageFromCurrentUser(msg)
										? "bg-blue-500 text-white"
										: "bg-white text-gray-900 shadow-sm border"
								}`}>
								<p className="text-sm">{msg.content}</p>
								<p
									className={`text-xs mt-1 ${
										isMessageFromCurrentUser(msg)
											? "text-blue-100"
											: "text-gray-500"
									}`}>
									{/* {formatTime(msg?.createdAt)}
									{isMessageFromCurrentUser(msg) &&
										(msg?.isRead ? " • Read" : " • Delivered")} */}
								</p>
							</div>
						</div>
					))
				)}

				{newMessage && (
					<div
						key={newMessage.id}
						className={`flex ${
							isMessageFromCurrentUser(newMessage)
								? "justify-end"
								: "justify-start"
						}`}>
						<div
							className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
								isMessageFromCurrentUser(newMessage)
									? "bg-blue-500 text-white"
									: "bg-white text-gray-900 shadow-sm border"
							}`}>
							<p className="text-sm">{newMessage.content}</p>
							<p
								className={`text-xs mt-1 ${
									isMessageFromCurrentUser(newMessage)
										? "text-blue-100"
										: "text-gray-500"
								}`}>
								{/* {formatTime(newMessage.createdAt)}
								{isMessageFromCurrentUser(newMessage) &&
									(newMessage.isRead ? " • Read" : " • Delivered")} */}
							</p>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Message Input */}
			<div className="p-4 bg-white border-t">
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm">
						<Paperclip className="h-5 w-5" />
					</Button>
					<div className="flex-1 relative">
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your message..."
							className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 pr-12"
							disabled={sendMessageMutation.isPending}
						/>
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-1 top-1/2 transform -translate-y-1/2">
							<Smile className="h-5 w-5" />
						</Button>
					</div>
					<Button
						onClick={handleSendMessage}
						disabled={!message.trim() || sendMessageMutation.isPending}
						className="rounded-full">
						<Send className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
