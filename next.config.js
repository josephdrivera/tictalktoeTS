/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, // Enable React Strict Mode
	async rewrites() {
		return [
			{
				source: '/socket.io/:path*',// Replace with your actual server URL
				destination: 'http://localhost:3001/socket.io/:path*', // Replace with your actual server URL
			},
		];
	},
};

export default nextConfig;