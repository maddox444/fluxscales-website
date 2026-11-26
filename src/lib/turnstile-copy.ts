import type { Lang } from "./i18n";

export const turnstileCopy: Record<Lang, { unavailable: string; retry: string }> = {
  en: {
    unavailable: "The anti-spam check couldn't load. Retry it or email us directly.",
    retry: "Retry anti-spam check",
  },
  mt: {
    unavailable:
      "Il-verifika kontra l-ispam ma setgħetx titgħabba. Erġa' pprova jew ibgħatilna email direttament.",
    retry: "Erġa' pprova l-verifika kontra l-ispam",
  },
  it: {
    unavailable:
      "Il controllo antispam non si è caricato. Riprova o scrivici direttamente via email.",
    retry: "Riprova il controllo antispam",
  },
  fr: {
    unavailable:
      "Le contrôle antispam n'a pas pu se charger. Réessayez ou contactez-nous directement par e-mail.",
    retry: "Réessayer le contrôle antispam",
  },
  uk: {
    unavailable:
      "Не вдалося завантажити перевірку захисту від спаму. Спробуйте ще раз або напишіть нам електронною поштою.",
    retry: "Повторити перевірку захисту від спаму",
  },
  ru: {
    unavailable:
      "Не удалось загрузить проверку защиты от спама. Попробуйте снова или напишите нам по электронной почте.",
    retry: "Повторить проверку защиты от спама",
  },
  ar: {
    unavailable:
      "تعذّر تحميل فحص مكافحة الرسائل المزعجة. أعد المحاولة أو راسلنا مباشرة عبر البريد الإلكتروني.",
    retry: "إعادة محاولة فحص مكافحة الرسائل المزعجة",
  },
};
