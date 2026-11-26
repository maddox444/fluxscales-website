import type { Lang } from "./i18n";

export const privacyCopy: Record<Lang, { privacy: string; terms: string; settings: string; notice: string }> = {
  en: { privacy: "Privacy", terms: "Terms", settings: "Privacy choices", notice: "We use your details to respond to your enquiry. Please do not include sensitive personal information." },
  mt: { privacy: "Privatezza", terms: "Termini", settings: "Għażliet tal-privatezza", notice: "Nużaw id-dettalji tiegħek biex inwieġbu għall-mistoqsija tiegħek. Jekk jogħġbok tinkludix informazzjoni personali sensittiva." },
  it: { privacy: "Privacy", terms: "Condizioni", settings: "Scelte sulla privacy", notice: "Usiamo i tuoi dati per rispondere alla tua richiesta. Non includere informazioni personali sensibili." },
  fr: { privacy: "Confidentialité", terms: "Conditions", settings: "Choix de confidentialité", notice: "Nous utilisons vos coordonnées pour répondre à votre demande. N’incluez pas de données personnelles sensibles." },
  uk: { privacy: "Конфіденційність", terms: "Умови", settings: "Налаштування конфіденційності", notice: "Ми використовуємо ваші дані, щоб відповісти на запит. Не додавайте чутливу особисту інформацію." },
  ru: { privacy: "Конфиденциальность", terms: "Условия", settings: "Настройки конфиденциальности", notice: "Мы используем ваши данные, чтобы ответить на запрос. Не указывайте чувствительную личную информацию." },
  ar: { privacy: "الخصوصية", terms: "الشروط", settings: "خيارات الخصوصية", notice: "نستخدم بياناتك للرد على استفسارك. يُرجى عدم تضمين معلومات شخصية حساسة." },
};