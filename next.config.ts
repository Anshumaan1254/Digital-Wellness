import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Video thumbnails are fetched by our server and served from this site,
    // so a visitor's browser contacts nothing on YouTube until they press play.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

export default nextConfig;
