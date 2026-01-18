import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Pas d'export statique - on laisse Next.js en mode normal
    images: {
        unoptimized: true,
    },
};

export default nextConfig;