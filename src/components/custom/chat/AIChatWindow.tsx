"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAIChatState } from "@/hooks/useAIChat";
import {
	AIMessage,
	formatPrice,
	MessageAction,
} from "@/services/aiChatService";
import { AIAction } from "@/types";
import {
	Bot,
	Calendar,
	ChevronDown,
	Home,
	Info,
	Loader2,
	MapPin,
	Phone,
	Send,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../../../public/logo.png";

interface AIChatWindowProps {
	initialChatId?: string;
	onPropertyClick?: (propertyId: string) => void;
	onActionClick?: (action: AIAction) => void;
	onNewChat?: () => void;
}

export default function AIChatWindow({
	initialChatId,
	onPropertyClick,
	onActionClick,
	onNewChat,
}: AIChatWindowProps) {
	const [message, setMessage] = useState("");
	const [isNewChat, setIsNewChat] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [lastMessageCount, setLastMessageCount] = useState(0);

	const {
		chatId,
		messages,
		isTyping,
		isLoading,
		isSendingMessage,
		startNewChat,
		sendMessage,
		setChatId: setAIChatId,
	} = useAIChatState(initialChatId);

	// Debug log for messages
	useEffect(() => {
		console.log(
			"AIChatWindow: Messages updated:",
			messages.length,
			"messages for chatId:",
			chatId
		);
	}, [messages, chatId]);

	// Handle initialChatId changes
	useEffect(() => {
		console.log(
			"AIChatWindow: initialChatId changed to:",
			initialChatId,
			"current chatId:",
			chatId,
			"isLoading:",
			isLoading
		);

		if (initialChatId && initialChatId !== chatId) {
			console.log("AIChatWindow: Setting new chat ID:", initialChatId);
			setAIChatId(initialChatId);
			setIsNewChat(false);
		} else if (!initialChatId && !chatId && !isLoading) {
			console.log("AIChatWindow: Starting new chat");
			setIsNewChat(true);
		}
	}, [initialChatId, chatId, isLoading, setAIChatId]);

	// Handle scroll position and auto-scroll logic
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;

		const checkScrollPosition = () => {
			if (!container) return;
			const threshold = 50;
			const isNearBottom =
				container.scrollHeight - container.scrollTop - container.clientHeight <=
				threshold;
			setIsAtBottom(isNearBottom);
		};

		container.addEventListener("scroll", checkScrollPosition);
		checkScrollPosition();

		return () => {
			container.removeEventListener("scroll", checkScrollPosition);
		};
	}, []);

	// Auto-scroll when new messages arrive or typing changes
	useEffect(() => {
		if (isAtBottom || messages.length > lastMessageCount || isTyping) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
		setLastMessageCount(messages.length);
	}, [messages, isTyping, isAtBottom, lastMessageCount]);

	const handleStartNewChat = async () => {
		try {
			await startNewChat();
			setIsNewChat(false);
			if (onNewChat) onNewChat();
		} catch (error) {
			console.error("Error starting new chat:", error);
		}
	};

	const handleSendMessage = async () => {
		if (!message.trim()) return;

		if (isNewChat || !chatId) {
			await handleStartNewChat();
		}

		const messageText = message;
		setMessage("");

		try {
			await sendMessage(messageText);
		} catch (error) {
			console.error("Error sending message:", error);
			setMessage(messageText);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handlePropertyAction = (action: AIAction, propertyId?: string) => {
		if (onActionClick) {
			onActionClick({ ...action, propertyId });
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		setIsAtBottom(true);
	};

	// Rest of your renderMessage function and JSX remains the same...
	const renderMessage = (msg: AIMessage, index: number) => {
		// ... your existing renderMessage implementation
		const isUser = msg.role === "user";

		return (
			<div
				key={msg._id || index}
				className={`flex gap-3 ${
					isUser ? "justify-end" : "justify-start"
				} mb-4`}>
				{/* AI Avatar */}
				{!isUser && (
					<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
						<Image src={logo} alt="Ai logo" width={20} height={20} />
					</div>
				)}

				<div className={`max-w-[70%] ${isUser ? "order-first" : ""}`}>
					<div
						className={`rounded-2xl px-4 py-3 ${
							isUser
								? "bg-blue-600 text-white rounded-br-md"
								: "bg-white text-gray-900 rounded-bl-md shadow-sm border"
						}`}>
						<div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
							<p className="text-sm whitespace-pre-wrap break-words">
								{msg.content}
							</p>
						</div>
					</div>

					{/* Property Cards */}
					{msg.properties && msg.properties.length > 0 && (
						<div className="mt-3 space-y-3">
							<p
								className={`text-xs font-medium ${
									isUser ? "text-blue-100" : "text-gray-500"
								} mb-2`}>
								Suggested Properties:
							</p>
							{msg.properties.map((property, idx) => (
								<Card
									key={property._id || idx}
									className="cursor-pointer hover:shadow-lg transition-all border border-gray-100 rounded-xl overflow-hidden">
									<CardContent className="p-0">
										{/* Image Section */}
										<div className="relative h-36 md:h-52 w-full">
											<img
												src={
													property?.images && property.images[0]
														? property.images[0]
														: "/api/placeholder/160/120"
												}
												alt={property.title}
												className="h-full w-full object-cover"
											/>
											<div className="absolute top-2  flex gap-1 justify-between w-full">
												<Badge variant="featured" className="text-xs">
													FEATURED
												</Badge>
												<Badge
													variant="price"
													className="bg-green-600 text-white text-xs shadow-md">
													{formatPrice(property.price)}
												</Badge>
											</div>
										</div>

										{/* Content */}
										<div className="p-3">
											<h4 className="font-semibold text-sm text-gray-900 truncate">
												{property.title}
											</h4>
											<p className="text-xs text-gray-600 flex items-center gap-1 truncate mt-1">
												<MapPin className="w-3 h-3 flex-shrink-0 text-blue-500" />
												{typeof property?.address === "string"
													? property.address
													: property?.address?.area ||
													  property?.address?.city ||
													  "Location not specified"}
											</p>

											{/* Badges */}
											<div className="flex gap-2 mt-2">
												{property.views !== undefined && (
													<Badge variant="outline" className="text-xs">
														{property.views} views
													</Badge>
												)}
												{property.likes !== undefined && (
													<Badge variant="outline" className="text-xs">
														{property.likes} likes
													</Badge>
												)}

												{property.size && (
													<Badge variant="outline" className="text-xs">
														{property.size}
													</Badge>
												)}
											</div>

											{/* Actions */}
											<div className="flex gap-2 mt-3">
												<Button
													size="sm"
													variant="default"
													onClick={() => onPropertyClick?.(property._id)}
													className="text-xs h-8 flex-1">
													<Home className="w-4 h-4 mr-1" />
													View Details
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Action Buttons */}
					{msg.actions && msg.actions.length > 0 && (
						<div className="mt-3 space-y-2">
							<p
								className={`text-xs font-medium ${
									isUser ? "text-blue-100" : "text-gray-500"
								}`}>
								Quick Actions:
							</p>
							<div className="flex flex-wrap gap-2">
								{msg.actions.map((action: MessageAction, idx: number) => (
									<Button
										key={idx}
										size="sm"
										variant={isUser ? "secondary" : "outline"}
										onClick={() =>
											handlePropertyAction({
												...action,
												type: action.type as AIAction["type"],
											})
										}
										className={`text-xs h-7 ${
											isUser ? "bg-white text-blue-600 hover:bg-white/90" : ""
										}`}>
										{action.type === "schedule-viewing" && (
											<Calendar className="w-3 h-3 mr-1" />
										)}
										{action.type === "contact-agent" && (
											<Phone className="w-3 h-3 mr-1" />
										)}
										{action.type === "request-info" && (
											<Info className="w-3 h-3 mr-1" />
										)}
										<span className="truncate">
											{action.type
												.replace("-", " ")
												.replace(/\b\w/g, (l: string) => l.toUpperCase())}
										</span>
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Suggestion Buttons */}
					{msg.suggestions && msg.suggestions.length > 0 && (
						<div className="mt-3 space-y-2">
							<p
								className={`text-xs font-medium ${
									isUser ? "text-blue-100" : "text-gray-500"
								}`}>
								Quick Replies:
							</p>
							<div className="flex flex-wrap gap-2">
								{msg.suggestions.map((suggestion: string, idx: number) => (
									<Button
										key={idx}
										size="sm"
										variant={isUser ? "ghost" : "outline"}
										onClick={() => setMessage(suggestion)}
										className={`text-xs h-7 border max-w-full ${
											isUser
												? "border-blue-500/20 text-blue-100 hover:bg-blue-500/10"
												: "border-gray-200 hover:bg-gray-100"
										}`}>
										<span className="truncate">{suggestion}</span>
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Timestamp */}
					<div
						className={`text-xs text-gray-400 mt-2 ${
							isUser ? "text-right" : "text-left"
						}`}>
						{(() => {
							const date = new Date(msg.timestamp || msg.createdAt);
							const hours = date.getHours().toString().padStart(2, "0");
							const minutes = date.getMinutes().toString().padStart(2, "0");
							return `${hours}:${minutes}`;
						})()}
					</div>
				</div>

				{/* User Avatar */}
				{isUser && (
					<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
						<span className="text-white text-sm font-medium">U</span>
					</div>
				)}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="flex flex-col items-center">
					<Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-500 mb-2" />
					<span className="text-sm text-gray-600 text-center">
						{initialChatId ? "Loading chat session..." : "Starting Propmize..."}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full max-h-screen relative bg-gray-50">
			{/* Messages Container */}
			<div
				className="flex-1 overflow-y-auto scroll-smooth"
				ref={messagesContainerRef}
				style={{ height: "calc(100vh - 120px)" }}>
				<div className="p-4 space-y-4 min-h-full flex flex-col">
					{/* New chat state */}
					{isNewChat && !isLoading && (
						<div className="flex-1 flex flex-col items-center justify-center text-center px-4">
							<div className="w-16 h-16 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
								<Bot className="w-8 h-8 text-blue-500" />
							</div>
							<h3 className="font-semibold mb-3 text-lg text-gray-900">
								Start a new conversation
							</h3>
							<p className="text-sm text-gray-600 max-w-sm mb-6 leading-relaxed">
								Your AI assistant is ready to help with your property search.
								Ask anything about properties, locations, or get personalized
								recommendations.
							</p>
							<Button onClick={handleStartNewChat} className="mb-6 px-6">
								Start Chat
							</Button>
							<div className="grid grid-cols-1 gap-3 w-full max-w-lg">
								{[
									"Show me 3BHK apartments in Mumbai",
									"What are trending areas in Bangalore?",
									"I need a property near good schools",
									"Compare Gurgaon vs Noida",
								].map((suggestion, idx) => (
									<Button
										key={idx}
										size="sm"
										variant="outline"
										onClick={() => {
											setMessage(suggestion);
											handleStartNewChat().then(() => handleSendMessage());
										}}
										className="text-sm h-10 px-4 text-left justify-start hover:bg-blue-50">
										<span className="truncate">{suggestion}</span>
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Empty chat state (after starting but no messages yet) */}
					{!isNewChat && messages.length === 0 && !isTyping && (
						<div className="flex-1 flex flex-col items-center justify-center text-center px-4">
							<div className="w-16 h-16 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
								<Bot className="w-8 h-8 text-blue-500" />
							</div>
							<h3 className="font-semibold mb-3 text-lg text-gray-900">
								Welcome back!
							</h3>
							<p className="text-sm text-gray-600 max-w-sm leading-relaxed">
								Continue your property search or ask a new question.
							</p>
						</div>
					)}

					{/* Render messages */}
					{!isNewChat && messages.map((msg, idx) => renderMessage(msg, idx))}

					{/* Typing indicator */}
					{isTyping && (
						<div className="flex gap-3 mb-4">
							<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
								<Bot className="w-4 h-4 text-blue-600" />
							</div>
							<div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border max-w-[70%]">
								<div className="flex items-center gap-3">
									<div className="flex gap-1">
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									</div>
									<span className="text-xs text-gray-500">
										Propmize is thinking...
									</span>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Scroll to bottom button */}
			{!isAtBottom && messages.length > 0 && (
				<Button
					onClick={scrollToBottom}
					className="absolute bottom-20 right-4 z-10 rounded-full w-10 h-10 p-0 shadow-lg bg-white hover:bg-gray-50 border">
					<ChevronDown className="w-4 h-4 text-gray-600" />
				</Button>
			)}

			{/* Input Area */}
			<div className="border-t bg-white p-4 flex-shrink-0">
				<div className="flex gap-3 items-end max-w-4xl mx-auto">
					<div className="flex-1 relative">
						<Input
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder={
								isNewChat
									? "Click 'Start Chat' button to begin chatting..."
									: "Type your message..."
							}
							className="pr-12 text-sm h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							disabled={isSendingMessage || isNewChat}
						/>
						<Button
							onClick={handleSendMessage}
							disabled={!message.trim() || isSendingMessage || isNewChat}
							size="icon"
							className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full">
							{isSendingMessage ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Send className="w-4 h-4" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}