import { createFileRoute, Link } from "@tanstack/react-router";

import logo from "@/assets/fluxscales-logo.png.asset.json";
import { SITE } from "@/lib/seo";

const TITLE = "Boutique Branding Agency | Fluxscales";
const DESC =
  "Fluxscales is a boutique branding agency in Malta. A four-person, senior-led team building identities and websites in black and white first, working directly with you.";

export const Route = createFileRoute("/boutique-branding-agency")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: `${SITE}/boutique-branding-agency` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/boutique-branding-agency` }],
  }),
  component: Boutique,
});

const sections: { h: string; body: string }[] = [
  {
    h: "Why a boutique studio",
    body: "Large agencies sell you a senior team and hand the work to someone else. We are four people. The strategists and designers in the first call are the ones who build your brand, so nothing gets lost between pitch and delivery.",
  },
  {
    h: "Monochrome first",
    body: "Every identity we design has to work in pure black and white before colour is allowed in. If a logo, a layout or a type system only holds up because of colour, it is not finished. Starting in monochrome forces clarity and gives you a brand that survives any format.",
  },
  {
    h: "Direct access, no account layer",
    body: "You talk to the people doing the work. No account managers, no relayed feedback, no surprise handover after launch. Questions get answered by the designer who made the decision.",
  },
  {
    h: "What we do",
    body: "Naming, positioning, logo systems, typography, brand guidelines and the website that carries it all. One small team from strategy through to launch, then ongoing improvement on a schedule.",
  },
];

function Boutique() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <Link to="/" aria-label="Fluxscales home" className="flex items-center">
            <img src={logo.url} alt="Fluxscales" width={844} height={135} className="h-4 w-auto md:h-5" />
          </Link>
          <Link
            to="/"
            className="label-mono press border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-16 md:py-24">
        <p className="label-mono text-muted-foreground">Studio</p>
        <h1 className="display mt-4 text-5xl md:text-7xl">A boutique branding agency</h1>
        <p className="mt-6 max-w-xl text-lg font-light text-muted-foreground">
          Fluxscales is a small, senior-led branding and web studio based in Malta, working with
          clients worldwide.
        </p>

        <div className="mt-14 space-y-12">
          {sections.map((s, i) => (
            <section key={s.h} className="border-t border-border pt-8">
              <h2 className="flex items-baseline gap-4 text-xl font-medium">
                <span className="label-mono text-muted-foreground">{`0${i + 1}`}</span>
                {s.h}
              </h2>
              <p className="mt-4 text-pretty font-light leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <h2 className="display text-3xl md:text-4xl">Start a project</h2>
          <p className="mt-4 font-light text-muted-foreground">
            Tell us about your brand and we will reply personally.
          </p>
          <a
            href="/#contact"
            className="label-mono press mt-8 inline-block border border-foreground px-6 py-4 transition-colors hover:bg-foreground hover:text-background"
          >
            Get in touch →
          </a>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-8 md:px-10">
          <img src={logo.url} alt="Fluxscales" width={844} height={135} className="h-4 w-auto" />
          <p className="label-mono text-muted-foreground">© 2026 Fluxscales</p>
        </div>
      </footer>
    </div>
  );
}
