import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routePriorities: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.85 },
  { path: "/portfolio", priority: 0.85 },
  { path: "/contact", priority: 0.8 },
  { path: "/subsidiary-tseboiq", priority: 0.7 },
  { path: "/privacy", priority: 0.4 },
  { path: "/terms", priority: 0.4 },
];

const SITE_LAST_MODIFIED = new Date("2025-04-01");

export default function sitemap(): MetadataRoute.Sitemap {
  return routePriorities.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}

