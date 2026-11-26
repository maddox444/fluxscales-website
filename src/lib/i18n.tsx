import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "mt", label: "Maltese", native: "Malti", dir: "ltr" },
  { code: "it", label: "Italian", native: "Italiano", dir: "ltr" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
  { code: "uk", label: "Ukrainian", native: "Українська", dir: "ltr" },
  { code: "ru", label: "Russian", native: "Русский", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const en = {
  skip: "Skip to content",
  nav: { services: "Services", process: "Process", studio: "Studio", start: "Start a project" },
  menu: { open: "Open menu", close: "Close menu", label: "Menu", language: "Language" },
  hero: {
    eyebrow: "Brand · Web · Campaign",
    l1: "Brands that",
    l2: "hold their",
    l3: "shape.",
    lede: "A small studio working in strict black and white. We build identity, digital and campaign work that stays sharp as it scales.",
    cta: "See services",
  },
  marquee: ["Identity", "Websites", "Campaigns", "Art direction", "Motion", "Packaging"],
  statement: {
    label: "Why we exist",
    a: "Most brands don't fail because they look bad. They fail because nobody can repeat what they stand for.",
    b: "We fix that first, then make it look inevitable.",
  },
  services: {
    heading: "What we do",
    items: [
      {
        title: "Brand Identity",
        body: "Naming, positioning, logo systems and typography, plus the rules that keep them holding together after we hand over.",
        items: ["Strategy & positioning", "Visual identity", "Guidelines", "Collateral"],
      },
      {
        title: "Websites",
        body: "Fast, considered sites designed and built end to end, with a CMS your team can actually use.",
        items: ["UX & wireframes", "UI design", "Development", "Analytics"],
      },
      {
        title: "Campaigns",
        body: "Concepts that carry across paid, social, print and out-of-home without losing their edge.",
        items: ["Creative concepts", "Art direction", "Content", "Paid media"],
      },
      {
        title: "Content",
        body: "Photography, motion and copy produced to a single art direction, not stitched together afterwards.",
        items: ["Photography", "Motion & edit", "Copywriting", "Social assets"],
      },
    ],
  },
  process: {
    heading: "How it runs",
    step: "Step",
    steps: [
      {
        k: "Interrogate",
        v: "We pull the brand apart, audience, category, competitors, and the questions nobody enjoys answering.",
      },
      { k: "Define", v: "One sharp idea, written in plain language before a single pixel is drawn." },
      { k: "Design", v: "Identity, interface and content built from that idea, in tight review loops." },
      { k: "Deploy", v: "Built, launched, measured then improved on a schedule, not a whim." },
    ],
  },
  studio: {
    heading: "The studio",
    p1: "A compact team of strategists, designers and developers. You work with the people doing the work, no account layer, no handover after the pitch.",
    p2: "We take on a limited number of projects at a time so each one gets full attention. Everything is designed monochrome-first: if it doesn't work in black and white, colour won't save it.",
    stats: {
      founded: "Founded",
      projects: "Projects scaled",
      engagement: "Avg. engagement",
      team: "Team",
      weeks: "12 wks",
    },
  },
  contact: {
    label: "Next step",
    h1: "Tell us what",
    h2: "you're building.",
  },
  footer: { rights: "All rights reserved" },
  form: {
    name: "Name",
    email: "Email",
    company: "Company",
    budget: "Budget range",
    budgetPlaceholder: "e.g. 15–30k",
    message: "What are you building?",
    send: "Send message",
    sending: "Sending…",
    sentTitle: "Message received.",
    sentBody: "We read everything ourselves and reply within two working days.",
    errName: "Please enter your name",
    errNameLong: "Name is too long",
    errEmail: "Please enter your email",
    errEmailValid: "Enter a valid email address",
    errEmailLong: "Email is too long",
    errCompanyLong: "Company name is too long",
    errMessage: "Tell us a little more, at least 20 characters",
    errMessageLong: "Message is too long (2000 characters max)",
    errGeneric: "Something went wrong. Please try again.",
    errNetwork: "We couldn't send that. Please email team@fluxscales.site instead.",
  },
  consent: {
    label: "Analytics consent",
    body: "We count anonymous page views to see what's useful, no cookies, no ad networks, no personal data. Nothing is measured until you say yes.",
    decline: "Decline",
    allow: "Allow",
  },
};

export type Dict = typeof en;

const mt: Dict = {
  skip: "Aqbeż għall-kontenut",
  nav: { services: "Servizzi", process: "Proċess", studio: "Studio", start: "Ibda proġett" },
  menu: { open: "Iftaħ il-menu", close: "Agħlaq il-menu", label: "Menu", language: "Lingwa" },
  hero: {
    eyebrow: "Marka · Web · Kampanji",
    l1: "Marki li",
    l2: "jżommu l-",
    l3: "forma.",
    lede: "Studio żgħir li jaħdem strettament bl-iswed u l-abjad. Nibnu identità, xogħol diġitali u kampanji li jibqgħu ċari hekk kif jikbru.",
    cta: "Ara s-servizzi",
  },
  marquee: ["Identità", "Websajts", "Kampanji", "Direzzjoni artistika", "Moviment", "Ippakkjar"],
  statement: {
    label: "Għaliex neżistu",
    a: "Ħafna marki ma jfallux għax jidhru ħżiena. Ifallu għax ħadd ma jista' jtenni għal xiex iwaqqfu.",
    b: "Nirranġaw dan l-ewwel, imbagħad nagħmluh jidher inevitabbli.",
  },
  services: {
    heading: "X'nagħmlu",
    items: [
      {
        title: "Identità tal-Marka",
        body: "Isem, pożizzjonament, sistemi ta' logo u tipografija, flimkien mar-regoli li jżommu kollox sħiħ wara li ngħaddu x-xogħol.",
        items: ["Strateġija u pożizzjonament", "Identità viżiva", "Linji gwida", "Materjal ta' sapport"],
      },
      {
        title: "Websajts",
        body: "Siti mgħaġġla u maħsuba, iddisinjati u mibnija mill-bidu sal-aħħar, b'CMS li t-tim tiegħek tabilħaqq jista' juża.",
        items: ["UX u wireframes", "Disinn UI", "Żvilupp", "Analitika"],
      },
      {
        title: "Kampanji",
        body: "Kunċetti li jaħdmu fuq midja mħallsa, soċjali, stampata u barra, mingħajr ma jitilfu l-qawwa tagħhom.",
        items: ["Kunċetti kreattivi", "Direzzjoni artistika", "Kontenut", "Midja mħallsa"],
      },
      {
        title: "Kontenut",
        body: "Fotografija, moviment u kitba prodotti taħt direzzjoni artistika waħda, mhux imwaħħla flimkien wara.",
        items: ["Fotografija", "Moviment u editjar", "Kitba", "Assi soċjali"],
      },
    ],
  },
  process: {
    heading: "Kif naħdmu",
    step: "Pass",
    steps: [
      {
        k: "Nistħarrġu",
        v: "Nifirdu l-marka biċċa biċċa, udjenza, kategorija, kompetituri, u l-mistoqsijiet li ħadd ma jieħu gost iwieġeb.",
      },
      { k: "Niddefinixxu", v: "Idea waħda ċara, miktuba b'lingwaġġ sempliċi qabel ma jinġibed pixel wieħed." },
      { k: "Niddisinjaw", v: "Identità, interfaċċa u kontenut mibnija minn dik l-idea, f'ċikli ta' reviżjoni stretti." },
      { k: "Nvaraw", v: "Mibni, imniedi, imkejjel, imbagħad imtejjeb fuq skeda, mhux fuq kapriċċ." },
    ],
  },
  studio: {
    heading: "L-istudio",
    p1: "Tim żgħir ta' strateġisti, disinjaturi u żviluppaturi. Taħdem direttament man-nies li qed jagħmlu x-xogħol, bla saffi ta' accounts, bla tibdil wara l-preżentazzjoni.",
    p2: "Nieħdu numru limitat ta' proġetti f'daqqa biex kull wieħed jingħata attenzjoni sħiħa. Kollox jiġi ddisinjat monokromatiku l-ewwel: jekk ma jaħdimx bl-iswed u l-abjad, il-kulur mhux se jsalvah.",
    stats: {
      founded: "Imwaqqaf",
      projects: "Proġetti mkabbra",
      engagement: "Medja ta' inkarigu",
      team: "Tim",
      weeks: "12 ġimgħa",
    },
  },
  contact: { label: "Il-pass li jmiss", h1: "Għidilna x'qed", h2: "tibni." },
  footer: { rights: "Id-drittijiet kollha riżervati" },
  form: {
    name: "Isem",
    email: "Email",
    company: "Kumpanija",
    budget: "Baġit",
    budgetPlaceholder: "eż. 15–30k",
    message: "X'qed tibni?",
    send: "Ibgħat il-messaġġ",
    sending: "Qed jintbagħat…",
    sentTitle: "Il-messaġġ wasal.",
    sentBody: "Naqraw kollox aħna stess u nweġbu fi żmien jumejn tax-xogħol.",
    errName: "Jekk jogħġbok daħħal ismek",
    errNameLong: "L-isem huwa twil wisq",
    errEmail: "Jekk jogħġbok daħħal l-email tiegħek",
    errEmailValid: "Daħħal indirizz email validu",
    errEmailLong: "L-email hija twila wisq",
    errCompanyLong: "L-isem tal-kumpanija huwa twil wisq",
    errMessage: "Għidilna ftit aktar, mill-inqas 20 karattru",
    errMessageLong: "Il-messaġġ huwa twil wisq (massimu 2000 karattru)",
    errGeneric: "Qalgħet problema. Erġa' pprova jekk jogħġbok.",
    errNetwork: "Ma stajniex nibagħtuh. Ibgħat email lil team@fluxscales.site minflok.",
  },
  consent: {
    label: "Kunsens għall-analitika",
    body: "Ngħoddu żjarat anonimi biex naraw x'inhu utli, bla cookies, bla netwerks tar-reklami, bla dejta personali. Xejn ma jitkejjel qabel ma tgħid iva.",
    decline: "Irrifjuta",
    allow: "Aċċetta",
  },
};

const it: Dict = {
  skip: "Vai al contenuto",
  nav: { services: "Servizi", process: "Processo", studio: "Studio", start: "Inizia un progetto" },
  menu: { open: "Apri il menu", close: "Chiudi il menu", label: "Menu", language: "Lingua" },
  hero: {
    eyebrow: "Brand · Web · Campagne",
    l1: "Marchi che",
    l2: "mantengono la",
    l3: "forma.",
    lede: "Uno studio piccolo che lavora rigorosamente in bianco e nero. Costruiamo identità, progetti digitali e campagne che restano nitidi mentre crescono.",
    cta: "Scopri i servizi",
  },
  marquee: ["Identità", "Siti web", "Campagne", "Direzione artistica", "Motion", "Packaging"],
  statement: {
    label: "Perché esistiamo",
    a: "La maggior parte dei marchi non fallisce perché è brutta. Fallisce perché nessuno sa ripetere cosa rappresenta.",
    b: "Prima risolviamo questo, poi lo rendiamo inevitabile anche nella forma.",
  },
  services: {
    heading: "Cosa facciamo",
    items: [
      {
        title: "Identità di marca",
        body: "Naming, posizionamento, sistemi di logo e tipografia, con le regole che li tengono insieme anche dopo la consegna.",
        items: ["Strategia e posizionamento", "Identità visiva", "Linee guida", "Materiali"],
      },
      {
        title: "Siti web",
        body: "Siti veloci e curati, progettati e sviluppati dall'inizio alla fine, con un CMS che il tuo team può davvero usare.",
        items: ["UX e wireframe", "Design UI", "Sviluppo", "Analytics"],
      },
      {
        title: "Campagne",
        body: "Concept che funzionano su paid, social, stampa e affissione senza perdere forza.",
        items: ["Concept creativi", "Direzione artistica", "Contenuti", "Media a pagamento"],
      },
      {
        title: "Contenuti",
        body: "Fotografia, motion e copy prodotti sotto un'unica direzione artistica, non assemblati dopo.",
        items: ["Fotografia", "Motion e montaggio", "Copywriting", "Asset social"],
      },
    ],
  },
  process: {
    heading: "Come lavoriamo",
    step: "Fase",
    steps: [
      {
        k: "Indagare",
        v: "Smontiamo il marchio, pubblico, categoria, concorrenti e le domande a cui nessuno ama rispondere.",
      },
      { k: "Definire", v: "Un'idea netta, scritta in parole semplici prima di disegnare un solo pixel." },
      { k: "Progettare", v: "Identità, interfaccia e contenuti costruiti da quell'idea, con revisioni serrate." },
      { k: "Lanciare", v: "Costruito, lanciato, misurato, poi migliorato secondo un piano, non a caso." },
    ],
  },
  studio: {
    heading: "Lo studio",
    p1: "Un team compatto di strateghi, designer e sviluppatori. Lavori con le persone che fanno il lavoro, nessun livello commerciale, nessun passaggio di mano dopo la presentazione.",
    p2: "Accettiamo un numero limitato di progetti alla volta, così ognuno riceve piena attenzione. Tutto nasce prima in monocromia: se non funziona in bianco e nero, il colore non lo salverà.",
    stats: {
      founded: "Fondato",
      projects: "Progetti scalati",
      engagement: "Durata media",
      team: "Team",
      weeks: "12 sett.",
    },
  },
  contact: { label: "Prossimo passo", h1: "Raccontaci cosa", h2: "stai costruendo." },
  footer: { rights: "Tutti i diritti riservati" },
  form: {
    name: "Nome",
    email: "Email",
    company: "Azienda",
    budget: "Budget",
    budgetPlaceholder: "es. 15–30k",
    message: "Cosa stai costruendo?",
    send: "Invia messaggio",
    sending: "Invio…",
    sentTitle: "Messaggio ricevuto.",
    sentBody: "Leggiamo tutto personalmente e rispondiamo entro due giorni lavorativi.",
    errName: "Inserisci il tuo nome",
    errNameLong: "Il nome è troppo lungo",
    errEmail: "Inserisci la tua email",
    errEmailValid: "Inserisci un indirizzo email valido",
    errEmailLong: "L'email è troppo lunga",
    errCompanyLong: "Il nome dell'azienda è troppo lungo",
    errMessage: "Raccontaci qualcosa in più, almeno 20 caratteri",
    errMessageLong: "Il messaggio è troppo lungo (massimo 2000 caratteri)",
    errGeneric: "Qualcosa è andato storto. Riprova.",
    errNetwork: "Non siamo riusciti a inviare. Scrivi a team@fluxscales.site.",
  },
  consent: {
    label: "Consenso analytics",
    body: "Contiamo visite anonime per capire cosa è utile, nessun cookie, nessun ad network, nessun dato personale. Non misuriamo nulla finché non dici di sì.",
    decline: "Rifiuta",
    allow: "Accetta",
  },
};

const fr: Dict = {
  skip: "Aller au contenu",
  nav: { services: "Services", process: "Processus", studio: "Studio", start: "Démarrer un projet" },
  menu: { open: "Ouvrir le menu", close: "Fermer le menu", label: "Menu", language: "Langue" },
  hero: {
    eyebrow: "Marque · Web · Campagnes",
    l1: "Des marques qui",
    l2: "gardent leur",
    l3: "forme.",
    lede: "Un petit studio qui travaille strictement en noir et blanc. Nous construisons des identités, du digital et des campagnes qui restent nets à mesure qu'ils grandissent.",
    cta: "Voir les services",
  },
  marquee: ["Identité", "Sites web", "Campagnes", "Direction artistique", "Motion", "Packaging"],
  statement: {
    label: "Pourquoi nous existons",
    a: "La plupart des marques n'échouent pas parce qu'elles sont laides. Elles échouent parce que personne ne sait répéter ce qu'elles défendent.",
    b: "Nous réglons cela d'abord, puis nous le rendons évident.",
  },
  services: {
    heading: "Ce que nous faisons",
    items: [
      {
        title: "Identité de marque",
        body: "Naming, positionnement, systèmes de logo et typographie, avec les règles qui tiennent l'ensemble après la livraison.",
        items: ["Stratégie et positionnement", "Identité visuelle", "Charte graphique", "Supports"],
      },
      {
        title: "Sites web",
        body: "Des sites rapides et réfléchis, conçus et développés de bout en bout, avec un CMS réellement utilisable par votre équipe.",
        items: ["UX et wireframes", "Design UI", "Développement", "Analytics"],
      },
      {
        title: "Campagnes",
        body: "Des concepts qui tiennent en paid, social, print et affichage sans perdre leur tranchant.",
        items: ["Concepts créatifs", "Direction artistique", "Contenu", "Média payant"],
      },
      {
        title: "Contenu",
        body: "Photographie, motion et écriture produits sous une seule direction artistique, pas assemblés après coup.",
        items: ["Photographie", "Motion et montage", "Rédaction", "Contenus sociaux"],
      },
    ],
  },
  process: {
    heading: "Comment ça se passe",
    step: "Étape",
    steps: [
      {
        k: "Interroger",
        v: "Nous démontons la marque, audience, catégorie, concurrents, et les questions que personne n'aime aborder.",
      },
      { k: "Définir", v: "Une idée nette, écrite simplement avant qu'un seul pixel ne soit dessiné." },
      { k: "Concevoir", v: "Identité, interface et contenu construits à partir de cette idée, en boucles de revue serrées." },
      { k: "Déployer", v: "Construit, lancé, mesuré, puis amélioré selon un calendrier, pas selon l'humeur." },
    ],
  },
  studio: {
    heading: "Le studio",
    p1: "Une équipe restreinte de stratèges, designers et développeurs. Vous travaillez avec les personnes qui font le travail, sans couche commerciale, sans passage de relais après la présentation.",
    p2: "Nous prenons un nombre limité de projets à la fois pour que chacun reçoive toute notre attention. Tout est conçu en monochrome d'abord : si ça ne marche pas en noir et blanc, la couleur n'y changera rien.",
    stats: {
      founded: "Fondé en",
      projects: "Projets développés",
      engagement: "Durée moyenne",
      team: "Équipe",
      weeks: "12 sem.",
    },
  },
  contact: { label: "Prochaine étape", h1: "Dites-nous ce que", h2: "vous construisez." },
  footer: { rights: "Tous droits réservés" },
  form: {
    name: "Nom",
    email: "E-mail",
    company: "Société",
    budget: "Budget",
    budgetPlaceholder: "ex. 15–30k",
    message: "Que construisez-vous ?",
    send: "Envoyer le message",
    sending: "Envoi…",
    sentTitle: "Message bien reçu.",
    sentBody: "Nous lisons tout nous-mêmes et répondons sous deux jours ouvrés.",
    errName: "Veuillez saisir votre nom",
    errNameLong: "Le nom est trop long",
    errEmail: "Veuillez saisir votre e-mail",
    errEmailValid: "Saisissez une adresse e-mail valide",
    errEmailLong: "L'e-mail est trop long",
    errCompanyLong: "Le nom de la société est trop long",
    errMessage: "Dites-nous en un peu plus, au moins 20 caractères",
    errMessageLong: "Le message est trop long (2000 caractères maximum)",
    errGeneric: "Une erreur est survenue. Veuillez réessayer.",
    errNetwork: "L'envoi a échoué. Écrivez-nous à team@fluxscales.site.",
  },
  consent: {
    label: "Consentement analytique",
    body: "Nous comptons des visites anonymes pour voir ce qui est utile, pas de cookies, pas de régie publicitaire, pas de données personnelles. Rien n'est mesuré tant que vous n'avez pas accepté.",
    decline: "Refuser",
    allow: "Accepter",
  },
};

const uk: Dict = {
  skip: "Перейти до вмісту",
  nav: { services: "Послуги", process: "Процес", studio: "Студія", start: "Почати проєкт" },
  menu: { open: "Відкрити меню", close: "Закрити меню", label: "Меню", language: "Мова" },
  hero: {
    eyebrow: "Бренд · Веб · Кампанії",
    l1: "Бренди, що",
    l2: "тримають",
    l3: "форму.",
    lede: "Невелика студія, що працює строго в чорному й білому. Ми створюємо айдентику, цифрові продукти та кампанії, які залишаються чіткими, коли масштабуються.",
    cta: "Переглянути послуги",
  },
  marquee: ["Айдентика", "Сайти", "Кампанії", "Арт-дирекція", "Моушн", "Пакування"],
  statement: {
    label: "Навіщо ми існуємо",
    a: "Більшість брендів програють не тому, що виглядають погано. Вони програють тому, що ніхто не може переказати, за що вони стоять.",
    b: "Спершу ми виправляємо це, а потім робимо вигляд неминучим.",
  },
  services: {
    heading: "Що ми робимо",
    items: [
      {
        title: "Айдентика бренду",
        body: "Нейминг, позиціонування, системи логотипів і типографіка, разом із правилами, які тримають усе разом після передавання.",
        items: ["Стратегія та позиціонування", "Візуальна айдентика", "Гайдлайни", "Носії"],
      },
      {
        title: "Сайти",
        body: "Швидкі й продумані сайти, спроєктовані та зібрані від початку до кінця, із CMS, якою команда справді користуватиметься.",
        items: ["UX і вайрфрейми", "UI-дизайн", "Розробка", "Аналітика"],
      },
      {
        title: "Кампанії",
        body: "Ідеї, що працюють у платних медіа, соцмережах, друці та зовнішній рекламі, не втрачаючи гостроти.",
        items: ["Креативні концепції", "Арт-дирекція", "Контент", "Платні медіа"],
      },
      {
        title: "Контент",
        body: "Фотографія, моушн і тексти, створені в одній арт-дирекції, а не зшиті докупи потім.",
        items: ["Фотографія", "Моушн і монтаж", "Копірайтинг", "Матеріали для соцмереж"],
      },
    ],
  },
  process: {
    heading: "Як це працює",
    step: "Крок",
    steps: [
      {
        k: "Дослідити",
        v: "Ми розбираємо бренд на частини, аудиторія, категорія, конкуренти й запитання, на які ніхто не любить відповідати.",
      },
      { k: "Визначити", v: "Одна чітка ідея, сформульована простими словами ще до першого пікселя." },
      { k: "Спроєктувати", v: "Айдентика, інтерфейс і контент, побудовані з цієї ідеї, у щільних циклах правок." },
      { k: "Запустити", v: "Зібрано, запущено, виміряно, а далі покращення за графіком, а не за настроєм." },
    ],
  },
  studio: {
    heading: "Студія",
    p1: "Компактна команда стратегів, дизайнерів і розробників. Ви працюєте з тими, хто робить роботу, без менеджерського прошарку й без передавання після презентації.",
    p2: "Ми беремо обмежену кількість проєктів одночасно, щоб кожен отримав повну увагу. Усе спершу проєктується монохромним: якщо не працює в чорно-білому, колір не врятує.",
    stats: {
      founded: "Засновано",
      projects: "Масштабовано проєктів",
      engagement: "Середній проєкт",
      team: "Команда",
      weeks: "12 тижн.",
    },
  },
  contact: { label: "Наступний крок", h1: "Розкажіть, що", h2: "ви будуєте." },
  footer: { rights: "Усі права захищено" },
  form: {
    name: "Ім'я",
    email: "Пошта",
    company: "Компанія",
    budget: "Бюджет",
    budgetPlaceholder: "напр. 15–30k",
    message: "Що ви будуєте?",
    send: "Надіслати",
    sending: "Надсилання…",
    sentTitle: "Повідомлення отримано.",
    sentBody: "Ми читаємо все самі й відповідаємо протягом двох робочих днів.",
    errName: "Вкажіть, будь ласка, ваше ім'я",
    errNameLong: "Ім'я задовге",
    errEmail: "Вкажіть вашу електронну пошту",
    errEmailValid: "Введіть дійсну адресу пошти",
    errEmailLong: "Адреса задовга",
    errCompanyLong: "Назва компанії задовга",
    errMessage: "Розкажіть трохи більше, щонайменше 20 символів",
    errMessageLong: "Повідомлення задовге (максимум 2000 символів)",
    errGeneric: "Щось пішло не так. Спробуйте ще раз.",
    errNetwork: "Не вдалося надіслати. Напишіть на team@fluxscales.site.",
  },
  consent: {
    label: "Згода на аналітику",
    body: "Ми рахуємо анонімні перегляди сторінок, щоб бачити, що корисно, без файлів cookie, рекламних мереж і персональних даних. Нічого не вимірюється, доки ви не погодитесь.",
    decline: "Відхилити",
    allow: "Дозволити",
  },
};

const ru: Dict = {
  skip: "Перейти к содержимому",
  nav: { services: "Услуги", process: "Процесс", studio: "Студия", start: "Начать проект" },
  menu: { open: "Открыть меню", close: "Закрыть меню", label: "Меню", language: "Язык" },
  hero: {
    eyebrow: "Бренд · Веб · Кампании",
    l1: "Бренды, которые",
    l2: "держат",
    l3: "форму.",
    lede: "Небольшая студия, работающая строго в чёрном и белом. Мы делаем айдентику, цифровые продукты и кампании, которые остаются чёткими при росте.",
    cta: "Смотреть услуги",
  },
  marquee: ["Айдентика", "Сайты", "Кампании", "Арт-дирекция", "Моушн", "Упаковка"],
  statement: {
    label: "Зачем мы нужны",
    a: "Большинство брендов проигрывают не потому, что плохо выглядят. Они проигрывают потому, что никто не может пересказать, за что они стоят.",
    b: "Сначала мы решаем это, а потом делаем форму неизбежной.",
  },
  services: {
    heading: "Что мы делаем",
    items: [
      {
        title: "Айдентика бренда",
        body: "Нейминг, позиционирование, системы логотипов и типографика, плюс правила, которые держат всё вместе после передачи.",
        items: ["Стратегия и позиционирование", "Визуальная айдентика", "Гайдлайны", "Носители"],
      },
      {
        title: "Сайты",
        body: "Быстрые, продуманные сайты, спроектированные и собранные от начала до конца, с CMS, которой команда действительно будет пользоваться.",
        items: ["UX и вайрфреймы", "UI-дизайн", "Разработка", "Аналитика"],
      },
      {
        title: "Кампании",
        body: "Идеи, которые работают в платных медиа, соцсетях, печати и наружной рекламе, не теряя остроты.",
        items: ["Креативные концепции", "Арт-дирекция", "Контент", "Платные медиа"],
      },
      {
        title: "Контент",
        body: "Фотография, моушн и тексты в единой арт-дирекции, а не собранные вместе постфактум.",
        items: ["Фотография", "Моушн и монтаж", "Копирайтинг", "Материалы для соцсетей"],
      },
    ],
  },
  process: {
    heading: "Как это устроено",
    step: "Шаг",
    steps: [
      {
        k: "Разобрать",
        v: "Мы разбираем бренд на части, аудитория, категория, конкуренты и вопросы, на которые никто не любит отвечать.",
      },
      { k: "Определить", v: "Одна чёткая идея, сформулированная простыми словами до первого пикселя." },
      { k: "Спроектировать", v: "Айдентика, интерфейс и контент, выстроенные из этой идеи, в плотных циклах правок." },
      { k: "Запустить", v: "Собрано, запущено, измерено, дальше улучшения по графику, а не по настроению." },
    ],
  },
  studio: {
    heading: "Студия",
    p1: "Компактная команда стратегов, дизайнеров и разработчиков. Вы работаете с теми, кто делает работу, без менеджерской прослойки и передачи после презентации.",
    p2: "Мы берём ограниченное число проектов одновременно, чтобы каждому досталось полное внимание. Всё проектируется сначала монохромным: если не работает в чёрно-белом, цвет не спасёт.",
    stats: {
      founded: "Основано",
      projects: "Проектов масштабировано",
      engagement: "Средний проект",
      team: "Команда",
      weeks: "12 нед.",
    },
  },
  contact: { label: "Следующий шаг", h1: "Расскажите, что", h2: "вы строите." },
  footer: { rights: "Все права защищены" },
  form: {
    name: "Имя",
    email: "Почта",
    company: "Компания",
    budget: "Бюджет",
    budgetPlaceholder: "напр. 15–30k",
    message: "Что вы строите?",
    send: "Отправить",
    sending: "Отправка…",
    sentTitle: "Сообщение получено.",
    sentBody: "Мы читаем всё сами и отвечаем в течение двух рабочих дней.",
    errName: "Укажите, пожалуйста, ваше имя",
    errNameLong: "Имя слишком длинное",
    errEmail: "Укажите вашу почту",
    errEmailValid: "Введите корректный адрес почты",
    errEmailLong: "Адрес слишком длинный",
    errCompanyLong: "Название компании слишком длинное",
    errMessage: "Расскажите чуть больше, минимум 20 символов",
    errMessageLong: "Сообщение слишком длинное (максимум 2000 символов)",
    errGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
    errNetwork: "Не удалось отправить. Напишите на team@fluxscales.site.",
  },
  consent: {
    label: "Согласие на аналитику",
    body: "Мы считаем анонимные просмотры страниц, чтобы понимать, что полезно, без cookie, рекламных сетей и персональных данных. Ничего не измеряется, пока вы не согласитесь.",
    decline: "Отклонить",
    allow: "Разрешить",
  },
};

const ar: Dict = {
  skip: "تخطَّ إلى المحتوى",
  nav: { services: "الخدمات", process: "منهجية العمل", studio: "الاستوديو", start: "ابدأ مشروعًا" },
  menu: { open: "فتح القائمة", close: "إغلاق القائمة", label: "القائمة", language: "اللغة" },
  hero: {
    eyebrow: "هوية · ويب · حملات",
    l1: "علامات",
    l2: "تحافظ على",
    l3: "شكلها.",
    lede: "استوديو صغير يعمل بالأبيض والأسود فقط. نبني هويات ومواقع وحملات تبقى واضحة مهما اتّسع نطاقها.",
    cta: "استعرض الخدمات",
  },
  marquee: ["الهوية", "المواقع", "الحملات", "الإخراج الفني", "الموشن", "التغليف"],
  statement: {
    label: "لماذا نحن هنا",
    a: "أغلب العلامات لا تفشل لأن شكلها سيئ، بل لأن لا أحد يستطيع أن يعيد بكلماته ما تمثّله.",
    b: "نعالج ذلك أولًا، ثم نجعل شكلها يبدو بديهيًا.",
  },
  services: {
    heading: "ما نقدّمه",
    items: [
      {
        title: "هوية العلامة",
        body: "التسمية والتموضع وأنظمة الشعار والخطوط, إضافة إلى القواعد التي تُبقيها متماسكة بعد التسليم.",
        items: ["الاستراتيجية والتموضع", "الهوية البصرية", "الدليل الإرشادي", "المطبوعات"],
      },
      {
        title: "المواقع",
        body: "مواقع سريعة ومدروسة، تُصمَّم وتُبنى من البداية إلى النهاية، مع نظام إدارة محتوى يستطيع فريقك استخدامه فعلًا.",
        items: ["تجربة المستخدم والمخططات", "تصميم الواجهات", "التطوير", "التحليلات"],
      },
      {
        title: "الحملات",
        body: "أفكار تصمد في الإعلانات المدفوعة والتواصل الاجتماعي والمطبوعات واللوحات الخارجية دون أن تفقد حدّتها.",
        items: ["الأفكار الإبداعية", "الإخراج الفني", "المحتوى", "الإعلانات المدفوعة"],
      },
      {
        title: "المحتوى",
        body: "تصوير وموشن ونصوص تُنتَج ضمن إخراج فني واحد، لا مجمّعة لاحقًا.",
        items: ["التصوير", "الموشن والمونتاج", "كتابة النصوص", "مواد التواصل الاجتماعي"],
      },
    ],
  },
  process: {
    heading: "كيف نعمل",
    step: "الخطوة",
    steps: [
      {
        k: "التفكيك",
        v: "نفكّك العلامة إلى أجزائها, الجمهور والفئة والمنافسون والأسئلة التي لا يحب أحد الإجابة عنها.",
      },
      { k: "التحديد", v: "فكرة واحدة واضحة، مكتوبة بلغة بسيطة قبل رسم أي بكسل." },
      { k: "التصميم", v: "هوية وواجهة ومحتوى تُبنى من تلك الفكرة، عبر دورات مراجعة قصيرة." },
      { k: "الإطلاق", v: "نبني ونطلق ونقيس, ثم نطوّر وفق جدول واضح لا وفق المزاج." },
    ],
  },
  studio: {
    heading: "الاستوديو",
    p1: "فريق صغير من الاستراتيجيين والمصممين والمطورين. تتعامل مباشرة مع من ينفّذ العمل, بلا وسطاء ولا تسليم بعد العرض.",
    p2: "نقبل عددًا محدودًا من المشاريع في الوقت نفسه ليحظى كل مشروع بالاهتمام الكامل. كل شيء يُصمَّم بالأبيض والأسود أولًا: ما لا ينجح بلا لون، لن ينقذه اللون.",
    stats: {
      founded: "سنة التأسيس",
      projects: "مشاريع طوّرناها",
      engagement: "متوسط المشروع",
      team: "الفريق",
      weeks: "12 أسبوعًا",
    },
  },
  contact: { label: "الخطوة التالية", h1: "أخبرنا بما", h2: "تبنيه." },
  footer: { rights: "جميع الحقوق محفوظة" },
  form: {
    name: "الاسم",
    email: "البريد الإلكتروني",
    company: "الشركة",
    budget: "الميزانية",
    budgetPlaceholder: "مثال: 15–30k",
    message: "ما الذي تبنيه؟",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    sentTitle: "وصلتنا رسالتك.",
    sentBody: "نقرأ كل رسالة بأنفسنا ونردّ خلال يومي عمل.",
    errName: "يرجى إدخال اسمك",
    errNameLong: "الاسم طويل جدًا",
    errEmail: "يرجى إدخال بريدك الإلكتروني",
    errEmailValid: "أدخل بريدًا إلكترونيًا صحيحًا",
    errEmailLong: "البريد الإلكتروني طويل جدًا",
    errCompanyLong: "اسم الشركة طويل جدًا",
    errMessage: "أخبرنا بالمزيد, 20 حرفًا على الأقل",
    errMessageLong: "الرسالة طويلة جدًا (2000 حرف كحد أقصى)",
    errGeneric: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    errNetwork: "تعذّر الإرسال. راسلنا على team@fluxscales.site.",
  },
  consent: {
    label: "الموافقة على التحليلات",
    body: "نحصي زيارات مجهولة الهوية لنعرف ما هو مفيد, بلا ملفات تعريف ارتباط، بلا شبكات إعلانية، بلا بيانات شخصية. لا نقيس شيئًا قبل موافقتك.",
    decline: "رفض",
    allow: "موافق",
  },
};

const DICTS: Record<Lang, Dict> = { en, mt, it, fr, uk, ru, ar };
const STORAGE_KEY = "fluxscales:lang";

type Ctx = { lang: Lang; dir: "ltr" | "rtl"; t: Dict; setLang: (l: Lang) => void };

const I18nContext = createContext<Ctx | null>(null);

function isLang(v: string): v is Lang {
  return LANGUAGES.some((l) => l.code === v);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Resolve URL/stored/browser preference after hydration to avoid SSR mismatches.
  useEffect(() => {
    let next: Lang | null = null;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      if (fromUrl && isLang(fromUrl)) next = fromUrl;
    } catch {
      /* no URL access */
    }
    if (!next) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && isLang(stored)) next = stored;
      } catch {
        /* storage unavailable */
      }
    }
    if (!next) {
      const nav = navigator.language?.slice(0, 2).toLowerCase() ?? "";
      if (isLang(nav)) next = nav;
    }
    if (next && next !== "en") setLangState(next);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);


  const dir = LANGUAGES.find((l) => l.code === lang)?.dir ?? "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<Ctx>(
    () => ({ lang, dir: dir as "ltr" | "rtl", t: DICTS[lang], setLang }),
    [lang, dir, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en", dir: "ltr", t: en, setLang: () => {} };
  return ctx;
}
