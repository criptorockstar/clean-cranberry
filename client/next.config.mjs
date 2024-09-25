/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "5001",
      },
      {
        protocol: "http",
        hostname: "api.cranberrymayorista.com",
      },
      {
        protocol: "https",
        hostname: "api.cranberrymayorista.com",
      },
    ],
  },
};

export default nextConfig;
