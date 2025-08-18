"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/providers/AuthProvider";
import { AIChat, aiChatService } from "@/services/aiChatService";
import { Bot, Calendar, MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectChat: (chatId: string) => void;
}

export default function ChatHistoryModal({
	isOpen,
	onClose,
	onSelectChat,
}: ChatHistoryModalProps) {
	const { user } = useAuth();
	const [chats, setChats] = useState<AIChat[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && user) {
			setChats([]);
			setPage(1);
			setHasMore(true);
			fetchChatHistory(1, true);
		}
	}, [isOpen, user]);

	// Infinite scroll handler
	useEffect(() => {
		if (!isOpen || !hasMore || isLoading) return;
		const handleScroll = () => {
			const el = scrollRef.current;
			if (!el) return;
			if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
				// Near bottom, load more
				if (hasMore && !isLoading) {
					fetchChatHistory(page + 1);
				}
			}
		};
		const el = scrollRef.current;
		if (el) {
			el.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (el) {
				el.removeEventListener("scroll", handleScroll);
			}
		};
	}, [isOpen, hasMore, isLoading, page]);

	// If not logged in, show message and do not fetch
	if (!user) {
		return (
			<Card className="max-w-lg mx-auto mt-8">
				<CardHeader className="flex flex-row items-center justify-between">
					<span className="font-semibold text-lg">Chat History</span>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="w-5 h-5" />
					</Button>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						No chat history available. Please log in.
					</div>
				</CardContent>
			</Card>
		);
	}

	const fetchChatHistory = async (pageToFetch = 1, reset = false) => {
		if (!user) return;
		setIsLoading(true);
		setError(null);
		try {
			const response = await aiChatService.getUserAIChats(pageToFetch, 20);
			if (response.success) {
				const newChats = response.data.chats;
				setChats((prev) => (reset ? newChats : [...prev, ...newChats]));
				setPage(pageToFetch);
				setHasMore(pageToFetch < response.data.pagination.pages);
			}
		} catch (error) {
			console.error("Error fetching chat history:", error);
			setError("Failed to load chat history");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChatSelect = (chatId: string) => {
		onSelectChat(chatId);
		onClose();
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) {
			return "Today";
		} else if (diffDays === 2) {
			return "Yesterday";
		} else if (diffDays <= 7) {
			return `${diffDays - 1} days ago`;
		} else {
			return date.toLocaleDateString();
		}
	};

	const getConversationTypeColor = (type: string) => {
		switch (type) {
			case "property-search":
				return "bg-blue-100 text-blue-800";
			case "recommendation":
				return "bg-green-100 text-green-800";
			case "general-inquiry":
				return "bg-purple-100 text-purple-800";
			case "support":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getMessagePreview = (messages: any[]) => {
		if (!messages || messages.length === 0) return "No messages";
		const lastMessage = messages[messages.length - 1];
		return lastMessage?.content?.substring(0, 100) + "..." || "Chat started";
	};

	if (!isOpen) return null;

	if (!user) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
				<div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-lg font-semibold">Chat History</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="rounded-full">
							<X className="w-5 h-5" />
						</Button>
					</div>
					<p className="text-gray-600 mb-6">
						Please log in to view your chat history.
					</p>
					<Button onClick={onClose} className="w-full" variant="default">
						Close
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col border border-gray-200">
				<div className="flex items-center justify-between px-6 pt-6 pb-2">
					<div className="flex items-center gap-2">
						<MessageSquare className="w-5 h-5 text-blue-600" />
						<h2 className="text-lg font-semibold">Chat History</h2>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="rounded-full">
						<X className="w-5 h-5" />
					</Button>
				</div>
				<p className="text-gray-600 px-6 pb-2">
					View and resume your previous AI chat conversations.
				</p>
				<div className="flex-1 min-h-0 px-6 pb-4">
					{isLoading && chats.length === 0 ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-center">
								<Bot className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-2" />
								<p className="text-gray-600">Loading chat history...</p>
							</div>
						</div>
					) : error ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-center text-red-600">
								<p>{error}</p>
								<Button
									variant="outline"
									size="sm"
									onClick={() => fetchChatHistory()}
									className="mt-2">
									Retry
								</Button>
							</div>
						</div>
					) : chats.length === 0 ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-center text-gray-600">
								<MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
								<p className="font-medium">No chat history found</p>
								<p className="text-sm mt-1">
									Start a new conversation to build your chat history.
								</p>
							</div>
						</div>
					) : (
						<div
							ref={scrollRef}
							className="max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
							{chats.map((chat) => (
								<div
									key={chat._id}
									className="border rounded-lg p-4 bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors shadow-sm"
									onClick={() => handleChatSelect(chat._id)}>
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center gap-2">
											<Bot className="w-4 h-4 text-blue-600 flex-shrink-0" />
											<h3 className="font-medium text-sm truncate">
												{chat.title || "AI Chat"}
											</h3>
										</div>
										<div className="flex items-center gap-2 text-xs text-gray-500">
											<Calendar className="w-3 h-3" />
											{formatDate(chat.updatedAt)}
										</div>
									</div>

									<div className="flex items-center gap-2 mb-2 flex-wrap">
										{chat.metadata?.conversationType && (
											<Badge
												variant="secondary"
												className={`text-xs ${getConversationTypeColor(
													chat.metadata.conversationType
												)}`}>
												{chat.metadata.conversationType
													.replace("-", " ")
													.replace(/\b\w/g, (l) => l.toUpperCase())}
											</Badge>
										)}
										<Badge variant="outline" className="text-xs">
											{chat.messages?.length || 0} messages
										</Badge>
										{chat.isActive && (
											<Badge variant="default" className="text-xs">
												Active
											</Badge>
										)}
									</div>

									<p className="text-sm text-gray-600 line-clamp-2">
										{getMessagePreview(chat.messages)}
									</p>
								</div>
							))}
							{isLoading && chats.length > 0 && (
								<div className="flex justify-center py-2">
									<svg
										className="animate-spin h-5 w-5 text-blue-500"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
									</svg>
								</div>
							)}
						</div>
					)}

					<div className="flex justify-end pt-4 border-t mt-4">
						<Button
							variant="default"
							onClick={onClose}
							className="rounded-lg px-6">
							Close
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
