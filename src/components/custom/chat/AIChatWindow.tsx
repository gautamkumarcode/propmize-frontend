"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAIChatState } from "@/hooks/useAIChat";
import { AIMessage, formatPrice } from "@/services/aiChatService";
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
	initialContext?: any;
	onPropertyClick?: (propertyId: string) => void;
	onActionClick?: (action: any) => void;
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
		updateContext,
		submitFeedback,
		endSession,
	} = useAIChatState(initialChatId);

	// Auto scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	// Initialize chat if not exists
	useEffect(() => {
		if (!chatId && !isLoading) {
			startNewChat(conversationType, initialContext);
		}
	}, [chatId, isLoading, conversationType, initialContext, startNewChat]);

	const handleSendMessage = async () => {
		if (!message.trim() || !chatId) return;

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

		await submitFeedback(messageId, {
			rating: rating || (helpful ? 5 : 1),
			helpful,
			comment: feedbackComment || undefined,
		});

		setShowFeedback(null);
		setFeedbackRating(0);
		setFeedbackComment("");
	};

	const handlePropertyAction = (action: any, propertyId?: string) => {
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
				className={`flex gap-3 ${
					isUser ? "justify-end" : "justify-start"
				} mb-4`}>
				{isAI && (
					<div className="flex-shrink-0">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
							<Bot className="w-4 h-4 text-white" />
						</div>
					</div>
				)}

				<div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
					<Card
						className={`${isUser ? "bg-blue-600 text-white" : "bg-gray-50"} ${
							isUser ? "border-blue-600" : "border-gray-200"
						}`}>
						<CardContent className="p-4">
							<p className="text-sm whitespace-pre-wrap">{msg.content}</p>

							{/* Property Suggestions */}
							{msg.properties && msg.properties.length > 0 && (
								<div className="mt-3 space-y-3">
									<p
										className={`text-xs font-medium ${
											isUser ? "text-blue-100" : "text-gray-500"
										}`}>
										Suggested Properties:
									</p>
									{msg.properties.map((property: any, idx) => (
										<Card
											key={idx}
											className="cursor-pointer hover:shadow-md transition-shadow border-gray-200">
											<CardContent className="p-3">
												<div className="flex gap-3">
													<img
														src={property.image || "/api/placeholder/80/60"}
														alt={property.title}
														className="w-20 h-15 object-cover rounded"
													/>
													<div className="flex-1">
														<h4 className="font-medium text-sm">
															{property.title}
														</h4>
														<p className="text-xs text-gray-600 flex items-center gap-1">
															<MapPin className="w-3 h-3" />
															{property.location}
														</p>
														<p className="text-sm font-bold text-green-600">
															{formatPrice(property.price)}
														</p>
														<div className="flex gap-2 mt-1">
															<Badge variant="secondary" className="text-xs">
																{property.type}
															</Badge>
															{property.size && (
																<Badge variant="outline" className="text-xs">
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
														className="text-xs h-7">
														<Home className="w-3 h-3 mr-1" />
														View Details
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
														className="text-xs h-7">
														<Heart className="w-3 h-3 mr-1" />
														Save
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
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
									<div className="flex flex-wrap gap-2">
										{msg.actions.map((action, idx) => (
											<Button
												key={idx}
												size="sm"
												variant={isUser ? "secondary" : "outline"}
												onClick={() => handlePropertyAction(action)}
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
												{action.type
													.replace("-", " ")
													.replace(/\b\w/g, (l) => l.toUpperCase())}
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
									<div className="flex flex-wrap gap-2">
										{msg.suggestions.map((suggestion, idx) => (
											<Button
												key={idx}
												size="sm"
												variant={isUser ? "ghost" : "outline"}
												onClick={() => setMessage(suggestion)}
												className={`text-xs h-7 border ${
													isUser
														? "border-blue-500/20 text-blue-100 hover:bg-blue-500/10"
														: "border-gray-200 hover:bg-gray-100"
												}`}>
												{suggestion}
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
												{[1, 2, 3, 4, 5].map((star) => (
													<button
														key={star}
														onClick={() => setFeedbackRating(star)}
														className={`text-lg ${
															feedbackRating >= star
																? "text-yellow-400"
																: "text-gray-300"
														}`}>
														<Star className="w-5 h-5 fill-current" />
													</button>
												))}
											</div>
											<textarea
												placeholder="Optional feedback..."
												value={feedbackComment}
												onChange={(e) => setFeedbackComment(e.target.value)}
												className="w-full text-xs border rounded p-2 mt-1"
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
										<div className="flex items-center gap-2">
											<span className="text-xs text-gray-500">
												Was this helpful?
											</span>
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
												Rate response
											</button>
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					<div className="text-xs text-gray-500 mt-1 text-right">
						{new Date(msg.timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</div>
				</div>

				{isUser && (
					<div className="flex-shrink-0">
						<div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
							<User className="w-4 h-4 text-white" />
						</div>
					</div>
				)}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="flex flex-col items-center">
					<Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
					<span className="text-sm text-gray-600">
						Starting AI assistant...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col h-full">
			{/* Chat Header */}
			<div className="border-b p-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Bot className="w-5 h-5 text-blue-500" />
						<Badge variant="secondary" className="text-xs capitalize">
							{conversationType.replace("-", " ")}
						</Badge>
					</div>
					{chatId && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => endSession()}
							className="text-xs h-8">
							End Session
						</Button>
					)}
				</div>

				{/* Context Display */}
				{context?.propertySearch && (
					<div className="mt-2 p-2 bg-blue-50 rounded text-xs">
						<p className="font-medium">Search Context:</p>
						<div className="flex flex-wrap gap-2 mt-1">
							{context.propertySearch.location && (
								<Badge variant="outline">
									{context.propertySearch.location}
								</Badge>
							)}
							{context.propertySearch.priceRange && (
								<Badge variant="outline">
									₹{context.propertySearch.priceRange.min} - ₹
									{context.propertySearch.priceRange.max}
								</Badge>
							)}
							{context.propertySearch.propertyType && (
								<Badge variant="outline">
									{context.propertySearch.propertyType}
								</Badge>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4">
				{messages.length === 0 && !isTyping && (
					<div className="h-full flex flex-col items-center justify-center text-center">
						<div className="w-16 h-16 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
							<Bot className="w-6 h-6 text-blue-500" />
						</div>
						<h3 className="font-medium mb-2">
							Welcome to AI Property Assistant!
						</h3>
						<p className="text-sm text-gray-600 max-w-xs mb-4">
							I'm here to help you find the perfect property. Ask me anything
							about properties, locations, or get recommendations.
						</p>
						<div className="flex flex-wrap gap-2 justify-center">
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
									onClick={() => setMessage(suggestion)}
									className="text-xs h-8">
									{suggestion}
								</Button>
							))}
						</div>
					</div>
				)}

				{messages.map((msg, idx) => renderMessage(msg, idx))}

				{isTyping && (
					<div className="flex gap-3 mb-4">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
							<Bot className="w-4 h-4 text-white" />
						</div>
						<Card className="bg-gray-50">
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

			{/* Input Area */}
			<div className="border-t p-3 bg-white">
				<div className="relative">
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Ask me about properties, locations, or get recommendations..."
						className="pr-10"
						disabled={isSendingMessage || !chatId}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!message.trim() || isSendingMessage || !chatId}
						size="icon"
						className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8">
						{isSendingMessage ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
