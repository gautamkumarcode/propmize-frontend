"use client";

import SellerLayout from "@/components/layout/SellerLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Building,
	Edit3,
	Eye,
	Mail,
	MapPin,
	Phone,
	Shield,
	Star,
	TrendingUp,
	User,
	Verified,
} from "lucide-react";
import { useState } from "react";

export default function SellerProfile() {
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState({
		name: "Suresh Sharma",
		email: "suresh.sharma@email.com",
		phone: "+91 98765 43210",
		location: "Bangalore, Karnataka",
		memberSince: "June 2023",
		verified: true,
		businessName: "Sharma Properties",
		reraLicense: "RERA/KA/AGENT/24/001234",
	});

	const stats = [
		{
			title: "Total Listings",
			value: "24",
			icon: Building,
			color: "text-blue-600",
		},
		{
			title: "Total Views",
			value: "8,456",
			icon: Eye,
			color: "text-green-600",
		},
		{
			title: "Avg Rating",
			value: "4.6",
			icon: Star,
			color: "text-yellow-600",
		},
		{
			title: "Response Rate",
			value: "95%",
			icon: TrendingUp,
			color: "text-purple-600",
		},
	];

	const handleSave = () => {
		setIsEditing(false);
		// Save logic here
	};

	return (
		<SellerLayout>
			<div className="min-h-screen bg-gray-50 py-6">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-6">
						{/* Header */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-start justify-between">
								<div className="flex items-center space-x-4">
									<div className="relative">
										<Avatar className="w-20 h-20">
											<div className="w-full h-full bg-blue-100 flex items-center justify-center">
												<User className="w-8 h-8 text-blue-600" />
											</div>
										</Avatar>
										{profile.verified && (
											<div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
												<Verified className="w-4 h-4 text-white" />
											</div>
										)}
									</div>
									<div>
										<h1 className="text-2xl font-bold text-gray-900">
											{profile.name}
										</h1>
										<p className="text-lg font-medium text-gray-700">
											{profile.businessName}
										</p>
										<p className="text-gray-600 flex items-center mt-1">
											<MapPin className="w-4 h-4 mr-1" />
											{profile.location}
										</p>
										<div className="flex items-center mt-2">
											<Badge variant="secondary" className="mr-2">
												RERA Verified
											</Badge>
											<p className="text-sm text-gray-500">
												Member since {profile.memberSince}
											</p>
										</div>
									</div>
								</div>
								<Button
									onClick={() => setIsEditing(!isEditing)}
									variant="outline">
									<Edit3 className="w-4 h-4 mr-2" />
									{isEditing ? "Cancel" : "Edit Profile"}
								</Button>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{stats.map((stat, index) => (
								<Card key={index} className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600">{stat.title}</p>
											<p className="text-2xl font-bold text-gray-900">
												{stat.value}
											</p>
										</div>
										<stat.icon className={`w-8 h-8 ${stat.color}`} />
									</div>
								</Card>
							))}
						</div>

						{/* Profile Details */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4">Profile Details</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name
									</label>
									{isEditing ? (
										<Input
											value={profile.name}
											onChange={(e) =>
												setProfile({ ...profile, name: e.target.value })
											}
										/>
									) : (
										<p className="text-gray-900 bg-gray-50 p-3 rounded-md">
											{profile.name}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Business Name
									</label>
									{isEditing ? (
										<Input
											value={profile.businessName}
											onChange={(e) =>
												setProfile({ ...profile, businessName: e.target.value })
											}
										/>
									) : (
										<p className="text-gray-900 bg-gray-50 p-3 rounded-md">
											{profile.businessName}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email
									</label>
									<div className="flex items-center space-x-2">
										<Mail className="w-5 h-5 text-gray-400" />
										{isEditing ? (
											<Input
												value={profile.email}
												onChange={(e) =>
													setProfile({ ...profile, email: e.target.value })
												}
											/>
										) : (
											<p className="text-gray-900">{profile.email}</p>
										)}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number
									</label>
									<div className="flex items-center space-x-2">
										<Phone className="w-5 h-5 text-gray-400" />
										{isEditing ? (
											<Input
												value={profile.phone}
												onChange={(e) =>
													setProfile({ ...profile, phone: e.target.value })
												}
											/>
										) : (
											<p className="text-gray-900">{profile.phone}</p>
										)}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Location
									</label>
									<div className="flex items-center space-x-2">
										<MapPin className="w-5 h-5 text-gray-400" />
										{isEditing ? (
											<Input
												value={profile.location}
												onChange={(e) =>
													setProfile({ ...profile, location: e.target.value })
												}
											/>
										) : (
											<p className="text-gray-900">{profile.location}</p>
										)}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										RERA License
									</label>
									<div className="flex items-center space-x-2">
										<Shield className="w-5 h-5 text-gray-400" />
										<p className="text-gray-900">{profile.reraLicense}</p>
									</div>
								</div>
							</div>
							{isEditing && (
								<div className="mt-6 flex space-x-3">
									<Button onClick={handleSave}>Save Changes</Button>
									<Button variant="outline" onClick={() => setIsEditing(false)}>
										Cancel
									</Button>
								</div>
							)}
						</Card>

						{/* Account Security */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4 flex items-center">
								<Shield className="w-5 h-5 mr-2" />
								Account Security & Verification
							</h2>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
									<div className="flex items-center">
										<Verified className="w-5 h-5 text-green-600 mr-3" />
										<div>
											<h3 className="font-medium text-gray-900">
												Phone Verified
											</h3>
											<p className="text-sm text-gray-600">
												Your phone number has been verified
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
									<div className="flex items-center">
										<Verified className="w-5 h-5 text-green-600 mr-3" />
										<div>
											<h3 className="font-medium text-gray-900">
												RERA Verified
											</h3>
											<p className="text-sm text-gray-600">
												Your RERA license has been verified
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
									<div className="flex items-center">
										<Verified className="w-5 h-5 text-green-600 mr-3" />
										<div>
											<h3 className="font-medium text-gray-900">
												Email Verified
											</h3>
											<p className="text-sm text-gray-600">
												Your email address has been verified
											</p>
										</div>
									</div>
								</div>
								<div className="pt-4">
									<Button variant="outline">Change Password</Button>
								</div>
							</div>
						</Card>

						{/* Recent Activity */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center">
										<Building className="w-5 h-5 text-blue-600 mr-3" />
										<div>
											<p className="font-medium text-gray-900">
												New property listing created
											</p>
											<p className="text-sm text-gray-600">
												3BHK Apartment in Koramangala
											</p>
										</div>
									</div>
									<span className="text-sm text-gray-500">2 hours ago</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center">
										<Eye className="w-5 h-5 text-green-600 mr-3" />
										<div>
											<p className="font-medium text-gray-900">
												Property received new inquiry
											</p>
											<p className="text-sm text-gray-600">
												2BHK Flat in Whitefield
											</p>
										</div>
									</div>
									<span className="text-sm text-gray-500">1 day ago</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center">
										<Star className="w-5 h-5 text-yellow-600 mr-3" />
										<div>
											<p className="font-medium text-gray-900">
												Received new review
											</p>
											<p className="text-sm text-gray-600">
												5-star rating from Rajesh Kumar
											</p>
										</div>
									</div>
									<span className="text-sm text-gray-500">3 days ago</span>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</SellerLayout>
	);
}
