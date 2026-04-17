import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "variety.com" },
      { protocol: "https", hostname: "st1.techlusive.in" },
      { protocol: "https", hostname: "dl.dir.freefiremobile.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
    qualities: [50, 75],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-avatar", "@radix-ui/react-dropdown-menu"],
  },
};

export default nextConfig;
