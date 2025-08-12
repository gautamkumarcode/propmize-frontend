import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
	variant?: "default" | "estate" | "premium";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ className, type, label, error, icon, variant = "default", ...props },
		ref
	) => {
		const baseStyles =
			"flex h-12 w-full rounded-xl border bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300";

		const variants = {
			default:
				"border-slate-300 hover:border-slate-400 focus:border-blue-500 dark:border-slate-600 dark:hover:border-slate-500",
			estate:
				"border-slate-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-slate-400 focus:border-blue-600 focus:shadow-lg focus:bg-white dark:bg-slate-800/80 dark:border-slate-600",
			premium:
				"border-2 border-amber-300/50 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 hover:from-amber-100/50 hover:to-yellow-100/50 focus:border-amber-500 focus:from-amber-50 focus:to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
		};

		const inputElement = (
			<div className="relative">
				{icon && (
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
						{icon}
					</div>
				)}
				<input
					type={type}
					className={cn(
						baseStyles,
						variants[variant],
						icon && "pl-10",
						error && "border-red-500 focus:border-red-500",
						className
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);

		if (label || error) {
			return (
				<div className="space-y-2">
					{label && (
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							{label}
						</label>
					)}
					{inputElement}
					{error && (
						<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
					)}
				</div>
			);
		}

		return inputElement;
	}
);
Input.displayName = "Input";

// Estate-specific Search Input
const SearchInput = React.forwardRef<
	HTMLInputElement,
	Omit<InputProps, "variant">
>(({ className, ...props }, ref) => (
	<Input
		ref={ref}
		variant="estate"
		className={cn(
			"h-14 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border-2 border-slate-200/60 hover:shadow-xl focus:shadow-2xl placeholder:text-slate-500 text-base",
			className
		)}
		{...props}
	/>
));
SearchInput.displayName = "SearchInput";

// Premium Input for high-value properties
const PremiumInput = React.forwardRef<
	HTMLInputElement,
	Omit<InputProps, "variant">
>(({ className, ...props }, ref) => (
	<Input
		ref={ref}
		variant="premium"
		className={cn("font-semibold", className)}
		{...props}
	/>
));
PremiumInput.displayName = "PremiumInput";

export { Input, PremiumInput, SearchInput };
