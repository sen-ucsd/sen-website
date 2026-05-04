import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 308-redirect every www.senatucsd.org URL to the apex senatucsd.org so
      // we have a single canonical domain. This matters for OAuth (so we don't
      // need to register both variants in Google Cloud Console), share-link
      // canonicalization, and SEO. App-level redirect works on any Vercel plan.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.senatucsd.org" }],
        destination: "https://senatucsd.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
