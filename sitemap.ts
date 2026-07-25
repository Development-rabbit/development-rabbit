import type { MetadataRoute } from "next";

// TODO: replace with your real production domain (no trailing slash)
const siteUrl = "https://8xwork.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Once you give each service its own route (see recommendation below),
    // list each page here too, e.g.:
    // {
    //   url: `${siteUrl}/services/ar-development`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];
}
