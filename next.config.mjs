
import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  env: {
    NEXT_PUBLIC_JETIC_API_URL:
      process.env.NEXT_PUBLIC_JETIC_API_URL ??
      process.env.JETIC_API_URL ??
      "http://localhost:4000",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
