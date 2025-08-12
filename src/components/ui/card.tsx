import { cn } from "@/lib/utils";
import * as React from "react";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm text-card-foreground shadow-lg shadow-slate-200/20 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-slate-900/20",
			className
		)}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-slate-100",
			className
		)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			"text-sm text-slate-600 dark:text-slate-400 leading-relaxed",
			className
		)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

// Estate-specific Card variants
const PropertyCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-xl shadow-slate-200/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200/40 dark:border-slate-800/60 dark:bg-slate-900/90",
			className
		)}
		{...props}
	/>
));
PropertyCard.displayName = "PropertyCard";

const EstateCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-1 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl dark:from-slate-800 dark:to-slate-900",
			className
		)}
		{...props}>
		<div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm dark:bg-slate-900/80">
			{props.children}
		</div>
	</div>
));
EstateCard.displayName = "EstateCard";

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	EstateCard,
	PropertyCard,
};
