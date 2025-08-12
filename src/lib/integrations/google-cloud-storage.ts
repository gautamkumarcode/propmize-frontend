// Google Cloud Storage Integration
interface GCSConfig {
	bucketName: string;
	projectId: string;
	keyFilename?: string; // Path to service account key file
	credentials?: {
		client_email: string;
		private_key: string;
	};
}

interface UploadOptions {
	destination?: string;
	metadata?: {
		contentType?: string;
		cacheControl?: string;
		metadata?: Record<string, string>;
	};
	public?: boolean;
}

interface UploadResult {
	success: boolean;
	publicUrl?: string;
	fileName?: string;
	error?: string;
}

// Note: This is a client-side interface. For production, file uploads should go through your API
export class GoogleCloudStorageService {
	private config: GCSConfig;

	constructor(config: GCSConfig) {
		this.config = config;
	}

	/**
	 * Upload file to Google Cloud Storage via API route
	 * This method sends file to your API endpoint which handles the actual GCS upload
	 */
	async uploadFile(
		file: File,
		folder: string = "properties",
		options: UploadOptions = {}
	): Promise<UploadResult> {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", folder);
			formData.append("bucketName", this.config.bucketName);

			if (options.destination) {
				formData.append("destination", options.destination);
			}

			if (options.metadata) {
				formData.append("metadata", JSON.stringify(options.metadata));
			}

			if (options.public !== undefined) {
				formData.append("public", options.public.toString());
			}

			const response = await fetch("/api/storage/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(error || "Upload failed");
			}

			const result = await response.json();
			return {
				success: true,
				publicUrl: result.publicUrl,
				fileName: result.fileName,
			};
		} catch (error) {
			console.error("GCS Upload Error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Upload failed",
			};
		}
	}

	/**
	 * Upload multiple files
	 */
	async uploadMultipleFiles(
		files: File[],
		folder: string = "properties",
		options: UploadOptions = {}
	): Promise<UploadResult[]> {
		const uploadPromises = files.map((file) =>
			this.uploadFile(file, folder, options)
		);

		return Promise.all(uploadPromises);
	}

	/**
	 * Delete file from Google Cloud Storage via API route
	 */
	async deleteFile(fileName: string, folder?: string): Promise<boolean> {
		try {
			const response = await fetch("/api/storage/delete", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fileName,
					folder,
					bucketName: this.config.bucketName,
				}),
			});

			return response.ok;
		} catch (error) {
			console.error("GCS Delete Error:", error);
			return false;
		}
	}

	/**
	 * Generate signed URL for private files
	 */
	async getSignedUrl(
		fileName: string,
		expirationMinutes: number = 60
	): Promise<string | null> {
		try {
			const response = await fetch("/api/storage/signed-url", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fileName,
					bucketName: this.config.bucketName,
					expirationMinutes,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate signed URL");
			}

			const result = await response.json();
			return result.signedUrl;
		} catch (error) {
			console.error("GCS Signed URL Error:", error);
			return null;
		}
	}

	/**
	 * Get public URL for a file
	 */
	getPublicUrl(fileName: string, folder?: string): string {
		const filePath = folder ? `${folder}/${fileName}` : fileName;
		return `https://storage.googleapis.com/${this.config.bucketName}/${filePath}`;
	}

	/**
	 * Validate file before upload
	 */
	validateFile(
		file: File,
		options: {
			maxSize?: number; // in bytes
			allowedTypes?: string[];
			maxWidth?: number; // for images
			maxHeight?: number; // for images
		} = {}
	): { valid: boolean; error?: string } {
		const {
			maxSize = 10 * 1024 * 1024, // 10MB default
			allowedTypes = [
				"image/jpeg",
				"image/png",
				"image/webp",
				"application/pdf",
			],
		} = options;

		// Check file size
		if (file.size > maxSize) {
			return {
				valid: false,
				error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
			};
		}

		// Check file type
		if (!allowedTypes.includes(file.type)) {
			return {
				valid: false,
				error: `File type ${file.type} is not allowed`,
			};
		}

		return { valid: true };
	}

	/**
	 * Optimize image before upload (client-side)
	 */
	async optimizeImage(
		file: File,
		options: {
			maxWidth?: number;
			maxHeight?: number;
			quality?: number;
			format?: "jpeg" | "webp";
		} = {}
	): Promise<File> {
		return new Promise((resolve, reject) => {
			const {
				maxWidth = 1920,
				maxHeight = 1080,
				quality = 0.8,
				format = "jpeg",
			} = options;

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const img = new Image();

			img.onload = () => {
				// Calculate new dimensions
				let { width, height } = img;

				if (width > maxWidth || height > maxHeight) {
					const ratio = Math.min(maxWidth / width, maxHeight / height);
					width = width * ratio;
					height = height * ratio;
				}

				canvas.width = width;
				canvas.height = height;

				// Draw and compress
				ctx?.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							const optimizedFile = new File([blob], file.name, {
								type: `image/${format}`,
								lastModified: Date.now(),
							});
							resolve(optimizedFile);
						} else {
							reject(new Error("Failed to optimize image"));
						}
					},
					`image/${format}`,
					quality
				);
			};

			img.onerror = () => reject(new Error("Failed to load image"));
			img.src = URL.createObjectURL(file);
		});
	}
}
