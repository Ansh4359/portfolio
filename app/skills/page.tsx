"use client";

import dynamic from "next/dynamic";

const SkillsPage = dynamic(
  () => import("@/app/components/architect/pages/SkillsPage"),
  { ssr: false }
);

export default function Page() {
  return <SkillsPage />;
}
