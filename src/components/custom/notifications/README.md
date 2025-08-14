# Notification System

A comprehensive notification system for the Propmize frontend application with dropdown notifications, real-time updates, and programmatic control.

## Components

### NotificationDropdown

A dropdown component that displays notifications with different types, actions, and metadata.

**Features:**

- Different notification types (property, message, success, warning, error, system, info)
- Mark as read/unread functionality
- Delete notifications
- Click to navigate to action URLs
- Responsive design with mobile support
- Real-time unread count display

### useNotifications Hook

Manages notification state and provides functions for notification operations.

**Features:**

- Automatic user mode detection (buyer/seller)
- Different notification sets based on user mode
- Real-time notification simulation in development
- Integration with NotificationService

### NotificationService

A global service for triggering notifications from anywhere in the app.

## Usage

### Basic Setup

1. **In your navbar/layout component:**

```tsx
import { useNotifications } from "@/hooks/useNotifications";
import NotificationDropdown from "@/components/custom/notifications/NotificationDropdown";

const {
	notifications,
	unreadCount,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	handleNotificationClick,
} = useNotifications();

// Use in your JSX
<NotificationDropdown
	isOpen={showNotifications}
	onClose={() => setShowNotifications(false)}
	notifications={notifications}
	onMarkAsRead={markAsRead}
	onMarkAllAsRead={markAllAsRead}
	onDeleteNotification={deleteNotification}
	onNotificationClick={handleNotificationClick}
/>;
```

2. **Using the Notification Service:**

```tsx
import { NotificationService } from "@/services/notificationService";

// Simple notifications
NotificationService.success("Success!", "Operation completed successfully.");
NotificationService.error("Error!", "Something went wrong.");
NotificationService.warning("Warning!", "Please check your input.");

// Property-specific notifications
NotificationService.property(
	"New Property Match",
	"A property matching your criteria is available",
	{
		id: "123",
		title: "Beautiful 3BHK Apartment",
		url: "/property/123",
	}
);

// Message notifications
NotificationService.message(
	"New Message",
	"You have a new message from the property owner",
	"John Doe",
	"/chat/456"
);

// Custom notifications
NotificationService.notify({
	title: "Custom Notification",
	message: "This is a custom notification with metadata",
	type: "info",
	actionUrl: "/custom-page",
	metadata: {
		propertyId: "123",
		amount: 50000,
	},
});
```

### Notification Types

- **property**: Real estate related notifications (new matches, price drops, etc.)
- **message**: Chat/communication notifications
- **success**: Positive feedback notifications
- **warning**: Important alerts that need attention
- **error**: Error/failure notifications
- **system**: System updates and information
- **info**: General informational notifications (default)

### User Mode Support

The notification system automatically adapts to user mode:

**Buyer Mode:**

- Property matches
- Price alerts
- Owner responses
- Visit confirmations
- System updates

**Seller Mode:**

- New leads
- Property performance
- Subscription alerts
- Property approval status
- Analytics updates

### Testing

Use the `NotificationDemo` component to test different notification types:

```tsx
import NotificationDemo from "@/components/demo/NotificationDemo";

// Add to any page for testing
<NotificationDemo />;
```

### Customization

#### Styling

Notifications use Tailwind CSS classes and can be customized by modifying the component classes in `NotificationDropdown.tsx`.

#### Icons

Notification icons are mapped in the `NotificationIcon` component. Add new types and icons as needed.

#### Mock Data

Mock notifications are defined in `useNotifications.ts`. Replace with real API calls in production.

## File Structure

```
src/
├── components/custom/notifications/
│   ├── NotificationDropdown.tsx    # Main dropdown component
│   └── index.ts                   # Export file
├── hooks/
│   └── useNotifications.ts        # Notification state management
├── services/
│   └── notificationService.ts     # Global notification service
└── components/demo/
    └── NotificationDemo.tsx       # Testing component
```

## Integration Notes

- The notification button is integrated into the main navbar
- Notifications are automatically shown based on user authentication state
- Unread count is displayed on the notification bell icon
- Click outside to close behavior is implemented
- Real-time simulation is enabled in development mode

## Future Enhancements

- WebSocket/SSE integration for real-time notifications
- Push notification support
- Notification persistence with local storage/database
- Email/SMS notification preferences
- Advanced filtering and categorization
- Notification templates and scheduling
