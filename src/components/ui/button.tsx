import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] transform",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700",
				destructive:
					"bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:from-red-700 hover:to-rose-700",
				outline:
					"border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 hover:shadow-md dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700",
				secondary:
					"bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 shadow-sm hover:from-slate-300 hover:to-slate-400 hover:shadow-md dark:from-slate-700 dark:to-slate-600 dark:text-slate-200",
				ghost:
					"text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
				link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
				premium:
					"bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600",
				success:
					"bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-700 hover:to-green-700",
				estate:
					"bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg shadow-slate-500/25 hover:shadow-xl hover:shadow-slate-500/30 hover:from-slate-900 hover:to-slate-900",
			},
			size: {
				default: "h-11 px-6 py-2.5",
				sm: "h-9 rounded-lg px-4 text-xs",
				lg: "h-13 rounded-xl px-10 text-base",
				icon: "h-11 w-11",
				xl: "h-16 rounded-2xl px-12 text-lg font-bold",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	size?: "default" | "sm" | "lg" | "icon" | "xl";
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium" | "success" | "estate";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };

