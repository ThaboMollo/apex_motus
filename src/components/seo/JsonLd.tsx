import { SITE } from "@/content/site";

/*
 * Organization + WebSite structured data, tying the brand, logo and enquiry
 * route to apexmotus.co.za so search engines attribute them to one entity.
 * Stable @id values let later schema (products, articles, breadcrumbs)
 * reference these nodes instead of repeating them.
 *
 * Only facts actually published on the site belong here — unverifiable
 * claims (founding date, headcount, ratings) would be invalid structured data.
 */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      slogan: SITE.tagline,
      email: SITE.enquiryEmail,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE.url}/#logo`,
        url: `${SITE.url}/brand/apex-motus-wordmark.png`,
        contentUrl: `${SITE.url}/brand/apex-motus-wordmark.png`,
        caption: SITE.name,
      },
      address: { "@type": "PostalAddress", addressCountry: "ZA" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.enquiryEmail,
        areaServed: "ZA",
        availableLanguage: ["en"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en-ZA",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

/*
 * `<` is escaped so a future content edit can never close this script tag
 * early. The payload is built from our own module, but the guard costs
 * nothing and keeps that true regardless of what lands in site.ts.
 */
const json = JSON.stringify(graph).replace(/</g, "\\u003c");

export function SiteJsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
