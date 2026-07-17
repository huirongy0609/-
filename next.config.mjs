/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      "/*": [
        "./config/foundation/**/*",
        "./foundation/**/*",
        "./knowledge/foundation/**/*",
      ],
    },
  },
};

export default nextConfig;
