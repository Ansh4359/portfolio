"use client";

import dynamic from "next/dynamic";

const ContactPage = dynamic(
  () => import("@/app/components/architect/pages/ContactPage"),
  { ssr: false }
);

export default function Page() {
  return <ContactPage />;
}
