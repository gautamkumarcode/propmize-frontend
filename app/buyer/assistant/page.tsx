"use client";

import AIChatWindow from "@/components/custom/chat/AIChatWindow";
import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/providers/AuthProvider";
import { aiChatService } from "@/services/aiChatService";
import { Bot, Loader2, MessageSquare, Search, Users } from "lucide-react";
import { useState } from "react";

export default function AssistantPage() {
	const { user } = useAuth();
	const [chatMode, setChatMode] = useState<
		"property-search" | "general-inquiry" | "recommendation" | "support"
	>("property-search");
	const [showChat, setShowChat] = useState(false);
	const [isStartingChat, setIsStartingChat] = useState(false);
	const [startingFromCard, setStartingFromCard] = useState<string | null>(null); // Track which card is loading
	const [chatId, setChatId] = useState<string | null>(null);

	const chatModes = [
		{
			mode: "property-search" as const,
			title: "Property Search",
			description: "Find properties based on your preferences",
			icon: Search,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			mode: "recommendation" as const,
			title: "Recommendations",
			description: "Get personalized property suggestions",
			icon: Bot,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			mode: "general-inquiry" as const,
			title: "General Inquiry",
			description: "Ask questions about real estate",
			icon: MessageSquare,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
		},
		{
			mode: "support" as const,
			title: "Support",
			description: "Get help with platform features",
			icon: Users,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
		},
	];

	const handleStartChat = async (
		selectedMode: typeof chatMode,
		showModeSpecificContent = false,
		fromCard = false
	) => {
		if (fromCard) {
			setStartingFromCard(selectedMode);
		} else {
			setIsStartingChat(true);
		}

		setChatMode(selectedMode);
		try {
			const response = await aiChatService.startAIChat(selectedMode, {
				showModeSpecificContent, // Pass flag to backend
				...(user && {
					userPreferences: {
						// Add any user preferences if available
					},
				}),
			});

			if (response.success && response.data) {
				setChatId(response.data._id);
				setShowChat(true);
			}
		} catch (error) {
			console.error("Error starting chat:", error);
			// Show error message to user
		} finally {
			if (fromCard) {
				setStartingFromCard(null);
			} else {
				setIsStartingChat(false);
			}
		}
	};

	if (showChat) {
		return (
			<BuyerLayout>
				{/* Full height chat container accounting for navbar/bottom nav */}
				<div className="fixed inset-x-0 top-16 bottom-20 md:bottom-6 bg-white flex flex-col mx-auto max-w-7xl">
					{/* Header */}
					<div className="border-b px-3 py-3 md:px-4 md:py-4 bg-white flex-shrink-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2 min-w-0">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowChat(false)}
									className="text-gray-600 hover:text-gray-900 flex-shrink-0">
									← Back
								</Button>
								<h1 className="text-lg md:text-xl font-semibold truncate">
									AI Property Assistant
								</h1>
								{user && (
									<span className="text-xs md:text-sm text-gray-500 hidden sm:block">
										Welcome, {user.name}!
									</span>
								)}
								{!user && (
									<span className="text-xs md:text-sm text-blue-600 hidden md:block">
										Guest Mode - Sign up for personalized experience
									</span>
								)}
							</div>
						</div>
						{/* Mobile user status */}
						{!user && (
							<div className="mt-2 md:hidden">
								<span className="text-xs text-blue-600">
									Guest Mode - Sign up for personalized experience
								</span>
							</div>
						)}
					</div>

					{/* Chat Window - Takes remaining height */}
					<div className="flex-1 min-h-0">
						<AIChatWindow
							initialChatId={chatId || undefined}
							conversationType={chatMode}
							onPropertyClick={(propertyId) => {
								console.log("Property clicked:", propertyId);
								// Navigate to property details
							}}
							onActionClick={(action) => {
								console.log("Action clicked:", action);
								// Handle various actions like save, contact, etc.
							}}
						/>
					</div>
				</div>
			</BuyerLayout>
		);
	}

	return (
		<BuyerLayout>
			<div className="min-h-screen bg-gray-50 pb-4">
				<div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-6xl">
					{/* Header */}
					<div className="text-center mb-6 md:mb-8 lg:mb-10">
						<div className="flex justify-center mb-3 md:mb-4">
							<div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
								<Bot className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
							</div>
						</div>
						<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
							AI Property Assistant
						</h1>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
							Get instant help finding your perfect property with our AI-powered
							assistant. Search properties, get recommendations, and receive
							expert advice.
						</p>
					</div>

					{/* User Status */}
					<div className="max-w-md mx-auto mb-6 md:mb-8 lg:mb-10 px-4">
						{user ? (
							<div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 lg:p-5 text-center">
								<p className="text-green-800">
									<span className="font-medium text-sm sm:text-base md:text-lg">
										Welcome back, {user.name}!
									</span>
									<br />
									<span className="text-xs sm:text-sm md:text-base">
										Your preferences and chat history are saved automatically.
									</span>
								</p>
							</div>
						) : (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 lg:p-5 text-center">
								<p className="text-blue-800">
									<span className="font-medium text-sm sm:text-base md:text-lg">
										Welcome! You can use our AI assistant as a guest.
									</span>
									<br />
									<span className="text-xs sm:text-sm md:text-base">
										Sign up later for personalized recommendations and saved
										chats.
									</span>
								</p>
							</div>
						)}
					</div>

					{/* Chat Mode Selection */}
					<div className="max-w-4xl mx-auto px-2 md:px-0">
						<h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 md:mb-6 lg:mb-8 text-center">
							Choose your chat mode:
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-10">
							{chatModes.map((mode) => {
								const isCardLoading = startingFromCard === mode.mode;
								const isDisabled = isStartingChat || startingFromCard !== null;

								return (
									<Card
										key={mode.mode}
										className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
											isDisabled && !isCardLoading
												? "border-gray-300 opacity-50 cursor-not-allowed"
												: isCardLoading
												? "border-blue-500 bg-blue-50"
												: chatMode === mode.mode
												? "border-blue-500 bg-blue-50 hover:border-blue-600"
												: "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
										}`}
										onClick={() => {
											if (!isDisabled) {
												setChatMode(mode.mode);
												handleStartChat(mode.mode, true, true); // Show mode-specific content, from card
											}
										}}>
										<CardHeader className="p-3 sm:p-4 md:p-5 lg:p-6">
											<div className="flex items-center space-x-3 md:space-x-4">
												<div
													className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg ${mode.bgColor} flex items-center justify-center flex-shrink-0`}>
													{isCardLoading ? (
														<Loader2 className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 animate-spin text-gray-400" />
													) : (
														<mode.icon
															className={`w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${mode.color}`}
														/>
													)}
												</div>
												<div className="min-w-0">
													<CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
														{mode.title}
													</CardTitle>
													<CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
														{mode.description}
													</CardDescription>
												</div>
											</div>
										</CardHeader>
									</Card>
								);
							})}
						</div>

						{/* Start Chat Button */}
						<div className="text-center">
							<Button
								onClick={() => handleStartChat(chatMode, false, false)} // Show default content, from button
								disabled={isStartingChat || startingFromCard !== null}
								size="lg"
								className="bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 lg:py-3.5 text-sm sm:text-base md:text-lg lg:text-xl font-medium min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
								{isStartingChat ? (
									<>
										<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 animate-spin mr-2" />
										Starting Chat...
									</>
								) : (
									<>
										<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2" />
										Start Chat
									</>
								)}
							</Button>
						</div>

						{/* Instructions */}
						<div className="text-center px-4 mt-4">
							<p className="text-gray-600 text-sm md:text-base">
								{isStartingChat || startingFromCard !== null
									? "Starting your AI assistant..."
									: "Click on any card above to start chatting immediately, or use the 'Start Chat' button"}
							</p>
						</div>
					</div>

					{/* Features */}
					<div className="max-w-4xl mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-16 px-2 md:px-0">
						<h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 md:mb-6 lg:mb-8 text-center">
							What our AI assistant can help you with:
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
							<div className="text-center p-3 sm:p-4 md:p-5 lg:p-6">
								<div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
									<Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue-600" />
								</div>
								<h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg lg:text-xl">
									Smart Property Search
								</h4>
								<p className="text-xs sm:text-sm md:text-base text-gray-600">
									Find properties matching your exact needs using natural
									language queries.
								</p>
							</div>
							<div className="text-center p-3 sm:p-4 md:p-5 lg:p-6">
								<div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
									<Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-green-600" />
								</div>
								<h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg lg:text-xl">
									Personalized Recommendations
								</h4>
								<p className="text-xs sm:text-sm md:text-base text-gray-600">
									Get property suggestions tailored to your budget, preferences,
									and location.
								</p>
							</div>
							<div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 sm:col-span-2 lg:col-span-1">
								<div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
									<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-600" />
								</div>
								<h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg lg:text-xl">
									Market Insights
								</h4>
								<p className="text-xs sm:text-sm md:text-base text-gray-600">
									Access real-time market data, price trends, and investment
									advice.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BuyerLayout>
	);
}
