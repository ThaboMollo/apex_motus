import type { Metadata } from "next";
import { PlannedPage } from "@/components/ui/PlannedPage";
import { PLANNED_ROUTES } from "@/content/site";

const route = PLANNED_ROUTES.solutions;

export const metadata: Metadata = { title: route.title, description: route.summary };

export default function Page() {
  return <PlannedPage title={route.title} summary={route.summary} />;
}
