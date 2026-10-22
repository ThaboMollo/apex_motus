import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/*
 * Only routes with real content belong here. Every other route is still a
 * PlannedPage holding page, so each one sets `robots: { index: false }`
 * itself — list a route here as soon as it carries its own content.
 */
/* Bump when the homepage content changes. A literal keeps the route static —
 * `new Date()` is dynamic IO under `cacheComponents` and would make it
 * server-rendered on every request. */
const LAST_MODIFIED = new Date("2026-10-22");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
