"use client";

import dynamic from "next/dynamic";

const HomePage = dynamic(
  () => import("@/app/components/architect/pages/HomePage"),
  { ssr: false }
);

export default function Page() {
  return <HomePage />;
}
