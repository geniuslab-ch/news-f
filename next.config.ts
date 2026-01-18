import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Mode Next.js normal - pas d'export statique
    images: {
        unoptimized: true,
    },
};

export default nextConfig;