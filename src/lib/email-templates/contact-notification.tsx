import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import type { TemplateEntry } from "./registry";

interface ContactNotificationProps {
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  message?: string;
}

export function ContactNotification({
  name = "Unknown",
  email = "unknown@example.com",
  company = "",
  budget = "",
  message = "",
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New enquiry from ${name}`}</Preview>
      <Body style={{ backgroundColor: "#ffffff", color: "#000000", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "22px", margin: "0 0 8px" }}>New contact enquiry</Heading>
          <Text style={{ fontSize: "13px", color: "#555555", margin: "0 0 24px" }}>
            Submitted through fluxscales.site
          </Text>
          <Hr style={{ borderColor: "#000000", margin: "0 0 24px" }} />
          <Section>
            <Text style={{ fontSize: "14px", margin: "0 0 8px" }}><strong>Name:</strong> {name}</Text>
            <Text style={{ fontSize: "14px", margin: "0 0 8px" }}><strong>Email:</strong> {email}</Text>
            {company ? (
              <Text style={{ fontSize: "14px", margin: "0 0 8px" }}><strong>Company:</strong> {company}</Text>
            ) : null}
            {budget ? (
              <Text style={{ fontSize: "14px", margin: "0 0 8px" }}><strong>Budget:</strong> {budget}</Text>
            ) : null}
          </Section>
          <Hr style={{ borderColor: "#dddddd", margin: "24px 0" }} />
          <Text style={{ fontSize: "14px", lineHeight: "22px", whiteSpace: "pre-wrap", margin: 0 }}>
            {message}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: ContactNotification,
  displayName: "Contact enquiry notification",
  subject: (data: Record<string, unknown>) =>
    `New enquiry from ${typeof data["name"] === "string" && data["name"] ? data["name"] : "the website"}`,
  to: "team@fluxscales.site",
  previewData: {
    name: "Jane Borg",
    email: "jane@example.com",
    company: "Example Ltd",
    budget: "€5k–10k",
    message: "We'd like help building a monochrome brand system for our new product line.",
  },
} satisfies TemplateEntry;
