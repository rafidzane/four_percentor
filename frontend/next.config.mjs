/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      // Proxy all /fourpercent/api/* requests to backend
      {
        source: "/fourpercent/api/:path*",
        destination: "http://localhost:8000/fourpercent/api/:path*",
      },
      // Proxy all /api/* requests to backend
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
