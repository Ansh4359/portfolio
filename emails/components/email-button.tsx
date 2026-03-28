import { Button } from "@react-email/components";
import * as React from "react";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: "#adc6ff",
        color: "#002e69",
        padding: "14px 28px",
        borderRadius: "10px",
        fontWeight: 700,
        fontSize: "14px",
        textDecoration: "none",
        display: "inline-block",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(173,198,255,0.25)",
      }}
    >
      {children}
    </Button>
  );
}
