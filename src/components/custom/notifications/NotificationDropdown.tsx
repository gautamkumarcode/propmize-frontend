"use client";

import { Button } from "@/components/ui/button";
import {
	Bell,
	Check,
	Home,
	MessageCircle,
	Settings,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export interface Notification {
	id: string;
	title: string;
	message: string;
	type:
		| "info"
		| "success"
		| "warning"
		| "error"
		| "property"
		| "message"
		| "system";
	timestamp: Date;
	read: boolean;
	actionUrl?: string;
	userId?: string;
	metadata?: {
		propertyId?: string;
		propertyTitle?: string;
		senderName?: string;
		amount?: number;
	};
}

interface NotificationDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	notifications: Notification[];
	onMarkAsRead: (id: string) => void;
	onMarkAllAsRead: () => void;
	onDeleteNotification: (id: string) => void;
	onNotificationClick: (notification: Notification) => void;
}

const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
	const iconProps = { size: 16, className: "text-white" };

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

const getNotificationStyles = (type: Notification["type"]) => {
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

const formatTimeAgo = (date: Date) => {
	const now = new Date();
	const diffInMinutes = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60)
	);

	if (diffInMinutes < 1) return "Just now";
	if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours}h ago`;

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) return `${diffInDays}d ago`;

	return date.toLocaleDateString();
};

export default function NotificationDropdown({
	isOpen,
	onClose,
	notifications,
	onMarkAsRead,
	onMarkAllAsRead,
	onDeleteNotification,
	onNotificationClick,
}: NotificationDropdownProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	// const { userMode } = useAuthStore();

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const unreadCount = notifications.filter((n) => !n.read).length;
	const sortedNotifications = [...notifications].sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);

	return (
		<div
			ref={dropdownRef}
			className="absolute -right-16 mt-2 w-92 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
				<div className="flex items-center space-x-2">
					<Bell size={18} className="text-gray-600" />
					<h3 className="font-semibold text-gray-900">Notifications</h3>
					{unreadCount > 0 && (
						<span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
							{unreadCount}
						</span>
					)}
				</div>
				<div className="flex items-center space-x-2">
					{unreadCount > 0 && (
						<Button
							onClick={onMarkAllAsRead}
							variant="ghost"
							size="sm"
							className="text-xs text-blue-600 hover:text-blue-800">
							Mark all read
						</Button>
					)}
					<Button
						onClick={onClose}
						variant="ghost"
						size="sm"
						className="text-gray-400 hover:text-gray-600">
						<X size={16} />
					</Button>
				</div>
			</div>

			{/* Notifications List */}
			<div className="max-h-80 overflow-y-auto">
				{sortedNotifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-gray-500">
						<Bell size={48} className="mb-2 opacity-30" />
						<p className="text-sm">No notifications yet</p>
						<p className="text-xs text-gray-400 mt-1">
							We&apos;ll notify you when something important happens
						</p>
					</div>
				) : (
					sortedNotifications.map((notification) => (
						<div
							key={notification.id}
							className={`flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
								!notification.read ? "bg-blue-50" : ""
							}`}
							onClick={() => onNotificationClick(notification)}>
							{/* Icon */}
							<div
								className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationStyles(
									notification.type
								)}`}>
								<NotificationIcon type={notification.type} />
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<p
											className={`text-sm ${
												!notification.read
													? "font-semibold text-gray-900"
													: "font-medium text-gray-700"
											}`}>
											{notification.title}
										</p>
										<p className="text-sm text-gray-600 mt-1 line-clamp-2">
											{notification.message}
										</p>

										{/* Metadata */}
										{notification.metadata && (
											<div className="mt-2 text-xs text-gray-500">
												{notification.metadata.propertyTitle && (
													<span className="bg-gray-100 px-2 py-1 rounded">
														{notification.metadata.propertyTitle}
													</span>
												)}
												{notification.metadata.senderName && (
													<span className="bg-gray-100 px-2 py-1 rounded ml-1">
														From: {notification.metadata.senderName}
													</span>
												)}
												{notification.metadata.amount && (
													<span className="bg-green-100 text-green-700 px-2 py-1 rounded ml-1">
														₹{notification.metadata.amount.toLocaleString()}
													</span>
												)}
											</div>
										)}
									</div>

									{/* Actions */}
									<div className="flex items-center space-x-1 ml-2">
										{!notification.read && (
											<Button
												onClick={(e) => {
													e.stopPropagation();
													onMarkAsRead(notification.id);
												}}
												variant="ghost"
												size="sm"
												className="p-1 text-blue-600 hover:text-blue-800">
												<Check size={14} />
											</Button>
										)}
										<Button
											onClick={(e) => {
												e.stopPropagation();
												onDeleteNotification(notification.id);
											}}
											variant="ghost"
											size="sm"
											className="p-1 text-gray-400 hover:text-red-600">
											<Trash2 size={14} />
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between mt-2">
									<span className="text-xs text-gray-400">
										{formatTimeAgo(notification.timestamp)}
									</span>
									{!notification.read && (
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Footer */}
			{sortedNotifications.length > 0 && (
				<div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-sm text-gray-600 hover:text-gray-800"
						onClick={() => {
							onClose();
							router.push('/notifications');
						}}>
						View All Notifications
					</Button>
				</div>
			)}
		</div>
	);
}
