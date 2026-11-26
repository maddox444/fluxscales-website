import { createServerFn } from "@tanstack/react-start";

import {
  contactSchema,
  notifyContactSubmission,
  saveContactSubmission,
  verifyTurnstile,
} from "./contact.server";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot filled, or form completed impossibly fast → bot.
    if (data.honeypot) return { ok: false as const, error: "Submission rejected." };
    if (typeof data.elapsedMs === "number" && data.elapsedMs < 1500) {
      return { ok: false as const, error: "That was a little too fast, please try again." };
    }

    try {
      const check = await verifyTurnstile(data.turnstileToken, process.env["TURNSTILE_SECRET_KEY"]);
      if (!check.ok) return { ok: false as const, error: check.reason };

      const submissionId = await saveContactSubmission(data);
      await notifyContactSubmission(data, submissionId);
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "We couldn't send that. Please email team@fluxscales.site instead." };
    }
  });
