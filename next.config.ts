import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: [
			"propmize-backend.onrender.com",
			"localhost",
			"localhost:5001",
			"res.cloudinary.com",
			"lh3.googleusercontent.com",
			// add other domains if needed
		],
	},

	/* config options here */
};

export default nextConfig;
