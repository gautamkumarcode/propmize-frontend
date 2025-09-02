"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib";
import { useState } from "react";

const TestNotification = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [notificationData, setNotificationData] = useState({
		title: "Test Notification",
		message: "This is a test notification from the client",
		type: "info",
		actionUrl: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNotificationData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleTypeChange = (value: string) => {
		setNotificationData((prev) => ({
			...prev,
			type: value,
		}));
	};

	const sendTestNotification = async () => {
		if (!user) {
			toast({
				title: "Error",
				description: "You must be logged in to send test notifications",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/test/notification`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
					body: JSON.stringify(notificationData),
				}
			);

			const data = await response.json();

			if (data.success) {
				toast({
					title: "Success",
					description: "Test notification sent successfully",
				});
			} else {
				toast({
					title: "Error",
					description: data.error || "Failed to send test notification",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error sending test notification:", error);
			toast({
				title: "Error",
				description: "An error occurred while sending the test notification",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Test Notification System</CardTitle>
				<CardDescription>
					Send a test notification to yourself to verify the real-time
					notification system.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="title">Notification Title</Label>
					<Input
						id="title"
						name="title"
						value={notificationData.title}
						onChange={handleChange}
						placeholder="Enter notification title"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="message">Notification Message</Label>
					<Input
						id="message"
						name="message"
						value={notificationData.message}
						onChange={handleChange}
						placeholder="Enter notification message"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="type">Notification Type</Label>
					<Select
						value={notificationData.type}
						onValueChange={handleTypeChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select notification type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="info">Info</SelectItem>
							<SelectItem value="success">Success</SelectItem>
							<SelectItem value="warning">Warning</SelectItem>
							<SelectItem value="error">Error</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="actionUrl">Action URL (Optional)</Label>
					<Input
						id="actionUrl"
						name="actionUrl"
						value={notificationData.actionUrl}
						onChange={handleChange}
						placeholder="Enter URL to navigate to when notification is clicked"
					/>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={sendTestNotification}
					disabled={loading}
					className="w-full">
					{loading ? "Sending..." : "Send Test Notification"}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default TestNotification;
