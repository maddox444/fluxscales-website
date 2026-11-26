import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const eventSchema = z.object({
  path: z.string().trim().min(1).max(300),
  referrerHost: z.string().trim().max(200).optional().or(z.literal("")),
  screenBucket: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

/**
 * First-party, cookieless page-view counter. Stores only the path, the
 * referring host and a coarse screen bucket — no IPs, no identifiers,
 * no cross-site tracking. Only called after the visitor opts in.
 */
export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => eventSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("page_views").insert({
      path: data.path,
      referrer_host: data.referrerHost || null,
      screen_bucket: data.screenBucket ?? null,
    });
    return { ok: true as const };
  });
