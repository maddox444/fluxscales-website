import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { contactSchema, verifyTurnstile } from "./contact.server";

const enquiry = { name: "Test visitor", email: "visitor@example.com", message: "A genuine branding enquiry for our new business." };
describe("Contact protection", () => {
  it("rejects invalid email addresses on the server", () => {
    assert.equal(contactSchema.safeParse({ ...enquiry, email: "not-an-email" }).success, false);
  });
  it("rejects oversized messages on the server", () => {
    assert.equal(contactSchema.safeParse({ ...enquiry, message: "x".repeat(2001) }).success, false);
  });
  it("allows enquiries without optional company and budget", () => {
    assert.equal(contactSchema.safeParse(enquiry).success, true);
  });
  it("rejects missing challenge tokens when spam protection is configured", async () => {
    assert.equal((await verifyTurnstile("", "test-secret")).ok, false);
  });
});