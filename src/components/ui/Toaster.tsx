"use client";

import { AlertCircle, Bell, CheckCircle, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ToastProps {
	id?: string;
	title: string;
	description?: string;
	variant?: "default" | "destructive" | "success" | "warning" | "info";
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface ToastInternal extends ToastProps {
	id: string;
	timestamp: number;
}

let toastQueue: ToastInternal[] = [];
let listeners: ((toasts: ToastInternal[]) => void)[] = [];

const addToast = (toast: ToastProps) => {
	const id = Math.random().toString(36).substring(2, 9);
	const newToast: ToastInternal = {
		id,
		timestamp: Date.now(),
		duration: 5000,
		...toast,
	};

	toastQueue = [...toastQueue, newToast];
	listeners.forEach((listener) => listener(toastQueue));
};

const removeToast = (id: string) => {
	toastQueue = toastQueue.filter((toast) => toast.id !== id);
	listeners.forEach((listener) => listener(toastQueue));
};

export const triggerToast = (toast: ToastProps) => {
	addToast(toast);
};

export const useToast = () => {
	const [toasts, setToasts] = useState<ToastInternal[]>([]);

	useEffect(() => {
		listeners.push(setToasts);
		return () => {
			listeners = listeners.filter((l) => l !== setToasts);
		};
	}, []);

	return {
		toasts,
		addToast,
		removeToast,
	};
};

export const Toaster: React.FC = () => {
	const { toasts, removeToast } = useToast();
	const position: "top-right" | "top-left" | "bottom-right" | "bottom-left" =
		"top-right";

	if (toasts.length === 0) return null;

	const getVariantStyles = (variant: ToastProps["variant"] = "default") => {
		const baseStyles =
			"rounded-xl p-4 shadow-lg border backdrop-blur-sm flex gap-3";

		switch (variant) {
			case "destructive":
				return `${baseStyles} bg-red-500 text-white border-red-600/30`;
			case "success":
				return `${baseStyles} bg-green-700 text-white border-green-600/30`;
			case "warning":
				return `${baseStyles} bg-amber-500 text-white border-amber-600/30`;
			case "info":
				return `${baseStyles} bg-blue-500 text-white border-blue-600/30`;
			default:
				return `${baseStyles} bg-gray-900 text-white border-gray-800/30`;
		}
	};

	const getVariantIcon = (variant: ToastProps["variant"] = "default") => {
		const iconProps = { className: "w-5 h-5 flex-shrink-0" };

		switch (variant) {
			case "destructive":
				return <AlertCircle {...iconProps} />;
			case "success":
				return <CheckCircle {...iconProps} />;
			case "warning":
				return <AlertCircle {...iconProps} />;
			case "info":
				return <Info {...iconProps} />;
			default:
				return <Bell {...iconProps} />;
		}
	};

	const getPositionStyles = () => {
		switch (position) {
			case "top-right":
				return "top-4 right-4";
			// case "top-left":
			// 	return "top-4 left-4";
			// case "bottom-right":
			// 	return "bottom-4 right-4";
			// case "bottom-left":
			// 	return "bottom-4 left-4";
			default:
				return "top-4 right-4";
		}
	};

	return (
		<div className={`fixed z-[999999] space-y-3 ${getPositionStyles()}`}>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					toast={toast}
					onClose={() => removeToast(toast.id)}
					variantStyles={getVariantStyles(toast.variant)}
					icon={getVariantIcon(toast.variant)}
				/>
			))}
		</div>
	);
};

interface ToastComponentProps {
	toast: ToastInternal;
	onClose: () => void;
	variantStyles: string;
	icon: React.ReactNode;
}

const Toast: React.FC<ToastComponentProps> = ({
	toast,
	onClose,
	variantStyles,
	icon,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [progress, setProgress] = useState(100);

	useEffect(() => {
		setIsVisible(true);

		// Set up progress bar animation
		if (toast.duration && toast.duration > 0) {
			const interval = 10;
			const totalSteps = toast.duration / interval;
			const decrement = 100 / totalSteps;

			const timer = setInterval(() => {
				setProgress((prev) => Math.max(0, prev - decrement));
			}, interval);

			// Auto-dismiss after duration
			const dismissTimer = setTimeout(() => {
				setIsVisible(false);
				setTimeout(() => onClose(), 300); // Wait for exit animation
			}, toast.duration);

			return () => {
				clearInterval(timer);
				clearTimeout(dismissTimer);
			};
		}

		return undefined;
	}, [toast.duration, onClose]);

	const handleMouseEnter = () => {
		setProgress((prev) => prev); // Pause progress
	};

	const handleMouseLeave = () => {
		// Resume progress (you could implement this with a ref for more accuracy)
	};

	return (
		<div
			className={`transform transition-all duration-300 ease-in-out ${
				isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
			} ${variantStyles} max-w-sm w-full relative overflow-hidden`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			{/* Progress bar */}
			{toast.duration && toast.duration > 0 && (
				<div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
					<div
						className="h-full bg-white/30 transition-all duration-100 ease-linear"
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}

			<div className="flex gap-3">
				<div className="mt-0.5">{icon}</div>

				<div className="flex-1">
					{/* <h3 className="font-semibold text-sm">{toast.title}</h3> */}
					{toast.description && (
						<p className="text-sm mt-1 opacity-90">{toast.description}</p>
					)}

					{toast.action && (
						<button
							className="mt-3 text-sm font-medium underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity"
							onClick={() => {
								toast.action?.onClick();
								onClose();
							}}>
							{toast.action.label}
						</button>
					)}
				</div>

				<button
					onClick={onClose}
					className="text-white/70 hover:text-white transition-colors self-start">
					<X className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default Toaster;
