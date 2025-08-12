import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
				outline: "text-foreground",
				// Estate-specific variants
				price:
					"bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md hover:from-emerald-600 hover:to-green-600 font-bold",
				premium:
					"bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-md hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 font-bold",
				featured:
					"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700",
				new: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:from-pink-600 hover:to-rose-600 animate-pulse",
				sold: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md opacity-80",
				verified:
					"bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:from-green-700 hover:to-emerald-700",
				location:
					"bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
				property:
					"bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
				amenity:
					"bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
				status:
					"bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
			},
			size: {
				default: "px-3 py-1 text-xs",
				sm: "px-2.5 py-0.5 text-xs rounded-md",
				lg: "px-4 py-2 text-sm rounded-lg",
				xl: "px-6 py-3 text-base rounded-xl font-bold",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant, size, ...rest }, ref) => (
		<span
			ref={ref}
			className={cn(badgeVariants({ variant, size }), className)}
			{...rest}
		/>
	)
);
Badge.displayName = "Badge";

// Estate-specific Badge Components
function PriceBadge({
	price,
	className,
	...props
}: {
	price: number | string;
	className?: string;
} & Omit<BadgeProps, "variant" | "children">) {
	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		if (numPrice >= 10000000) {
			// 1 crore
			return `₹${(numPrice / 10000000).toFixed(1)}Cr`;
		} else if (numPrice >= 100000) {
			// 1 lakh
			return `₹${(numPrice / 100000).toFixed(1)}L`;
		} else {
			return `₹${numPrice.toLocaleString()}`;
		}
	};

	return (
		<Badge
			variant="price"
			size="lg"
			className={cn("shadow-lg", className)}
			{...props}>
			{formatPrice(price)}
		</Badge>
	);
}

function StatusBadge({
	status,
	className,
	...props
}: {
	status: "new" | "featured" | "sold" | "verified" | "premium";
	className?: string;
} & Omit<BadgeProps, "variant" | "children">) {
	const statusLabels = {
		new: "NEW",
		featured: "FEATURED",
		sold: "SOLD",
		verified: "VERIFIED",
		premium: "PREMIUM",
	};

	return (
		<Badge
			variant={status}
			size="sm"
			className={cn("font-bold uppercase tracking-wide", className)}
			{...props}>
			{statusLabels[status]}
		</Badge>
	);
}

function PropertyTypeBadge({
	type,
	className,
	...props
}: {
	type: string;
	className?: string;
} & Omit<BadgeProps, "variant" | "children">) {
	return (
		<Badge
			variant="property"
			className={cn("capitalize", className)}
			{...props}>
			{type}
		</Badge>
	);
}

function LocationBadge({
	location,
	className,
	...props
}: {
	location: string;
	className?: string;
} & Omit<BadgeProps, "variant" | "children">) {
	return (
		<Badge variant="location" className={cn("", className)} {...props}>
			📍 {location}
		</Badge>
	);
}

export {
	Badge,
	badgeVariants,
	LocationBadge,
	PriceBadge,
	PropertyTypeBadge,
	StatusBadge,
};
