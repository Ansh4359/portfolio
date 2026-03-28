"use client";

import dynamic from "next/dynamic";

const ArchitectShell = dynamic(
  () => import("@/app/components/Architect"),
  { ssr: false }
);

export default function ClientLayout({ children }) {
  return <ArchitectShell>{children}</ArchitectShell>;
}
