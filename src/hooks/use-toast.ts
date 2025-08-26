export interface Toast {
	title: string;
	description?: string;
	variant?: "default" | "destructive";
}

import { triggerToast } from "@/components/ui/Toaster";

export const toast = ({ title, description, variant }: Toast) => {
	triggerToast({ title, description, variant });
};
