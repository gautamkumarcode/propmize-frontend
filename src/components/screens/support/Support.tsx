"use client";

import AppLayout from "@/components/custom/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	CheckCircle,
	ChevronDown,
	Clock,
	HelpCircle,
	Mail,
	MessageCircle,
	Phone,
	Search,
	Star,
} from "lucide-react";
import { useState } from "react";

export default function Support() {
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

	const supportOptions = [
		{
			title: "Live Chat",
			description: "Get instant help from our support team",
			icon: MessageCircle,
			availability: "Available 24/7",
			action: "Start Chat",
			color: "bg-green-100 text-green-600",
		},
		{
			title: "Phone Support",
			description: "Call our helpline for immediate assistance",
			icon: Phone,
			availability: "Mon-Fri 9AM-7PM",
			action: "Call Now",
			color: "bg-blue-100 text-blue-600",
		},
		{
			title: "Email Support",
			description: "Send us your queries via email",
			icon: Mail,
			availability: "Response in 2-4 hours",
			action: "Send Email",
			color: "bg-purple-100 text-purple-600",
		},
	];

	const faqs = [
		{
			question: "How do I search for properties on Propmize?",
			answer:
				"You can search for properties using our AI-powered search feature on the homepage. Simply enter your location preferences, budget range, and property type to get personalized recommendations.",
		},
		{
			question: "Is it safe to contact property owners through the platform?",
			answer:
				"Yes, all property owners are verified before listing. We provide secure communication channels and never share your personal information without your consent.",
		},
		{
			question: "What documents do I need for property verification?",
			answer:
				"You'll need property title deeds, approval documents, NOC certificates, and tax receipts. Our legal team can help you verify these documents.",
		},
		{
			question: "How does the home loan assistance work?",
			answer:
				"We partner with leading banks and NBFCs to provide competitive home loan options. Our financial advisors help you compare rates and choose the best loan product.",
		},
		{
			question: "Can I schedule property visits through the platform?",
			answer:
				"Yes, you can schedule property visits directly through our platform. Property owners will coordinate with you for convenient viewing times.",
		},
		{
			question: "What are the charges for using Propmize services?",
			answer:
				"Basic property search and contact is free for buyers. We charge a nominal fee only when you successfully purchase a property through our platform.",
		},
		{
			question: "How do I report a suspicious listing or fraud?",
			answer:
				"You can report suspicious listings using the 'Report' button on any property page. Our team investigates all reports within 24 hours.",
		},
		{
			question: "Can I get legal assistance for property purchase?",
			answer:
				"Yes, we provide legal assistance through our network of verified lawyers. This includes document verification, agreement drafting, and registration support.",
		},
	];

	const recentTickets = [
		{
			id: "#TK-001234",
			subject: "Property verification query",
			status: "Resolved",
			date: "2024-01-10",
			priority: "Medium",
		},
		{
			id: "#TK-001235",
			subject: "Home loan documentation help",
			status: "In Progress",
			date: "2024-01-12",
			priority: "High",
		},
	];

	const toggleFaq = (index: number) => {
		setExpandedFaq(expandedFaq === index ? null : index);
	};

	return (
		<AppLayout mode="buyer">
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-6">
						{/* Header */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="text-center">
								<h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
									<HelpCircle className="w-6 h-6 mr-3 text-orange-500" />
									Help & Support
								</h1>
								<p className="text-gray-600 mt-1">
									We're here to help you with your property journey
								</p>
							</div>
						</div>

						{/* Search Help */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="max-w-md mx-auto">
								<div className="relative">
									<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search help articles..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>
						</div>

						{/* Support Options */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{supportOptions.map((option, index) => (
								<Card
									key={index}
									className="p-6 text-center hover:shadow-lg transition-shadow">
									<div
										className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
										<option.icon className="w-8 h-8" />
									</div>
									<h3 className="text-lg font-semibold mb-2">{option.title}</h3>
									<p className="text-gray-600 mb-3">{option.description}</p>
									<div className="flex items-center justify-center text-sm text-gray-500 mb-4">
										<Clock className="w-4 h-4 mr-1" />
										{option.availability}
									</div>
									<Button className="w-full">{option.action}</Button>
								</Card>
							))}
						</div>

						{/* Recent Support Tickets */}
						{recentTickets.length > 0 && (
							<Card className="p-6">
								<h2 className="text-xl font-semibold mb-4">
									Recent Support Tickets
								</h2>
								<div className="space-y-3">
									{recentTickets.map((ticket) => (
										<div
											key={ticket.id}
											className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div className="flex-1">
												<div className="flex items-center space-x-3">
													<span className="font-medium text-blue-600">
														{ticket.id}
													</span>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															ticket.status === "Resolved"
																? "bg-green-100 text-green-800"
																: "bg-yellow-100 text-yellow-800"
														}`}>
														{ticket.status}
													</span>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															ticket.priority === "High"
																? "bg-red-100 text-red-800"
																: "bg-blue-100 text-blue-800"
														}`}>
														{ticket.priority}
													</span>
												</div>
												<p className="text-gray-900 mt-1">{ticket.subject}</p>
												<p className="text-sm text-gray-500">{ticket.date}</p>
											</div>
											<Button size="sm" variant="outline">
												View Details
											</Button>
										</div>
									))}
								</div>
							</Card>
						)}

						{/* FAQ Section */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-6">
								Frequently Asked Questions
							</h2>
							<div className="space-y-4">
								{faqs.map((faq, index) => (
									<div key={index} className="border-b border-gray-200 pb-4">
										<button
											onClick={() => toggleFaq(index)}
											className="flex items-center justify-between w-full text-left">
											<h3 className="font-medium text-gray-900 pr-4">
												{faq.question}
											</h3>
											<ChevronDown
												className={`w-5 h-5 text-gray-500 transform transition-transform ${
													expandedFaq === index ? "rotate-180" : ""
												}`}
											/>
										</button>
										{expandedFaq === index && (
											<div className="mt-3 text-gray-600">{faq.answer}</div>
										)}
									</div>
								))}
							</div>
						</Card>

						{/* Contact Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Card className="p-6">
								<h3 className="text-lg font-semibold mb-4">
									Contact Information
								</h3>
								<div className="space-y-3">
									<div className="flex items-center">
										<Phone className="w-5 h-5 text-blue-600 mr-3" />
										<div>
											<p className="font-medium">Phone Support</p>
											<p className="text-gray-600">+91 1800-XXX-XXXX</p>
										</div>
									</div>
									<div className="flex items-center">
										<Mail className="w-5 h-5 text-green-600 mr-3" />
										<div>
											<p className="font-medium">Email Support</p>
											<p className="text-gray-600">support@propmize.com</p>
										</div>
									</div>
									<div className="flex items-center">
										<MessageCircle className="w-5 h-5 text-purple-600 mr-3" />
										<div>
											<p className="font-medium">Live Chat</p>
											<p className="text-gray-600">Available 24/7</p>
										</div>
									</div>
								</div>
							</Card>

							<Card className="p-6">
								<h3 className="text-lg font-semibold mb-4">
									Customer Satisfaction
								</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-gray-600">Average Response Time</span>
										<span className="font-semibold">&lt; 2 hours</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-gray-600">Customer Rating</span>
										<div className="flex items-center">
											<Star className="w-4 h-4 text-yellow-500 mr-1" />
											<span className="font-semibold">4.8/5</span>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-gray-600">Resolution Rate</span>
										<div className="flex items-center">
											<CheckCircle className="w-4 h-4 text-green-500 mr-1" />
											<span className="font-semibold">98%</span>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
