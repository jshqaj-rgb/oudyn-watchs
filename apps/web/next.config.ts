import path from "node:path";
import type { NextConfig } from "next";

const devApiOrigin = process.env.DEV_API_ORIGIN ?? "http://127.0.0.1:4000";
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport,
  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
  poweredByHeader: false,
  transpilePackages: ["@oudyn/contracts", "@oudyn/catalog"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "**.aaaaaaaa.bid" },
    ],
  },
  ...(isStaticExport
    ? {}
    : {
        async rewrites() {
          return [
            {
              source: "/api/catalog/:path*",
              destination: `${devApiOrigin}/api/:path*`,
            },
          ];
        },
      }),
};

export default nextConfig;
