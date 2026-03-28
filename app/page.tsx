"use client"

import dynamic from "next/dynamic";

const ArchitectPortfolio = dynamic(() => import("./components/Architect"), {
  ssr: false,
});

export default function Page() {
  return <ArchitectPortfolio />;
}