import type { MetadataRoute } from "next";

// TODO: replace with your real production domain (no trailing slash)
const siteUrl = "https://8xwork.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
