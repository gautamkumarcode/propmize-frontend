"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "../validation/propertySchema";

interface StepProps {
	form: UseFormReturn<PropertyFormData>;
}

export default function MediaStep({ form }: StepProps) {
	// Local state for selected video files
	const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
	const [videoDragActive, setVideoDragActive] = useState(false);
	const videoInputRef = useRef<HTMLInputElement>(null);
	// Local state for selected image files
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Always sync local state with form state
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		const newImages = [...selectedImages, ...files];
		setSelectedImages(newImages);
		form.setValue("images", newImages);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragActive(false);
		const files = Array.from(event.dataTransfer.files).filter((f) =>
			f.type.startsWith("image/")
		);
		const newImages = [...selectedImages, ...files];
		setSelectedImages(newImages);
		form.setValue("images", newImages);
	};

	const handleRemoveImage = (index: number) => {
		const newImages = selectedImages.filter((_, i) => i !== index);
		setSelectedImages(newImages);
		form.setValue("images", newImages);
	};

	const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		const newVideos = [...selectedVideos, ...files];
		setSelectedVideos(newVideos);
		form.setValue("videos", newVideos);
	};

	const handleRemoveVideo = (index: number) => {
		const newVideos = selectedVideos.filter((_, i) => i !== index);
		setSelectedVideos(newVideos);
		form.setValue("videos", newVideos);
	};

	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="images"
				render={() => (
					<FormItem>
						<FormLabel>Images</FormLabel>
						<FormControl>
							<div
								className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
									dragActive
										? "border-primary bg-primary/10"
										: "border-muted bg-background"
								}`}
								onDrop={handleDrop}
								onDragOver={(e) => {
									e.preventDefault();
									setDragActive(true);
								}}
								onDragLeave={() => setDragActive(false)}
								style={{ cursor: "pointer" }}
								onClick={() => inputRef.current && inputRef.current.click()}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-muted-foreground mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l4-4a2 2 0 012.828 0l2.828 2.828a2 2 0 002.828 0L20 8m-4 4v4m0 0h-4m4 0h4"
									/>
								</svg>
								<span className="text-sm text-muted-foreground mb-2">
									Drag & drop images here, or click to select
								</span>
								<input
									ref={inputRef}
									type="file"
									accept="image/*"
									multiple
									className="absolute inset-0 opacity-0 cursor-pointer"
									style={{ zIndex: 2, pointerEvents: "none" }}
									onChange={handleImageChange}
									tabIndex={-1}
								/>
							</div>
						</FormControl>
						<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{selectedImages.map((file, index) => (
								<div key={file.name + index} className="relative group">
									<img
										src={URL.createObjectURL(file)}
										alt={file.name}
										className="h-32 w-full object-cover rounded-lg border shadow-sm"
									/>
									<button
										type="button"
										className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
										onClick={() => handleRemoveImage(index)}
										title="Remove">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
									<span className="absolute bottom-2 left-2 bg-black/60 text-xs text-white px-2 py-1 rounded">
										{file.name}
									</span>
								</div>
							))}
						</div>
						<div className="text-xs text-muted-foreground mt-2">
							You can upload up to 10 images. Supported formats: JPG, PNG, WEBP.
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="videos"
				render={() => (
					<FormItem>
						<FormLabel>Videos</FormLabel>
						<FormControl>
							<div
								className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
									videoDragActive
										? "border-primary bg-primary/10"
										: "border-muted bg-background"
								}`}
								onDrop={(e) => {
									e.preventDefault();
									setVideoDragActive(false);
									const files = Array.from(e.dataTransfer.files).filter((f) =>
										f.type.startsWith("video/")
									);
									const newVideos = [...selectedVideos, ...files];
									setSelectedVideos(newVideos);
									form.setValue("videos", newVideos);
								}}
								onDragOver={(e) => {
									e.preventDefault();
									setVideoDragActive(true);
								}}
								onDragLeave={() => setVideoDragActive(false)}
								style={{ cursor: "pointer" }}
								onClick={() =>
									videoInputRef.current && videoInputRef.current.click()
								}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-muted-foreground mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0h-4m4 0h4"
									/>
								</svg>
								<span className="text-sm text-muted-foreground mb-2">
									Drag & drop videos here, or click to select
								</span>
								<input
									ref={videoInputRef}
									type="file"
									accept="video/*"
									multiple
									className="absolute inset-0 opacity-0 cursor-pointer"
									style={{ zIndex: 2, pointerEvents: "none" }}
									onChange={handleVideoChange}
									tabIndex={-1}
								/>
							</div>
						</FormControl>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							{selectedVideos.map((file, index) => (
								<div key={file.name + index} className="relative group">
									<video
										src={URL.createObjectURL(file)}
										controls
										className="h-32 w-full object-cover rounded-lg border shadow-sm"
									/>
									<button
										type="button"
										className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
										onClick={() => handleRemoveVideo(index)}
										title="Remove">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
									<span className="absolute bottom-2 left-2 bg-black/60 text-xs text-white px-2 py-1 rounded">
										{file.name}
									</span>
								</div>
							))}
						</div>
						<div className="text-xs text-muted-foreground mt-2">
							You can upload up to 5 videos. Supported formats: MP4, WEBM, MOV.
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
