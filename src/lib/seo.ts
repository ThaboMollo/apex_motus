import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "./site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = canonicalPath === "/" ? SITE_URL : `${SITE_URL}${canonicalPath}`;
  const ogImageUrl = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    keywords,
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          alt: "Apex Motus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

