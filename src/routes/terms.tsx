import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/fluxscales-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/seo";

const description = "Terms for using the Fluxscales website, making enquiries and agreeing branding and web projects.";
export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Website Terms | Fluxscales" },
      { name: "description", content: description },
      { property: "og:title", content: "Website Terms | Fluxscales" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/terms` }],
  }),
  component: Terms,
});

const sections = [
  { h: "Using this website", body: "This website presents Fluxscales’ branding and web services. You may browse it and contact us about a project. Do not misuse the contact form, attempt to access private information or disrupt the website." },
  { h: "Enquiries and project agreements", body: "Sending an enquiry does not place an order or commit either party to a project. Any paid work needs a separate agreement covering the scope, deliverables, timing, fees, payment schedule and ownership or licensing of the work." },
  { h: "Fees, cancellation and refunds", body: "This website does not take payments or sell subscriptions. For a proposed project, ask us for the applicable fees, cancellation and refund terms before agreeing or paying. These belong in the project agreement. Nothing on this page limits any mandatory consumer rights." },
  { h: "Website content", body: "Website images are illustrative and are not presented as evidence of client projects. Website content does not grant a licence to reuse the Fluxscales name, logo or other protected material. Contact us about any reuse request or concern about content." },
  { h: "External links", body: "Links to Instagram and other external websites take you to services with their own terms and privacy policies. We do not control their content or availability." },
  { h: "Contact and privacy", body: "For questions about these terms, contact team@fluxscales.site or +356 99944202. Our Privacy Policy explains how enquiries and optional analytics are handled. Last updated: 4 November 2026." },
];

function Terms() {
  return <div lang="en" dir="ltr" className="min-h-screen bg-background">
    <header className="border-b border-border"><div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-10">
      <Link to="/" aria-label="Fluxscales home"><img src={logo.url} alt="Fluxscales" width={844} height={135} className="h-4 w-auto md:h-5" /></Link>
      <Button asChild variant="contact"><Link to="/">Back</Link></Button>
    </div></header>
    <main className="mx-auto max-w-[760px] px-5 py-16 md:py-24">
      <p className="label-mono text-muted-foreground">Legal</p><h1 className="display mt-4 text-5xl md:text-7xl">Website Terms</h1>
      <div className="mt-14 space-y-12">{sections.map((s) => <section key={s.h} className="border-t border-border pt-8"><h2 className="text-xl font-medium">{s.h}</h2><p className="mt-4 font-light leading-relaxed text-muted-foreground">{s.body}</p></section>)}</div>
      <Link to="/privacy" className="mt-10 inline-block text-muted-foreground underline underline-offset-4">Privacy Policy</Link>
    </main>
    <footer className="border-t border-border px-5 py-8"><p className="label-mono mx-auto max-w-[1500px] text-muted-foreground">© 2026 Fluxscales</p></footer>
  </div>;
}