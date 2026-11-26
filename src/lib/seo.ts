import { LANGUAGES, type Lang } from "@/lib/i18n";

export const SITE = "https://fluxscales.site";

export type LocaleSeo = {
  /** BCP-47 / Open Graph locale, e.g. en_GB */
  ogLocale: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

export const SEO: Record<Lang, LocaleSeo> = {
  en: {
    ogLocale: "en_GB",
    title: "Fluxscales",
    description:
      "Fluxscales is a small monochrome studio for brand identity, websites and campaigns. Strategy, design and build handled by the people doing the work.",
    ogTitle: "Fluxscales",
    ogDescription:
      "Identity, websites and campaigns built in strict black and white. A compact studio, limited projects, full attention.",
  },
  mt: {
    ogLocale: "mt_MT",
    title: "Fluxscales",
    description:
      "Fluxscales huwa studjo żgħir monokromatiku għall-identità tal-brand, websajts u kampanji. Strateġija, disinn u bini mill-istess nies li jaħdmu fuqhom.",
    ogTitle: "Fluxscales",
    ogDescription:
      "Identità, websajts u kampanji f'iswed u abjad strett. Studjo kompakt, proġetti limitati, attenzjoni sħiħa.",
  },
  it: {
    ogLocale: "it_IT",
    title: "Fluxscales",
    description:
      "Fluxscales è un piccolo studio monocromatico per identità di marca, siti web e campagne. Strategia, design e sviluppo curati dalle stesse persone.",
    ogTitle: "Fluxscales",
    ogDescription:
      "Identità, siti web e campagne in rigoroso bianco e nero. Studio compatto, progetti limitati, attenzione totale.",
  },
  fr: {
    ogLocale: "fr_FR",
    title: "Fluxscales",
    description:
      "Fluxscales est un petit studio monochrome dédié à l'identité de marque, aux sites web et aux campagnes. Stratégie, design et développement par les mêmes mains.",
    ogTitle: "Fluxscales",
    ogDescription:
      "Identité, sites web et campagnes en noir et blanc strict. Un studio compact, peu de projets, une attention totale.",
  },
  uk: {
    ogLocale: "uk_UA",
    title: "Fluxscales",
    description:
      "Fluxscales, невелика монохромна студія: айдентика бренду, вебсайти та кампанії. Стратегія, дизайн і розробка від тих самих людей.",
    ogTitle: "Fluxscales",
    ogDescription:
      "Айдентика, вебсайти та кампанії у строгому чорно-білому. Компактна студія, обмежена кількість проєктів, повна увага.",
  },
  ru: {
    ogLocale: "ru_RU",
    title: "Fluxscales",
    description:
      "Fluxscales, небольшая монохромная студия: айдентика бренда, сайты и кампании. Стратегия, дизайн и разработка одними и теми же руками.",
    ogTitle: "Fluxscales",
    ogDescription:
      "Айдентика, сайты и кампании в строгом чёрно-белом. Компактная студия, ограниченное число проектов, полное внимание.",
  },
  ar: {
    ogLocale: "ar_AR",
    title: "Fluxscales",
    description:
      "‏Fluxscales استوديو صغير أحادي اللون للهوية البصرية والمواقع والحملات. الاستراتيجية والتصميم والتنفيذ على يد الفريق نفسه.",
    ogTitle: "Fluxscales",
    ogDescription:
      "هوية ومواقع وحملات بالأسود والأبيض الصريح. استوديو مركّز، مشاريع محدودة، اهتمام كامل.",
  },
};

/** Canonical URL for a locale (English is the bare root). */
export function localeUrl(lang: Lang): string {
  return lang === "en" ? SITE : `${SITE}/?lang=${lang}`;
}

/** hreflang alternates for every locale plus x-default. */
export function alternateLinks() {
  return [
    ...LANGUAGES.map((l) => ({
      rel: "alternate",
      hrefLang: l.code,
      href: localeUrl(l.code as Lang),
    })),
    { rel: "alternate", hrefLang: "x-default", href: SITE },
  ];
}
