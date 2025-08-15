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
import { PropertySuggestion } from "@/types/aiChat";
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
	Star,
	ThumbsDown,
	ThumbsUp,
	User,
	X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface AIChatWindowProps {
	initialChatId?: string;
	conversationType?:
		| "property-search"
		| "general-inquiry"
		| "recommendation"
		| "support";
	initialContext?: { userId: string; location: string };
	onPropertyClick?: (propertyId: string) => void;
	onActionClick?: (action: AIAction) => void;
}

export default function AIChatWindow({
	initialChatId,
	conversationType = "property-search",
	initialContext,
	onPropertyClick,
	onActionClick,
}: AIChatWindowProps) {
	const [message, setMessage] = useState("");
	const [showFeedback, setShowFeedback] = useState<string | null>(null);
	const [feedbackRating, setFeedbackRating] = useState<number>(0);
	const [feedbackComment, setFeedbackComment] = useState("");

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const {
		chatId,
		messages,
		isTyping,
		context,
		isLoading,
		isSendingMessage,
		startNewChat,
		sendMessage,
		submitFeedback,
		endSession,
	} = useAIChatState(initialChatId);

	// Auto scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	// Initialize chat only if initialChatId is provided (don't auto-create new chats)
	useEffect(() => {
		if (initialChatId && !chatId && !isLoading) {
			// Only load existing chat, don't create new one
			return;
		}
	}, [initialChatId, chatId, isLoading]);

	const handleSendMessage = async () => {
		if (!message.trim()) return;

		// Check if chat exists, if not show error
		if (!chatId) {
			console.error("No chat session available. Please start a new chat.");
			return;
		}

		const messageText = message;
		setMessage("");

		try {
			await sendMessage(messageText);
		} catch (error) {
			console.error("Error sending message:", error);
			setMessage(messageText); // Restore message on error
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleFeedback = async (
		messageId: string,
		helpful: boolean,
		rating?: number
	) => {
		if (!chatId) return;

		await submitFeedback({
			chatId,
			messageId,
			feedback: {
				rating: (rating || (helpful ? 5 : 1)) as 1 | 2 | 3 | 4 | 5,
				helpful,
				comment: feedbackComment || undefined,
			},
		});

		setShowFeedback(null);
		setFeedbackRating(0);
		setFeedbackComment("");
	};

	const handlePropertyAction = (action: AIAction, propertyId?: string) => {
		if (onActionClick) {
			onActionClick({ ...action, propertyId });
		}
	};

	const renderMessage = (msg: AIMessage, index: number) => {
		const isAI = msg.role === "assistant";
		const isUser = msg.role === "user";

		return (
			<div
				key={msg._id || index}
				className={`flex gap-2 md:gap-3 ${
					isUser ? "justify-end" : "justify-start"
				} mb-3 md:mb-4 px-2 md:px-0`}>
				{isAI && (
					<div className="flex-shrink-0">
						<div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
							<Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
						</div>
					</div>
				)}

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

							{/* Property Suggestions */}
							{msg.properties && msg.properties.length > 0 && (
								<div className="mt-3 space-y-3">
									<p
										className={`text-xs font-medium ${
											isUser ? "text-blue-100" : "text-gray-500"
										}`}>
										Suggested Properties:
									</p>
									{msg.properties.map(
										(property: PropertySuggestion, idx: number) => (
											<Card
												key={idx}
												className="cursor-pointer hover:shadow-md transition-shadow border-gray-200">
												<CardContent className="p-2 md:p-3">
													<div className="flex gap-2 md:gap-3">
														<img
															src={property.image || "/api/placeholder/80/60"}
															alt={property.title}
															className="w-16 h-12 md:w-20 md:h-15 object-cover rounded flex-shrink-0"
														/>
														<div className="flex-1 min-w-0">
															<h4 className="font-medium text-sm truncate">
																{property.title}
															</h4>
															<p className="text-xs text-gray-600 flex items-center gap-1 truncate">
																<MapPin className="w-3 h-3 flex-shrink-0" />
																<span className="truncate">
																	{typeof property.location === "string"
																		? property.location
																		: property.location
																		? [
																				property.location.area,
																				property.location.city,
																		  ]
																				.filter(Boolean)
																				.join(", ")
																		: ""}
																</span>
															</p>
															<p className="text-sm font-bold text-green-600">
																{formatPrice(property.price)}
															</p>
															<div className="flex gap-1 md:gap-2 mt-1">
																<Badge
																	variant="secondary"
																	className="text-xs px-1.5 py-0.5">
																	{property.type}
																</Badge>
																{property.size && (
																	<Badge
																		variant="outline"
																		className="text-xs px-1.5 py-0.5">
																		{property.size}
																	</Badge>
																)}
															</div>
														</div>
													</div>
													<div className="flex gap-2 mt-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() => onPropertyClick?.(property.id)}
															className="text-xs h-7 flex-1 md:flex-none">
															<Home className="w-3 h-3 mr-1" />
															<span className="hidden sm:inline">
																View Details
															</span>
															<span className="sm:hidden">View</span>
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																handlePropertyAction(
																	{ type: "save-property" },
																	property.id
																)
															}
															className="text-xs h-7 flex-1 md:flex-none">
															<Heart className="w-3 h-3 mr-1" />
															Save
														</Button>
													</div>
												</CardContent>
											</Card>
										)
									)}
								</div>
							)}

							{/* Action Suggestions */}
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

							{/* Quick Reply Suggestions */}
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

							{/* Message Feedback */}
							{isAI && msg._id && (
								<div
									className={`mt-3 pt-2 ${
										isUser
											? "border-t border-blue-500/30"
											: "border-t border-gray-200"
									}`}>
									{showFeedback === msg._id ? (
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-xs text-gray-500">
													Rate this response:
												</span>
												<button
													onClick={() => setShowFeedback(null)}
													className="text-gray-400 hover:text-gray-600">
													<X className="w-4 h-4" />
												</button>
											</div>
											<div className="flex items-center gap-1">
												{[1, 2, 3, 4, 5].map((star: number) => (
													<button
														key={star}
														onClick={() => setFeedbackRating(star)}
														className={`text-lg ${
															feedbackRating >= star
																? "text-yellow-400"
																: "text-gray-300"
														}`}>
														<Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
													</button>
												))}
											</div>
											<textarea
												placeholder="Optional feedback..."
												value={feedbackComment}
												onChange={(e) => setFeedbackComment(e.target.value)}
												className="w-full text-xs border rounded p-2 mt-1 resize-none"
												rows={2}
											/>
											<Button
												size="sm"
												onClick={() =>
													handleFeedback(msg._id!, true, feedbackRating)
												}
												className="text-xs h-8 w-full">
												Submit Feedback
											</Button>
										</div>
									) : (
										<div className="flex items-center gap-2 flex-wrap">
											<span className="text-xs text-gray-500">
												Was this helpful?
											</span>
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleFeedback(msg._id!, true)}
													className="text-green-500 hover:text-green-600">
													<ThumbsUp className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleFeedback(msg._id!, false)}
													className="text-red-500 hover:text-red-600">
													<ThumbsDown className="w-4 h-4" />
												</button>
												<button
													onClick={() => setShowFeedback(msg._id!)}
													className="text-blue-500 hover:text-blue-600 text-xs ml-1">
													Rate
												</button>
											</div>
										</div>
									)}
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

				{isUser && (
					<div className="flex-shrink-0">
						<div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
							<User className="w-3 h-3 md:w-4 md:h-4 text-white" />
						</div>
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
						Starting AI assistant...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col h-full">
			{/* Chat Header */}
			<div className="border-b p-2 md:p-3 flex-shrink-0 bg-white">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Bot className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
						<Badge variant="secondary" className="text-xs capitalize">
							{conversationType.replace("-", " ")}
						</Badge>
					</div>
					{chatId && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => chatId && endSession(chatId)}
							className="text-xs h-7 md:h-8">
							End Session
						</Button>
					)}
				</div>

				{/* Context Display */}
				{context?.propertySearch && (
					<div className="mt-2 p-2 bg-blue-50 rounded text-xs">
						<p className="font-medium">Search Context:</p>
						<div className="flex flex-wrap gap-1 md:gap-2 mt-1">
							{context.propertySearch.location && (
								<Badge variant="outline" className="text-xs">
									{context.propertySearch.location}
								</Badge>
							)}
							{context.propertySearch.priceRange && (
								<Badge variant="outline" className="text-xs">
									₹{context.propertySearch.priceRange.min} - ₹
									{context.propertySearch.priceRange.max}
								</Badge>
							)}
							{context.propertySearch.propertyType && (
								<Badge variant="outline" className="text-xs">
									{context.propertySearch.propertyType}
								</Badge>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto overscroll-contain">
				<div className="p-2 md:p-4 space-y-0">
					{!chatId && !isLoading ? (
						<div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4">
							<div className="w-12 h-12 md:w-16 md:h-16 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
								<Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
							</div>
							<h3 className="font-medium mb-2 text-sm md:text-base">
								Ready to Start!
							</h3>
							<p className="text-xs md:text-sm text-gray-600 max-w-xs mb-4">
								Your AI assistant is ready to help. Click the "Start Chat"
								button to begin your property search journey.
							</p>
						</div>
					) : messages.length === 0 && !isTyping && chatId ? (
						<div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4">
							<div className="w-12 h-12 md:w-16 md:h-16 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
								<Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
							</div>
							<h3 className="font-medium mb-2 text-sm md:text-base">
								Welcome to AI Property Assistant!
							</h3>
							<p className="text-xs md:text-sm text-gray-600 max-w-xs mb-4">
								I&apos;m here to help you find the perfect property. Ask me
								anything about properties, locations, or get recommendations.
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
								{[
									"Show me 3BHK apartments in Mumbai",
									"What are trending areas in Bangalore?",
									"I need a property near good schools",
									"Compare Gurgaon vs Noida",
								].map((suggestion: string, idx: number) => (
									<Button
										key={idx}
										size="sm"
										variant="outline"
										onClick={() => setMessage(suggestion)}
										className="text-xs h-8 px-2 text-left">
										<span className="truncate">{suggestion}</span>
									</Button>
								))}
							</div>
						</div>
					) : null}

					{chatId &&
						messages.map((msg: AIMessage, idx: number) =>
							renderMessage(msg, idx)
						)}

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
							!chatId
								? "Click 'Start Chat' button to begin chatting..."
								: "Ask me about properties, locations, or get recommendations..."
						}
						className="pr-10 text-sm md:text-base h-10 md:h-12"
						disabled={isSendingMessage || !chatId}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!message.trim() || isSendingMessage || !chatId}
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
