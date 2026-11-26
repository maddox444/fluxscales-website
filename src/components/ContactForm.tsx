import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { privacyCopy } from "@/lib/privacy-copy";
import { Turnstile } from "@/components/Turnstile";
import { turnstileCopy } from "@/lib/turnstile-copy";

import { submitContact } from "@/lib/contact.functions";
import { useI18n, type Dict } from "@/lib/i18n";

const makeSchema = (f: Dict["form"]) =>
  z.object({
    name: z.string().trim().min(2, f.errName).max(100, f.errNameLong),
    email: z.string().trim().min(1, f.errEmail).email(f.errEmailValid).max(255, f.errEmailLong),
    message: z.string().trim().min(20, f.errMessage).max(2000, f.errMessageLong),
  });

type Fields = z.infer<ReturnType<typeof makeSchema>>;
type Errors = Partial<Record<keyof Fields, string>>;

const inputClass =
  "w-full border border-foreground/50 bg-transparent px-4 py-3 text-base font-light text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/60 focus:border-foreground aria-[invalid=true]:border-destructive-foreground/70";

export function ContactForm() {
  const { t, lang } = useI18n();
  const f = t.form;
  const send = useServerFn(submitContact);
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [token, setToken] = useState("");
  const [challengeUnavailable, setChallengeUnavailable] = useState(false);
  const [resetChallenge, setResetChallenge] = useState(0);
  const [focusRequest, setFocusRequest] = useState(0);
  const form = useRef<HTMLFormElement | null>(null);
  const inFlight = useRef(false);
  const honeypot = useRef<HTMLInputElement | null>(null);
  const mounted = useRef(Date.now());

  useEffect(() => {
    if (focusRequest === 0) return;
    // Runs after aria-invalid and error descriptions have been committed.
    form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusRequest]);

  const set =
    (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || status === "sent") return;
    setFormError("");

    const parsed = makeSchema(f).safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("error");
      setFocusRequest((value) => value + 1);
      return;
    }

    if (challengeUnavailable) {
      setFormError(turnstileCopy[lang].unavailable);
      return;
    }
    inFlight.current = true;
    setErrors({});
    setStatus("sending");
    try {
      const res = await send({
        data: {
          ...parsed.data,
          honeypot: honeypot.current?.value ?? "",
          elapsedMs: Date.now() - mounted.current,
          turnstileToken: token,
        },
      });
      if (!res.ok) {
        setStatus("error");
        setFormError(res.error ?? f.errGeneric);
        setToken("");
        setResetChallenge((value) => value + 1);
        return;
      }
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setFormError(f.errNetwork);
      setToken("");
      setResetChallenge((value) => value + 1);
    } finally {
      inFlight.current = false;
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="border border-border p-8">
        <p className="display text-3xl">{f.sentTitle}</p>
        <p className="mt-4 max-w-md font-light text-muted-foreground">{f.sentBody}</p>
      </div>
    );
  }

  const field = (key: keyof Fields) => ({
    id: key,
    name: key,
    value: values[key],
    onChange: set(key),
    className: inputClass,
    required: true,
    "aria-invalid": Boolean(errors[key]),
    ...(errors[key] ? { "aria-describedby": `${key}-error` } : {}),
  });

  return (
    <form
      ref={form}
      noValidate
      onSubmit={onSubmit}
      aria-busy={status === "sending"}
      className="grid gap-6 md:grid-cols-2"
    >
      <div>
        <label htmlFor="name" className="label-mono block pb-2 text-muted-foreground">
          {f.name} *
        </label>
        <input {...field("name")} type="text" autoComplete="name" maxLength={100} />
        {errors.name && (
          <p id="name-error" className="label-mono pt-2 text-destructive-foreground">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label-mono block pb-2 text-muted-foreground">
          {f.email} *
        </label>
        <input {...field("email")} type="email" autoComplete="email" maxLength={255} />
        {errors.email && (
          <p id="email-error" className="label-mono pt-2 text-destructive-foreground">
            {errors.email}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="message" className="label-mono block pb-2 text-muted-foreground">
          {f.message} *
        </label>
        <textarea {...field("message")} rows={5} maxLength={2000} />
        <div className="flex items-start justify-between gap-4 pt-2">
          {errors.message ? (
            <p id="message-error" className="label-mono text-destructive-foreground">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span className="label-mono text-muted-foreground">{values.message.length}/2000</span>
        </div>
      </div>

      {/* honeypot: hidden from humans and assistive tech */}
      <div aria-hidden className="sr-only pointer-events-none opacity-0">
        <label htmlFor="website">Website</label>
        <input
          ref={honeypot}
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="md:col-span-2">
        <Turnstile
          onToken={setToken}
          onUnavailable={setChallengeUnavailable}
          resetKey={resetChallenge}
        />
        <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
          {privacyCopy[lang].notice}{" "}
          <Link to="/privacy" className="underline underline-offset-4">
            {privacyCopy[lang].privacy}
          </Link>
        </p>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-6 md:col-span-2">
        <Button
          type="submit"
          variant="submit"
          disabled={status === "sending"}
          className="label-mono press group h-14 w-full justify-between gap-8 px-6 font-normal sm:w-auto"
        >
          {status === "sending" ? f.sending : f.send}
          <span
            aria-hidden
            className="shrink-0 text-lg transition-transform group-hover:translate-x-1 rtl:rotate-180"
          >
            →
          </span>
        </Button>
        <p
          aria-live="polite"
          className="label-mono min-w-0 break-words text-destructive-foreground empty:hidden"
        >
          {formError}
        </p>
      </div>
    </form>
  );
}
