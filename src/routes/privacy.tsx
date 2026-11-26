import { createFileRoute, Link } from "@tanstack/react-router";

import logo from "@/assets/fluxscales-logo.png.asset.json";
import { SITE } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Fluxscales" },
      {
        name: "description",
        content:
          "How Fluxscales collects, uses and protects personal data submitted through the contact form, plus our consent-based analytics and spam protection.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Privacy Policy — Fluxscales" },
      {
        property: "og:description",
        content:
          "How Fluxscales collects, uses and protects personal data submitted through the contact form.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: `${SITE}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/privacy` }],
  }),
  component: Privacy,
});

const sections: { h: string; body: string[] }[] = [
  {
    h: "Who we are",
    body: [
      "Fluxscales is a branding and web studio based in Malta, operating worldwide. For the purposes of the EU General Data Protection Regulation (GDPR), Fluxscales is the data controller for personal data collected through this website.",
      "You can reach us at any time at team@fluxscales.site or +356 99944202.",
    ],
  },
  {
    h: "What we collect",
    body: [
      "Contact form: we collect your name, email address and project message. Please do not send sensitive personal information.",
      "Optional analytics: after you choose Allow, we record page paths, referring website hostnames, approximate screen categories and event timestamps. We do not store IP addresses or unique visitor identifiers in these analytics records, and do not use advertising or cross-site tracking. Declining or ignoring the banner prevents optional analytics, but does not prevent essential hosting or contact-form processing.",
      "Spam protection: hidden form checks help reject automated submissions. Cloudflare Turnstile is supported but is not currently configured. If enabled, it may process your IP address and browser characteristics to check for automated traffic.",
    ],
  },
  {
    h: "Third parties that process data",
    body: [
      "Hosting and database: this site and its form submissions are hosted on our cloud infrastructure provider, which stores data encrypted at rest and in transit.",
      "Email delivery: form submissions are forwarded to our team inbox through our transactional email provider.",
      "Fonts: your browser requests typefaces from Google Fonts. These requests expose technical connection information, including your IP address, to Google.",
      "Instagram links: Instagram receives information when you follow a link to its service, under its own privacy policy. We do not embed Instagram tracking widgets.",
      "Essential hosting and security services may process technical request information to deliver and protect this website. We do not sell your enquiry details or use them for marketing.",
    ],
  },
  {
    h: "How long we keep it",
    body: [
      "Enquiries and email copies are used to handle your conversation and any resulting project. Analytics are stored as individual events, not only aggregate totals. This website does not currently apply an automatic deletion schedule.",
      "To request deletion of an enquiry or related emails, write to team@fluxscales.site. We may need to verify your identity. Information subject to a legal retention requirement may need to be kept.",
    ],
  },
  {
    h: "Your rights",
    body: [
      "You may request access, correction, deletion, restriction, portability or object to processing where these GDPR rights apply. Email team@fluxscales.site. Requests are normally answered within one month; any permitted extension will be explained.",
      "You also have the right to lodge a complaint with the Maltese Office of the Information and Data Protection Commissioner (IDPC) or your local supervisory authority.",
    ],
  },
  {
    h: "Cookies, local storage and your choices",
    body: [
      "Our optional analytics do not use cookies. Your browser stores your analytics choice under fluxscales:analytics-consent and your language preference locally. These preferences are not advertising identifiers.",
      "You can reopen Privacy choices on this page or in the homepage footer and choose Decline to stop future optional analytics. This does not erase events already recorded. You can also clear saved preferences in your browser settings.",
    ],
  },
  {
    h: "Why we process data",
    body: [
      "We use enquiry information to take steps at your request before a potential project agreement, and our legitimate interest in answering general business correspondence. Optional analytics rely on your consent, which you can withdraw at any time. Essential security processing supports our legitimate interest in protecting the website.",
      "Cloud and email providers may process data outside your country. Where GDPR transfer safeguards are required, the applicable provider arrangements must cover those transfers. Contact us for details about processing your enquiry.",
    ],
  },
  {
    h: "Changes",
    body: [
      "If we change how we handle data we will update this page. Last updated: 4 November 2026.",
    ],
  },
];

function Privacy() {
  return (
    <div lang="en" dir="ltr" className="min-h-screen bg-background">
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
        <p className="label-mono text-muted-foreground">Legal</p>
        <h1 className="display mt-4 text-5xl md:text-7xl">Privacy Policy</h1>
        <p className="mt-6 max-w-xl text-lg font-light text-muted-foreground">
          We use enquiries to reply to you. Optional analytics run only after you allow them,
          and you can change that choice or request deletion of your enquiry.
        </p>
        <div className="mt-6 flex flex-wrap gap-6">
          <Button variant="contact" onClick={() => window.dispatchEvent(new Event("fluxscales:privacy-choices"))}>Privacy choices</Button>
          <Button asChild variant="contact"><Link to="/terms">Website terms</Link></Button>
          <Button asChild variant="contact"><a href="mailto:team@fluxscales.site?subject=Personal%20data%20request">Request data deletion</a></Button>
        </div>

        <div className="mt-14 space-y-12">
          {sections.map((s, i) => (
            <section key={s.h} className="border-t border-border pt-8">
              <h2 className="flex items-baseline gap-4 text-xl font-medium">
                <span className="label-mono text-muted-foreground">{`0${i + 1}`}</span>
                {s.h}
              </h2>
              <div className="mt-4 space-y-3">
                {s.body.map((p) => (
                  <p key={p.slice(0, 32)} className="text-pretty font-light leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
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
