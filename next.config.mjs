/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["localhost:3000", "192.168.29.130:3000", "192.168.29.130"],
  },
};

export default nextConfig;
