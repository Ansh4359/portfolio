import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";
import { EmailHeader } from "./components/email-header";
import { EmailFooter } from "./components/email-footer";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New portfolio contact from {name}</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
          margin: "0",
          padding: "0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
          }}
        >
          <EmailHeader />

          <Section style={{ padding: "32px 40px" }}>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 24px",
              }}
            >
              New Contact Form Submission
            </Text>

            <Section
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                padding: "20px 24px",
                marginBottom: "24px",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                From
              </Text>
              <Text
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: "0 0 16px",
                }}
              >
                {name}
              </Text>

              <Text
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Email
              </Text>
              <Link
                href={`mailto:${email}`}
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#adc6ff",
                  textDecoration: "none",
                  margin: "0",
                }}
              >
                {email}
              </Link>
            </Section>

            <Text
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0 0 8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Message
            </Text>
            <Text
              style={{
                fontSize: "15px",
                color: "#374151",
                lineHeight: "1.7",
                margin: "0",
              }}
            >
              {message}
            </Text>
          </Section>

          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

export default ContactEmail;
