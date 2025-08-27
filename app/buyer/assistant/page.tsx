"use client";

import AIChatWindow from "@/components/custom/chat/AIChatWindow";
import ChatHistoryModal from "@/components/custom/chat/ChatHistoryModal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/providers/AuthProvider";
import { aiChatService } from "@/services/aiChatService";
import {
	Bot,
	History,
	Info,
	MoreVertical,
	Plus,
	Settings,
	X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function AssistantPage() {
	const { user } = useAuth();
	const [chatMode, setChatMode] = useState<
		"property-search" | "general-inquiry" | "recommendation"
	>("property-search");
	const [showModeSelector, setShowModeSelector] = useState(false);
	const [chatId, setChatId] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);
	const [showChatHistory, setShowChatHistory] = useState(false);

	// Initialize chat when component mounts
	const initializeChat = useCallback(async () => {
		const storedChatId = localStorage.getItem("ai_current_chat");
		if (storedChatId) {
			setChatId(storedChatId);
			setIsInitializing(false);
			return;
		}
		// If chatId exists (from localStorage), do not create a new chat
		if (chatId) {
			setIsInitializing(false);
			return;
		}
		try {
			const response = await aiChatService.startAIChat(chatMode, {
				showModeSpecificContent: false,
				...(user && {
					userPreferences: {
						// Add any user preferences if available
					},
				}),
			});
			if (response.success && response.data) {
				setChatId(response.data._id);
				localStorage.setItem("ai_current_chat", response.data._id);
			}
		} catch (error) {
			console.error("Error initializing chat:", error);
		} finally {
			setIsInitializing(false);
		}
	}, [chatMode, user, chatId]);

	useEffect(() => {
		initializeChat();
	}, [initializeChat]);

	const chatModes = [
		{
			mode: "property-search" as const,
			title: "Property Search",
			description: "Find properties based on your preferences",
		},
		{
			mode: "recommendation" as const,
			title: "Recommendations",
			description: "Get personalized property suggestions",
		},
		{
			mode: "general-inquiry" as const,
			title: "General Inquiry",
			description: "Ask questions about real estate",
		},
	];

	const handleModeChange = async (newMode: typeof chatMode) => {
		setIsInitializing(true);
		setChatMode(newMode);

		try {
			const response = await aiChatService.startAIChat(newMode, {
				showModeSpecificContent: false,
				...(user && {
					userPreferences: {},
				}),
			});

			if (response.success && response.data) {
				setChatId(response.data._id);
			}
		} catch (error) {
			console.error("Error changing chat mode:", error);
		} finally {
			setIsInitializing(false);
		}
	};

	const handleNewChat = async () => {
		try {
			const response = await aiChatService.startAIChat(chatMode, {
				showModeSpecificContent: false,
				...(user && {
					userPreferences: {},
				}),
			});
			if (response.success && response.data) {
				setChatId(response.data._id);
				localStorage.setItem("ai_current_chat", response.data._id);
			}
		} catch (error) {
			console.error("Error creating new chat:", error);
		}
	};

	const handleViewChatHistory = () => {
		if (!user) {
			// Show a message that user needs to be logged in
			console.log("User must be logged in to view chat history");
			return;
		}
		setShowChatHistory(true);
	};

	const handleSelectChat = async (selectedChatId: string) => {
		setIsInitializing(true);
		setChatId(selectedChatId);
		localStorage.setItem("ai_current_chat", selectedChatId);
		setIsInitializing(false);
	};

	const handleClearChat = async () => {
		// Create a new chat to effectively clear the current one
		await handleNewChat();
	};

	if (isInitializing) {
		return (
			<div className="fixed inset-x-0 top-16 bottom-20 md:bottom-6 bg-white flex items-center justify-center mx-auto max-w-7xl">
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Bot className="w-8 h-8 text-blue-600 animate-pulse" />
					</div>
					<p className="text-gray-600">Initializing AI Assistant...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-x-0 top-16 bottom-20 md:bottom-6 bg-white flex flex-col mx-auto max-w-7xl">
			{/* Header */}
			<div className="border-b px-4 py-3 md:px-6 md:py-4 bg-gray-50 flex-shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3 min-w-0">
						<div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
							<Bot className="w-5 h-5 text-blue-600" />
						</div>
						<h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
							Propmize Assistant
						</h1>
						{user && (
							<span className="text-sm text-gray-500 hidden sm:block">
								Welcome, {user.name}!
							</span>
						)}
						{!user && (
							<span className="text-sm text-blue-600/80 hidden md:block">
								Guest Mode
							</span>
						)}
					</div>

					{/* New Chat and Mode selector buttons */}

					<div className="flex gap-2 justify-center items-center">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNewChat}
							className="text-gray-600 hover:text-blue-600 rounded-full"
							aria-label="New Chat">
							<Plus className="w-5 h-5" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onClick={handleViewChatHistory}
							className="text-gray-600 hover:text-blue-600 rounded-full"
							aria-label="Chat History">
							<History className="w-5 h-5" />
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-600 hover:text-blue-600 rounded-full flex-shrink-0"
									aria-label="Chat Options">
									<MoreVertical className="w-6 h-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem
									onClick={handleNewChat}
									className="cursor-pointer">
									<Plus className="w-4 h-4 mr-2" />
									New Chat
								</DropdownMenuItem>
								{user && (
									<DropdownMenuItem
										onClick={() => setShowChatHistory(true)}
										className="cursor-pointer">
										<History className="w-4 h-4 mr-2" />
										Chat History
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleClearChat}
									className="cursor-pointer">
									<X className="w-4 h-4 mr-2" />
									Clear Chat
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer">
									<Info className="w-4 h-4 mr-2" />
									Help & Support
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setShowModeSelector(!showModeSelector)}
									className="cursor-pointer">
									<Settings className="w-4 h-4 mr-2" />
									Settings
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
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

				{/* Mode selector dropdown */}
				{showModeSelector && (
					<div className="mt-4 p-4 bg-gray-100 rounded-xl border border-gray-200">
						<p className="text-sm font-medium text-gray-700 mb-3">
							Select Chat Mode:
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{chatModes.map((mode) => (
								<button
									key={mode.mode}
									onClick={() => {
										handleModeChange(mode.mode);
										setShowModeSelector(false);
									}}
									className={`p-3 text-left text-sm rounded-lg border transition-all duration-200
										${chatMode === mode.mode
											? "bg-blue-50 border-blue-400 text-blue-800 shadow-sm"
											: "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
										}`}>
									<div className="font-semibold text-gray-800 mb-1">
										{mode.title}
									</div>
									<div className="text-xs text-gray-600">
										{mode.description}
									</div>
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Chat Window - Takes remaining height */}
			<div className="flex-1 min-h-0">
				<AIChatWindow
					key={chatId} // Force re-render when chatId changes
					initialChatId={chatId || undefined}
					onNewChat={handleNewChat}
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

			{/* Chat History Modal */}
			<ChatHistoryModal
				isOpen={showChatHistory}
				onClose={() => setShowChatHistory(false)}
				onSelectChat={handleSelectChat}
			/>
		</div>
	);
}
