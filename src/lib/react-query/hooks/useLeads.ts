import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LeadService } from "../../services/leadService";
import { ApiResponse, Lead, LeadCreateData } from "../../types/api";
import { QueryKeys } from "../queryClient";

// Define proper error interface for HTTP errors
interface HttpError {
	response?: {
		status: number;
		data?: {
			message?: string;
			error?: string;
		};
	};
	message?: string;
}

// Type guard to check if error is an HttpError
function isHttpError(error: unknown): error is HttpError {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as HttpError).response?.status === "number"
	);
}

// Get seller's leads
export const useMyLeads = (
	filters: {
		status?: "new" | "contacted" | "qualified" | "converted" | "rejected";
		page?: number;
		limit?: number;
		sortBy?: "createdAt" | "status";
		sortOrder?: "asc" | "desc";
	} = {}
) => {
	return useQuery({
		queryKey: [QueryKeys.myLeads, filters],
		queryFn: () => LeadService.getMyLeads(filters),
		select: (data) => data.data,
	});
};

// Get buyer's inquiries
export const useMyInquiries = (
	filters: {
		status?: "pending" | "responded" | "closed";
		page?: number;
		limit?: number;
	} = {}
) => {
	return useQuery({
		queryKey: [QueryKeys.myInquiries, filters],
		queryFn: () => LeadService.getMyInquiries(filters),
		select: (data) => data.data,
	});
};

// Get leads for a specific property
export const usePropertyLeads = (
	propertyId: string,
	filters: {
		status?: "new" | "contacted" | "qualified" | "converted" | "rejected";
		page?: number;
		limit?: number;
	} = {}
) => {
	return useQuery({
		queryKey: [QueryKeys.propertyLeads(propertyId), filters],
		queryFn: () => LeadService.getPropertyLeads(propertyId, filters),
		select: (data) => data.data,
		enabled: !!propertyId,
	});
};

// Get single lead
export const useLead = (leadId: string) => {
	return useQuery({
		queryKey: QueryKeys.lead(leadId),
		queryFn: () => LeadService.getLead(leadId),
		select: (data) => data.data,
		enabled: !!leadId,
	});
};

// Get lead analytics
export const useLeadAnalytics = (
	filters: {
		period?: "week" | "month" | "quarter" | "year";
		propertyId?: string;
	} = {}
) => {
	return useQuery({
		queryKey: [QueryKeys.leadAnalytics, filters],
		queryFn: () => LeadService.getLeadAnalytics(filters),
		select: (data) => data.data,
	});
};

// Mutations
export const useCreateLead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (leadData: LeadCreateData) => LeadService.createLead(leadData),
		onSuccess: () => {
			// Invalidate leads queries
			queryClient.invalidateQueries({ queryKey: QueryKeys.leads });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myInquiries });

			console.log("Lead created successfully!");
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to create lead:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useUpdateLeadStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			leadId,
			status,
			notes,
		}: {
			leadId: string;
			status: "new" | "contacted" | "qualified" | "converted" | "rejected";
			notes?: string;
		}) => LeadService.updateLeadStatus(leadId, status, notes),
		onSuccess: (data, variables) => {
			// Update the specific lead in cache
			queryClient.setQueryData(
				QueryKeys.lead(variables.leadId),
				(old: ApiResponse<Lead> | undefined) =>
					old ? { ...old, data: data.data } : data
			);

			// Invalidate lead lists
			queryClient.invalidateQueries({ queryKey: QueryKeys.myLeads });
			queryClient.invalidateQueries({ queryKey: QueryKeys.leadAnalytics });

			console.log("Lead status updated successfully!");
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to update lead status:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useAddLeadNotes = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ leadId, notes }: { leadId: string; notes: string }) =>
			LeadService.addLeadNotes(leadId, notes),
		onSuccess: (data, variables) => {
			// Update the specific lead in cache
			queryClient.setQueryData(
				QueryKeys.lead(variables.leadId),
				(old: ApiResponse<Lead> | undefined) =>
					old ? { ...old, data: data.data } : data
			);

			console.log("Lead notes added successfully!");
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to add lead notes:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useDeleteLead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (leadId: string) => LeadService.deleteLead(leadId),
		onSuccess: (_, leadId) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: QueryKeys.lead(leadId) });

			// Invalidate lists
			queryClient.invalidateQueries({ queryKey: QueryKeys.myLeads });
			queryClient.invalidateQueries({ queryKey: QueryKeys.myInquiries });

			console.log("Lead deleted successfully!");
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to delete lead:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};

export const useExportLeads = () => {
	return useMutation({
		mutationFn: (filters: {
			status?: string;
			propertyId?: string;
			startDate?: string;
			endDate?: string;
		}) => LeadService.exportLeads(filters),
		onSuccess: (blob) => {
			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `leads-export-${
				new Date().toISOString().split("T")[0]
			}.csv`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);

			console.log("Leads exported successfully!");
		},
		onError: (error: unknown) => {
			console.error(
				"Failed to export leads:",
				isHttpError(error) && error.response?.data?.message
					? error.response.data.message
					: "Unknown error"
			);
		},
	});
};
