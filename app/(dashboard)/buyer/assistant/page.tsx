"use client";

import AIChatWindow from "@/components/custom/chat/AIChatWindow";
import { aiChatService } from "@/services/aiChatService";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ChatSidebar } from "@/components/custom/chat/ChatSidebar";
import { useAppStore } from "@/store/app-store";
import logo from "../../../../public/logo.png";

export default function AssistantPage() {
	const router = useRouter();
	const { user } = useAppStore();
	const [chatMode, setChatMode] = useState<
		"property-search" | "general-inquiry" | "recommendation"
	>("property-search");
	const [showModeSelector, setShowModeSelector] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [chatId, setChatId] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);
	const [previousUser, setPreviousUser] = useState(user?.id || null);
	const [initializationAttempted, setInitializationAttempted] = useState(false);

	// Function to clear all chat data
	const clearChatData = useCallback(() => {
		localStorage.removeItem("ai_current_chat");
		setChatId(null);
	}, []);

	// Function to create a new chat
	const createNewChat = useCallback(async () => {
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
				return response.data._id;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error creating new chat:", error);
			return null;
		}
	}, [chatMode, user]);

	// Function to validate if chat exists
	const validateChatExists = useCallback(async (chatId: string) => {
		try {
			const response = await aiChatService.getAIChat(chatId);
			return response.success && response.data;
		} catch (error) {
			console.error("Error validating chat:", error);
			return false;
		}
	}, []);

	// Function to load user's latest chat
	const loadUserLatestChat = useCallback(async () => {
		if (!user) {
			return null;
		}

		try {
			const history = await aiChatService.getUserAIChats(1, 1, "active");
			if (history.success && history.data.chats.length > 0) {
				const latestChatId = history.data.chats[0]._id;
				return latestChatId;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error fetching user chat history:", error);
			return null;
		}
	}, [user]);

	// Initialize chat when component mounts - SIMPLIFIED VERSION
	const initializeChat = useCallback(async () => {
		if (initializationAttempted) {
			return;
		}

		setInitializationAttempted(true);

		try {
			// Case 1: No user (guest mode)
			if (!user) {
				clearChatData();
				setIsInitializing(false);
				return;
			}

			// Case 2: User changed (login/logout)
			if (previousUser !== user.id) {
				clearChatData();
				setPreviousUser(user._id);
			}

			// Case 3: Check localStorage for existing chat
			const storedChatId = localStorage.getItem("ai_current_chat");
			if (storedChatId) {
				const isValidChat = await validateChatExists(storedChatId);
				if (isValidChat) {
					setChatId(storedChatId);
					setIsInitializing(false);
					return;
				} else {
					console.log("❌ Stored chat is invalid, clearing...");
					clearChatData();
				}
			}

			// Case 4: Try to load user's latest chat from history
			const latestChatId = await loadUserLatestChat();
			if (latestChatId) {
				setChatId(latestChatId);
				localStorage.setItem("ai_current_chat", latestChatId);
				setIsInitializing(false);
				return;
			}

			// Case 5: Create new chat for user
			await createNewChat();
		} catch (error) {
			console.error("❌ Error during chat initialization:", error);
			// Even if there's an error, we should stop initializing to prevent infinite loop
			clearChatData();
		} finally {
			setIsInitializing(false);
		}
	}, [
		user,
		previousUser,
		initializationAttempted,
		clearChatData,
		validateChatExists,
		loadUserLatestChat,
		createNewChat,
	]);

	// Initialize on mount and when user changes
	useEffect(() => {
		if (isInitializing) {
			initializeChat();
		}
	}, [isInitializing, initializeChat]);

	// Reset initialization when user changes
	useEffect(() => {
		if (user?.id !== previousUser) {
			setIsInitializing(true);
			setInitializationAttempted(false);
		}
	}, [user, previousUser]);

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
		if (!user) {
			return;
		}

		setIsInitializing(true);
		setChatMode(newMode);
		clearChatData();

		try {
			const response = await aiChatService.startAIChat(newMode, {
				showModeSpecificContent: false,
				userPreferences: {},
			});

			if (response.success && response.data) {
				setChatId(response.data._id);
				localStorage.setItem("ai_current_chat", response.data._id);
			}
		} catch (error) {
			console.error("Error changing chat mode:", error);
		} finally {
			setIsInitializing(false);
		}
	};

	const handleNewChat = async () => {
		if (!user) {
			return;
		}

		setIsInitializing(true);
		clearChatData();

		try {
			const response = await aiChatService.startAIChat(chatMode, {
				showModeSpecificContent: false,
				userPreferences: {},
			});
			if (response.success && response.data) {
				setChatId(response.data._id);
				localStorage.setItem("ai_current_chat", response.data._id);
			}
		} catch (error) {
			console.error("Error creating new chat:", error);
		} finally {
			setIsInitializing(false);
		}
	};

	const handleSelectChat = async (selectedChatId: string) => {
		if (!user) {
			return;
		}

		if (selectedChatId === chatId) {
			return;
		}

		const isValidChat = await validateChatExists(selectedChatId);
		if (isValidChat) {
			setChatId(selectedChatId);
			localStorage.setItem("ai_current_chat", selectedChatId);
		} else {
			await handleNewChat();
		}
	};

	const handlePropertyClick = (propertyId: string) => {
		console.log("Property clicked:", propertyId);
		router.push(`/property/${propertyId}`);
	};

	// Add a fallback in case initialization gets stuck
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (isInitializing) {
				setIsInitializing(false);
				clearChatData();
			}
		}, 2000); // 5 second timeout

		return () => clearTimeout(timeout);
	}, [isInitializing, clearChatData]);

	if (isInitializing) {
		return (
			<div className="bg-white flex items-center justify-center mx-auto max-w-7xl h-screen">
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Image src={logo} alt="Propmize Logo" width={40} height={40} />
					</div>
					<p className="text-gray-600">Initializing Propmize...</p>
					<p className="text-sm text-gray-400 mt-2">
						This should only take a moment
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="inset-x-0 bg-white flex flex-col mx-auto max-w-7xl h-[85vh] lg:h-[90vh] overflow-scroll relative">
			{/* Header */}
			<div className="border-b bg-gray-200 flex-shrink-0 flex justify-end absolute z-30 left-0 rounded-br-2xl">
				{user && (
					<ChevronRight
						className="w-8 h-8 text-xl text-gray-900 cursor-pointer"
						onClick={() => setShowSidebar(true)}
					/>
				)}

				{showModeSelector && user && (
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

			{/* Chat Window */}
			<div className="flex-1 min-h-0 mb-6">
				<AIChatWindow
					key={chatId || "new-chat"}
					initialChatId={user ? chatId || undefined : undefined}
					onNewChat={handleNewChat}
					onPropertyClick={handlePropertyClick}
					onActionClick={(action) => {
						console.log("Action clicked:", action);
					}}
				/>
			</div>

			{user && (
				<ChatSidebar
					showSidebar={showSidebar}
					setShowSidebar={setShowSidebar}
					handleNewChat={handleNewChat}
					handleSelectChat={handleSelectChat}
				/>
			)}
		</div>
	);
}