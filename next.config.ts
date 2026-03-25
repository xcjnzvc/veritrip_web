/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "http", hostname: "googleusercontent.com" }, // 스시로 이미지 도메인 추가
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://mungs-day-api.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://mungs-day-api.onrender.com/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;
