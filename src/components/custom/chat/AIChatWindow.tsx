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
	Heart,
	Home,
	Info,
	Loader2,
	MapPin,
	Phone,
	Send,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

	// Initialize chat only once
	useEffect(() => {
		if (initialChatId) {
			setAIChatId(initialChatId);
			setIsNewChat(false);
		} else if (!chatId && !isLoading) {
			setIsNewChat(true);
		}
	}, [initialChatId, chatId, isLoading, setAIChatId]);

	// Auto scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	const handleStartNewChat = async () => {
		try {
			await startNewChat();
			setIsNewChat(false);
			if (onNewChat) onNewChat();
		} catch (error) {
			console.error("Error starting new chat:", error);
		}
	};

	// useEffect(() => {
	// 	handleStartNewChat();
	// }, [isAuthenticated && !user]); // Restart chat when user logs in/out

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

	const renderMessage = (msg: AIMessage, index: number) => {
		const isUser = msg.role === "user";

		return (
			<div
				key={msg._id || index}
				className={`flex gap-2 md:gap-3 ${
					isUser ? "justify-end" : "justify-start"
				} mb-3 md:mb-4 px-2 md:px-0`}>
				<div
					className={`max-w-[85%] md:max-w-[80%] ${
						isUser ? "order-first" : ""
					}`}>
					<Card
						className={`${isUser ? "bg-blue-600 text-white" : "bg-gray-50"} ${
							isUser ? "border-blue-600" : "border-gray-200"
						}`}>
						<CardContent className="p-3 md:p-4">
							<p className="text-sm whitespace-pre-wrap break-words">
								{msg.content}
							</p>

							{msg.properties && msg.properties.length > 0 && (
								<div className="mt-3 space-y-3">
									<p
										className={`text-xs font-medium ${
											isUser ? "text-blue-100" : "text-gray-500"
										}`}>
										Suggested Properties:
									</p>
									{msg.properties.map((property, idx) => (
										<Card
											key={property._id || idx}
											className="cursor-pointer hover:shadow-lg transition-all border border-gray-100 rounded-xl overflow-hidden">
											<CardContent className="p-0">
												{/* Image Section */}
												<div className="relative h-36 md:h-40 w-full">
													<img
														src={
															property?.images && property.images[0]
																? property.images[0]
																: "/api/placeholder/160/120"
														}
														alt={property.title}
														className="h-full w-full object-cover"
													/>
													<div className="absolute top-2 left-2 flex gap-1">
														<Badge variant="featured" className="text-xs">
															FEATURED
														</Badge>
														<Badge
															variant="price"
															className="bg-green-600 text-white text-xs shadow-md">
															{formatPrice(property.price)}
														</Badge>
													</div>
													<button
														onClick={() =>
															handlePropertyAction(
																{ type: "save-property" },
																property._id
															)
														}
														className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md">
														<Heart className="w-4 h-4 text-red-500" />
													</button>
												</div>

												{/* Content */}
												<div className="p-3">
													<h4 className="font-semibold text-sm text-gray-900 truncate">
														{property.title}
													</h4>
													<p className="text-xs text-gray-600 flex items-center gap-1 truncate mt-1">
														<MapPin className="w-3 h-3 flex-shrink-0 text-blue-500" />
														{[property?.address?.area, property?.address?.city]
															.filter(Boolean)
															.join(", ")}
													</p>

													{/* Badges */}
													<div className="flex gap-2 mt-2">
														<Badge
															variant="secondary"
															className="text-xs capitalize">
															{property.type}
														</Badge>
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

							{msg.actions && msg.actions.length > 0 && (
								<div className="mt-3 space-y-2">
									<p
										className={`text-xs font-medium ${
											isUser ? "text-blue-100" : "text-gray-500"
										}`}>
										Quick Actions:
									</p>
									<div className="flex flex-wrap gap-1 md:gap-2">
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
													isUser
														? "bg-white text-blue-600 hover:bg-white/90"
														: ""
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

							{msg.suggestions && msg.suggestions.length > 0 && (
								<div className="mt-3 space-y-2">
									<p
										className={`text-xs font-medium ${
											isUser ? "text-blue-100" : "text-gray-500"
										}`}>
										Quick Replies:
									</p>
									<div className="flex flex-wrap gap-1 md:gap-2">
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
						</CardContent>
					</Card>

					<div className="text-xs text-gray-500 mt-1 text-right px-1">
						{(() => {
							const date = new Date(msg.timestamp || msg.createdAt);
							const hours = date.getHours().toString().padStart(2, "0");
							const minutes = date.getMinutes().toString().padStart(2, "0");
							return `${hours}:${minutes}`;
						})()}
					</div>
				</div>

				{/* {isUser && (
					<div className="flex-shrink-0">
						<div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
							<User className="w-3 h-3 md:w-4 md:h-4 text-white" />
						</div>
					</div>
				)} */}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="flex flex-col items-center">
					<Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-500 mb-2" />
					<span className="text-sm text-gray-600 text-center">
						{initialChatId
							? "Loading chat session..."
							: "Starting AI assistant..."}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col h-full">
			{/* Messages */}
			<div className=" overflow-y-scroll flex-1">
				<div className="p-2 md:p-4 space-y-0">
					{/* New chat state */}
					{isNewChat && !isLoading && (
						<div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4">
							<div className="w-12 h-12 md:w-16 md:h-16 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
								<Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
							</div>
							<h3 className="font-medium mb-2 text-sm md:text-base">
								Start a new conversation
							</h3>
							<p className="text-xs md:text-sm text-gray-600 max-w-xs mb-4">
								Your AI assistant is ready to help with your property search.
							</p>
							<Button onClick={handleStartNewChat} className="mb-4">
								Start Chat
							</Button>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
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
										className="text-xs h-8 px-2 text-left">
										<span className="truncate">{suggestion}</span>
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Empty chat state (after starting but no messages yet) */}
					{!isNewChat && messages.length === 0 && !isTyping && (
						<div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4">
							<div className="w-12 h-12 md:w-16 md:h-16 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
								<Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
							</div>
							<h3 className="font-medium mb-2 text-sm md:text-base">
								Welcome back!
							</h3>
							<p className="text-xs md:text-sm text-gray-600 max-w-xs mb-4">
								Continue your property search or ask a new question.
							</p>
						</div>
					)}

					{/* Render messages */}
					{!isNewChat && messages.map((msg, idx) => renderMessage(msg, idx))}

					{/* Typing indicator */}
					{isTyping && (
						<div className="flex gap-2 md:gap-3 mb-4 px-2 md:px-0">
							<div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
								<Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
							</div>
							<Card className="bg-gray-50 max-w-[85%] md:max-w-[80%]">
								<CardContent className="p-3">
									<div className="flex items-center gap-2">
										<div className="flex gap-1">
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
										</div>
										<span className="text-xs text-gray-500">
											AI assistant is thinking...
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className="border-t p-2 md:p-3 bg-white flex-shrink-0">
				<div className="relative">
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder={
							isNewChat
								? "Click 'Start Chat' button to begin chatting..."
								: "Ask me about properties, locations, or get recommendations..."
						}
						className="pr-10 text-sm md:text-base h-10 md:h-12 focus:ring-0 focus:outline-none"
						disabled={isSendingMessage || isNewChat}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!message.trim() || isSendingMessage || isNewChat}
						size="icon"
						className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10">
						{isSendingMessage ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-3 h-3 md:w-4 md:h-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}