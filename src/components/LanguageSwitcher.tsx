import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { LANGUAGES, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, t, setLang } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={t.menu.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="label-mono press flex items-center gap-2 border border-border px-3 py-2 text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground"
      >
        <span aria-hidden>{current.code.toUpperCase()}</span>
        <span
          aria-hidden
          className={`text-[0.6rem] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.menu.language}
          className="absolute end-0 z-50 mt-2 min-w-[11rem] border border-border bg-background py-1"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                  // Keep the URL (and therefore the per-locale head tags) in sync.
                  void navigate({
                    to: "/",
                    search: l.code === "en" ? {} : { lang: l.code },
                    replace: true,
                    resetScroll: false,
                  });
                }}
                className={`label-mono flex w-full items-center justify-between gap-4 px-4 py-2.5 text-start transition-colors duration-200 hover:bg-secondary ${
                  l.code === lang ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span>{l.native}</span>
                <span aria-hidden className="opacity-50">
                  {l.code.toUpperCase()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
