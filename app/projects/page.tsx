"use client";

import dynamic from "next/dynamic";

const ProjectsPage = dynamic(
  () => import("@/app/components/architect/pages/ProjectsPage"),
  { ssr: false }
);

export default function Page() {
  return <ProjectsPage />;
}
