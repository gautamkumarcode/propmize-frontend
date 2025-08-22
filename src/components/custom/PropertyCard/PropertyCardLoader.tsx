import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyCardSkeletonProps {
	className?: string;
}

export const PropertyCardSkeleton = ({
	className = "",
}: PropertyCardSkeletonProps) => {
	return (
		<Card className={`overflow-hidden border-0 shadow-lg ${className}`}>
			<Skeleton className="w-full h-60 rounded-none" />
			<CardContent className="p-6">
				<Skeleton className="h-6 w-3/4 mb-4" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-2/3 mb-4" />
				<div className="flex justify-between items-center mb-4">
					<Skeleton className="h-6 w-20" />
					<Skeleton className="h-6 w-24" />
				</div>
				<Skeleton className="h-10 w-full" />
			</CardContent>
		</Card>
	);
};
