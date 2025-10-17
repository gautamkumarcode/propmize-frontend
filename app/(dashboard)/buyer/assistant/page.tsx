"use client";

import AIChatWindow from "@/components/custom/chat/AIChatWindow";
import { useAuth } from "@/lib/providers/AuthProvider";
import { aiChatService } from "@/services/aiChatService";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ChatSidebar } from "@/components/custom/chat/ChatSidebar";
import logo from "../../../../public/logo.png";

export default function AssistantPage() {
	const router = useRouter();
	const { user } = useAuth();
	const [chatMode, setChatMode] = useState<
		"property-search" | "general-inquiry" | "recommendation"
	>("property-search");
	const [showModeSelector, setShowModeSelector] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [chatId, setChatId] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	// Initialize chat when component mounts
	const initializeChat = useCallback(async () => {
		console.log("initializeChat called, isInitializing:", isInitializing);
		if (!isInitializing) return; // Prevent multiple initializations

		// Check localStorage first
		const storedChatId = localStorage.getItem("ai_current_chat");
		if (storedChatId) {
			console.log("Found stored chat ID:", storedChatId);
			setChatId(storedChatId);
			setIsInitializing(false);
			return;
		}

		if (user) {
			// Logged-in user: check for existing chat history
			try {
				const history = await aiChatService.getUserAIChats(1, 1, "active");
				if (history.success && history.data.chats.length > 0) {
					const latestChatId = history.data.chats[0]._id;
					console.log("Found latest chat:", latestChatId);
					setChatId(latestChatId);
					localStorage.setItem("ai_current_chat", latestChatId);
					setIsInitializing(false);
					return;
				}
			} catch (error) {
				console.error("Error fetching chat history:", error);
			}
		}

		// No existing chat found, create new one
		try {
			console.log("Creating new chat");
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
			console.error("Error initializing chat:", error);
		} finally {
			setIsInitializing(false);
		}
	}, [chatMode, user, isInitializing]);

	useEffect(() => {
		if (isInitializing && !chatId) {
			initializeChat();
		}
	}, [initializeChat, isInitializing, chatId]);

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

	const handleSelectChat = async (selectedChatId: string) => {
		console.log("handleSelectChat: Selecting chat:", selectedChatId);
		if (selectedChatId === chatId) {
			console.log("handleSelectChat: Same chat selected, ignoring");
			return;
		}

		setChatId(selectedChatId);
		localStorage.setItem("ai_current_chat", selectedChatId);
	};

	const handlePropertyClick = (propertyId: string) => {
		console.log("Property clicked:", propertyId);
		// Navigate to property details
		router.push(`/property/${propertyId}`);
	};

	if (isInitializing) {
		return (
			<div className=" bg-white flex items-center justify-center mx-auto max-w-7xl h-screen ">
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Image src={logo} alt="Propmize Logo" width={40} height={40} />
					</div>
					<p className="text-gray-600">Initializing Propmize...</p>
				</div>
			</div>
		);
	}

	return (
		<div className=" inset-x-0  bg-white flex flex-col mx-auto max-w-7xl h-[85vh] lg:h-[90vh] overflow-scroll relative">
			{/* Header */}
			<div className="border-b  bg-gray-200 flex-shrink-0 flex justify-end absolute z-30 left-0 rounded-br-2xl">
				{/* Sidebar open button */}

				{/* You can use any icon, here is Settings for example */}
				<ChevronRight
					className="w-8 h-8 text-xl text-gray-900"
					onClick={() => setShowSidebar(true)}
				/>
				{/* <div className="flex items-center justify-between">
					<div className="flex items-center space-x-3 min-w-0">
						<div className="lg:w-9 lg:h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 w-7 h-7">
							<Bot className="lg:w-5 lg:h-5 w-4 h-4 text-blue-600" />
						</div>
						<h1 className="lg:text-xl md:text-lg font-bold text-gray-800 truncate text-md">
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
				{/* 
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
				</div> */}
				{/* </div> */}

				{/* Mobile user status */}
				{/* {!user && (
					<div className="mt-2 md:hidden">
						<span className="text-xs text-blue-600">
							Guest Mode - Sign up for personalized experience
						</span>
					</div>
				)} */}

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
										${
											chatMode === mode.mode
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
			<div className="flex-1 min-h-0 mb-6">
				<AIChatWindow
					key={chatId || "new-chat"} // Force re-render when chatId changes
					initialChatId={chatId || undefined}
					onNewChat={handleNewChat}
					onPropertyClick={handlePropertyClick}
					onActionClick={(action) => {
						console.log("Action clicked:", action);
						// Handle various actions like save, contact, etc.
					}}
				/>
			</div>

			<ChatSidebar
				showSidebar={showSidebar}
				setShowSidebar={setShowSidebar}
				handleNewChat={handleNewChat}
				handleSelectChat={handleSelectChat}
			/>

			{/* Chat History Modal */}
			{/* <ChatHistoryModal
				isOpen={false}
				onClose={() => setShowChatHistory(false)}
				onSelectChat={handleSelectChat}
			/> */}
		</div>
	);
}
