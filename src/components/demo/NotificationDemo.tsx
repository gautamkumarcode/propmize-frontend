"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationService } from "@/services/notificationService";

export default function NotificationDemo() {
	const handleTestNotification = (type: string) => {
		switch (type) {
			case "success":
				NotificationService.success(
					"Operation Successful!",
					"Your property has been saved successfully."
				);
				break;
			case "error":
				NotificationService.error(
					"Something went wrong",
					"Failed to save the property. Please try again."
				);
				break;
			case "warning":
				NotificationService.warning(
					"Price Alert",
					"The property price has increased by 10% since your last visit."
				);
				break;
			case "property":
				NotificationService.property(
					"New Property Match",
					"We found a perfect match for your preferences in Koramangala.",
					{
						id: "demo-123",
						title: "Beautiful 3BHK Apartment",
						url: "/property/demo-123",
					}
				);
				break;
			case "message":
				NotificationService.message(
					"New Message",
					"The property owner has responded to your inquiry.",
					"Rajesh Kumar",
					"/chat/demo-456"
				);
				break;
			case "info":
			default:
				NotificationService.notify({
					title: "System Update",
					message: "New features have been added to your dashboard.",
					type: "info",
					actionUrl: "/dashboard",
				});
				break;
		}
	};

	return (
		<Card className="p-6 max-w-md mx-auto">
			<h3 className="text-lg font-semibold mb-4">Test Notifications</h3>
			<div className="space-y-2">
				<Button
					onClick={() => handleTestNotification("success")}
					className="w-full"
					variant="outline">
					Success Notification
				</Button>
				<Button
					onClick={() => handleTestNotification("error")}
					className="w-full"
					variant="outline">
					Error Notification
				</Button>
				<Button
					onClick={() => handleTestNotification("warning")}
					className="w-full"
					variant="outline">
					Warning Notification
				</Button>
				<Button
					onClick={() => handleTestNotification("property")}
					className="w-full"
					variant="outline">
					Property Notification
				</Button>
				<Button
					onClick={() => handleTestNotification("message")}
					className="w-full"
					variant="outline">
					Message Notification
				</Button>
				<Button
					onClick={() => handleTestNotification("info")}
					className="w-full"
					variant="outline">
					Info Notification
				</Button>
			</div>
		</Card>
	);
}
