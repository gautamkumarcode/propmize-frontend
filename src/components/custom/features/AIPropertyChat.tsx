"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
	useAIChatMessages,
	useAIChatRealtime,
	useSendAIMessage,
	useStartAIChat,
} from "@/lib/react-query/hooks/useAIChat";
import { useAuthStore } from "@/store/app-store";
import { Property } from "@/types";
import {
	Building2,
	DollarSign,
	History,
	Home,
	Loader2,
	MapPin,
	MoreVertical,
	Plus,
	Send,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Message {
	_id: string;
	sender: string; // "ai-assistant" or user ID
	content: string;
	messageType: string;
	suggestions: string[];
	properties: any[];
	readBy: string[];
	createdAt: string;
}

interface ChatData {
	_id: string;
	participants: string[];
	type: string;
	title: string;
	isActive: boolean;
	messages: Message[];
	unreadCount: Record<string, number>;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface APIResponse {
	success: boolean;
	data: {
		messages: Message[];
		chat: ChatData;
	};
}

interface AIPropertyChatProps {
	onNewChat: () => void;
	onDeleteChat: (chatId: string) => void;
	onChatHistory: () => void;
}

export default function AIPropertyChat({
	onNewChat,
	onDeleteChat,
	onChatHistory,
}: AIPropertyChatProps) {
	const [inputMessage, setInputMessage] = useState("");
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);
	const [isAITyping, setIsAITyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { user, isAuthenticated } = useAuthStore();
	const router = useRouter();

	// Hooks
	const startChatMutation = useStartAIChat();
	const sendMessageMutation = useSendAIMessage();
	const { data: apiResponse, isLoading: messagesLoading } = useAIChatMessages(
		currentChatId || ""
	);

	// Extract messages from API response
	const messages = apiResponse || [];

	// Real-time socket connection
	useAIChatRealtime(currentChatId || "");

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Initialize chat when component mounts
	useEffect(() => {
		if (isAuthenticated && user && !currentChatId) {
			handleStartChat();
		} else if (!isAuthenticated) {
			toast({
				title: "Authentication Required",
				description: "Please log in to use the AI chat",
				variant: "destructive",
			});
		}
	}, [isAuthenticated, user]);

	const handleStartChat = async () => {
		if (!isAuthenticated || !user) {
			toast({
				title: "Authentication Required",
				description: "Please log in to start AI chat",
				variant: "destructive",
			});
			return;
		}

		try {
			const chatData = await startChatMutation.mutateAsync();
			setCurrentChatId(chatData.data._id);
		} catch (error: any) {
			console.error("Failed to start AI chat:", error);
			toast({
				title: "Error",
				description: error?.response?.data?.error || "Failed to start AI chat",
				variant: "destructive",
			});
		}
	};

	const handleSendMessage = async () => {
		if (
			!inputMessage.trim() ||
			!currentChatId ||
			sendMessageMutation.isPending
		) {
			return;
		}

		if (!isAuthenticated || !user) {
			toast({
				title: "Authentication Required",
				description: "Please log in to send messages",
				variant: "destructive",
			});
			return;
		}

		const messageText = inputMessage.trim();
		setInputMessage("");
		setIsAITyping(true);

		try {
			await sendMessageMutation.mutateAsync({
				chatId: currentChatId,
				message: messageText,
			});
		} catch (error: any) {
			console.error("Failed to send message:", error);
			toast({
				title: "Error",
				description: error?.response?.data?.error || "Failed to send message",
				variant: "destructive",
			});
			setIsAITyping(false);
			setInputMessage(messageText);
		} finally {
			setIsAITyping(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInputMessage(suggestion);
	};

	const handleNewChat = () => {
		setCurrentChatId(null);
		onNewChat();
		handleStartChat();
	};

	const isUserMessage = (sender: string) => {
		return sender !== "ai-assistant";
	};

	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h3 className="text-lg font-semibold text-gray-900">
						Login Required
					</h3>
					<p className="text-gray-600 mt-2">
						Please login to access the AI Property Assistant
					</p>
				</div>
			</div>
		);
	}

	const handlePropertyClick = (property: Property) => {
		router.push(`/properties/${property._id}`);
		// Handle property click event
	};

	return (
		<div className="flex h-full max-h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
			{/* Sidebar */}
			<div className="w-80 border-r bg-gray-50">
				{/* Header */}
				<div className="p-4 border-b">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-gray-900">AI Assistant</h2>
						<div className="flex space-x-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleNewChat}
								disabled={startChatMutation.isPending}>
								{startChatMutation.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Plus className="h-4 w-4" />
								)}
							</Button>
							<Button variant="ghost" size="sm" onClick={onChatHistory}>
								<History className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Chat Info */}
				<div className="p-4">
					<div className="flex items-center space-x-3">
						<Avatar className="h-10 w-10">
							<AvatarFallback className="bg-blue-100 text-blue-600">
								AI
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-medium text-gray-900">Property Assistant</h3>
							<p className="text-sm text-gray-500">
								{isAITyping ? "Typing..." : "Online"}
							</p>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="px-4 pb-4">
					<h4 className="text-sm font-medium text-gray-900 mb-2">
						Quick Actions
					</h4>
					<div className="space-y-2">
						<Button
							variant="ghost"
							className="w-full justify-start text-sm"
							onClick={() =>
								handleSuggestionClick("Show me 2BHK apartments under ₹50L")
							}>
							<Home className="h-4 w-4 mr-2" />
							Find Apartments
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start text-sm"
							onClick={() =>
								handleSuggestionClick("What are trending locations in Mumbai?")
							}>
							<MapPin className="h-4 w-4 mr-2" />
							Location Insights
						</Button>
						{/* <Button
							variant="ghost"
							className="w-full justify-start text-sm"
							onClick={() =>
								handleSuggestionClick("Calculate EMI for ₹80 lakh property")
							}>
							<DollarSign className="h-4 w-4 mr-2" />
							EMI Calculator
						</Button> */}
					</div>
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex-1 flex flex-col">
				{/* Chat Header */}
				<div className="p-4 border-b bg-white">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Avatar className="h-8 w-8">
								<AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
									AI
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="font-medium text-gray-900">AI Property Chat</h3>
								<p className="text-sm text-gray-500">
									Get personalized property recommendations
								</p>
							</div>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleNewChat}>
									<Plus className="h-4 w-4 mr-2" />
									New Chat
								</DropdownMenuItem>
								<DropdownMenuItem onClick={onChatHistory}>
									<History className="h-4 w-4 mr-2" />
									Chat History
								</DropdownMenuItem>
								{currentChatId && (
									<DropdownMenuItem
										onClick={() => onDeleteChat(currentChatId)}
										className="text-red-600">
										<Trash2 className="h-4 w-4 mr-2" />
										Delete Chat
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Messages Container */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="space-y-4">
						{messages
							.filter(
								(message: any): message is Message =>
									typeof message._id === "string" && !!message._id
							)
							.map((message) => (
								<div
									key={message._id}
									className={`flex ${
										isUserMessage(message.sender)
											? "justify-end"
											: "justify-start"
									}`}>
									<div
										className={`max-w-3xl ${
											isUserMessage(message.sender) ? "ml-8" : "mr-8"
										}`}>
										{!isUserMessage(message.sender) && (
											<div className="flex items-center space-x-2 mb-1">
												<Avatar className="h-6 w-6">
													<AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
														AI
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-medium text-gray-900">
													AI Assistant
												</span>
											</div>
										)}

										<div
											className={`rounded-lg p-3 ${
												isUserMessage(message.sender)
													? "bg-blue-600 text-white"
													: "bg-gray-100 text-gray-900"
											}`}>
											<p className="text-sm whitespace-pre-wrap">
												{message.content}
											</p>
											<p
												className={`text-xs mt-1 ${
													isUserMessage(message.sender)
														? "text-blue-200"
														: "text-gray-500"
												}`}>
												{new Date(message.createdAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>

										{/* Property Suggestions */}
										{!isUserMessage(message.sender) &&
											message.properties &&
											message.properties.length > 0 && (
												<div className="mt-2 space-y-2">
													{(message.properties as unknown as Property[]).map(
														(property) => (
															<Card
																key={property._id}
																onClick={() => handlePropertyClick(property)}
																className="overflow-hidden">
																<div className="flex p-3">
																	<div className="w-16 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0">
																		{property.images &&
																		property.images.length > 0 ? (
																			<img
																				src={
																					typeof property.images[0] === "string"
																						? property.images[0]
																						: property.images[0]?.url
																				}
																				alt={property.title}
																				className="w-full h-full object-cover rounded-lg"
																			/>
																		) : (
																			<Home className="w-full h-full p-2 text-gray-400" />
																		)}
																	</div>
																	<div className="flex-1 min-w-0">
																		<h4 className="text-sm font-medium text-gray-900 mb-0.5">
																			{property.title}
																		</h4>
																		<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
																			<span className="flex items-center">
																				<DollarSign className="h-3 w-3 mr-1" />
																				{property.price}
																			</span>
																			<span className="flex items-center">
																				<MapPin className="h-3 w-3 mr-1" />
																				{property?.address.area},{" "}
																				{property?.address.street},{" "}
																				{property?.address.city}
																			</span>
																			<span className="flex items-center">
																				<Building2 className="h-3 w-3 mr-1" />
																				{property.address.city}
																			</span>
																		</div>
																		<div className="flex space-x-1 mt-1">
																			<Badge
																				variant="secondary"
																				className="text-xs">
																				{property.type}
																			</Badge>
																		</div>
																	</div>
																</div>
															</Card>
														)
													)}
												</div>
											)}

										{/* Quick Suggestions */}
										{!isUserMessage(message.sender) &&
											message.suggestions &&
											message.suggestions.length > 0 && (
												<div className="mt-2 flex flex-wrap gap-1">
													{message.suggestions.map(
														(suggestion: string, index: number) => (
															<Button
																key={index}
																variant="outline"
																size="sm"
																onClick={() =>
																	handleSuggestionClick(suggestion)
																}
																className="text-xs h-7 px-2">
																{suggestion}
															</Button>
														)
													)}
												</div>
											)}
									</div>
								</div>
							))}

						{/* Typing Indicator */}
						{isAITyping && (
							<div className="flex justify-start">
								<div className="flex items-center space-x-2">
									<Avatar className="h-6 w-6">
										<AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
											AI
										</AvatarFallback>
									</Avatar>
									<div className="bg-gray-100 rounded-lg px-3 py-2">
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
										</div>
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Input */}
				<div className="border-t p-4 bg-white">
					<div className="flex items-end gap-2">
						<div className="flex-1 relative">
							<textarea
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Ask about properties, locations, prices..."
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
								rows={1}
								style={{
									minHeight: "44px",
									maxHeight: "120px",
								}}
							/>
						</div>
						<Button
							onClick={handleSendMessage}
							disabled={
								!inputMessage.trim() ||
								sendMessageMutation.isPending ||
								isAITyping
							}
							size="sm"
							className="h-11">
							{sendMessageMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Send className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
