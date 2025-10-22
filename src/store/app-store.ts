"use client";

import { AppState, ChatSession, NotificationTpes, User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStore extends AppState {
	// Auth actions
	setUser: (user: User | null) => void;
	setUserMode: (mode: "buyer" | "seller") => void;
	setAuthenticated: (isAuthenticated: boolean) => void;

	// Notification actions
	addNotification: (notification: NotificationTpes) => void;
	markNotificationAsRead: (notificationId: string) => void;
	clearNotifications: () => void;

	// Chat actions
	addChatSession: (session: ChatSession) => void;
	setCurrentChatId: (chatId: string | null) => void;
	updateChatSession: (sessionId: string, session: Partial<ChatSession>) => void;
	deleteChatSession: (sessionId: string) => void;
	clearChatHistory: () => void;

	// Property actions
	addSavedProperty: (propertyId: string) => void;
	removeSavedProperty: (propertyId: string) => void;
	addRecentlyViewed: (propertyId: string) => void;
	clearRecentlyViewed: () => void;
}

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			userMode:
				typeof window !== "undefined"
					? (localStorage.getItem("userMode") as "buyer" | "seller") || "buyer"
					: "buyer",
			isAuthenticated: false,
			notifications: [],
			chatSessions: [],
			currentChatId: null,
			savedProperties: [],
			recentlyViewed: [],

			// Auth actions
			setUser: (user) => set({ user }),
			setUserMode: (mode) => {
				set({ userMode: mode });
				if (typeof window !== "undefined") {
					localStorage.setItem("userMode", mode);
				}
			},
			setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

			// Notification actions
			addNotification: (notification: NotificationTpes) =>
				set((state) => ({
					notifications: [notification, ...state.notifications],
				})),
			markNotificationAsRead: (notificationId) =>
				set((state) => ({
					notifications: state.notifications.map((notif) =>
						notif._id === notificationId ? { ...notif, isRead: true } : notif
					),
				})),
			clearNotifications: () => set({ notifications: [] }),

			// Chat actions
			addChatSession: (session) =>
				set((state) => ({
					chatSessions: [session, ...state.chatSessions],
					currentChatId: session.id,
				})),
			setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
			updateChatSession: (sessionId, updates) =>
				set((state) => ({
					chatSessions: state.chatSessions.map((session) =>
						session.id === sessionId ? { ...session, ...updates } : session
					),
				})),
			deleteChatSession: (sessionId) =>
				set((state) => ({
					chatSessions: state.chatSessions.filter((s) => s.id !== sessionId),
					currentChatId:
						state.currentChatId === sessionId ? null : state.currentChatId,
				})),
			clearChatHistory: () => set({ chatSessions: [], currentChatId: null }),

			// Property actions
			addSavedProperty: (propertyId) =>
				set((state) => ({
					savedProperties: state.savedProperties.includes(propertyId)
						? state.savedProperties
						: [...state.savedProperties, propertyId],
				})),
			removeSavedProperty: (propertyId) =>
				set((state) => ({
					savedProperties: state.savedProperties.filter(
						(id) => id !== propertyId
					),
				})),
			addRecentlyViewed: (propertyId) =>
				set((state) => ({
					recentlyViewed: [
						propertyId,
						...state.recentlyViewed.filter((id) => id !== propertyId),
					].slice(0, 10), // Keep only last 10 items
				})),
			clearRecentlyViewed: () => set({ recentlyViewed: [] }),
		}),
		{
			name: "e-state-storage",
			partialize: (state) => ({
				user: state.user,
				userMode: state.userMode,
				isAuthenticated: state.isAuthenticated,
				savedProperties: state.savedProperties,
				recentlyViewed: state.recentlyViewed,
				chatSessions: state.chatSessions,
			}),
		}
	)
);

export const useAuthStore = () => {
	const state = useAppStore();
	return {
		user: state.user,
		userMode: state.userMode,
		isAuthenticated: state.isAuthenticated,
		setUser: state.setUser,
		setUserMode: state.setUserMode,
		setAuthenticated: state.setAuthenticated,
		login: (user: User, accessToken: string, refreshToken?: string) => {
			// Store tokens in localStorage
			if (typeof window !== "undefined") {
				localStorage.setItem("accessToken", accessToken);
				if (refreshToken) {
					localStorage.setItem("refreshToken", refreshToken);
				}
			}

			console.log("User to be set:", user);

			// Update both values in a single state update
			useAppStore.setState({
				user: user,
				isAuthenticated: true,
			});
		},
		logout: () => {
			// Remove tokens from localStorage
			if (typeof window !== "undefined") {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				localStorage.removeItem("propmize_guest_id");
				localStorage.removeItem("ai_current_chat");
			}

			// Update both values in a single state update
			useAppStore.setState({
				user: null,
				isAuthenticated: false,
			});
		},
	};
};