import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";
import { ContactForm } from "./ContactForm";
import { ConsentAnalytics } from "./ConsentAnalytics";
import { Turnstile } from "./Turnstile";
import { I18nProvider, LANGUAGES } from "@/lib/i18n";

const mocks = vi.hoisted(() => {
  const listeners = new Set<(event: { toLocation: { pathname: string } }) => void>();
  return {
    send: vi.fn(),
    track: vi.fn(),
    listeners,
    router: {
      state: { resolvedLocation: { pathname: "/" }, location: { pathname: "/" } },
      subscribe: (
        _event: string,
        listener: (event: { toLocation: { pathname: string } }) => void,
      ) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    },
  };
});

vi.mock("@/lib/contact.functions", () => ({ submitContact: mocks.send }));
vi.mock("@/lib/analytics.functions", () => ({ trackPageView: mocks.track }));
vi.mock("@tanstack/react-start", () => ({
  // Deliberately unstable identity reproduces the original tracking regression.
  useServerFn:
    (fn: (...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
      fn(...args),
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouter: () => mocks.router,
}));

const renderWidget = vi.fn<(element: HTMLElement, options: Record<string, unknown>) => string>();
const resetWidget = vi.fn();
const removeWidget = vi.fn();

function widgetCallback(key: string) {
  const callback = renderWidget.mock.calls.at(-1)?.[1][key];
  if (typeof callback !== "function") throw new Error(`Missing widget callback: ${key}`);
  return callback as (...args: unknown[]) => void;
}

function navigate(pathname: string) {
  mocks.router.state.resolvedLocation.pathname = pathname;
  act(() => {
    for (const listener of mocks.listeners) listener({ toLocation: { pathname } });
  });
}

function completeForm() {
  fireEvent.change(screen.getByLabelText("Name *"), { target: { value: "UX test" } });
  fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "ux@example.com" } });
  fireEvent.change(screen.getByLabelText("What are you building? *"), {
    target: { value: "A test project message, never sent to the backend." },
  });
  act(() => widgetCallback("callback")("test-token"));
}

beforeEach(() => {
  localStorage.clear();
  mocks.listeners.clear();
  mocks.router.state.resolvedLocation.pathname = "/";
  mocks.router.state.location.pathname = "/";
  mocks.send.mockResolvedValue({ ok: true });
  mocks.track.mockResolvedValue({ ok: true });
  renderWidget.mockReturnValue("owned-widget");
  window.turnstile = { render: renderWidget, reset: resetWidget, remove: removeWidget };
});

afterEach(() => {
  cleanup();
  document.querySelectorAll("script[data-turnstile]").forEach((script) => script.remove());
  delete window.turnstile;
  vi.useRealTimers();
});

describe("Contact UX", () => {
  it("focuses committed errors in form order on first and repeated invalid submits, never another form", () => {
    render(
      <>
        <input aria-label="Unrelated invalid field" aria-invalid="true" />
        <ContactForm />
      </>,
    );
    const submit = screen.getByRole("button", { name: "Send message" });
    fireEvent.click(submit);
    expect(document.activeElement).toBe(screen.getByLabelText("Name *"));
    expect(document.activeElement?.getAttribute("aria-describedby")).toBe("name-error");
    submit.focus();
    fireEvent.click(submit);
    expect(document.activeElement).toBe(screen.getByLabelText("Name *"));
    fireEvent.change(screen.getByLabelText("Name *"), { target: { value: "Valid name" } });
    fireEvent.click(submit);
    expect(document.activeElement).toBe(screen.getByLabelText("Email *"));
    fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "valid@example.com" } });
    fireEvent.click(submit);
    expect(document.activeElement).toBe(screen.getByLabelText("What are you building? *"));
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("marks all three contact fields required programmatically", () => {
    render(<ContactForm />);
    for (const label of ["Name *", "Email *", "What are you building? *"]) {
      expect(screen.getByLabelText(label).hasAttribute("required")).toBe(true);
    }
  });

  it("prevents simultaneous submits, then allows retry with a fresh token and resets only its widget", async () => {
    let resolve: ((value: { ok: boolean; error: string }) => void) | undefined;
    mocks.send.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const { container } = render(<ContactForm />);
    completeForm();
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing contact form");
    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
    });
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(form.getAttribute("aria-busy")).toBe("true");
    const finish = resolve;
    if (!finish) throw new Error("No in-flight submission");
    await act(async () => finish({ ok: false, error: "Mock rejection" }));
    expect(resetWidget).toHaveBeenCalledExactlyOnceWith("owned-widget");
    expect(renderWidget).toHaveBeenCalledTimes(1);
    act(() => widgetCallback("callback")("fresh-token"));
    fireEvent.submit(form);
    await screen.findByRole("status");
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.send.mock.calls[1]?.[0].data.turnstileToken).toBe("fresh-token");
    expect(removeWidget).toHaveBeenCalledWith("owned-widget");
  });

  it("does not send a valid form while the configured challenge has failed", () => {
    render(<ContactForm />);
    completeForm();
    act(() => widgetCallback("error-callback")());
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(mocks.send).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Retry anti-spam check" })).toBeDefined();
  });
});

describe("Turnstile lifecycle", () => {
  it("keeps one widget through normal renders and uses the latest callbacks", () => {
    const firstToken = vi.fn();
    const latestToken = vi.fn();
    const { rerender, unmount } = render(
      <Turnstile onToken={firstToken} onUnavailable={vi.fn()} resetKey={0} />,
    );
    rerender(<Turnstile onToken={latestToken} onUnavailable={vi.fn()} resetKey={0} />);
    act(() => widgetCallback("callback")("verified"));
    expect(renderWidget).toHaveBeenCalledTimes(1);
    expect(removeWidget).not.toHaveBeenCalled();
    expect(latestToken).toHaveBeenCalledWith("verified");
    const expired = widgetCallback("expired-callback");
    act(() => expired());
    expect(latestToken).toHaveBeenLastCalledWith("");
    unmount();
    expect(removeWidget).toHaveBeenCalledExactlyOnceWith("owned-widget");
    latestToken.mockClear();
    expired();
    expect(latestToken).not.toHaveBeenCalled();
  });

  it("cleans up the replayed widget in StrictMode without retaining multiple widgets", () => {
    const { unmount } = render(
      <StrictMode>
        <Turnstile onToken={vi.fn()} onUnavailable={vi.fn()} resetKey={0} />
      </StrictMode>,
    );
    expect(renderWidget).toHaveBeenCalledTimes(2);
    expect(removeWidget).toHaveBeenCalledTimes(1);
    unmount();
    expect(removeWidget).toHaveBeenCalledTimes(2);
  });

  it("handles script failure and retry, ignores duplicate load events, and removes listeners on unmount", () => {
    delete window.turnstile;
    const { unmount } = render(
      <Turnstile onToken={vi.fn()} onUnavailable={vi.fn()} resetKey={0} />,
    );
    const failedScript = document.querySelector("script[data-turnstile]");
    if (!failedScript) throw new Error("Missing provider script");
    fireEvent.error(failedScript);
    expect(screen.getByRole("link", { name: "team@fluxscales.site" }).getAttribute("href")).toBe(
      "mailto:team@fluxscales.site",
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry anti-spam check" }));
    const nextScript = document.querySelector("script[data-turnstile]");
    if (!nextScript) throw new Error("Missing retry script");
    expect(nextScript).not.toBe(failedScript);
    window.turnstile = { render: renderWidget, reset: resetWidget, remove: removeWidget };
    fireEvent.load(nextScript);
    fireEvent.load(nextScript);
    expect(renderWidget).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.load(nextScript);
    expect(renderWidget).toHaveBeenCalledTimes(1);
  });

  it("shows recovery after a script load timeout and cancels the watchdog on unmount", () => {
    vi.useFakeTimers();
    delete window.turnstile;
    const onUnavailable = vi.fn();
    const { unmount } = render(
      <Turnstile onToken={vi.fn()} onUnavailable={onUnavailable} resetKey={0} />,
    );
    const stalledScript = document.querySelector("script[data-turnstile]");
    act(() => vi.advanceTimersByTime(15_000));
    expect(onUnavailable).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("button", { name: "Retry anti-spam check" })).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Retry anti-spam check" }));
    expect(document.querySelector("script[data-turnstile]")).not.toBe(stalledScript);
    unmount();
    onUnavailable.mockClear();
    act(() => vi.advanceTimersByTime(30_000));
    expect(onUnavailable).not.toHaveBeenCalled();
  });

  it("turns provider render exceptions into recovery instead of crashing the form", () => {
    renderWidget.mockImplementationOnce(() => {
      throw new Error("Provider unavailable");
    });
    render(<Turnstile onToken={vi.fn()} onUnavailable={vi.fn()} resetKey={0} />);
    expect(screen.getByRole("button", { name: "Retry anti-spam check" })).toBeDefined();
  });

  it("shows recovery if the provider script loads without exposing its API", () => {
    delete window.turnstile;
    render(<Turnstile onToken={vi.fn()} onUnavailable={vi.fn()} resetKey={0} />);
    const script = document.querySelector("script[data-turnstile]");
    if (!script) throw new Error("Missing provider script");
    fireEvent.load(script);
    expect(screen.getByRole("button", { name: "Retry anti-spam check" })).toBeDefined();
    expect(renderWidget).not.toHaveBeenCalled();
  });

  it.each(LANGUAGES)("offers recovery for the $code locale", async ({ code }) => {
    localStorage.setItem("fluxscales:lang", code);
    render(
      <I18nProvider>
        <Turnstile onToken={vi.fn()} onUnavailable={vi.fn()} resetKey={0} />
      </I18nProvider>,
    );
    act(() => widgetCallback("error-callback")());
    await waitFor(() => expect(document.documentElement.lang).toBe(code));
    expect(screen.getByRole("button")).toBeDefined();
    expect(screen.getByRole("link", { name: "team@fluxscales.site" }).getAttribute("href")).toBe(
      "mailto:team@fluxscales.site",
    );
  });
});

describe("Consent-granted pathname visits", () => {
  it("never tracks before consent or while declined", () => {
    render(<ConsentAnalytics />);
    navigate("/privacy");
    fireEvent.click(screen.getByRole("button", { name: "Decline" }));
    navigate("/terms");
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it("tracks each pathname transition once, including back navigation, with no new data", () => {
    render(<ConsentAnalytics />);
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    navigate("/privacy");
    navigate("/privacy"); // query/hash-only change or repeat resolution
    navigate("/terms");
    navigate("/privacy");
    expect(mocks.track.mock.calls.map((call) => call[0].data.path)).toEqual([
      "/",
      "/privacy",
      "/terms",
      "/privacy",
    ]);
    expect(Object.keys(mocks.track.mock.calls[0]?.[0].data).sort()).toEqual([
      "path",
      "referrerHost",
      "screenBucket",
    ]);
  });

  it("does not duplicate visits on unstable callback identities, rerenders or reopened choices", () => {
    localStorage.setItem("fluxscales:analytics-consent", "granted");
    const { rerender } = render(
      <StrictMode>
        <ConsentAnalytics />
      </StrictMode>,
    );
    rerender(
      <StrictMode>
        <ConsentAnalytics />
      </StrictMode>,
    );
    act(() => window.dispatchEvent(new Event("fluxscales:privacy-choices")));
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(mocks.listeners.size).toBe(1);
  });

  it("withdraws consent immediately and resumes only the current uncounted visit", () => {
    localStorage.setItem("fluxscales:analytics-consent", "granted");
    render(<ConsentAnalytics />);
    act(() => window.dispatchEvent(new Event("fluxscales:privacy-choices")));
    fireEvent.click(screen.getByRole("button", { name: "Decline" }));
    navigate("/privacy");
    navigate("/terms");
    expect(mocks.track).toHaveBeenCalledTimes(1);
    act(() => window.dispatchEvent(new Event("fluxscales:privacy-choices")));
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    expect(mocks.track.mock.calls.map((call) => call[0].data.path)).toEqual(["/", "/terms"]);
  });

  it("does not retry failed analytics on rerender and unsubscribes on unmount", async () => {
    mocks.track.mockRejectedValue(new Error("Offline"));
    localStorage.setItem("fluxscales:analytics-consent", "granted");
    const { rerender, unmount } = render(<ConsentAnalytics />);
    await act(async () => {});
    rerender(<ConsentAnalytics />);
    expect(mocks.track).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.listeners.size).toBe(0);
    navigate("/privacy");
    expect(mocks.track).toHaveBeenCalledTimes(1);
  });
});
