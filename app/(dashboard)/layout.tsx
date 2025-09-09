import AppLayout from "@/components/custom/layout/AppLayout";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/lib";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<NextTopLoader
				color="#2563eb"
				initialPosition={0.08}
				crawlSpeed={200}
				height={3}
				crawl={true}
				easing="ease"
				speed={200}
				showSpinner={false}
				// disable circle loader

				zIndex={1600}
			/>
			<Toaster />
			<Providers>
				<AppLayout>{children}</AppLayout>
			</Providers>
		</div>
	);
}
