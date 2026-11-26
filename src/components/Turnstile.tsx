import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { turnstileCopy } from "@/lib/turnstile-copy";

const SITE_KEY = import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined;
const LOAD_TIMEOUT_MS = 15_000;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

/** The widget owns its ID; renders and callback updates never recreate it. */
export function Turnstile({
  onToken,
  onUnavailable,
  resetKey,
}: {
  onToken: (token: string) => void;
  onUnavailable: (unavailable: boolean) => void;
  resetKey: number;
}) {
  const { lang } = useI18n();
  const copy = turnstileCopy[lang];
  const holder = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const callbacks = useRef({ onToken, onUnavailable });
  const [attempt, setAttempt] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    callbacks.current = { onToken, onUnavailable };
  }, [onToken, onUnavailable]);

  useEffect(() => {
    if (!SITE_KEY || !holder.current) return;
    let cancelled = false;
    let script: HTMLScriptElement | undefined;
    const fail = () => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      setUnavailable(true);
      callbacks.current.onToken("");
      callbacks.current.onUnavailable(true);
    };
    const timeout = window.setTimeout(() => {
      // A stalled script must be replaceable by the explicit retry action.
      if (script && !window.turnstile) script.dataset["turnstileFailed"] = "true";
      fail();
    }, LOAD_TIMEOUT_MS);
    const scriptFailed = () => {
      if (script) script.dataset["turnstileFailed"] = "true";
      fail();
    };
    const render = () => {
      if (cancelled || !holder.current || widgetId.current !== undefined) return;
      window.clearTimeout(timeout);
      const api = window.turnstile;
      if (!api) {
        scriptFailed();
        return;
      }
      try {
        widgetId.current = api.render(holder.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          callback: (token: string) => {
            if (cancelled) return;
            setUnavailable(false);
            callbacks.current.onUnavailable(false);
            callbacks.current.onToken(token);
          },
          "expired-callback": () => {
            if (!cancelled) callbacks.current.onToken("");
          },
          "error-callback": fail,
          "timeout-callback": fail,
          "unsupported-callback": fail,
        });
      } catch {
        fail();
      }
    };

    setUnavailable(false);
    callbacks.current.onUnavailable(false);
    callbacks.current.onToken("");
    if (window.turnstile) {
      render();
    } else {
      let existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      if (existing?.dataset["turnstileFailed"] === "true") {
        existing.remove();
        existing = null;
      }
      script = existing ?? document.createElement("script");
      script.addEventListener("load", render);
      script.addEventListener("error", scriptFailed);
      if (!existing) {
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset["turnstile"] = "true";
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      script?.removeEventListener("load", render);
      script?.removeEventListener("error", scriptFailed);
      const id = widgetId.current;
      widgetId.current = undefined;
      if (id !== undefined) {
        try {
          window.turnstile?.remove(id);
        } catch {
          // Provider cleanup must not break navigation.
        }
      }
    };
  }, [attempt]);

  useEffect(() => {
    const id = widgetId.current;
    if (resetKey === 0 || id === undefined) return;
    callbacks.current.onToken("");
    try {
      window.turnstile?.reset(id);
    } catch {
      setUnavailable(true);
      callbacks.current.onUnavailable(true);
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return (
    <div className="mt-2">
      <div ref={holder} />
      {unavailable && (
        <div className="mt-3">
          <p role="alert" className="text-sm font-light text-destructive-foreground">
            {copy.unavailable}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="contact"
              className="h-auto min-h-11 whitespace-normal text-start"
              onClick={() => setAttempt((value) => value + 1)}
            >
              {copy.retry}
            </Button>
            <Button asChild variant="contact" className="h-auto min-h-11">
              <a href="mailto:team@fluxscales.site" dir="ltr">
                team@fluxscales.site
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
