import { Section, Text, Link, Hr } from "@react-email/components";
import * as React from "react";

export function EmailFooter() {
  return (
    <Section
      style={{
        padding: "24px 40px 32px",
        backgroundColor: "#f9fafb",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e5e7eb",
          margin: "0 0 20px",
        }}
      />
      <Text
        style={{
          fontSize: "12px",
          color: "#6b7280",
          margin: "0 0 12px",
          lineHeight: "1.6",
        }}
      >
        This message was sent from the contact form on your portfolio website.
      </Text>
      <Section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="https://ansh-dev.me"
          style={{
            fontSize: "12px",
            color: "#adc6ff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Visit Portfolio
        </Link>
        <Text
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            margin: "0",
          }}
        >
          © {new Date().getFullYear()} Ansh Singh
        </Text>
      </Section>
    </Section>
  );
}
