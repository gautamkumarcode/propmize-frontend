"use client";

import { ReactNode } from "react";
import { SocketProvider } from "../socket/socketContext";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<QueryProvider>
			<AuthProvider>
				<SocketProvider>{children}</SocketProvider>
			</AuthProvider>
		</QueryProvider>
	);
}
