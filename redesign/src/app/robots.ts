import type { MetadataRoute } from "next";

// Review build: disallow everything until the client approves a production release.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
