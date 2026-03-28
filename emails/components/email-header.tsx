import { Section, Text } from "@react-email/components";
import * as React from "react";

export function EmailHeader() {
  return (
    <Section
      style={{
        padding: "32px 40px 24px",
        background: "linear-gradient(135deg, #adc6ff26, #31e19214, #a2e7ff1f)",
        borderBottom: "1px solid #4247531a",
      }}
    >
      <Text
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#1a1a1a",
          margin: "0 0 4px",
          letterSpacing: "-0.02em",
        }}
      >
        Ansh Singh
      </Text>
      <Text
        style={{
          fontSize: "12px",
          color: "#6b7280",
          margin: "0",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Portfolio Contact
      </Text>
    </Section>
  );
}
