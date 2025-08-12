// Utility functions for safe localStorage access
export const isClient = typeof window !== "undefined";

export const safeLocalStorage = {
	getItem: (key: string): string | null => {
		if (!isClient) return null;
		try {
			return localStorage.getItem(key);
		} catch (error) {
			console.warn(`Error accessing localStorage for key "${key}":`, error);
			return null;
		}
	},

	setItem: (key: string, value: string): void => {
		if (!isClient) return;
		try {
			localStorage.setItem(key, value);
		} catch (error) {
			console.warn(`Error setting localStorage for key "${key}":`, error);
		}
	},

	removeItem: (key: string): void => {
		if (!isClient) return;
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.warn(`Error removing localStorage for key "${key}":`, error);
		}
	},

	clear: (): void => {
		if (!isClient) return;
		try {
			localStorage.clear();
		} catch (error) {
			console.warn("Error clearing localStorage:", error);
		}
	},
};
