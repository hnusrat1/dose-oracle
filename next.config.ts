import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Set basePath if deploying to github.io/repo-name (not custom domain)
  // Remove or comment out basePath when using a custom domain
  basePath: process.env.GITHUB_PAGES ? '/dose-oracle' : '',
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
