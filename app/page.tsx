"use client"

import dynamic from "next/dynamic";

const ArchitectPortfolio = dynamic(
  () => import("../app/components/Architect"),
  { ssr: false }
);

export default function Page() {
  return <ArchitectPortfolio />;
}