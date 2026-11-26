import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/fluxscales-logo.png.asset.json";
import hero800Avif from "@/assets/hero-800.avif";
import hero1600Avif from "@/assets/hero-1600.avif";
import hero800Webp from "@/assets/hero-800.webp";
import hero1600Webp from "@/assets/hero-1600.webp";
import hero800Jpg from "@/assets/hero-800.jpg";
import hero1600Jpg from "@/assets/hero-1600.jpg";
import { heroBlur } from "@/assets/hero-blur";

import { SEO, SITE, alternateLinks, localeUrl } from "@/lib/seo";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { privacyCopy } from "@/lib/privacy-copy";

function parseLang(value: unknown): Lang {
  return typeof value === "string" && LANGUAGES.some((l) => l.code === value)
    ? (value as Lang)
    : "en";
}

export const Route = createFileRoute("/")({
  // `lang` stays optional so "/" never redirects to "/?lang=en".
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => {
    const raw = search["lang"];
    return typeof raw === "string" && LANGUAGES.some((l) => l.code === raw)
      ? { lang: raw as Lang }
      : {};
  },
  loaderDeps: ({ search }) => ({ lang: parseLang(search.lang) }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const lang = parseLang(loaderData?.lang);

    const seo = SEO[lang];
    const url = localeUrl(lang);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.ogTitle },
        { property: "og:description", content: seo.ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Fluxscales" },
        { property: "og:locale", content: seo.ogLocale },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo.ogTitle },
        { name: "twitter:description", content: seo.ogDescription },
      ],

      links: [
        { rel: "canonical", href: url },
        ...alternateLinks(),
        {
          rel: "preload",
          as: "image",
          type: "image/avif",
          href: hero1600Avif,
          imageSrcSet: `${hero800Avif} 800w, ${hero1600Avif} 1600w`,
          imageSizes: "100vw",
          fetchPriority: "high",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Fluxscales",
            url: SITE,
            description: seo.description,
            email: "team@fluxscales.site",
            telephone: "+35699944202",
            foundingDate: "2026",
            areaServed: "Worldwide",
            address: { "@type": "PostalAddress", addressCountry: "MT" },
            inLanguage: LANGUAGES.map((l) => l.code),
          }),
        },
      ],
    };
  },

  component: Index,
});

/* ---------- motion primitives ---------- */

function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal-base ${shown ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Minimal boot curtain: fades the wordmark in, then lifts away. */
function Boot() {
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t1 = window.setTimeout(() => setFading(true), 380);
    const t2 = window.setTimeout(() => setGone(true), 1000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
  if (gone) return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-[600ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <img src={logo.url} alt="" className="boot-fade h-4 w-auto md:h-5" />
    </div>
  );
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Very light hero parallax — transform only, rAF-throttled, off for reduced motion. */
function useParallax<T extends HTMLElement>(strength = 0.1) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight) * strength;
      el.style.transform = `translate3d(0, ${y}px, 0) scale(1.06)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/* ---------- page ---------- */

function Index() {
  const { t, lang } = useI18n();
  const scrolled = useScrolled();
  const heroRef = useParallax<HTMLImageElement>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const nav = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.studio, href: "#studio" },
  ];

  const stats = [
    { k: t.studio.stats.founded, v: "2026" },
    { k: t.studio.stats.projects, v: "32+" },
    { k: t.studio.stats.engagement, v: t.studio.stats.weeks },
    { k: t.studio.stats.team, v: "4" },
  ];

  // Cached images can finish decoding before onLoad is attached, so poll
  // briefly to guarantee the blur placeholder always clears.
  useEffect(() => {
    if (heroLoaded) return;
    let frames = 0;
    const id = window.setInterval(() => {
      if (heroRef.current?.complete || ++frames > 40) {
        setHeroLoaded(true);
        window.clearInterval(id);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [heroRef, heroLoaded]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Boot />

      <a href="#top" className="skip-link label-mono">
        {t.skip}
      </a>

      {/* NAV */}
      <header
        className={`boot-nav fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-500 ease-out ${
          scrolled ? "border-border bg-background/95" : "border-transparent bg-background/70"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1500px] items-center justify-between px-5 transition-[height] duration-500 ease-out md:px-10 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <a href="#top" aria-label="Fluxscales home" className="flex items-center">
            <img
              src={logo.url}
              alt="Fluxscales"
              width={844}
              height={135}
              className="h-4 w-auto transition-opacity duration-500 ease-out hover:opacity-60 md:h-5"
            />
          </a>

          <nav aria-label="Primary" className="hidden gap-9 md:flex">
            {nav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="label-mono link-underline text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="#contact"
              className="label-mono press hidden border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background md:inline-block"
            >
              {t.nav.start}
            </a>
            <button
              type="button"
              aria-label={menuOpen ? t.menu.close : t.menu.open}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="press flex h-10 w-10 items-center justify-center border border-foreground md:hidden"
            >
              <span className="sr-only">{t.menu.label}</span>
              <span aria-hidden className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-4 bg-foreground transition-all duration-300 ease-out ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-4 bg-foreground transition-all duration-300 ease-out ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>

            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <div
          inert={!menuOpen}
          className={`overflow-hidden border-border bg-background transition-[max-height,opacity] duration-500 ease-out md:hidden ${
            menuOpen ? "max-h-80 border-t opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav aria-label="Mobile" className="mx-auto max-w-[1500px] px-5 py-6">
            {[...nav, { label: t.nav.start, href: "#contact" }].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="display block border-b border-border py-4 text-2xl last:border-0"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="top" className="relative flex min-h-svh items-end overflow-hidden pt-16">
          <div
            aria-hidden
            className="absolute inset-0 scale-[1.06] bg-cover bg-center blur-xl transition-opacity duration-700 ease-out"
            style={{ backgroundImage: `url(${heroBlur})`, opacity: heroLoaded ? 0 : 0.7 }}
          />
          <picture>
            <source
              type="image/avif"
              srcSet={`${hero800Avif} 800w, ${hero1600Avif} 1600w`}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={`${hero800Webp} 800w, ${hero1600Webp} 1600w`}
              sizes="100vw"
            />
            <img
              ref={heroRef}
              src={hero1600Jpg}
              srcSet={`${hero800Jpg} 800w, ${hero1600Jpg} 1600w`}
              sizes="100vw"
              width={1600}
              height={1104}
              decoding="async"
              fetchPriority="high"
              alt=""
              aria-hidden
              onLoad={() => setHeroLoaded(true)}
              className="boot-fade absolute inset-0 h-full w-full scale-[1.06] object-cover opacity-80 will-change-transform"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/35" />


          <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-14 md:px-10 md:pb-20">
            <Reveal delay={620}>
              <p className="label-mono text-muted-foreground">{t.hero.eyebrow}</p>
            </Reveal>
            <Reveal delay={720}>
              <h1
                style={{ lineHeight: lang === "en" ? 0.84 : 1 }}
                className={`display mt-6 text-balance ${
                  lang === "en"
                    ? "text-[clamp(3rem,10.5vw,8.5rem)]"
                    : "text-[clamp(2.25rem,8vw,6.5rem)]"
                }`}
              >
                <span className="block">{t.hero.l1}</span>
                <span className="block">{t.hero.l2}</span>
                <span className="block">{t.hero.l3}</span>
              </h1>
            </Reveal>
            <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3">
              <Reveal delay={840} className="md:col-span-2">
                <p className="max-w-md text-pretty text-lg font-light text-muted-foreground">
                  {t.hero.lede}
                </p>
              </Reveal>
              <Reveal delay={940}>
                <div className="flex items-start md:justify-end">
                  <a
                    href="#services"
                    className="label-mono press group inline-flex items-center gap-3 border border-foreground px-6 py-4 transition-colors hover:bg-foreground hover:text-background"
                  >
                    {t.hero.cta}
                    <span
                      aria-hidden
                      className="transition-transform duration-500 ease-out group-hover:translate-x-1.5 rtl:-scale-x-100"
                    >
                      →
                    </span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div
          aria-hidden
          className="marquee-mask overflow-hidden border-y border-border bg-foreground py-4 text-background"
        >
          <div className="marquee-track">
            {[0, 1].map((i) => (
              <span key={i} className="display flex shrink-0 text-2xl md:text-4xl">
                {t.marquee.map((w) => (
                  <span key={w} className="mx-7 flex items-center gap-7">
                    {w}
                    <span className="block h-1.5 w-1.5 rotate-45 bg-background/50" />
                  </span>
                ))}
              </span>

            ))}
          </div>
        </div>

        {/* STATEMENT */}
        <section
          aria-label={t.statement.label}
          className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-36"
        >
          <div className="grid gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <p className="label-mono text-muted-foreground">{t.statement.label}</p>
            </Reveal>
            <Reveal delay={120} className="md:col-span-9">
              <h2 className="text-balance text-3xl font-light leading-[1.15] md:text-5xl">
                {t.statement.a}{" "}
                <span className="text-muted-foreground">{t.statement.b}</span>
              </h2>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="border-t border-border">
          <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
            <Reveal>
              <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)]">{t.services.heading}</h2>
            </Reveal>
            <ul className="mt-12 divide-y divide-border border-y border-border">
              {t.services.items.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 90}>
                  <div className="group grid gap-6 py-10 transition-colors duration-500 ease-out md:grid-cols-12 md:gap-10">
                    <span className="label-mono text-muted-foreground transition-colors duration-500 group-hover:text-foreground md:col-span-1">
                      {`0${i + 1}`}
                    </span>
                    <h3 className="display text-3xl transition-transform duration-500 ease-out md:col-span-4 md:text-4xl md:group-hover:translate-x-1">
                      {s.title}
                    </h3>
                    <p className="text-pretty text-lg font-light text-muted-foreground md:col-span-4">
                      {s.body}
                    </p>
                    <ul className="md:col-span-3">
                      {s.items.map((it) => (
                        <li
                          key={it}
                          className="label-mono border-b border-border py-2 text-muted-foreground transition-colors duration-500 last:border-0 group-hover:text-foreground"
                        >
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Link
              to="/boutique-branding-agency"
              className="label-mono mt-8 inline-block text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Why a boutique branding agency →
            </Link>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="border-t border-border bg-foreground text-background">
          <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
            <Reveal>
              <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)]">{t.process.heading}</h2>
            </Reveal>
            <ol className="mt-14 grid gap-10 md:grid-cols-4">
              {t.process.steps.map((s, i) => (
                <Reveal as="li" key={s.k} delay={i * 110}>
                  <div className="border-t border-background/25 pt-5">
                    <span className="label-mono opacity-60">{`${t.process.step} 0${i + 1}`}</span>
                    <h3 className="display mt-4 text-3xl">{s.k}</h3>
                    <p className="mt-3 text-pretty text-base font-light opacity-75">{s.v}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* STUDIO */}
        <section id="studio" className="border-t border-border">
          <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28">
            <Reveal>
              <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)]">{t.studio.heading}</h2>
              <p className="mt-8 max-w-lg text-pretty text-xl font-light text-muted-foreground">
                {t.studio.p1}
              </p>
              <p className="mt-6 max-w-lg text-pretty font-light text-muted-foreground">
                {t.studio.p2}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <dl className="grid grid-cols-2 gap-px self-start bg-border">
                {stats.map((s) => (
                  <div
                    key={s.k}
                    className="group bg-background p-8 transition-colors duration-500 ease-out hover:bg-secondary"
                  >
                    <dd className="display text-4xl md:text-6xl">{s.v}</dd>
                    <dt className="label-mono mt-3 text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
                      {s.k}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t border-border">
          <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
            <Reveal>
              <p className="label-mono text-muted-foreground">{t.contact.label}</p>
              <h2
                className={`display mt-6 text-balance leading-[0.86] ${
                  lang === "en"
                    ? "text-[clamp(2.5rem,8vw,6.5rem)]"
                    : "text-[clamp(2.25rem,8vw,6.5rem)]"
                }`}
              >
                {t.contact.h1}
                <br />
                {t.contact.h2}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-12 border-t border-border pt-10">
                <ContactForm />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-10 grid min-w-0 gap-3 border-t border-border pt-6 sm:max-w-[40rem] sm:grid-cols-2 sm:gap-8">
                <Button asChild variant="contact" className="group h-14 min-w-0 justify-between gap-3 px-0 font-normal">
                <a
                  href="mailto:team@fluxscales.site"
                  dir="ltr"
                >
                  <span className="min-w-0 break-all text-sm">team@fluxscales.site</span>
                  <span aria-hidden className="shrink-0 text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </a>
                </Button>
                <Button asChild variant="contact" className="group h-14 min-w-0 justify-between gap-3 px-0 font-normal">
                <a
                  href="tel:+35699944202"
                  dir="ltr"
                >
                  <span className="min-w-0 text-sm">+356 99944202</span>
                  <span aria-hidden className="shrink-0 text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <img src={logo.url} alt="Fluxscales" width={844} height={135} className="h-4 w-auto" />
            <nav aria-label="Social" className="flex flex-wrap gap-x-4 gap-y-1">
              {[
                { handle: "@fluxscales.mt", href: "https://instagram.com/fluxscales.mt" },
                { handle: "@fluxscales.ua", href: "https://instagram.com/fluxscales.ua" },
                { handle: "@fluxscales.uk", href: "https://instagram.com/fluxscales.uk" },
                { handle: "@fluxscales.eu", href: "https://instagram.com/fluxscales.eu" },
                { handle: "@fluxscales.ly", href: "https://instagram.com/fluxscales.ly" },
              ].map((link) => (
                <a
                  key={link.handle}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${link.handle}`}
                  className="label-mono text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {link.handle}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <Link
              to="/privacy"
              className="label-mono link-underline text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {privacyCopy[lang].privacy}
            </Link>
            <Link to="/terms" className="label-mono link-underline text-muted-foreground hover:text-foreground">{privacyCopy[lang].terms}</Link>
            <Button variant="contact" onClick={() => window.dispatchEvent(new Event("fluxscales:privacy-choices"))} className="label-mono h-auto whitespace-normal border-0 px-0 py-2 font-normal text-muted-foreground hover:text-foreground">{privacyCopy[lang].settings}</Button>
            <p className="label-mono text-muted-foreground">
              © 2026 Fluxscales. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
