"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Clock,
	HelpCircle,
	Mail,
	MessageCircle,
	Phone,
	Search,
	Send,
	ThumbsUp,
	Video,
} from "lucide-react";
import { useState } from "react";

export default function SellerSupport() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [supportTickets] = useState([
		{
			id: "#12345",
			title: "Issue with property listing",
			status: "Open",
			priority: "High",
			date: "2024-01-15",
			category: "Technical",
		},
		{
			id: "#12344",
			title: "Payment not reflected",
			status: "In Progress",
			priority: "Medium",
			date: "2024-01-12",
			category: "Billing",
		},
		{
			id: "#12343",
			title: "How to upload property photos",
			status: "Resolved",
			priority: "Low",
			date: "2024-01-10",
			category: "General",
		},
	]);

	const categories = [
		{ id: "all", name: "All Categories", count: 45 },
		{ id: "technical", name: "Technical Issues", count: 15 },
		{ id: "billing", name: "Billing & Payments", count: 12 },
		{ id: "general", name: "General Queries", count: 18 },
	];

	const faqs = [
		{
			question: "How do I create a property listing?",
			answer:
				"Go to 'Add Property' in your dashboard, fill in all required details, upload photos, and submit for review.",
			category: "general",
			helpful: 24,
		},
		{
			question: "Why is my listing not showing up?",
			answer:
				"New listings take 24-48 hours for review and approval. Check your email for any required corrections.",
			category: "technical",
			helpful: 18,
		},
		{
			question: "How do I upgrade my plan?",
			answer:
				"Visit the 'Plans' section in your dashboard and select your preferred plan. Payment can be made online.",
			category: "billing",
			helpful: 32,
		},
		{
			question: "Can I edit my listing after publishing?",
			answer:
				"Yes, you can edit your listing anytime from your dashboard. Changes may require re-approval.",
			category: "general",
			helpful: 15,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "open":
				return "bg-red-100 text-red-800";
			case "in progress":
				return "bg-yellow-100 text-yellow-800";
			case "resolved":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const filteredFaqs = faqs.filter(
		(faq) =>
			(selectedCategory === "all" || faq.category === selectedCategory) &&
			(searchQuery === "" ||
				faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
				faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	return (
		<div className="min-h-screen bg-gray-50 py-6">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{/* Header */}
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
							<HelpCircle className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Support Center
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Get help with your questions and issues. We&apos;re here to
							support your selling journey
						</p>
					</div>

					{/* Quick Actions */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<MessageCircle className="w-6 h-6 text-blue-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Live Chat
							</h3>
							<p className="text-gray-600 mb-4">
								Get instant help from our support team
							</p>
							<Button className="w-full">Start Chat</Button>
						</Card>

						<Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Phone className="w-6 h-6 text-green-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Phone Support
							</h3>
							<p className="text-gray-600 mb-4">Call us at +91-9876543210</p>
							<Button variant="outline" className="w-full">
								Call Now
							</Button>
						</Card>

						<Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
							<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Mail className="w-6 h-6 text-purple-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Email Support
							</h3>
							<p className="text-gray-600 mb-4">
								Send us an email for detailed queries
							</p>
							<Button variant="outline" className="w-full">
								Send Email
							</Button>
						</Card>
					</div>

					{/* Support Tickets */}
					<Card className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								Your Support Tickets
							</h2>
							<Button>
								<Send className="w-4 h-4 mr-2" />
								Create Ticket
							</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 font-semibold">
											Ticket ID
										</th>
										<th className="text-left py-3 px-4 font-semibold">Title</th>
										<th className="text-left py-3 px-4 font-semibold">
											Status
										</th>
										<th className="text-left py-3 px-4 font-semibold">
											Priority
										</th>
										<th className="text-left py-3 px-4 font-semibold">Date</th>
									</tr>
								</thead>
								<tbody>
									{supportTickets.map((ticket) => (
										<tr key={ticket.id} className="border-b">
											<td className="py-3 px-4">
												<span className="font-medium text-blue-600">
													{ticket.id}
												</span>
											</td>
											<td className="py-3 px-4">
												<span className="font-medium">{ticket.title}</span>
											</td>
											<td className="py-3 px-4">
												<Badge className={getStatusColor(ticket.status)}>
													{ticket.status}
												</Badge>
											</td>
											<td className="py-3 px-4">
												<Badge className={getPriorityColor(ticket.priority)}>
													{ticket.priority}
												</Badge>
											</td>
											<td className="py-3 px-4 text-gray-600">{ticket.date}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>

					{/* FAQ Section */}
					<Card className="p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Frequently Asked Questions
						</h2>

						{/* Search and Filter */}
						<div className="flex flex-col md:flex-row gap-4 mb-6">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search FAQs..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<Button
										key={category.id}
										variant={
											selectedCategory === category.id ? "default" : "outline"
										}
										size="sm"
										onClick={() => setSelectedCategory(category.id)}>
										{category.name} ({category.count})
									</Button>
								))}
							</div>
						</div>

						{/* FAQ List */}
						<div className="space-y-4">
							{filteredFaqs.map((faq, index) => (
								<Card key={index} className="p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{faq.question}
											</h3>
											<p className="text-gray-700 mb-3">{faq.answer}</p>
											<div className="flex items-center justify-between">
												<Badge variant="outline" className="text-xs">
													{faq.category}
												</Badge>
												<div className="flex items-center text-sm text-gray-500">
													<ThumbsUp className="w-4 h-4 mr-1" />
													{faq.helpful} people found this helpful
												</div>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>

						{filteredFaqs.length === 0 && (
							<div className="text-center py-8">
								<HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									No FAQs found
								</h3>
								<p className="text-gray-600">
									Try adjusting your search or category filter
								</p>
							</div>
						)}
					</Card>

					{/* Contact Form */}
					<Card className="p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Still need help?
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<p className="text-gray-600 mb-6">
									Can&apos;t find the answer you&apos;re looking for? Send us a
									message and we&apos;ll get back to you as soon as possible.
								</p>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Subject
										</label>
										<Input placeholder="What can we help you with?" />
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Category
										</label>
										<select className="w-full border border-gray-300 rounded-md px-3 py-2">
											<option>Technical Issue</option>
											<option>Billing Question</option>
											<option>General Inquiry</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Message
										</label>
										<textarea
											rows={4}
											className="w-full border border-gray-300 rounded-md px-3 py-2"
											placeholder="Describe your issue or question..."></textarea>
									</div>
									<Button className="w-full">
										<Send className="w-4 h-4 mr-2" />
										Send Message
									</Button>
								</div>
							</div>
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Other ways to reach us
								</h3>
								<div className="space-y-4">
									<div className="flex items-center">
										<Clock className="w-5 h-5 text-gray-500 mr-3" />
										<div>
											<p className="font-medium">Response Time</p>
											<p className="text-sm text-gray-600">Within 24 hours</p>
										</div>
									</div>
									<div className="flex items-center">
										<Phone className="w-5 h-5 text-gray-500 mr-3" />
										<div>
											<p className="font-medium">Phone</p>
											<p className="text-sm text-gray-600">
												+91-9876543210 (9 AM - 6 PM)
											</p>
										</div>
									</div>
									<div className="flex items-center">
										<Mail className="w-5 h-5 text-gray-500 mr-3" />
										<div>
											<p className="font-medium">Email</p>
											<p className="text-sm text-gray-600">
												support@propmize.com
											</p>
										</div>
									</div>
									<div className="flex items-center">
										<Video className="w-5 h-5 text-gray-500 mr-3" />
										<div>
											<p className="font-medium">Video Call</p>
											<p className="text-sm text-gray-600">
												Available for premium users
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
