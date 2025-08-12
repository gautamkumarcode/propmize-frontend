export interface Toast {
	title: string;
	description?: string;
	variant?: "default" | "destructive";
}

// Simple toast implementation using native browser alert/console
export const toast = ({ title, description, variant }: Toast) => {
	if (variant === "destructive") {
		console.error(`❌ ${title}`, description);
		alert(`❌ Error: ${title}${description ? `\n${description}` : ""}`);
	} else {
		console.log(`✅ ${title}`, description);
		// For success, you could implement a better notification system later
		// For now, we'll just log to console
	}
};
