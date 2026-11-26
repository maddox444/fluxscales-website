import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { privacyCopy } from "@/lib/privacy-copy";

import { trackPageView } from "@/lib/analytics.functions";
import { useI18n } from "@/lib/i18n";

const KEY = "fluxscales:analytics-consent";
type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function screenBucket(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/**
 * Consent-gated, cookieless analytics. Nothing is measured or stored until the
 * visitor opts in; declining stores a single local flag and never calls the
 * server again.
 */
export function ConsentAnalytics() {
  const { t, lang } = useI18n();
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const track = useServerFn(trackPageView);
  const router = useRouter();
  const latestTrack = useRef(track);
  const currentConsent = useRef<Consent>(null);
  const visit = useRef<{ pathname: string | null; counted: boolean }>({
    pathname: null,
    counted: false,
  });
  const [editing, setEditing] = useState(false);
  const copy = privacyCopy[lang];

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const reopen = () => setEditing(true);
    window.addEventListener("fluxscales:privacy-choices", reopen);
    return () => window.removeEventListener("fluxscales:privacy-choices", reopen);
  }, []);

  useEffect(() => {
    latestTrack.current = track;
  }, [track]);

  const observePath = useCallback((pathname: string) => {
    if (visit.current.pathname !== pathname) {
      visit.current = { pathname, counted: false };
    }
    if (currentConsent.current !== "granted" || visit.current.counted) return;
    // Claim the visit before sending; failures and rerenders never retry it.
    visit.current.counted = true;
    let referrerHost = "";
    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
    } catch {
      referrerHost = "";
    }
    void latestTrack
      .current({
        data: {
          path: pathname,
          referrerHost,
          screenBucket: screenBucket(),
        },
      })
      .catch(() => {
        /* analytics must never break the page */
      });
  }, []);

  useEffect(() => {
    currentConsent.current = consent;
    if (!ready) return;
    observePath((router.state.resolvedLocation ?? router.state.location).pathname);
  }, [consent, ready, router, observePath]);

  useEffect(() => {
    // onResolved excludes cancelled/pending navigation and captures each visit,
    // including returns to a path previously counted during this mount.
    return router.subscribe("onResolved", ({ toLocation }) => {
      observePath(toLocation.pathname);
    });
  }, [router, observePath]);

  const choose = (value: Exclude<Consent, null>) => {
    currentConsent.current = value;
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* private mode — session-only choice */
    }
    setConsent(value);
    setEditing(false);
  };

  if (!ready || (consent !== null && !editing)) return null;

  return (
    <div
      role="dialog"
      aria-label={t.consent.label}
      className="fixed inset-x-0 bottom-0 z-[90] flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-md md:px-10"
      style={{ animation: "flux-boot-fade 600ms cubic-bezier(0.22,0.68,0.16,1) 900ms both" }}
    >
      <p className="min-w-0 basis-full text-sm font-light leading-snug md:basis-0 md:flex-1 text-muted-foreground">
        {t.consent.body}
      </p>
      <Link to="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
        {copy.privacy}
      </Link>
      <div className="flex gap-3">
        <Button
          variant="contact"
          type="button"
          onClick={() => choose("granted")}
          aria-pressed={consent === "granted"}
          className="label-mono press h-9 w-auto border border-border px-4 py-1 text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          {t.consent.allow}
        </Button>
        <Button
          variant="contact"
          type="button"
          onClick={() => choose("denied")}
          aria-pressed={consent === "denied"}
          className="label-mono press h-9 w-auto border border-border px-4 py-1 text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          {t.consent.decline}
        </Button>
      </div>
    </div>
  );
}
