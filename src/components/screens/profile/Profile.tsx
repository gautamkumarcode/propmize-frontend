"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/lib/react-query/hooks/useAuth";
import { useAuthStore } from "@/store/app-store";
import {
	Edit3,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Shield,
	User,
	Verified,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const { user, isAuthenticated } = useAuthStore();
	const { data: profileData, isLoading, error } = useProfile();
	const updateProfileMutation = useUpdateProfile();

	// Use profile data from API or fallback to store data
	const profile = profileData || user;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		location: "",
	});

	// Update form data when profile loads
	useEffect(() => {
		if (profile) {
			setFormData({
				name: profile.name || "",
				email: profile.email || "",
				phone: profile.phone || "",
				location: profile.location || "",
			});
		}
	}, [profile]);

	const handleSave = () => {
		updateProfileMutation.mutate(formData, {
			onSuccess: () => {
				setIsEditing(false);
				toast({
					title: "Profile updated",
					description: "Your profile has been updated successfully.",
				});
			},
			onError: (error: any) => {
				toast({
					title: "Update failed",
					description:
						error.response?.data?.message || "Failed to update profile",
					variant: "destructive",
				});
			},
		});
	};

	if (!isAuthenticated) {
		return (
			<BuyerLayout>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Please login to view your profile
						</h2>
					</div>
				</div>
			</BuyerLayout>
		);
	}

	if (isLoading) {
		return (
			<BuyerLayout>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
						<p className="text-gray-600">Loading profile...</p>
					</div>
				</div>
			</BuyerLayout>
		);
	}

	if (error) {
		return (
			<BuyerLayout>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center text-red-600">
						<p className="text-lg font-semibold">Failed to load profile</p>
						<p className="text-sm">Please try again later</p>
					</div>
				</div>
			</BuyerLayout>
		);
	}

	return (
		<BuyerLayout>
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
										{profile?.verified && (
											<div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
												<Verified className="w-4 h-4 text-white" />
											</div>
										)}
									</div>
									<div>
										<h1 className="text-2xl font-bold text-gray-900">
											{profile?.name || "User"}
										</h1>
										<p className="text-gray-600 flex items-center mt-1">
											<MapPin className="w-4 h-4 mr-1" />
											{profile?.location || "Location not provided"}
										</p>
										<p className="text-sm text-gray-500 mt-1">
											Member since{" "}
											{new Date(
												profile?.createdAt || Date.now()
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
											})}
										</p>
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
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
										/>
									) : (
										<p className="text-gray-900 bg-gray-50 p-3 rounded-md">
											{profile?.name || "Not provided"}
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
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
											/>
										) : (
											<p className="text-gray-900">
												{profile?.email || "Not provided"}
											</p>
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
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
											/>
										) : (
											<p className="text-gray-900">
												{profile?.phone || "Not provided"}
											</p>
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
												value={formData.location}
												onChange={(e) =>
													setFormData({ ...formData, location: e.target.value })
												}
											/>
										) : (
											<p className="text-gray-900">
												{profile?.location || "Not provided"}
											</p>
										)}
									</div>
								</div>
							</div>
							{isEditing && (
								<div className="mt-6 flex space-x-3">
									<Button
										onClick={handleSave}
										disabled={updateProfileMutation.isPending}>
										{updateProfileMutation.isPending ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Saving...
											</>
										) : (
											"Save Changes"
										)}
									</Button>
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
								Account Security
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
					</div>
				</div>
			</div>
		</BuyerLayout>
	);
}
