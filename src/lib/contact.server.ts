import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Enter a valid email address")
    .max(255, "Email is too long"),
  company: z.string().trim().max(120, "Company name is too long").optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more, at least 20 characters")
    .max(2000, "Message is too long (2000 characters max)"),
  // spam traps, never shown to humans
  honeypot: z.string().max(0).optional().or(z.literal("")),
  elapsedMs: z.number().int().nonnegative().optional(),
  turnstileToken: z.string().max(4096).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Cloudflare Turnstile server-side verification. */
export async function verifyTurnstile(token: string | undefined, secret: string | undefined) {
  if (!secret) return { ok: true as const, skipped: true as const };
  if (!token) return { ok: false as const, reason: "Please complete the anti-spam check." };

  const body = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const json = (await res.json()) as { success?: boolean };
  return json.success
    ? ({ ok: true as const, skipped: false as const })
    : ({ ok: false as const, reason: "Anti-spam check failed. Please try again." });
}

export async function saveContactSubmission(input: ContactInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("contact_submissions")
    .insert({
      name: input.name,
      email: input.email,
      company: input.company || null,
      budget: input.budget || null,
      message: input.message,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

/** Notifies the studio inbox about a new enquiry. Never blocks the submission. */
export async function notifyContactSubmission(input: ContactInput, submissionId: string) {
  try {
    const { sendTemplateEmail } = await import("./email-templates/send-email");
    await sendTemplateEmail("contact-notification", "team@fluxscales.site", {
      templateData: {
        name: input.name,
        email: input.email,
        company: input.company ?? "",
        budget: input.budget ?? "",
        message: input.message,
      },
      idempotencyKey: `contact-notification-${submissionId}`,
      replyTo: input.email,
    });
  } catch (error) {
    console.error("[contact] notification email failed", error);
  }
}
