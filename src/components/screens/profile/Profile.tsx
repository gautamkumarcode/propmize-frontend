"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/lib/react-query/hooks/useAuth";
import { useAuthStore } from "@/store/app-store";
import { User } from "@/types";
import {
	Bell,
	Camera,
	Edit3,
	Eye,
	Heart,
	Loader2,
	Mail,
	MapPin,
	MessageSquare,
	Phone,
	Save,
	Shield,
	User as UserIcon, // Alias User to UserIcon to avoid naming conflict with interface User
	Verified,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const { user, isAuthenticated, userMode } = useAuthStore();
	const { data: profileData, isLoading, error } = useProfile();
	const updateProfileMutation = useUpdateProfile();

	const profile: User | undefined | null = profileData || user;
	// const Layout = userMode === "seller" ? SellerLayout : BuyerLayout;

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
		bio: "",
		avatar: undefined as string | File | undefined,
		preferences: {
			propertyTypes: [] as string[],
			priceRange: { min: 0, max: 10000000 },
			locations: [] as string[],
			notifications: { email: true, sms: true, push: true },
		},
	});

	useEffect(() => {
		if (profile) {
			setFormData({
				name: profile.name || "",
				email: profile.email || "",
				phone: profile.phone || "",
				bio: profile.bio || "",
				address: {
					street: profile.address?.street || "",
					city: profile.address?.city || "",
					state: profile.address?.state || "",
					zipCode: profile.address?.zipCode || "",
					country: profile.address?.country || "India",
				},
				avatar: profile.avatar || undefined,
				preferences: profile.preferences ? {
					propertyTypes: profile.preferences.propertyTypes || [],
					priceRange: profile.preferences.priceRange || { min: 0, max: 10000000 },
					locations: profile.preferences.locations || [],
					notifications: profile.preferences.notifications || { email: true, sms: true, push: true },
				} : {
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

	const handleSave = () => {
		const fd = new FormData();
		const changedData: Record<string, unknown> = {};

		const compareAndAdd = <K extends keyof User>(
			key: K,
			newValue: User[K] | undefined,
			oldValue: User[K] | undefined
		) => {
			if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
				changedData[key] = newValue;
			}
		};

		// Compare top-level fields
		compareAndAdd("name", formData.name, profile?.name);
		compareAndAdd("email", formData.email, profile?.email);
		compareAndAdd("phone", formData.phone, profile?.phone);
		compareAndAdd("bio", formData.bio, profile?.bio);

		// Compare address (send only changed fields as "address.fieldName")
		if (formData.address) {
			(["street", "city", "state", "zipCode", "country"] as const).forEach(
				(field) => {
					if (formData.address[field] !== profile?.address?.[field]) {
						changedData[`address.${field}`] = formData.address[field];
					}
				}
			);
		}

		// Compare preferences (send only changed fields as "preferences.fieldName")
		if (formData.preferences) {
			Object.keys(formData.preferences).forEach((key) => {
				if (
					JSON.stringify(formData.preferences[key as keyof typeof formData.preferences]) !==
					JSON.stringify(profile?.preferences?.[key as keyof typeof profile.preferences])
				) {
					changedData[`preferences.${key}`] =
						formData.preferences[key as keyof typeof formData.preferences];
				}
			});
		}

		// Avatar (file only)
		if (formData.avatar instanceof File) {
			fd.append("avatar", formData.avatar);
		} else if (formData.avatar !== profile?.avatar) {
			changedData.avatar = formData.avatar;
		}

		// Append changed fields to FormData
		Object.entries(changedData).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (typeof value === "object") {
					fd.append(key, JSON.stringify(value)); // stringify objects/arrays
				} else {
					fd.append(key, String(value));
				}
			}
		});
		if (fd.entries().next().done) {
			toast({
				title: "No changes detected",
				description: "You didn&apos;t modify anything.",
			});
			return;
		}

		updateProfileMutation.mutate(fd, {
			onSuccess: () => {
				setIsEditing(false);
				toast({
					title: "Profile updated successfully",
					description: "Your changes have been saved.",
				});
			},
			onError: (error: unknown) => {
				toast({
					title: "Update failed",
					description:
						error instanceof Error
							? error.message
							: "Failed to update profile",
					variant: "destructive",
				});
			},
		});
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-10">
				<div className="text-center p-8 bg-white rounded-xl shadow-lg">
					<Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Authentication Required
					</h2>
					<p className="text-gray-600 mb-6">
						Please login to view your profile
					</p>
					<Button>Sign In</Button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
					<p className="text-gray-600 text-lg">Loading your profile...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
				<div className="text-center p-8 bg-white rounded-xl shadow-lg">
					<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<X className="w-6 h-6 text-red-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Failed to load profile
					</h2>
					<p className="text-gray-600">Please try again later</p>
					<Button className="mt-4" variant="outline">
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-4 ">
			<div className="max-w-6xl mx-auto px-2 sm:px-2 lg:px-8">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
						<p className="text-gray-600 mt-2">
							Manage your account settings and preferences
						</p>
					</div>
					<div className="flex gap-3">
						{isEditing ? (
							<>
								<Button
									onClick={handleSave}
									disabled={updateProfileMutation.isPending}>
									{updateProfileMutation.isPending ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Save Changes
										</>
									)}
								</Button>
								<Button variant="outline" onClick={() => setIsEditing(false)}>
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
							</>
						) : (
							<Button onClick={() => setIsEditing(true)}>
								<Edit3 className="w-4 h-4 mr-2" />
								Edit Profile
							</Button>
						)}
					</div>
				</div>

				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="preferences">Preferences</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
					</TabsList>

					<TabsContent value="profile">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Profile Card */}
							<div className="lg:col-span-1">
								<Card className="overflow-hidden">
									<div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
									<CardContent className="pt-0">
										<div className="flex flex-col items-center -mt-16">
											<div className="relative">
												<Avatar className="w-24 h-24 border-4 border-white shadow-lg">
													{formData.avatar ? (
														<AvatarImage
															src={
																formData.avatar instanceof File
																	? URL.createObjectURL(formData.avatar as File)
																	: formData.avatar
															}
															alt="Profile"
															className="object-contain w-full h-full"
														/>
													) : profile?.avatar ? (
														<AvatarImage src={profile.avatar} alt="Profile" />
													) : null}
													<AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">
														<UserIcon className="w-8 h-8" />
													</AvatarFallback>
												</Avatar>
												{isEditing && (
													<Label
														htmlFor="avatar-upload"
														className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer border">
														<Camera className="w-4 h-4" />
														<input
															id="avatar-upload"
															type="file"
															accept="image/*"
															onChange={handleAvatarChange}
															className="hidden"
														/>
													</Label>
												)}
											</div>
											<div className="text-center mt-4">
												<h2 className="text-xl font-semibold">
													{profile?.name || "User"}
												</h2>
												<p className="text-gray-600 flex items-center justify-center mt-1">
													<MapPin className="w-4 h-4 mr-1" />
													{profile?.address?.city || "Location not set"}
												</p>
												{profile?.verified && (
													<Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
														<Verified className="w-3 h-3 mr-1" />
														Verified
													</Badge>
												)}
											</div>
										</div>

										<div className="mt-6 space-y-4">
											<div className="flex items-center p-3 bg-gray-50 rounded-lg">
												<Mail className="w-5 h-5 text-gray-500 mr-3" />
												<div>
													<p className="text-sm text-gray-600">Email</p>
													<p className="font-medium">
														{profile?.email || "Not provided"}
													</p>
												</div>
											</div>
											<div className="flex items-center p-3 bg-gray-50 rounded-lg">
												<Phone className="w-5 h-5 text-gray-500 mr-3" />
												<div>
													<p className="text-sm text-gray-600">Phone</p>
													<p className="font-medium">
														{profile?.phone || "Not provided"}
													</p>
												</div>
											</div>
											<div className="flex items-center p-3 bg-gray-50 rounded-lg">
												<UserIcon className="w-5 h-5 text-gray-500 mr-3" />
												<div>
													<p className="text-sm text-gray-600">Member since</p>
													<p className="font-medium">
														{new Date(
															profile?.createdAt || Date.now()
														).toLocaleDateString("en-US", {
															year: "numeric",
															month: "long",
														})}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Edit Form */}
							<div className="lg:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle>Personal Information</CardTitle>
										<CardDescription>
											Update your personal details and contact information
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="name">Full Name</Label>
												{isEditing ? (
													<Input
														id="name"
														value={formData.name}
														onChange={(e) =>
															setFormData({
																...formData,
																name: e.target.value,
															})
														}
													/>
												) : (
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.name || "Not provided"}
													</div>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="email">Email Address</Label>
												{isEditing ? (
													<Input
														id="email"
														type="email"
														value={formData.email}
														onChange={(e) =>
															setFormData({
																...formData,
																email: e.target.value,
															})
														}
													/>
												) : (
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.email || "Not provided"}
													</div>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone">Phone Number</Label>
												{isEditing ? (
													<Input
														id="phone"
														value={formData.phone}
														onChange={(e) =>
															setFormData({
																...formData,
																phone: e.target.value,
															})
														}
													/>
												) : (
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.phone || "Not provided"}
													</div>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="city">City</Label>
												{isEditing ? (
													<Input
														id="city"
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
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.address?.city || "Not provided"}
													</div>
												)}
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="bio">Bio</Label>
											{isEditing ? (
												<Textarea
													id="bio"
													placeholder="Tell us a little about yourself"
													value={formData.bio}
													onChange={(e) =>
														setFormData({ ...formData, bio: e.target.value })
													}
													rows={3}
												/>
											) : (
												<div className="p-3 bg-gray-50 rounded-md">
													{formData.bio || "No bio provided yet."}
												</div>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="street">Street Address</Label>
												{isEditing ? (
													<Input
														id="street"
														value={formData.address.street}
														onChange={(e) =>
															setFormData({
																...formData,
																address: {
																	...formData.address,
																	street: e.target.value,
																},
															})
														}
													/>
												) : (
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.address?.street || "Not provided"}
													</div>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="zipCode">ZIP Code</Label>
												{isEditing ? (
													<Input
														id="zipCode"
														value={formData.address.zipCode}
														onChange={(e) =>
															setFormData({
																...formData,
																address: {
																	...formData.address,
																	zipCode: e.target.value,
																},
															})
														}
													/>
												) : (
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.address?.zipCode || "Not provided"}
													</div>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="state">State</Label>
												{isEditing ? (
													<Input
														id="state"
														value={formData.address.state}
														onChange={(e) =>
															setFormData({
																...formData,
																address: {
																	...formData.address,
																	state: e.target.value,
																},
															})
														}
													/>
												) : (
													<div className="p-3 bg-gray-50 rounded-md">
														{profile?.address?.state || "Not provided"}
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="preferences">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card>
								<CardHeader>
									<CardTitle>Notification Preferences</CardTitle>
									<CardDescription>
										Choose how you want to be notified
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="email-notifications">
												Email Notifications
											</Label>
											<p className="text-sm text-gray-500">
												Receive updates via email
											</p>
										</div>
										<Switch
											id="email-notifications"
											checked={formData.preferences.notifications.email}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													preferences: {
														...formData.preferences,
														notifications: {
															...formData.preferences.notifications,
															email: checked,
														},
													},
												})
											}
											disabled={!isEditing}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="sms-notifications">
												SMS Notifications
											</Label>
											<p className="text-sm text-gray-500">
												Receive text message alerts
											</p>
										</div>
										<Switch
											id="sms-notifications"
											checked={formData.preferences.notifications.sms}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													preferences: {
														...formData.preferences,
														notifications: {
															...formData.preferences.notifications,
															sms: checked,
														},
													},
												})
											}
											disabled={!isEditing}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="push-notifications">
												Push Notifications
											</Label>
											<p className="text-sm text-gray-500">
												Receive browser/app notifications
											</p>
										</div>
										<Switch
											id="push-notifications"
											checked={formData.preferences.notifications.push}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													preferences: {
														...formData.preferences,
														notifications: {
															...formData.preferences.notifications,
															push: checked,
														},
													},
												})
											}
											disabled={!isEditing}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Property Preferences</CardTitle>
									<CardDescription>
										Set your property search preferences
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="property-types">
											Preferred Property Types
										</Label>
										{isEditing ? (
											<Input
												id="property-types"
												placeholder="apartment, house, villa..."
												value={formData.preferences.propertyTypes.join(", ")}
												onChange={(e) =>
													setFormData({
														...formData,
														preferences: {
															...formData.preferences,
															propertyTypes: e.target.value
																.split(",")
																.map((s) => s.trim()),
														},
													})
												}
											/>
										) : (
											<div className="p-3 bg-gray-50 rounded-md">
												{formData.preferences.propertyTypes.join(", ") ||
													"Not set"}
											</div>
										)}
									</div>

									<div className="space-y-2">
										<Label>Price Range</Label>
										{isEditing ? (
											<div className="flex space-x-2">
												<Input
													type="number"
													placeholder="Min"
													value={formData.preferences.priceRange.min}
													onChange={(e) =>
														setFormData({
															...formData,
															preferences: {
																...formData.preferences,
																priceRange: {
																	...formData.preferences.priceRange,
																	min: Number(e.target.value),
																},
															},
														})
													}
												/>
												<Input
													type="number"
													placeholder="Max"
													value={formData.preferences.priceRange.max}
													onChange={(e) =>
														setFormData({
															...formData,
															preferences: {
																...formData.preferences,
																priceRange: {
																	...formData.preferences.priceRange,
																	max: Number(e.target.value),
																},
															},
														})
													}
												/>
											</div>
										) : (
											<div className="p-3 bg-gray-50 rounded-md">
												{formData.preferences.priceRange.min.toLocaleString()} -{" "}
												{formData.preferences.priceRange.max.toLocaleString()}
											</div>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="locations">Preferred Locations</Label>
										{isEditing ? (
											<Input
												id="locations"
												placeholder="city1, city2, ..."
												value={formData.preferences.locations.join(", ")}
												onChange={(e) =>
													setFormData({
														...formData,
														preferences: {
															...formData.preferences,
															locations: e.target.value
																.split(",")
																.map((s) => s.trim()),
														},
													})
												}
											/>
										) : (
											<div className="p-3 bg-gray-50 rounded-md">
												{formData.preferences.locations.join(", ") || "Not set"}
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="activity">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
								<CardContent className="p-6">
									<div className="flex items-center">
										<div className="rounded-lg bg-blue-100 p-3 mr-4">
											<Heart className="w-6 h-6 text-blue-600" />
										</div>
										<div>
											<p className="text-2xl font-bold text-gray-900">
												{profile?.savedProperties?.length || 0}
											</p>
											<p className="text-sm text-gray-600">Saved Properties</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
								<CardContent className="p-6">
									<div className="flex items-center">
										<div className="rounded-lg bg-green-100 p-3 mr-4">
											<Eye className="w-6 h-6 text-green-600" />
										</div>
										<div>
											<p className="text-2xl font-bold text-gray-900">
												{profile?.viewedProperties?.length || 0}
											</p>
											<p className="text-sm text-gray-600">Properties Viewed</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
								<CardContent className="p-6">
									<div className="flex items-center">
										<div className="rounded-lg bg-purple-100 p-3 mr-4">
											<MessageSquare className="w-6 h-6 text-purple-600" />
										</div>
										<div>
											<p className="text-2xl font-bold text-gray-900">
												{profile?.contactedOwners?.length || 0}
											</p>
											<p className="text-sm text-gray-600">Owners Contacted</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
								<CardContent className="p-6">
									<div className="flex items-center">
										<div className="rounded-lg bg-amber-100 p-3 mr-4">
											<Bell className="w-6 h-6 text-amber-600" />
										</div>
										<div>
											<p className="text-2xl font-bold text-gray-900">
												{profile?.notifications?.length || 0}
											</p>
											<p className="text-sm text-gray-600">Notifications</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
								<CardDescription>
									Your recent actions on the platform
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[1, 2, 3].map((item) => (
										<div
											key={item}
											className="flex items-start p-4 border rounded-lg">
											<div className="rounded-full bg-blue-100 p-2 mr-4">
												<Eye className="w-4 h-4 text-blue-600" />
											</div>
											<div className="flex-1">
												<p className="font-medium">Viewed a property</p>
												<p className="text-sm text-gray-600">
													3 bedroom apartment in Downtown
												</p>
												<p className="text-xs text-gray-500 mt-1">
													2 hours ago
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}