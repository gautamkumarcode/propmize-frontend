"use client";

import BuyerLayout from "@/components/custom/layout/BuyerLayout";
import SellerLayout from "@/components/custom/layout/SellerLayout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/lib/react-query/hooks/useAuth";
import { useAuthStore } from "@/store/app-store";
import {
	Building2,
	Crown,
	Edit3,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Shield,
	TrendingUp,
	User,
	Verified,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const { user, isAuthenticated, userMode } = useAuthStore();
	const { data: profileData, isLoading, error } = useProfile();
	const updateProfileMutation = useUpdateProfile();

	// Use profile data from API or fallback to store data
	const profile = profileData || user;

	// Determine which layout to use based on current mode
	const Layout = userMode === "seller" ? SellerLayout : BuyerLayout;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "India",
		},
		avatar: undefined as string | File | undefined,
		preferences: {
			propertyTypes: [] as string[],
			priceRange: { min: 0, max: 10000000 },
			locations: [] as string[],
			notifications: { email: true, sms: true, push: true },
		},
	});

	// Update form data when profile loads
	useEffect(() => {
		if (profile) {
			setFormData({
				name: profile.name || "",
				email: profile.email || "",
				phone: profile.phone || "",
				address: {
					street: profile.address?.street || "",
					city: profile.address?.city || "",
					state: profile.address?.state || "",
					zipCode: profile.address?.zipCode || "",
					country: profile.address?.country || "India",
				},
				avatar: profile.avatar || undefined,
				preferences: (profile as any).preferences || {
					propertyTypes: [],
					priceRange: { min: 0, max: 10000000 },
					locations: [],
					notifications: { email: true, sms: true, push: true },
				},
			});
		}
	}, [profile]);

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFormData({ ...formData, avatar: e.target.files[0] });
		}
	};

	const handlePreferenceChange = (key: string, value: any) => {
		setFormData({
			...formData,
			preferences: {
				...formData.preferences,
				[key]: value,
			},
		});
	};

	const handleSave = () => {
		const updateData: any = { ...formData };
		// If avatar is a file, send as FormData
		if (typeof formData.avatar === "object" && formData.avatar !== null) {
			const fd = new FormData();
			Object.entries(updateData).forEach(([key, value]) => {
				if (key === "avatar" && value instanceof File) {
					fd.append("avatar", value);
				} else if (key === "address" || key === "preferences") {
					fd.append(key, JSON.stringify(value));
				} else if (value !== undefined) {
					fd.append(key, String(value));
				}
			});
			updateProfileMutation.mutate(fd, {
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
		} else {
			updateProfileMutation.mutate(updateData, {
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
		}
	};

	if (!isAuthenticated) {
		return (
			<Layout>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Please login to view your profile
						</h2>
					</div>
				</div>
			</Layout>
		);
	}

	if (isLoading) {
		return (
			<Layout>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
						<p className="text-gray-600">Loading profile...</p>
					</div>
				</div>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center text-red-600">
						<p className="text-lg font-semibold">Failed to load profile</p>
						<p className="text-sm">Please try again later</p>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
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
											{profile?.address?.city || "Location not provided"}
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

						{/* Mode-specific Stats */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4">
								{userMode === "seller" ? "Seller Dashboard" : "Buyer Activity"}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{userMode === "seller" ? (
									// Seller-specific stats
									<>
										<div className="text-center p-4 bg-blue-50 rounded-lg">
											<Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
											<div className="text-2xl font-bold text-gray-900">
												{(profile as any)?.properties?.length || 0}
											</div>
											<div className="text-sm text-gray-600">
												Properties Listed
											</div>
										</div>
										<div className="text-center p-4 bg-green-50 rounded-lg">
											<TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
											<div className="text-2xl font-bold text-gray-900">
												{(profile as any)?.totalViews || 0}
											</div>
											<div className="text-sm text-gray-600">
												Total Property Views
											</div>
										</div>
										<div className="text-center p-4 bg-purple-50 rounded-lg">
											<Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
											<div className="text-2xl font-bold text-gray-900">
												{(profile as any)?.plan || "Basic"}
											</div>
											<div className="text-sm text-gray-600">Current Plan</div>
										</div>
									</>
								) : (
									// Buyer-specific stats
									<>
										<div className="text-center p-4 bg-red-50 rounded-lg">
											<User className="w-8 h-8 text-red-600 mx-auto mb-2" />
											<div className="text-2xl font-bold text-gray-900">
												{(profile as any)?.savedProperties?.length || 0}
											</div>
											<div className="text-sm text-gray-600">
												Saved Properties
											</div>
										</div>
										<div className="text-center p-4 bg-blue-50 rounded-lg">
											<TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
											<div className="text-2xl font-bold text-gray-900">
												{(profile as any)?.viewedProperties?.length || 0}
											</div>
											<div className="text-sm text-gray-600">
												Properties Viewed
											</div>
										</div>
										<div className="text-center p-4 bg-green-50 rounded-lg">
											<Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
											<div className="text-2xl font-bold text-gray-900">
												{(profile as any)?.contactedOwners?.length || 0}
											</div>
											<div className="text-sm text-gray-600">
												Owners Contacted
											</div>
										</div>
									</>
								)}
							</div>
						</Card>

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
										City
									</label>
									<div className="flex items-center space-x-2">
										<MapPin className="w-5 h-5 text-gray-400" />
										{isEditing ? (
											<Input
												value={formData.address.city}
												onChange={(e) =>
													setFormData({
														...formData,
														address: {
															...formData.address,
															city: e.target.value,
														},
													})
												}
											/>
										) : (
											<p className="text-gray-900">
												{profile?.address?.city || "Not provided"}
											</p>
										)}
									</div>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Avatar
									</label>
									<div className="flex items-center space-x-4">
										<Avatar className="w-16 h-16">
											{formData.avatar &&
											typeof formData.avatar === "string" ? (
												<img
													src={formData.avatar}
													alt="Avatar"
													className="w-full h-full object-cover rounded-full"
												/>
											) : profile?.avatar ? (
												<img
													src={profile.avatar}
													alt="Avatar"
													className="w-full h-full object-cover rounded-full"
												/>
											) : (
												<User className="w-8 h-8 text-blue-600" />
											)}
										</Avatar>
										{isEditing && (
											<input
												type="file"
												accept="image/*"
												onChange={handleAvatarChange}
												className="block"
											/>
										)}
									</div>
								</div>
							</div>
							<hr className="my-6" />
							<h2 className="text-xl font-semibold mb-4">Preferences</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Property Types
									</label>
									{isEditing ? (
										<Input
											value={formData.preferences.propertyTypes.join(", ")}
											onChange={(e) =>
												handlePreferenceChange(
													"propertyTypes",
													e.target.value.split(",").map((s) => s.trim())
												)
											}
											placeholder="apartment, house, villa, plot, commercial, office"
										/>
									) : (
										<p className="text-gray-900">
											{formData.preferences.propertyTypes.join(", ") ||
												"Not set"}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Price Range
									</label>
									{isEditing ? (
										<div className="flex space-x-2">
											<Input
												type="number"
												value={formData.preferences.priceRange.min}
												onChange={(e) =>
													handlePreferenceChange("priceRange", {
														...formData.preferences.priceRange,
														min: Number(e.target.value),
													})
												}
												placeholder="Min"
											/>
											<Input
												type="number"
												value={formData.preferences.priceRange.max}
												onChange={(e) =>
													handlePreferenceChange("priceRange", {
														...formData.preferences.priceRange,
														max: Number(e.target.value),
													})
												}
												placeholder="Max"
											/>
										</div>
									) : (
										<p className="text-gray-900">
											{formData.preferences.priceRange.min} -{" "}
											{formData.preferences.priceRange.max}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Locations
									</label>
									{isEditing ? (
										<Input
											value={formData.preferences.locations.join(", ")}
											onChange={(e) =>
												handlePreferenceChange(
													"locations",
													e.target.value.split(",").map((s) => s.trim())
												)
											}
											placeholder="city1, city2, ..."
										/>
									) : (
										<p className="text-gray-900">
											{formData.preferences.locations.join(", ") || "Not set"}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Notifications
									</label>
									{isEditing ? (
										<div className="flex space-x-4">
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={formData.preferences.notifications.email}
													onChange={(e) =>
														handlePreferenceChange("notifications", {
															...formData.preferences.notifications,
															email: e.target.checked,
														})
													}
													className="mr-2"
												/>{" "}
												Email
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={formData.preferences.notifications.sms}
													onChange={(e) =>
														handlePreferenceChange("notifications", {
															...formData.preferences.notifications,
															sms: e.target.checked,
														})
													}
													className="mr-2"
												/>{" "}
												SMS
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={formData.preferences.notifications.push}
													onChange={(e) =>
														handlePreferenceChange("notifications", {
															...formData.preferences.notifications,
															push: e.target.checked,
														})
													}
													className="mr-2"
												/>{" "}
												Push
											</label>
										</div>
									) : (
										<p className="text-gray-900">
											{Object.entries(formData.preferences.notifications)
												.map(([k, v]) => (v ? k : null))
												.filter(Boolean)
												.join(", ") || "None"}
										</p>
									)}
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
		</Layout>
	);
}
