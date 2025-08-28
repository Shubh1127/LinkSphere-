/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://linksphere-blxe.onrender.com/:path*", // your backend
      },
    ];
  },
};

export default nextConfig;
