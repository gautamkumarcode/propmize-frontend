"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, ReactNode, useContext } from "react";
import { queryClient } from "../react-query/queryClient";

// Create a context for the query client
const QueryContext = createContext<QueryClient | null>(null);

interface QueryProviderProps {
	children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<QueryContext.Provider value={queryClient}>
				{children}
				{/* Show React Query DevTools in development */}
				{process.env.NODE_ENV === "development" && (
					<ReactQueryDevtools
						initialIsOpen={false}
						buttonPosition="bottom-right"
					/>
				)}
			</QueryContext.Provider>
		</QueryClientProvider>
	);
}

// Hook to use the query client
export function useQueryClient() {
	const client = useContext(QueryContext);
	if (!client) {
		throw new Error("useQueryClient must be used within a QueryProvider");
	}
	return client;
}
