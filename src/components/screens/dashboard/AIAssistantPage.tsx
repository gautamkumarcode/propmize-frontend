"use client";

import AIChatWindow from "@/components/custom/chat/AIChatWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIChats } from "@/hooks/useAIChat";
import { Bot, Calendar, Home, MessageCircle } from "lucide-react";
import { useState } from "react";

interface AIAssistantPageProps {
	onPropertyClick?: (propertyId: string) => void;
	onNavigate?: (path: string) => void;
}

export default function AIAssistantPage({
	onPropertyClick,
	onNavigate,
}: AIAssistantPageProps) {
	const [showChat, setShowChat] = useState(false);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [conversationType, setConversationType] = useState<
		"property-search" | "general-inquiry" | "recommendation" | "support"
	>("property-search");

	const { data: chatsData, isLoading } = useAIChats(1, 10, "active");
	const recentChats = chatsData?.data?.chats || [];

	const handleStartNewChat = (type: typeof conversationType) => {
		setConversationType(type);
		setSelectedChatId(null);
		setShowChat(true);
	};

	const handleOpenExistingChat = (chatId: string) => {
		setSelectedChatId(chatId);
		setShowChat(true);
	};

	const handleActionClick = (action: any) => {
		console.log("Action clicked:", action);

		switch (action.type) {
			case "schedule-viewing":
				// Navigate to scheduling page or open modal
				onNavigate?.("/schedule-viewing");
				break;
			case "request-info":
				// Open property info request modal
				break;
			case "save-property":
				// Add to saved properties
				break;
			case "contact-agent":
				// Open contact form or initiate call
				break;
			default:
				break;
		}
	};

	return (
		<div className="container mx-auto p-4 ">
			{/* Header */}
			{showChat && (
				<div className="container mx-auto p-4 max-w-4xl">
					<div className="mb-4">
						<Button
							variant="outline"
							onClick={() => setShowChat(false)}
							className="mb-4">
							← Back to AI Assistant
						</Button>
					</div>

					<Card>
						<AIChatWindow
							initialChatId={selectedChatId || undefined}
							conversationType={conversationType}
							onPropertyClick={onPropertyClick}
							onActionClick={handleActionClick}
						/>
					</Card>
				</div>
			)}
			{!showChat && (
				<>
					{" "}
					<div className="text-center mb-8">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Bot className="w-8 h-8 text-blue-500" />
							<h1 className="text-3xl font-bold">AI Property Assistant</h1>
						</div>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Get personalized property recommendations, market insights, and
							instant answers to all your real estate questions with our
							AI-powered assistant.
						</p>
					</div>
					{/* Quick Start Options */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<Card
							className="cursor-pointer hover:shadow-lg transition-shadow"
							onClick={() => handleStartNewChat("property-search")}>
							<CardContent className="p-6 text-center">
								<Home className="w-8 h-8 text-blue-500 mx-auto mb-3" />
								<h3 className="font-semibold mb-2">Property Search</h3>
								<p className="text-sm text-gray-600">
									Find properties based on your specific requirements
								</p>
							</CardContent>
						</Card>

						<Card
							className="cursor-pointer hover:shadow-lg transition-shadow"
							onClick={() => handleStartNewChat("recommendation")}>
							<CardContent className="p-6 text-center">
								<Bot className="w-8 h-8 text-green-500 mx-auto mb-3" />
								<h3 className="font-semibold mb-2">Get Recommendations</h3>
								<p className="text-sm text-gray-600">
									Receive personalized property suggestions
								</p>
							</CardContent>
						</Card>

						<Card
							className="cursor-pointer hover:shadow-lg transition-shadow"
							onClick={() => handleStartNewChat("general-inquiry")}>
							<CardContent className="p-6 text-center">
								<MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
								<h3 className="font-semibold mb-2">General Inquiry</h3>
								<p className="text-sm text-gray-600">
									Ask about market trends, areas, and more
								</p>
							</CardContent>
						</Card>

						<Card
							className="cursor-pointer hover:shadow-lg transition-shadow"
							onClick={() => handleStartNewChat("support")}>
							<CardContent className="p-6 text-center">
								<Calendar className="w-8 h-8 text-orange-500 mx-auto mb-3" />
								<h3 className="font-semibold mb-2">Support</h3>
								<p className="text-sm text-gray-600">
									Get help with using the platform
								</p>
							</CardContent>
						</Card>
					</div>
					{/* Recent Chats */}
					{recentChats.length > 0 && (
						<Card className="mb-8">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MessageCircle className="w-5 h-5" />
									Recent Conversations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{recentChats.map((chat) => (
										<div
											key={chat._id}
											className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
											onClick={() => handleOpenExistingChat(chat._id)}>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<h4 className="font-medium">{chat.title}</h4>
													<Badge
														variant="secondary"
														className="text-xs capitalize">
														{chat.context.conversationType.replace("-", " ")}
													</Badge>
													{chat.status === "active" && (
														<Badge variant="default" className="text-xs">
															Active
														</Badge>
													)}
												</div>
												<div className="text-sm text-gray-600">
													{chat.analytics.messageCount} messages • Last updated{" "}
													{(() => {
														const date = new Date(chat.updatedAt);
														const day = date
															.getDate()
															.toString()
															.padStart(2, "0");
														const month = (date.getMonth() + 1)
															.toString()
															.padStart(2, "0");
														const year = date.getFullYear();
														return `${day}/${month}/${year}`;
													})()}
												</div>
												{chat.relatedProperties.length > 0 && (
													<div className="text-xs text-blue-600 mt-1">
														{chat.relatedProperties.length} properties discussed
													</div>
												)}
											</div>
											<div className="text-sm text-gray-500">
												{chat.aiSessionData.userSatisfactionScore && (
													<div className="flex items-center gap-1">
														⭐ {chat.aiSessionData.userSatisfactionScore}/5
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
					{/* Features Section */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold mb-3 flex items-center gap-2">
									<Bot className="w-5 h-5 text-blue-500" />
									Smart Property Matching
								</h3>
								<p className="text-sm text-gray-600">
									Our AI analyzes your preferences and budget to suggest the
									most suitable properties from our database.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold mb-3 flex items-center gap-2">
									<MessageCircle className="w-5 h-5 text-green-500" />
									Natural Language Chat
								</h3>
								<p className="text-sm text-gray-600">
									Ask questions in plain English and get intelligent responses
									with property suggestions and actionable insights.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold mb-3 flex items-center gap-2">
									<Home className="w-5 h-5 text-purple-500" />
									Market Insights
								</h3>
								<p className="text-sm text-gray-600">
									Get real-time market data, price trends, and area information
									to make informed property decisions.
								</p>
							</CardContent>
						</Card>
					</div>
					{/* Sample Questions */}
					<Card>
						<CardHeader>
							<CardTitle>Try asking questions like:</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{[
									"Show me 3BHK apartments in Mumbai under ₹1 crore",
									"What are the best areas for investment in Bangalore?",
									"Compare properties in Gurgaon vs Noida",
									"I need a property near good schools and hospitals",
									"What's the average price per sqft in Pune?",
									"Show me properties with parking and gym facilities",
								].map((question, idx) => (
									<Button
										key={idx}
										variant="outline"
										className="text-left h-auto p-3 justify-start"
										onClick={() => {
											setConversationType("property-search");
											setSelectedChatId(null);
											setShowChat(true);
											// You could pre-populate the message here
										}}>
										<MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
										<span className="text-sm">{question}</span>
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
