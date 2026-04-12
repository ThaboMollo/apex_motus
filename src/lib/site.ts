const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.apexmotus.co.za";

export const SITE_URL = configuredSiteUrl.endsWith("/")
  ? configuredSiteUrl.slice(0, -1)
  : configuredSiteUrl;

export const SITE_NAME = "Apex Motus";

export const SITE_DESCRIPTION =
  "Apex Motus helps businesses scale with practical tools, restructuring, and hands-on execution guidance.";

export const DEFAULT_OG_IMAGE_PATH = "/apex_motus_logo_no_bg.png";
