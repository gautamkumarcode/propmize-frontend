"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Calendar, // For follow-up dates
	MessageSquare, // For messages/follow-ups
	Phone, // For contact info
	User, // For buyer info
} from "lucide-react";
import { useParams } from "next/navigation";
import { useLead } from "@/lib/react-query/hooks/useLeads";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { useAddFollowUp, useConvertLead, useUpdateLeadStatus } from "@/lib/react-query/hooks/useLeads";
import { toast } from "@/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default function SellerLeadDetails() {
	const params = useParams();
	const rawLeadId = params.id as string;
	const leadId = isValidObjectId(rawLeadId) ? rawLeadId : undefined;

	const { data: lead, isLoading, isError } = useLead(leadId || ""); // Pass empty string if leadId is undefined, let 'enabled' handle it.

	const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = React.useState(false);
	const [isAddFollowUpModalOpen, setIsAddFollowUpModalOpen] = React.useState(false);
	const [isConvertLeadModalOpen, setIsConvertLeadModalOpen] = React.useState(false);

	const updateLeadStatusMutation = useUpdateLeadStatus();
	const addFollowUpMutation = useAddFollowUp();
	const convertLeadMutation = useConvertLead();

	const isHttpError = (error: unknown): error is { response: { data: { message: string } } } => {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as any).response?.data?.message === "string"
		);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "new":
				return "bg-blue-100 text-blue-800";
			case "contacted":
				return "bg-yellow-100 text-yellow-800";
			case "qualified":
				return "bg-green-100 text-green-800";
			case "converted":
				return "bg-purple-100 text-purple-800";
			case "rejected":
			case "lost":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "low":
				return "bg-green-100 text-green-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "high":
			case "urgent":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleUpdateStatus = async (newStatus: string, notes: string) => {
		await updateLeadStatusMutation.mutateAsync(
			{ leadId: leadId!, status: newStatus as any, notes },
			{
				onSuccess: () => {
					toast({ title: "Lead Status Updated", description: "The lead status has been updated successfully." });
					setIsUpdateStatusModalOpen(false);
				},
				onError: (error: unknown) => {
					toast({ title: "Error", description: `Failed to update status: ${isHttpError(error) ? error.response.data.message : "Unknown error"}`, variant: "destructive" });
				},
			}
		);
	};

	const handleAddFollowUp = async (
		date: Date,
		method: "phone" | "email" | "whatsapp" | "meeting",
		status: "scheduled" | "completed" | "missed",
		notes: string,
		nextFollowUp?: Date
	) => {
		await addFollowUpMutation.mutateAsync(
			{ leadId: leadId!, date, method, status, notes, nextFollowUp },
			{
				onSuccess: () => {
					toast({ title: "Follow-up Added", description: "A new follow-up has been added to the lead." });
					setIsAddFollowUpModalOpen(false);
				},
				onError: (error: unknown) => {
					toast({ title: "Error", description: `Failed to add follow-up: ${isHttpError(error) ? error.response.data.message : "Unknown error"}`, variant: "destructive" });
				},
			}
		);
	};

	const handleConvertLead = async (dealAmount: number, commissionEarned?: number) => {
		await convertLeadMutation.mutateAsync(
			{ leadId: leadId!, dealAmount, commissionEarned },
			{
				onSuccess: () => {
					toast({ title: "Lead Converted", description: "The lead has been successfully converted." });
					setIsConvertLeadModalOpen(false);
				},
				onError: (error: unknown) => {
					toast({ title: "Error", description: `Failed to convert lead: ${isHttpError(error) ? error.response.data.message : "Unknown error"}`, variant: "destructive" });
				},
			}
		);
	};

	if (!leadId) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="p-8 text-center">
					<CardTitle className="text-red-600 mb-4">Invalid Lead ID</CardTitle>
					<CardContent>
						<p className="text-gray-700">The provided lead ID is not valid. Please check the URL.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="p-8 text-center">
					<CardTitle className="text-red-600 mb-4">Error Loading Lead</CardTitle>
					<CardContent>
						<p className="text-gray-700">Failed to load lead details. Please try again later.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!lead) {
		return (
			<div className="text-center p-8 text-gray-600">
				Lead not found.
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold mb-2">
						Lead Details for {lead.buyer?.name || "N/A"}
					</CardTitle>
					<p className="text-gray-600">
						Property: "
						<Link
							href={`/property/${lead.property?._id}`}
							className="font-medium hover:text-blue-600"
						>
							{lead.property?.title || "N/A"}
						</Link>"
					</p>
					<div className="flex flex-wrap gap-2 mt-2">
						<Badge
							className={`capitalize ${
								getStatusColor(lead.status || "new")
							}`}
						>
							{lead.status}
						</Badge>
						{lead.priority && (
							<Badge
								className={`capitalize ${
									getPriorityColor(lead.priority as string)
								}`}
							>
								Priority: {lead.priority}
							</Badge>
						)}
						{lead.source && (
							<Badge variant="secondary" className="capitalize">
								Source: {lead.source}
							</Badge>
						)}
						<Badge variant="secondary">
							Created: {format(new Date(lead.createdAt), "MMM d, yyyy")}
						</Badge>
					</div>
					{/* Action Buttons */}
					<div className="flex flex-wrap gap-3 mt-4">
						<Dialog open={isUpdateStatusModalOpen} onOpenChange={setIsUpdateStatusModalOpen}>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">Update Status</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Update Lead Status</DialogTitle>
								</DialogHeader>
								<UpdateStatusForm
									onSubmit={handleUpdateStatus}
									initialStatus={lead.status}
									isLoading={updateLeadStatusMutation.isPending}
								/>
							</DialogContent>
						</Dialog>

						<Dialog open={isAddFollowUpModalOpen} onOpenChange={setIsAddFollowUpModalOpen}>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">Add Follow-up</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Follow-up</DialogTitle>
								</DialogHeader>
								<AddFollowUpForm
									onSubmit={handleAddFollowUp}
									isLoading={addFollowUpMutation.isPending}
								/>
							</DialogContent>
						</Dialog>

						<Dialog open={isConvertLeadModalOpen} onOpenChange={setIsConvertLeadModalOpen}>
							<DialogTrigger asChild>
								<Button size="sm" disabled={lead.status === "converted"}>
									{lead.status === "converted" ? "Converted" : "Convert Lead"}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Convert Lead to Customer</DialogTitle>
								</DialogHeader>
								<ConvertLeadForm
									onSubmit={handleConvertLead}
									isLoading={convertLeadMutation.isPending}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Buyer Information */}
					<div>
						<h3 className="text-xl font-semibold mb-3 flex items-center">
							<User className="w-5 h-5 mr-2 text-blue-600" />
							Buyer Information
						</h3>
						<p>
							<strong>Name:</strong> {lead.buyer?.name || "N/A"}
						</p>
						<p>
							<strong>Email:</strong> {lead.buyer?.email || "N/A"}
						</p>
						<p>
							<strong>Phone:</strong> {lead.buyer?.phone || "N/A"}
						</p>
						{lead.message && (
							<p className="mt-4">
								<strong>Initial Message:</strong> {lead.message}
							</p>
						)}
						{lead.buyerContact && (
							<>
								{lead.buyerContact.preferredContactTime && (
									<p>
										<strong>Preferred Contact Time:</strong>{" "}
										{lead.buyerContact.preferredContactTime}
									</p>
								)}
								{lead.buyerContact.contactMethod && (
									<p>
										<strong>Contact Method:</strong> {lead.buyerContact.contactMethod}
									</p>
								)}
							</>
						)}
					</div>

					{/* Follow-up History */}
					<div>
						<h3 className="text-xl font-semibold mb-3 flex items-center">
							<MessageSquare className="w-5 h-5 mr-2 text-green-600" />
							Follow-up History
						</h3>
						{lead.followUps && lead.followUps.length > 0 ? (
							<div className="space-y-4">
								{lead.followUps.map((followUp, index) => (
									<Card key={index} className="p-4">
										<p className="text-sm text-gray-700">
											<strong>Date:</strong> {format(new Date(followUp.date), "MMM d, yyyy HH:mm")}
										</p>
										<p className="text-sm text-gray-700">
											<strong>Method:</strong> {followUp.method}
										</p>
										<p className="text-sm text-gray-700">
											<strong>Status:</strong> {followUp.status}
										</p>
										{followUp.notes && (
											<p className="text-sm text-gray-700">
												<strong>Notes:</strong> {followUp.notes}
											</p>
										)}
										{followUp.nextFollowUp && (
											<p className="text-sm text-gray-700">
												<strong>Next Follow-up:</strong>{" "}
												{format(
													new Date(followUp.nextFollowUp),
													"MMM d, yyyy HH:mm"
												)}
											</p>
										)}
									</Card>
								))}
							</div>
						) : (
							<p className="text-gray-500">No follow-up history.</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Modals for actions */}
			{/* Update Status Form */}
			{/* Add Follow-up Form */}
			{/* Convert Lead Form */}
		</div>
	);
}

interface UpdateStatusFormProps {
	onSubmit: (newStatus: string, notes: string) => void;
	initialStatus: string;
	isLoading: boolean;
}

const UpdateStatusForm: React.FC<UpdateStatusFormProps> = ({
	onSubmit, initialStatus, isLoading
}) => {
	const [status, setStatus] = React.useState(initialStatus);
	const [notes, setNotes] = React.useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(status, notes);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="status">New Status</Label>
				<Select value={status} onValueChange={(value: "new" | "contacted" | "qualified" | "converted" | "rejected") => setStatus(value)} disabled={isLoading}>
					<SelectTrigger>
						<SelectValue placeholder="Select new status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="new">New</SelectItem>
						<SelectItem value="contacted">Contacted</SelectItem>
						<SelectItem value="qualified">Qualified</SelectItem>
						<SelectItem value="converted">Converted</SelectItem>
						<SelectItem value="rejected">Rejected</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="notes">Notes (Optional)</Label>
				<Textarea
					id="notes"
					placeholder="Add any relevant notes..."
					value={notes}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
					disabled={isLoading}
				/>
			</div>
			<Button type="submit" disabled={isLoading}>
				{isLoading ? "Updating..." : "Update Status"}
			</Button>
		</form>
	);
};

interface AddFollowUpFormProps {
	onSubmit: (
		date: Date,
		method: "phone" | "email" | "whatsapp" | "meeting",
		status: "scheduled" | "completed" | "missed",
		notes: string,
		nextFollowUp?: Date
	) => void;
	isLoading: boolean;
}

const AddFollowUpForm: React.FC<AddFollowUpFormProps> = ({
	onSubmit, isLoading
}) => {
	const [date, setDate] = React.useState(new Date());
	const [method, setMethod] = React.useState<"phone" | "email" | "whatsapp" | "meeting">("phone");
	const [status, setStatus] = React.useState<"scheduled" | "completed" | "missed">("scheduled");
	const [notes, setNotes] = React.useState("");
	const [nextFollowUp, setNextFollowUp] = React.useState<Date | undefined>(undefined);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(date, method, status, notes, nextFollowUp);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="followUpDate">Date</Label>
				<Input
					id="followUpDate"
					type="datetime-local"
					value={format(date, "yyyy-MM-dd'T'HH:mm")}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(new Date(e.target.value))}
					disabled={isLoading}
				/>
			</div>
			<div>
				<Label htmlFor="method">Method</Label>
				<Select value={method} onValueChange={(value: "phone" | "email" | "whatsapp" | "meeting") => setMethod(value)} disabled={isLoading}>
					<SelectTrigger>
						<SelectValue placeholder="Select method" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="phone">Phone Call</SelectItem>
						<SelectItem value="email">Email</SelectItem>
						<SelectItem value="whatsapp">WhatsApp</SelectItem>
						<SelectItem value="meeting">Meeting</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="status">Status</Label>
				<Select value={status} onValueChange={(value: "scheduled" | "completed" | "missed") => setStatus(value)} disabled={isLoading}>
					<SelectTrigger>
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="scheduled">Scheduled</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="missed">Missed</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="followUpNotes">Notes (Optional)</Label>
				<Textarea
					id="followUpNotes"
					placeholder="Add notes for this follow-up..."
					value={notes}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
					disabled={isLoading}
				/>
			</div>
			<div>
				<Label htmlFor="nextFollowUpDate">Next Follow-up Date (Optional)</Label>
				<Input
					id="nextFollowUpDate"
					type="datetime-local"
					value={nextFollowUp ? format(nextFollowUp, "yyyy-MM-dd'T'HH:mm") : ""}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNextFollowUp(e.target.value ? new Date(e.target.value) : undefined)}
					disabled={isLoading}
				/>
			</div>
			<Button type="submit" disabled={isLoading}>
				{isLoading ? "Adding..." : "Add Follow-up"}
			</Button>
		</form>
	);
};

interface ConvertLeadFormProps {
	onSubmit: (dealAmount: number, commissionEarned?: number) => void;
	isLoading: boolean;
}

const ConvertLeadForm: React.FC<ConvertLeadFormProps> = ({
	onSubmit, isLoading
}) => {
	const [dealAmount, setDealAmount] = React.useState<number | "">("");
	const [commissionEarned, setCommissionEarned] = React.useState<number | "">("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (typeof dealAmount === "number") {
			onSubmit(dealAmount, typeof commissionEarned === "number" ? commissionEarned : undefined);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="dealAmount">Deal Amount</Label>
				<Input
					id="dealAmount"
					type="number"
					value={dealAmount}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDealAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
					disabled={isLoading}
					required
				/>
			</div>
			<div>
				<Label htmlFor="commissionEarned">Commission Earned (Optional)</Label>
				<Input
					id="commissionEarned"
					type="number"
					value={commissionEarned}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommissionEarned(e.target.value === "" ? "" : parseFloat(e.target.value))}
					disabled={isLoading}
				/>
			</div>
			<Button type="submit" disabled={isLoading}>
				{isLoading ? "Converting..." : "Convert Lead"}
			</Button>
		</form>
	);
};
