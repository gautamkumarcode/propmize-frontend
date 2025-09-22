"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/lib";
import { NotificationTpes } from "@/types";
import {
	Bell,
	Check,
	Home,
	MessageCircle,
	Settings,
	Trash2,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NotificationIcon = ({ type }: { type: NotificationTpes["type"] }) => {
	const iconProps = { size: 20, className: "text-white" };

	switch (type) {
		case "property":
			return <Home {...iconProps} />;
		case "message":
			return <MessageCircle {...iconProps} />;
		case "success":
			return <Check {...iconProps} />;
		case "warning":
			return <Bell {...iconProps} />;
		case "error":
			return <X {...iconProps} />;
		case "system":
			return <Settings {...iconProps} />;
		default:
			return <Bell {...iconProps} />;
	}
};

const getNotificationStyles = (type: NotificationTpes["type"]) => {
	switch (type) {
		case "property":
			return "bg-blue-500";
		case "message":
			return "bg-green-500";
		case "success":
			return "bg-emerald-500";
		case "warning":
			return "bg-yellow-500";
		case "error":
			return "bg-red-500";
		case "system":
			return "bg-gray-500";
		default:
			return "bg-blue-500";
	}
};

export default function NotificationsPage() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const {
		notifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		handleNotificationClick,
	} = useNotifications();
	const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

	if (!isAuthenticated) {
		return (
			<div className="container mx-auto py-10">
				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<CardTitle>Authentication Required</CardTitle>
						<CardDescription>
							You need to be logged in to view your notifications.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push("/login")} className="w-full">
							Go to Login
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const sortedNotifications = [...notifications].sort(
		(a, b) =>
			new Date(b.createdAt ?? new Date()).getTime() -
			new Date(a.createdAt ?? new Date()).getTime()
	);

	const filteredNotifications =
		activeTab === "unread"
			? sortedNotifications.filter((n) => !n.read)
			: sortedNotifications;

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<div className="container mx-auto pt-4 pb-20 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold">Notifications</h1>
					<div className="flex items-center space-x-2">
						{unreadCount > 0 && (
							<Button
								onClick={markAllAsRead}
								variant="outline"
								size="sm"
								className="text-sm">
								Mark all as read
							</Button>
						)}
					</div>
				</div>

				<Tabs
					defaultValue="all"
					className="w-full"
					onValueChange={(value) => setActiveTab(value as "all" | "unread")}>
					<TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="unread">
							Unread
							{unreadCount > 0 && (
								<span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
									{unreadCount}
								</span>
							)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="mt-0">
						<Card>
							<CardContent className="p-0">
								{renderNotificationList(filteredNotifications)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="unread" className="mt-0">
						<Card>
							<CardContent className="p-0">
								{renderNotificationList(filteredNotifications)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);

	function renderNotificationList(notifications: NotificationTpes[]) {
		if (notifications.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center py-16 text-gray-500">
					<Bell size={48} className="mb-4 opacity-30" />
					<p className="text-lg font-medium">No notifications</p>
					<p className="text-sm text-gray-400 mt-1">
						We&apos;ll notify you when something important happens
					</p>
				</div>
			);
		}

		return (
			<div className="divide-y divide-gray-100">
				{notifications.map((notification) => (
					<div
						key={notification._id}
						className={`flex items-start p-4 hover:bg-gray-50 transition-colors ${
							!notification.read ? "bg-blue-50" : ""
						}`}>
						{/* Icon */}
						<div
							className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getNotificationStyles(
								notification.type
							)}`}>
							<NotificationIcon type={notification.type} />
						</div>

						{/* Content */}
						<div
							className="flex-1 cursor-pointer"
							onClick={() => handleNotificationClick(notification)}>
							<div className="flex items-start justify-between">
								<div>
									<h3
										className={`text-base ${
											!notification.read
												? "font-semibold text-gray-900"
												: "font-medium text-gray-700"
										}`}>
										{notification.title}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										{notification.message}
									</p>

									{/* Metadata */}
									{notification.metadata && (
										<div className="mt-2 flex flex-wrap gap-2">
											{notification.metadata.propertyTitle && (
												<span className="bg-gray-100 px-2 py-1 rounded text-xs">
													{notification.metadata.propertyTitle}
												</span>
											)}
											{notification.metadata.senderName && (
												<span className="bg-gray-100 px-2 py-1 rounded text-xs">
													From: {notification.metadata.senderName}
												</span>
											)}
											{notification.metadata.amount && (
												<span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
													₹{notification.metadata.amount.toLocaleString()}
												</span>
											)}
										</div>
									)}

									<div className="mt-2 text-xs text-gray-400">
										{new Date(
											notification.createdAt ?? Date.now()
										).toLocaleString("en-US", {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center space-x-1 ml-4">
									{!notification.read && (
										<Button
											onClick={(e) => {
												e.stopPropagation();
												markAsRead(notification._id);
											}}
											variant="ghost"
											size="sm"
											className="p-1 text-blue-600 hover:text-blue-800">
											<Check size={16} />
										</Button>
									)}
									<Button
										onClick={(e) => {
											e.stopPropagation();
											deleteNotification(notification._id);
										}}
										variant="ghost"
										size="sm"
										className="p-1 text-gray-400 hover:text-red-600">
										<Trash2 size={16} />
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}
}
