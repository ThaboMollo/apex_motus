import type { Metadata } from "next";
import { PlannedPage } from "@/components/ui/PlannedPage";
import { PLANNED_ROUTES } from "@/content/site";

const route = PLANNED_ROUTES.work;

// Holding page: real content lands in a later phase, so keep it out of the index.
export const metadata: Metadata = {
  title: route.title,
  description: route.summary,
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PlannedPage title={route.title} summary={route.summary} />;
}
