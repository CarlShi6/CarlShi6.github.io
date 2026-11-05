import type { NextConfig } from "next";
import { prepareProductionRoutes } from './scripts/prepare-production-routes.mjs';
import { productionExtension } from './scripts/production-policy.mjs';

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default function config(phase: string): NextConfig {
  const release = phase === 'phase-production-build' || process.env.PORTFOLIO_RELEASE === '1';
  if (release) {
    // Persist across Vinext's build and prerender config loads in this process.
    process.env.PORTFOLIO_RELEASE = '1';
    prepareProductionRoutes();
  }
  return { ...nextConfig, ...(release ? { pageExtensions: [productionExtension] } : {}) };
}
