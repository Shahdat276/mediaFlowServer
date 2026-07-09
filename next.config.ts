import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable response compression
  compress: true,

  // Optimize package imports - tree shake unused exports
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "@base-ui/react"],
  },

  // Add security and caching headers (production only for static assets)
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      ...(isProd
        ? [
            {
              source: "/_next/static/:path*",
              headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
