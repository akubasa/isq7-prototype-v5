const { useState, useEffect, useRef, Fragment } = React;

const STEPS = [
  { id: "inbox",    label: "Inbox" },
  { id: "inquiry",  label: "Inquiry" },
  { id: "price",    label: "Pricing" },
  { id: "sent",     label: "Sent" },
];

const Icon = ({ n, s = 16 }) => {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (n) {
    case "sun":   return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case "moon":  return <svg {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case "arr":   return <svg {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case "back":  return <svg {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
    case "check": return <svg {...p} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>;
    case "spark": return <svg {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/></svg>;
    case "send":  return <svg {...p}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>;
    case "gear":  return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "chart": return <svg {...p}><path d="M3 3v18h18"/><path d="M7 14l3-3 4 4 5-6"/></svg>;
    case "arch":  return <svg {...p}><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><path d="M10 12h4"/></svg>;
    case "in":    return <svg {...p}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case "out":   return <svg {...p}><path d="M12 19V5M19 12l-7-7-7 7"/></svg>;
  }
  return null;
};

// ---------- Inquiry Data ----------
// Each inquiry is self-contained so clicking any of them tells a real story.
const INQUIRIES = {
  omv: {
    id:"omv", co:"OMV AG", from:"Sarah Mueller", email:"sarah.mueller@omv.com",
    summary:"25 Zimmer · Konferenz · 15.–17. April", value:10830, tag:"Neu", tone:"gold", status:"new",
    title:"25 Zimmer, 2 Nächte,\nKonferenz für 30.",
    emailSubject:"Anfrage: Konferenz + Zimmerkontingent 15.–17. April",
    emailBody:`Sehr geehrtes Lakeview-Team,

für unser Executive-Off-Site vom 15. bis 17. April benötigen wir ein Zimmerkontingent von 25 Doppel­zimmern zur Einzelnutzung sowie einen Konferenzraum für 30 Personen inklusive Technik.

An beiden Tagen bitten wir um ein Mittagsbuffet, am ersten Abend um ein Dinner im Haus. Anreise 15.04. ab 14:00, Abreise 17.04. bis 12:00.

Ich freue mich über ein Angebot bis Donnerstag.

Mit freundlichen Grüßen
Sarah Mueller
Executive Assistant · OMV AG`,
    language:"DE", intent:"Corporate MICE", confidence:"98 %",
    extract:[
      ["Firma","OMV AG"],
      ["Ansprechpartner","Sarah Mueller"],
      ["Zimmer","25 × DZ zur EZ-Nutzung"],
      ["Nächte","2 (15.–17. 04.)"],
      ["Konferenzraum","30 Pax · mit Technik"],
      ["F&B","2× Lunch · 1× Dinner"],
      ["Deadline","Donnerstag"],
    ],
    market:[
      { n:"Novum Kavalier", w:44, p:95 },
      { n:"the niu Franz",  w:56, p:109 },
      { n:"Mercure Vienna", w:68, p:119 },
      { n:"NH Wien City",   w:82, p:135 },
    ],
    event:{
      pill:"Event-Surge", tone:"red", dates:"13.–16. April", name:"Vienna Medical Congress",
      body:"Über 700.000 Besucher in Wien erwartet. Hotel-Nachfrage +15–25 % über den gesamten Zeitraum. Die AI hat den Preis entsprechend im oberen Markt-Band verankert.",
    },
    lines:[
      { k:"25 Zimmer × 2 Nächte × € 145", v:7250 },
      { k:"Konferenzraum + Technik",      v:1300 },
      { k:"Lunch-Buffet · 30 Pax × 2",    v:2280 },
    ],
    rate:145, rateHint:"pro Zimmer · pro Nacht",
  },
  sie: {
    id:"sie", co:"Siemens AG", from:"Markus Kraft", email:"markus.kraft@siemens.com",
    summary:"18 Zimmer · Training · 4.–7. Mai", value:12480, tag:"Bepreist", tone:"blue", status:"priced",
    title:"18 Zimmer, 3 Nächte,\nTraining für 20.",
    emailSubject:"RFP Siemens Executive Training Wien, 04.–07. Mai",
    emailBody:`Liebes Lakeview-Team,

wir planen ein internes Führungskräfte-Training vom 4. bis 7. Mai in Wien. Benötigt: 18 Einzelzimmer, ein Tagungsraum für 20 Personen mit U-Form, täglich Tagungspauschale (inkl. Kaffeepausen und Mittagessen).

Bitte Angebot an unsere Procurement-Abteilung.

Beste Grüße
Markus Kraft
Global Travel · Siemens AG`,
    language:"DE", intent:"Corporate Training", confidence:"96 %",
    extract:[
      ["Firma","Siemens AG"],
      ["Ansprechpartner","Markus Kraft"],
      ["Zimmer","18 × EZ"],
      ["Nächte","3 (04.–07. 05.)"],
      ["Tagungsraum","20 Pax · U-Form"],
      ["F&B","Tagungspauschale × 3"],
      ["Empfänger","procurement@siemens.com"],
    ],
    market:[
      { n:"Novum Kavalier", w:40, p:89 },
      { n:"the niu Franz",  w:54, p:115 },
      { n:"Mercure Vienna", w:64, p:125 },
      { n:"NH Wien City",   w:78, p:139 },
    ],
    event:{
      pill:"Normale Saison", tone:"blue", dates:"04.–07. Mai", name:"Kein Event-Impact",
      body:"In diesem Zeitraum sind keine Großveranstaltungen erfasst. Nachfrage im Markt ist saisontypisch (Auslastung ~78 %).",
    },
    lines:[
      { k:"18 Zimmer × 3 Nächte × € 149", v:8046 },
      { k:"Tagungsraum × 3 Tage",         v:1800 },
      { k:"Tagungspauschale · 20 × 3",    v:2634 },
    ],
    rate:149, rateHint:"pro Zimmer · pro Nacht",
  },
  erb: {
    id:"erb", co:"Erste Bank", from:"Dr. Claudia Steiner", email:"claudia.steiner@erstegroup.com",
    summary:"40 Zimmer · Gala-Dinner · 12. Mai", value:24910, tag:"Gesendet", tone:"green", status:"sent",
    title:"40 Zimmer + Gala-Dinner.\nDeal aktiv.",
    emailSubject:"Erste Bank Jahresgala 2026 — Festliches Dinner + Übernachtung",
    emailBody:`Liebe Kolleginnen und Kollegen,

für unsere Jahresgala am 12. Mai benötigen wir 40 Zimmer (Standard Doppel, Einzelnutzung) sowie einen Bankettsaal für ein festliches Gala-Dinner mit ca. 180 Gästen.

Es soll ein 4-Gang-Menü inkl. korrespondierender Weinbegleitung geben, Sektempfang ab 18:30.

Mit besten Grüßen
Dr. Claudia Steiner
Head of Corporate Events · Erste Group`,
    language:"DE", intent:"Corporate Gala", confidence:"99 %",
    extract:[
      ["Firma","Erste Group"],
      ["Ansprechpartner","Dr. Claudia Steiner"],
      ["Zimmer","40 × DZ zur EZ-Nutzung"],
      ["Nächte","1 (12. 05.)"],
      ["Event","Gala-Dinner · 180 Pax"],
      ["F&B","4-Gang + Weinbegleitung + Sekt"],
      ["Empfang","ab 18:30"],
    ],
    market:[
      { n:"Novum Kavalier", w:40, p:92 },
      { n:"the niu Franz",  w:55, p:112 },
      { n:"Mercure Vienna", w:68, p:125 },
      { n:"NH Wien City",   w:82, p:140 },
    ],
    event:{
      pill:"Wochenende", tone:"gold", dates:"12. Mai",
      name:"Muttertags-Wochenende",
      body:"Leicht erhöhte Leisure-Nachfrage. Die AI hat das Gala-Paket als Premium positioniert.",
    },
    lines:[
      { k:"40 Zimmer × 1 Nacht × € 159", v:6360 },
      { k:"Bankettsaal + Deko",          v:4200 },
      { k:"4-Gang-Gala · 180 Pax",       v:11700 },
      { k:"Sektempfang + Weinbegleitung", v:2650 },
    ],
    rate:159, rateHint:"pro Zimmer · pro Nacht",
    sentAt:"Gestern · 16:42", sentBy:"Andreas Bauer",
    followUps:[
      { at:"T+0", label:"Angebot gesendet per E-Response", done:true },
      { at:"T+4h", label:"Öffnungsbestätigung empfangen", done:true },
      { at:"T+24h", label:"Automatische Erinnerung", done:false },
      { at:"T+72h", label:"Eskalation an Sales-Manager", done:false },
    ],
  },
  bmw: {
    id:"bmw", co:"BMW Wien", from:"Lisa Hofmann", email:"lisa.hofmann@bmw.at",
    summary:"12 Zimmer · Incentive · 28.–30. April", value:5720, tag:"Neu", tone:"gold", status:"new",
    title:"12 Zimmer, 2 Nächte,\nIncentive-Reise.",
    emailSubject:"Incentive-Trip Top-Verkäufer · 28.–30. April",
    emailBody:`Hallo!

Wir machen unseren jährlichen Incentive-Trip für unsere besten Verkäufer. 12 Zimmer für 28.–30. April, nichts Großes, aber gerne ein nettes Abendessen am ersten Abend.

Hätten Sie da was für uns?

LG Lisa Hofmann
BMW Wien`,
    language:"DE", intent:"Leisure Incentive", confidence:"92 %",
    extract:[
      ["Firma","BMW Wien"],
      ["Ansprechpartner","Lisa Hofmann"],
      ["Zimmer","12 × DZ"],
      ["Nächte","2 (28.–30. 04.)"],
      ["F&B","1× Dinner"],
      ["Ton","Informell"],
    ],
    market:[
      { n:"Novum Kavalier", w:42, p:95 },
      { n:"the niu Franz",  w:56, p:109 },
      { n:"Mercure Vienna", w:68, p:119 },
      { n:"NH Wien City",   w:80, p:129 },
    ],
    event:{
      pill:"Normale Saison", tone:"blue", dates:"28.–30. April", name:"Kein Event-Impact",
      body:"Keine Großveranstaltungen. Markt im normalen Korridor.",
    },
    lines:[
      { k:"12 Zimmer × 2 Nächte × € 129", v:3096 },
      { k:"Dinner · 12 Pax",              v:1080 },
      { k:"Incentive-Upgrade (Suite × 2)",v:1544 },
    ],
    rate:129, rateHint:"pro Zimmer · pro Nacht",
  },
};

// VIP inquiry — bypasses auto-reply, AI only drafts for human approval
INQUIRIES.phil = {
  id:"phil", co:"Wiener Philharmoniker", from:"Dr. Andreas Grossbauer", email:"a.grossbauer@wienerphilharmoniker.at",
  summary:"60 Zimmer · Neujahrskonzert-Gäste · 30. 12. – 02. 01.", value:48600, tag:"VIP", tone:"vip", status:"vip",
  vip:true,
  title:"VIP-Anfrage.\n60 Zimmer, 3 Nächte, höchste Sorgfalt.",
  emailSubject:"Vertrauliche Anfrage · Ehrengäste Neujahrskonzert 2027",
  emailBody:`Sehr geehrter Herr Bauer,

für unsere Ehrengäste beim Neujahrskonzert 2027 suchen wir 60 Zimmer in höchster Kategorie vom 30. 12. 2026 bis 02. 01. 2027. Die Gäste reisen teils mit Protokoll, höchste Diskretion vorausgesetzt.

Zusätzlich: exklusiver Empfang am 31. 12., abgeschirmter Transfer zum Musikverein, Late Check-out 01. 01.

Wir vertrauen wie immer auf Ihre Diskretion und bitten um ein persönliches Angebot.

Mit musikalischen Grüßen
Dr. Andreas Grossbauer
Generalsekretär · Wiener Philharmoniker`,
  language:"DE", intent:"VIP Protocol", confidence:"99 %",
  extract:[
    ["Firma","Wiener Philharmoniker"],
    ["Ansprechpartner","Dr. A. Grossbauer · Generalsekretär"],
    ["Zimmer","60 × Deluxe / Suite (gemischt)"],
    ["Nächte","3 (30. 12. – 02. 01.)"],
    ["Ereignis","Neujahrskonzert · Ehrengäste"],
    ["Besonderheit","Protokoll · Diskretion · Transfers"],
    ["VIP-Status","Tier 1 · persönliche Betreuung"],
  ],
  market:[
    { n:"Novum Kavalier", w:40, p:145 },
    { n:"the niu Franz",  w:52, p:175 },
    { n:"Mercure Vienna", w:62, p:209 },
    { n:"NH Wien City",   w:78, p:239 },
  ],
  event:{
    pill:"Peak-Event", tone:"red", dates:"30. 12. – 02. 01.", name:"Neujahrskonzert Wien",
    body:"Das teuerste Preis-Fenster des Jahres. Nachfrage +60–80 % über Markt. Für VIP-Gäste der Philharmoniker kein Upcharge — Beziehung > Marge.",
  },
  lines:[
    { k:"40 Deluxe × 3 Nächte × € 310", v:37200 },
    { k:"20 Suite × 3 Nächte × € 490",   v:29400 },
    { k:"Protokoll-Services + Transfers",v:4800 },
    { k:"Exklusiver Empfang 31. 12.",    v:7800 },
    { k:"VIP-Stammkunden-Rabatt (–15 %)",v:-11850 },
  ],
  rate:310, rateHint:"Deluxe · pro Zimmer · pro Nacht",
  draftReply:`Sehr geehrter Herr Dr. Grossbauer,

herzlichen Dank für Ihr Vertrauen und die erneute Anfrage für das Neujahrskonzert 2027.

Ich bereite Ihnen persönlich ein maßgeschneidertes Angebot vor und melde mich bis Mittwoch mit Details zur Zimmerallokation, Protokoll-Koordination und dem Empfang am 31. 12.

Für Rückfragen stehe ich Ihnen selbstverständlich jederzeit direkt zur Verfügung.

Mit den besten Grüßen
Andreas Bauer
Director Group Sales · The Lakeview Vienna
+43 1 234 5678 · andreas.bauer@lakeview-vienna.at`,
};

const ORDER = ["phil","omv","sie","erb","bmw"];

// ---------- Customer memory: past interactions, discounts with rationale ----------
const MEMORY = {
  phil: {
    since: "2019",
    bookings: 7,
    lifetimeValue: 284500,
    avgDiscount: 15,
    lastStay: "Dezember 2025 · 40 Zimmer · Silvesterkonzert",
    rating: "A+",
    notes: "Kern-Beziehung. Generalsekretär persönlich Ansprechpartner. Protokoll-Events mit höchster Diskretion.",
    history: [
      { when:"Dez 2025", what:"Silvesterkonzert · 40 Zimmer", rate:310, disc:15, reason:"Stammkunden-Staffel · 5+ Buchungen/Jahr" },
      { when:"Mai 2025", what:"Mozartwoche · 25 Zimmer",      rate:265, disc:12, reason:"Stammkunden-Staffel" },
      { when:"Dez 2024", what:"Neujahrskonzert · 55 Zimmer", rate:295, disc:18, reason:"Stammkunden + Volumen (>50 Zi.)" },
      { when:"Sep 2024", what:"Salzburger Festspiele Transfer", rate:225, disc:10, reason:"Stammkunden-Staffel" },
      { when:"Dez 2023", what:"Neujahrskonzert · 48 Zimmer", rate:279, disc:15, reason:"Stammkunden + Peak-Season Loyalty" },
    ],
    aiReasoning: "–15 % wurde angewendet weil: (a) 5 der letzten 7 Buchungen hatten 12–18 % Rabatt — der Kunde erwartet das als Standard, (b) 15 % liegt genau an meiner autonomen Rabatt-Schwelle (Regel r1), (c) die LTV von € 284.500 rechtfertigt es ohne Verhandlung. ABER: weil die Philharmoniker in der VIP-Liste stehen (Regel r3), wurde keine Auto-Reply gesendet — dieses Angebot wartet auf deine persönliche Freigabe.",
  },
  omv: {
    since: "2022",
    bookings: 2,
    lifetimeValue: 18400,
    avgDiscount: 0,
    lastStay: "November 2024 · 18 Zimmer · Board Offsite",
    rating: "B",
    notes: "Procurement-getrieben, entscheidet nach Preisbenchmark. Freundlich aber transaktional.",
    history: [
      { when:"Nov 2024", what:"Board Offsite · 18 Zimmer", rate:139, disc:0, reason:"Preisbenchmark im Markt — kein Rabatt nötig" },
      { when:"Mär 2023", what:"Executive Training · 12 Zimmer", rate:135, disc:5, reason:"Neukunden-Willkommen" },
    ],
    aiReasoning: "Kein Rabatt in diesem Angebot, weil: der Kunde hat historisch NICHT rabattiert gekauft und war trotzdem zufrieden. € 145/Nacht liegt im oberen Markt-Korridor (Medical Congress treibt), ist aber noch unter NH Wien (€ 135 + Surge) positioniert. Wir gewinnen wenn wir Wert zeigen, nicht wenn wir Preis nachlassen.",
  },
  sie: {
    since: null,
    bookings: 0,
    lifetimeValue: 0,
    avgDiscount: 0,
    lastStay: "—",
    rating: "Neu",
    notes: "Erstkontakt. Globales Unternehmen, RFP-Prozess über Procurement.",
    history: [],
    aiReasoning: "Neukunde. Die AI hat den Preis bei € 149 verankert — bewusst über Mercure, unter NH. Kein Willkommensrabatt angewendet, weil Siemens global preistransparent beschafft und ein Rabatt hier Präzedenz schafft. Statt Preis → zusätzlichen Wert im Angebot (kostenloser Konferenz-Tech-Check).",
  },
  erb: {
    since: "2018",
    bookings: 12,
    lifetimeValue: 412000,
    avgDiscount: 8,
    lastStay: "Januar 2026 · 30 Zimmer · Board-Retreat",
    rating: "A+",
    notes: "Head of Events ist persönlich bekannt. Gala-Dinners traditionell bei uns. Zahlt immer pünktlich.",
    history: [
      { when:"Jan 2026", what:"Board-Retreat · 30 Zimmer", rate:152, disc:8,  reason:"Stammkunden-Staffel" },
      { when:"Mai 2025", what:"Jahresgala 2025 · 38 Zimmer", rate:155, disc:10, reason:"Stammkunden + Event-Gesamtpaket" },
      { when:"Nov 2024", what:"Strategie-Klausur · 22 Zimmer", rate:145, disc:7,  reason:"Stammkunden-Staffel" },
    ],
    aiReasoning: "–10 % wurde als Stammkunden-Rabatt angewendet weil: (a) 12 Buchungen seit 2018, (b) durchschnittlicher Rabatt liegt historisch bei 8 %, (c) Jahresgala ist ein jährlicher Ankerevent — den zu verlieren wäre teurer als der Rabatt.",
  },
  bmw: {
    since: null,
    bookings: 0,
    lifetimeValue: 0,
    avgDiscount: 0,
    lastStay: "—",
    rating: "Neu",
    notes: "Erstkontakt. Informeller Ton deutet auf lokales Team hin.",
    history: [],
    aiReasoning: "Neukunde — Willkommensrabatt nicht nötig, Anfrage ist klein und preisunsensibel (Incentive, der Charakter zählt). Statt Rabatt → Suite-Upgrade inkludiert. Das fühlt sich wertvoller an als –10 %.",
  },
};

// ---------- Archived / past inquiries (last 60 days) ----------
const ARCHIVE = [
  { id:"a1", co:"Raiffeisen Bank", from:"Verena Weiss", email:"verena.weiss@rbinternational.com", summary:"32 Zimmer · Offsite · 21.–23. März", value:21400, offered:22800, outcome:"won", sent:"19. März 2026", replied:"12h", handledBy:"Andreas Bauer",
    brief:"Strategie-Offsite, 32 Einzelzimmer, Konferenz, 2x Abendessen.",
    timeline:[
      { t:"18. März 14:08", kind:"in",   label:"E-Mail Anfrage empfangen" },
      { t:"18. März 14:08", kind:"ai",   label:"AI hat geparsed · Corporate Strategy Offsite · 98 % Confidence" },
      { t:"18. März 14:09", kind:"out",  label:"Auto-Reply gesendet (Deutsch)" },
      { t:"18. März 14:12", kind:"ai",   label:"Markt-Analyse: Preis-Korridor € 135–160, kein Event-Surge" },
      { t:"18. März 15:40", kind:"rev",  label:"Andreas hat Angebot geprüft + genehmigt" },
      { t:"19. März 09:02", kind:"send", label:"Angebot gesendet · € 22.800 (149 €/Nacht, Stammkunden −5 %)" },
      { t:"19. März 09:07", kind:"track",label:"E-Mail geöffnet · 5 Min nach Versand" },
      { t:"19. März 14:30", kind:"nego", label:"Kundin antwortet: bittet um Frühstücks-Inklusive" },
      { t:"19. März 15:10", kind:"ai",   label:"AI schlägt vor: Frühstück inkludieren, Rate auf € 145 senken → Gesamt € 21.400" },
      { t:"19. März 16:22", kind:"send", label:"Revidiertes Angebot gesendet · € 21.400" },
      { t:"20. März 10:14", kind:"won",  label:"Zusage per E-Mail · „Passt perfekt — wir bestätigen hiermit.“" },
    ],
    emailOut:`Sehr geehrte Frau Weiss,

vielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen folgendes Angebot zu unterbreiten für Ihren Strategie-Offsite vom 21. bis 23. März:

• 32 Einzelzimmer × 2 Nächte × € 149 = € 9.536
• Konferenzraum mit Technik × 2 Tage = € 2.200
• Frühstücksbuffet 32 × 2 = € 1.792
• 2× Business-Dinner für 32 Personen = € 8.640
• Kaffeepausen + Mineralwasser ganztägig

Gesamt: € 22.168 (Stammkunden-Rabatt bereits enthalten)

Das Angebot ist gültig bis 22. März.

Herzliche Grüße
Andreas Bauer · Group Sales`,
    emailIn:`Lieber Herr Bauer,

danke für das schnelle Angebot. Eine Bitte: könnt ihr das Frühstück in den Raten inkludieren statt separat? Und damit einen leicht runderen Gesamtpreis? Alles andere passt!

Beste Grüße,
Verena Weiss`,
    learnings:[
      "Raiffeisen reagiert sensibel auf „saubere“ Gesamtpreise ohne zu viele Einzelposten. In Zukunft: Bundle-Paket als Default anbieten.",
      "Antwort innerhalb von 12 Std. → positive Korrelation mit Close-Rate (bestätigt 3. Mal in Folge bei diesem Kunden).",
      "Die Verhandlung war minimal (1 Runde). Nächstes Mal kann die AI Frühstück-Inklusive direkt vorschlagen.",
    ],
  },
  { id:"a2", co:"Red Bull GmbH", from:"Max Feichtinger", email:"max.feichtinger@redbull.com", summary:"55 Zimmer · Team-Event · 14.–15. März", value:18200, offered:18200, outcome:"won", sent:"10. März 2026", replied:"4h", handledBy:"Sarah Klein",
    brief:"Internes Team-Event, 55 Zimmer, ein Abendessen, kein Konferenzraum.",
    timeline:[
      { t:"09. März 11:17", kind:"in",   label:"Anfrage empfangen (über Marketing-Team, informell)" },
      { t:"09. März 11:17", kind:"ai",   label:"Parsed · Leisure/Incentive · 94 % Confidence" },
      { t:"09. März 11:18", kind:"out",  label:"Auto-Reply gesendet" },
      { t:"09. März 11:24", kind:"ai",   label:"Markt-Check: hohe Nachfrage (Rennwochenende Spielberg bindet Zimmer in Wien)" },
      { t:"09. März 13:40", kind:"rev",  label:"Sarah hat Angebot geprüft" },
      { t:"10. März 08:15", kind:"send", label:"Angebot gesendet · € 18.200" },
      { t:"10. März 12:04", kind:"track",label:"E-Mail geöffnet (mobil)" },
      { t:"10. März 12:11", kind:"won",  label:"Sofortige Zusage · „Passt, wir buchen.“" },
    ],
    emailOut:`Hi Max,

wie besprochen — euer Team-Event-Angebot:

55 Zimmer × 1 Nacht × € 139 = € 7.645
Abendessen (3-Gang) × 55 Personen = € 9.625
Willkommens-Apéro = € 930

Gesamt: € 18.200

Wir halten die Zimmer bis Donnerstag.

LG Sarah`,
    emailIn:`Passt, wir buchen.
Danke!
Max`,
    learnings:[
      "Informelle Anfrage → informeller Ton in der Antwort + transaktionaler Flow funktioniert sehr gut bei Red Bull.",
      "Zusage innerhalb 7 Min nach Öffnen. Hohe Intent-Signal bei kurzen Antworten — AI sollte solche Anfragen priorisieren.",
    ],
  },
  { id:"a3", co:"Austrian Airlines", from:"Petra Hofer", email:"petra.hofer@austrian.com", summary:"12 Zimmer · Crew-Übernachtung · laufend", value:4320, offered:4320, outcome:"recurring", sent:"08. März 2026", replied:"< 1h", handledBy:"AI + Andreas Bauer",
    brief:"Monatliche Crew-Slots, 12 Zimmer pro Einsatz, Rahmenvertrag aktiv.",
    timeline:[
      { t:"08. März 05:45", kind:"in",   label:"Automatische Anfrage über Airline-Portal" },
      { t:"08. März 05:45", kind:"ai",   label:"Rahmenvertrag erkannt · fester Preis € 60/Zimmer" },
      { t:"08. März 05:46", kind:"send", label:"Angebot automatisch bestätigt · € 4.320 (72 Zimmer × € 60)" },
      { t:"08. März 05:46", kind:"won",  label:"Auto-Bestätigung an Disposition" },
    ],
    emailOut:`Automatische Bestätigung · Rahmenvertrag OS-2024-LV-0012
12 Zimmer/Nacht × 6 Nächte × € 60 = € 4.320
Check-in wie gewohnt über Crew-Desk.`,
    emailIn:"—",
    learnings:[
      "Vollautomatischer Flow funktioniert seit 14 Monaten ohne menschlichen Eingriff — Modell für weitere B2B-Rahmenverträge.",
      "Ø Antwortzeit: 48 Sekunden. Kundin hat sich explizit für die Zuverlässigkeit bedankt (letztes QBR).",
    ],
  },
  { id:"a4", co:"Google Vienna", from:"James O'Brien", email:"james.obrien@google.com", summary:"28 Zimmer · Dev-Summit · 02.–05. März", value:17900, offered:21400, outcome:"lost", sent:"24. Februar 2026", replied:"3h", handledBy:"Andreas Bauer",
    lostReason:"Kunde ist zu Marriott gegangen (Preis)",
    brief:"Developer-Summit, 28 Zimmer, 3 Nächte, Plenum + 2 Breakouts.",
    timeline:[
      { t:"23. Februar 10:02", kind:"in",   label:"RFP empfangen (Englisch)" },
      { t:"23. Februar 10:02", kind:"ai",   label:"Parsed · Tech Summit · 97 % · Englisch erkannt" },
      { t:"23. Februar 10:03", kind:"out",  label:"Auto-Reply gesendet (Englisch)" },
      { t:"23. Februar 10:05", kind:"ai",   label:"Markt: Marriott läuft aktuell Aktion für Tech-Sektor (−10 %)" },
      { t:"23. Februar 12:20", kind:"rev",  label:"Andreas hat Angebot auf € 165/Nacht gesetzt (fest)" },
      { t:"24. Februar 09:00", kind:"send", label:"Angebot gesendet · € 21.400 (Englisch, voll gebrandet)" },
      { t:"24. Februar 12:15", kind:"track",label:"E-Mail geöffnet · 3 Min Lesezeit" },
      { t:"26. Februar 14:30", kind:"nego", label:"James fragt nach: „Marriott ist bei € 19.500. Könnt ihr mit?“" },
      { t:"26. Februar 15:45", kind:"rev",  label:"Andreas entscheidet: max € 20.100 — gehen wir nicht runter." },
      { t:"26. Februar 16:02", kind:"send", label:"Gegenangebot · € 20.100 mit Frühstück + Lunch-Upgrade" },
      { t:"28. Februar 11:20", kind:"lost", label:"Absage · „Sorry, wir gehen mit Marriott.“" },
    ],
    emailOut:`Dear James,

thank you for considering The Lakeview Vienna for your developer summit. Please find our proposal below:

28 rooms × 3 nights × € 165 = € 13.860
Plenary room (80 pax) × 3 days = € 3.900
2 breakout rooms × 3 days = € 2.400
Coffee breaks + lunch buffet × 3 days = € 1.240

Total: € 21.400

Warm regards,
Andreas`,
    emailIn:`Hi Andreas,

thanks for the detailed proposal. Unfortunately Marriott came in at € 19,500 all-in. Anything you can do to close the gap?

James`,
    learnings:[
      "Tech/Dev-Events: Preis-Sensitivität höher als unser Modell annahm. Marriott attackiert gezielt Tech mit −10 %. Wir müssen entscheiden: mitgehen oder Premium-Story bauen.",
      "AI hat die Marriott-Aktion im Markt-Check erwähnt, aber nicht stark genug als Risiko markiert. → Regel: Aktions-Flags von Mitbewerbern lauter signalisieren.",
      "Ab Verhandlungsrunde 2 verliert der Deal 58 % Wahrscheinlichkeit. Entscheidung: in Zukunft das erste Angebot näher am akzeptablen Endpreis anbieten.",
      "Lost-Reason wurde automatisch in die Markt-Intelligence-DB geschrieben. Nächste Tech-Anfrage bekommt angepassten Startpreis.",
    ],
  },
  { id:"a5", co:"ÖBB", from:"Wolfgang Mayer", email:"w.mayer@oebb.at", summary:"20 Zimmer · Schulung · 27. Februar", value:6890, offered:6890, outcome:"won", sent:"22. Februar 2026", replied:"6h", handledBy:"Sarah Klein",
    brief:"Interne Schulung, 20 Zimmer, 1 Nacht, Tagung.",
    timeline:[
      { t:"21. Feb 14:10", kind:"in",   label:"Anfrage empfangen" },
      { t:"21. Feb 14:10", kind:"ai",   label:"Parsed · Corporate Training · 96 % Confidence" },
      { t:"21. Feb 14:11", kind:"out",  label:"Auto-Reply" },
      { t:"22. Feb 08:00", kind:"send", label:"Angebot · € 6.890 (Tagungspauschale inkl.)" },
      { t:"22. Feb 14:22", kind:"won",  label:"Bestätigung per E-Mail" },
    ],
    emailOut:`Sehr geehrter Herr Mayer, anbei unser Angebot für Ihre Schulung am 27. Februar…`,
    emailIn:"Passt so. Bitte buchen.",
    learnings:[
      "ÖBB: drittes Mal innerhalb von 6 Monaten — Pattern erkannt, könnte in Rahmenvertrag überführt werden. Vorschlag wurde an Andreas eskaliert.",
    ],
  },
  { id:"a6", co:"WKO Wien", from:"Mag. Elsa Bauer", email:"e.bauer@wko.at", summary:"80 Zimmer · Jahreskongress · 18.–20. Feb.", value:54200, offered:58000, outcome:"won", sent:"05. Februar 2026", replied:"1h", handledBy:"Andreas Bauer",
    brief:"Jahreskongress Wirtschaftskammer, 80 Zimmer, 2 Nächte, Großer Saal, Catering.",
    timeline:[
      { t:"03. Feb 09:14", kind:"in",   label:"Anfrage empfangen (Geschäftsleitung)" },
      { t:"03. Feb 09:14", kind:"ai",   label:"Parsed · Großveranstaltung · 99 % · Eskalations-Flag (>50 Zimmer)" },
      { t:"03. Feb 09:15", kind:"rev",  label:"AI hat Andreas direkt benachrichtigt (Regel: Eskalation ab 50 Zimmer)" },
      { t:"04. Feb 16:20", kind:"rev",  label:"Andreas + GM haben Angebot gemeinsam kalibriert" },
      { t:"05. Feb 10:00", kind:"send", label:"Angebot gesendet · € 58.000" },
      { t:"05. Feb 11:02", kind:"nego", label:"Elsa verhandelt · „€ 54.200 ist das Budget.“" },
      { t:"05. Feb 14:30", kind:"rev",  label:"Andreas akzeptiert intern mit GM-Freigabe" },
      { t:"05. Feb 15:00", kind:"send", label:"Revidiertes Angebot · € 54.200" },
      { t:"05. Feb 15:14", kind:"won",  label:"Zusage + Anzahlung angefragt" },
    ],
    emailOut:`Sehr geehrte Frau Mag. Bauer, es ist uns eine große Freude, Ihnen für den Jahreskongress der Wirtschaftskammer Wien folgendes Angebot zu unterbreiten…`,
    emailIn:`Herr Bauer, das Angebot ist in der Substanz passend, jedoch bewegt sich unser freigegebenes Budget bei € 54.200 all-in. Wenn wir das so darstellen können, bestätigen wir umgehend. MfG`,
    learnings:[
      "Escalation-Regel (>50 Zimmer) hat sauber funktioniert — GM war frühzeitig eingebunden, Verhandlungsspielraum war abgeklärt.",
      "WKO-Budget-Regel: bei öffentlich-rechtlichen Institutionen zuerst Budget erfragen statt Listenpreis zu senden. Regel-Vorschlag an Andreas übermittelt.",
      "Deal-Marge: 18 % nach Revision. Liegt im Zielkorridor.",
    ],
  },
  { id:"a7", co:"Deloitte Austria", from:"Clara Fuchs", email:"clara.fuchs@deloitte.com", summary:"16 Zimmer · Partner-Meeting · 30. Januar", value:9600, offered:9600, outcome:"lost", sent:"24. Januar 2026", replied:"8h", handledBy:"Andreas Bauer", lostReason:"Kunde verschoben auf Q3",
    brief:"Partner-Meeting, 16 Zimmer, 1 Nacht, Working Session.",
    timeline:[
      { t:"23. Jan 10:00", kind:"in",   label:"Anfrage" },
      { t:"23. Jan 10:00", kind:"ai",   label:"Parsed · 95 %" },
      { t:"24. Jan 08:00", kind:"send", label:"Angebot gesendet · € 9.600" },
      { t:"28. Jan 09:30", kind:"lost", label:"Absage · interne Verschiebung auf Q3 2026" },
    ],
    emailOut:`Sehr geehrte Frau Fuchs, anbei unser Angebot…`,
    emailIn:`Herr Bauer, wir müssen das Meeting leider auf Q3 verschieben. Ich komme bei neuer Terminierung proaktiv auf Sie zu.`,
    learnings:[
      "Kein qualitativer Lost — reine Terminverschiebung. AI hat automatisch Wiedervorlage für Juli gesetzt.",
      "Clara Fuchs ist nun als warmer Kontakt markiert — nächste Anfrage bekommt Priority-Handling.",
    ],
  },
  { id:"a8", co:"PwC Österreich", from:"Julian Reiter", email:"j.reiter@pwc.com", summary:"14 Zimmer · Audit-Team · 22.–24. Januar", value:7120, offered:7120, outcome:"won", sent:"18. Januar 2026", replied:"2h", handledBy:"AI (vollautomatisch)",
    brief:"Audit-Team vor Ort beim Mandanten, 14 Zimmer, 2 Nächte.",
    timeline:[
      { t:"18. Jan 07:14", kind:"in",   label:"E-Mail Anfrage" },
      { t:"18. Jan 07:14", kind:"ai",   label:"Parsed · 97 %" },
      { t:"18. Jan 07:15", kind:"ai",   label:"Autonome Freigabe (unter € 10k Schwelle · Regel aktiv)" },
      { t:"18. Jan 07:15", kind:"send", label:"Angebot automatisch versendet · € 7.120" },
      { t:"18. Jan 09:08", kind:"won",  label:"Bestätigung ohne Verhandlung" },
    ],
    emailOut:`Sehr geehrter Herr Reiter, anbei unser Angebot für Ihren Audit-Einsatz…`,
    emailIn:"Bestätigt. Vielen Dank.",
    learnings:[
      "Vollautomatischer Flow, Deal unter € 10k-Schwelle — genau das Szenario, für das die AI gebaut wurde. 1h54m vom Posteingang bis Bestätigung.",
      "Keine menschliche Intervention → 100 % AI-Zeitersparnis-Fall. Gutes Demo-Beispiel.",
    ],
  },
  { id:"a9", co:"Porsche Wien", from:"Melissa Grund", email:"m.grund@porsche.at", summary:"9 Zimmer · VIP-Kundenevent · 12. Januar", value:8900, offered:8900, outcome:"won", sent:"04. Januar 2026", replied:"30 Min", handledBy:"Andreas Bauer",
    brief:"VIP-Kundenevent, 9 Suiten, Privat-Dinner.",
    timeline:[
      { t:"03. Jan 16:00", kind:"in",   label:"Anfrage (persönlich, Andreas bekannt)" },
      { t:"03. Jan 16:01", kind:"ai",   label:"VIP-Flag gesetzt (Regel r3: Porsche explizit auf VIP-Liste)" },
      { t:"04. Jan 08:30", kind:"rev",  label:"Andreas hat Entwurf persönlich geschrieben" },
      { t:"04. Jan 09:15", kind:"send", label:"Angebot · € 8.900 (mit persönlicher Note)" },
      { t:"04. Jan 09:45", kind:"won",  label:"Direkt-Zusage via SMS" },
    ],
    emailOut:`Liebe Melissa, wie immer freue ich mich besonders…`,
    emailIn:"Perfekt wie immer. Buche bitte.",
    learnings:[
      "VIP-Regel hat gegriffen — keine Auto-Reply, Andreas hat selbst geschrieben. Richtig für Beziehungspflege.",
      "Zusage per SMS statt E-Mail — Follow-Up-System hat es trotzdem korrekt verknüpft.",
    ],
  },
  { id:"a10", co:"Boehringer Ingelheim", from:"Dr. Tobias Klee", email:"tobias.klee@boehringer-ingelheim.com", summary:"45 Zimmer · Forschungs-Summit · Dez. '25", value:31200, offered:31200, outcome:"lost", sent:"19. Dezember 2025", replied:"4h", handledBy:"Sarah Klein", lostReason:"Unsere Verfügbarkeit zu knapp",
    brief:"Internationale Forschungs-Konferenz, 45 Zimmer, 3 Nächte.",
    timeline:[
      { t:"18. Dez 14:00", kind:"in",   label:"Anfrage empfangen" },
      { t:"18. Dez 14:00", kind:"ai",   label:"Parsed · 98 % · Verfügbarkeits-Warnung (nur 38 von 45 Zi. verfügbar)" },
      { t:"18. Dez 14:02", kind:"rev",  label:"Sarah hat Split-Angebot vorbereitet (eigenes Haus + Partnerhotel)" },
      { t:"19. Dez 10:00", kind:"send", label:"Angebot gesendet · € 31.200" },
      { t:"19. Dez 14:12", kind:"lost", label:"Absage · „Wir brauchen alle Gäste in einem Haus.“" },
    ],
    emailOut:`Sehr geehrter Herr Dr. Klee, wir schlagen folgendes Setup vor…`,
    emailIn:`Herr Klee, danke für den kreativen Vorschlag, aber wir können die Gruppe für diesen Anlass nicht aufteilen.`,
    learnings:[
      "Verfügbarkeits-Problem früh erkannt. Kreatives Split-Angebot war aber nicht passend für Forschungs-Gruppe (Networking-Fokus).",
      "Regel-Vorschlag: bei >40 Zimmern und <90 % Verfügbarkeit sofort absagen statt Split vorschlagen. Erspart dem Kunden Zeit.",
    ],
  },
];

// ---------- Root App ----------
const App = () => {
  const [step, setStep] = useState(() => localStorage.getItem("isq7s.step") || "inbox");
  const [theme, setTheme] = useState(() => localStorage.getItem("isq7s.theme") || "dark");
  const [activeId, setActiveId] = useState(() => localStorage.getItem("isq7s.id") || null);
  const [activeArchiveId, setActiveArchiveId] = useState(null);
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("isq7s.data"));
      if (saved) {
        // Merge so newly-added inquiries (e.g. phil) show up for returning users
        const merged = { ...INQUIRIES };
        for (const k of Object.keys(saved)) merged[k] = saved[k];
        return merged;
      }
    } catch(e){}
    return INQUIRIES;
  });

  useEffect(() => { localStorage.setItem("isq7s.step", step); }, [step]);
  useEffect(() => { if (activeId) localStorage.setItem("isq7s.id", activeId); else localStorage.removeItem("isq7s.id"); }, [activeId]);
  useEffect(() => { localStorage.setItem("isq7s.data", JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => {
    localStorage.setItem("isq7s.theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const go = (s, id) => {
    if (id) setActiveId(id);
    else if (s === "inbox") setActiveId(null);  // clicking Inbox clears selection
    setStep(s);
    window.scrollTo({top:0, behavior:"smooth"});
  };
  const updateInquiry = (id, patch) => {
    setInquiries(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const active = inquiries[activeId];
  const hasSelection = !!active;

  let S;
  switch (step) {
    case "inbox":   S = <Inbox inquiries={inquiries} go={go} updateInquiry={updateInquiry}/>; break;
    case "inquiry": S = active ? <Inquiry q={active} go={go}/> : <Inbox inquiries={inquiries} go={go} updateInquiry={updateInquiry}/>; break;
    case "price":   S = active ? <Pricing q={active} go={go} updateInquiry={updateInquiry}/> : <Inbox inquiries={inquiries} go={go} updateInquiry={updateInquiry}/>; break;
    case "sent":    S = active ? <Sent q={active} go={go}/> : <Inbox inquiries={inquiries} go={go} updateInquiry={updateInquiry}/>; break;
    case "stats":   S = <Stats/>; break;
    case "config":  S = <Config/>; break;
    case "archive": S = activeArchiveId ? <ArchiveDetail id={activeArchiveId} go={go} setActiveArchiveId={setActiveArchiveId}/> : <Archive go={go} setActiveArchiveId={setActiveArchiveId}/>; break;
    default:        S = <Inbox inquiries={inquiries} go={go}/>;
  }
  return (<>
    <Nav step={step} setStep={(s)=>go(s)} theme={theme} setTheme={setTheme} activeInquiry={active} hasSelection={hasSelection}/>
    <div key={step + (activeId||"")}>{S}</div>
  </>);
};

const Nav = ({ step, setStep, theme, setTheme, activeInquiry, hasSelection }) => {
  const isSent = activeInquiry?.status === "sent";
  const enabled = {
    inbox:   true,
    inquiry: hasSelection && !isSent,
    price:   hasSelection && !isSent,
    sent:    hasSelection && isSent,
  };
  const hint = {
    inbox:   null,
    inquiry: hasSelection ? (isSent ? "Diese Anfrage wurde schon gesendet" : null) : "Erst eine Anfrage auswählen",
    price:   hasSelection ? (isSent ? "Diese Anfrage wurde schon gesendet" : null) : "Erst eine Anfrage auswählen",
    sent:    hasSelection ? (isSent ? null : "Anfrage noch nicht gesendet") : "Erst eine Anfrage auswählen",
  };
  return (
  <div className="nav">
    <div className="logo"><span className="mark"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a1405" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5h14L10 21"/><circle cx="15" cy="12" r="1.6" fill="#1a1405" stroke="none"/></svg></span>ISQ7</div>
    <div className="steps">
      {STEPS.filter(s => enabled[s.id]).map((s, i, visible) => (
        <button
          key={s.id}
          className={`step ${step === s.id ? "active" : ""}`}
          onClick={() => setStep(s.id)}
        >
          <span>{s.label}</span>
        </button>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <button className={`tgl ${step==="archive"?"active":""}`} onClick={() => setStep("archive")} title="Archiv">
        <Icon n="arch" s={15}/>
      </button>
      <button className={`tgl ${step==="stats"?"active":""}`} onClick={() => setStep("stats")} title="Analytics">
        <Icon n="chart" s={15}/>
      </button>
      <button className={`tgl ${step==="config"?"active":""}`} onClick={() => setStep("config")} title="Einstellungen">
        <Icon n="gear" s={15}/>
      </button>
      <button className="tgl" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Theme">
        <Icon n={theme === "dark" ? "sun" : "moon"} s={15}/>
      </button>
    </div>
  </div>
  );
};

// Format € thousands
const fmt = (n) => "€ " + n.toLocaleString("de-DE");
const total = (q) => q.lines.reduce((s, l) => s + l.v, 0);

// ---------- 1. Inbox ----------
// Extra meta shown when "Mehr Details" is on
const META = {
  phil: { recv:"Heute · 07:42", since:"vor 3 Std 18 Min", channel:"groups@lakeview-vienna.at", sla:"Antwort bis morgen 12:00", deals:"7 vorherige Buchungen" },
  omv:  { recv:"Heute · 09:23", since:"vor 1 Std 37 Min", channel:"groups@lakeview-vienna.at", sla:"Angebot bis Donnerstag",   deals:"2 vorherige Buchungen" },
  sie:  { recv:"Heute · 08:11", since:"vor 2 Std 49 Min", channel:"rfp@lakeview-vienna.at",    sla:"RFP-Deadline 28. 4.",     deals:"Neukunde" },
  erb:  { recv:"Gestern · 16:22", since:"vor 19 Std",      channel:"groups@lakeview-vienna.at", sla:"Angebot versendet",       deals:"12 vorherige Buchungen" },
  bmw:  { recv:"Heute · 10:04", since:"vor 56 Min",        channel:"groups@lakeview-vienna.at", sla:"Kein harter Deadline",    deals:"Neukunde" },
};

// PDF-style Dashboard: Two-column layout with sidebar + activity feed
const STATUS_PILL = {
  vip:    { label:"VIP",     tone:"awaiting" },
  new:    { label:"Review",  tone:"review" },
  priced: { label:"Pricing", tone:"pricing" },
  sent:   { label:"Sent",    tone:"sent" },
};

const HEAD_PILL = {
  vip:    { label:"VIP - Awaiting Approval", tone:"awaiting" },
  new:    { label:"Awaiting Approval",       tone:"awaiting" },
  priced: { label:"Priced",                  tone:"pricing" },
  sent:   { label:"Sent",                    tone:"sent" },
};

const timeOf = (id) => {
  var raw = (META[id] && META[id].recv) || "Heute · 09:23";
  var parts = raw.split("·");
  return (parts[parts.length-1] || "").trim();
};

const initialsOf = (q) => {
  var name = q.from || q.co;
  var parts = name.replace(/^Dr\.?\s+/i, "").split(/\s+/).filter(function(s){ return s.length > 0; });
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  return q.co.slice(0,2).toUpperCase();
};

const PDFPreviewModal = ({ q, open, onClose }) => {
  if (!open || !q) return null;
  const proposalNum = "ANG-2026-" + String(((q.id.charCodeAt(0) * 137 + q.id.charCodeAt(1) * 41) % 9000) + 1000).slice(0,4);
  const totalAmt = total(q);
  const lastName = q.from.replace(/^Dr\.?\s+/i, "").split(/\s+/).slice(-1)[0];
  const firstName = q.from.replace(/^Dr\.?\s+/i, "").split(/\s+/)[0];
  const isHerr = /^(Markus|Andreas|Tobias|Roman|Philipp)/i.test(firstName) || q.from.includes("Herr");
  const greeting = `Sehr geehrte${isHerr ? "r Herr" : " Frau"} ${lastName}`;
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 14);
  const validStr = validDate.toLocaleDateString("de-DE", { day:"2-digit", month:"long", year:"numeric" });
  const today = new Date().toLocaleDateString("de-DE", { day:"2-digit", month:"long", year:"numeric" });
  const period = q.event && q.event.dates ? q.event.dates : q.summary.split("·").slice(-1)[0].trim();

  const handleBgClick = function(e){ if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="modal-bg" onClick={handleBgClick}>
      <div className="modal pdf-modal" style={{maxHeight:"none"}}>
        <button className="pdf-modal-x" onClick={onClose} title="Schließen">×</button>
        <div className="pdf-paper">
          <div className="pdf-paper-inner">
            <div className="pdf-paper-head">
              <h1>The Lakeview Vienna</h1>
              <div className="sub">Grandview Hotel Group · Wien</div>
            </div>

            <div className="pdf-paper-meta">
              <div className="col">
                <span className="label">Angebot</span>
                <span className="num">{proposalNum}</span>
              </div>
              <div className="col">
                <span className="label">Zeitraum</span>
                <span className="val">{period}</span>
              </div>
              <div className="col r">
                <span className="label">Datum</span>
                <span className="val">{today}</span>
              </div>
            </div>

            <div className="pdf-paper-greet">{greeting},</div>
            <p>vielen Dank für Ihr Vertrauen{q.intent === "VIP Protocol" ? " und Ihre erneute Anfrage" : " und Ihre Anfrage"}. Wir freuen uns, Ihnen für den genannten Zeitraum das folgende, persönlich kuratierte Angebot vorzulegen.</p>

            <table className="pdf-paper-table">
              <thead>
                <tr>
                  <th>Leistung</th>
                  <th className="amt">Betrag</th>
                </tr>
              </thead>
              <tbody>
                {q.lines.map(function(line, i){
                  const isDiscount = line.v < 0;
                  return (
                    <tr key={i}>
                      <td>{line.k}</td>
                      <td className={"amt" + (isDiscount ? " discount" : "")}>{isDiscount ? "-" : ""}{fmt(Math.abs(line.v))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pdf-paper-total">
              <span className="label">Gesamt</span>
              <span className="val">{fmt(totalAmt)}</span>
            </div>

            <div className="pdf-paper-body-after">
              <p>Alle Preise verstehen sich zuzüglich gesetzlicher Mehrwertsteuer. {q.intent === "VIP Protocol" ? "Selbstverständlich kümmert sich unser Team persönlich um Protokoll, Ankunft und alle individuellen Wünsche." : "Inbegriffen sind die mit Ihnen besprochenen Leistungen sowie unser persönlicher Service durch das Group-Sales-Team."}</p>
              <p>Dieses Angebot ist <em>gültig bis {validStr}</em>. Für Rückfragen oder Anpassungen stehe ich Ihnen jederzeit persönlich zur Verfügung.</p>
            </div>

            <div className="pdf-paper-sig">
              <span className="closing">Mit den herzlichsten Grüßen aus Wien</span>
              <span className="name">Andreas Bauer</span>
              <div className="role">Director · Group Sales</div>
              <div className="contact">+43 1 234 5678 · andreas.bauer@lakeview-vienna.at</div>
            </div>

            <div className="pdf-paper-foot">The Lakeview Vienna · Grandview Hotel Group · {proposalNum}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedEvent = ({ avatar, avatarKind, name, badge, badgeKind, time, children }) => (
  <div className="feed-event">
    <div className={`feed-avatar ${avatarKind}`}>{avatar}</div>
    <div className="feed-content">
      <div className="feed-head">
        <span className="feed-name">{name}</span>
        {badge && <span className={`feed-badge ${badgeKind}`}>{badge}</span>}
        <span className="feed-time">{time}</span>
      </div>
      <div className="feed-body">{children}</div>
    </div>
  </div>
);

const ActivityFeed = ({ q, go, updateInquiry }) => {
  const [pdfOpen, setPdfOpen] = useState(false);
  const t = timeOf(q.id);
  const senderInitials = initialsOf(q);
  const totalAmt = total(q);
  const prices = q.market.map(function(m){ return m.p; });
  const minPrice = Math.min.apply(null, prices);
  const maxPrice = Math.max.apply(null, prices);
  const priority = q.value > 20000 ? "HIGH" : q.value > 10000 ? "MEDIUM" : "STANDARD";
  const proposalNum = "ANG-2026-" + String(((q.id.charCodeAt(0) * 137 + q.id.charCodeAt(1) * 41) % 9000) + 1000).slice(0,4);
  const headPill = HEAD_PILL[q.status] || HEAD_PILL.new;
  const titleSub = q.summary.split("·").slice(0,2).join(" ·").trim();

  const approveAndSend = function(){
    if (updateInquiry) {
      const now = new Date();
      const sentAt = "Heute · " + now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
      updateInquiry(q.id, {
        status: "sent",
        tag: "Gesendet",
        tone: "green",
        sentAt: sentAt,
        sentBy: "Andreas Bauer",
        followUps: q.followUps || [
          { at:"T+0", label:"Angebot per E-Response gesendet", done:true },
          { at:"T+4h", label:"Öffnungsbestätigung erwartet", done:false },
          { at:"T+24h", label:"Automatische Erinnerung", done:false },
          { at:"T+72h", label:"Eskalation an Sales-Manager", done:false },
        ],
      });
    }
    go("sent", q.id);
  };

  return (
    <div className="dash-feed">
      <header className="dash-feed-head">
        <h2>{q.co} — {titleSub}</h2>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <span className={`dash-pill ${headPill.tone}`}>{headPill.label}</span>
          <button className="btn sm" onClick={function(){ go(q.status === "sent" ? "sent" : "inquiry", q.id); }}>
            Vollansicht öffnen <Icon n="arr" s={13}/>
          </button>
        </div>
      </header>
      <div className="dash-events">
        {/* 1. Email received */}
        <FeedEvent avatar={senderInitials} avatarKind="purple" name={q.email} time={t}>
          <div><b>Betreff:</b> {q.emailSubject}</div>
          <div style={{marginTop:8, color:"var(--muted)"}}>{q.emailBody.split("\n\n").slice(0,2).join(" ").slice(0,220)}...</div>
        </FeedEvent>

        {/* 2. AI parsed */}
        <FeedEvent avatar="AI" avatarKind="ai" name="isq7" badge="PARSED" badgeKind="parsed" time={`${t} (+2.3s)`}>
          <div><b>Extrahiert:</b> {q.summary}</div>
          <div><b>Firma:</b> {q.co} · <b>Priorität:</b> {priority} · <b>Est. Revenue:</b> {fmt(q.value)}</div>
        </FeedEvent>

        {/* 3. Auto-reply or VIP draft */}
        {q.vip ? (
          <FeedEvent avatar="!" avatarKind="ai" name="VIP-Modus" badge="DRAFT" badgeKind="parsed" time={`${t} (+5s)`}>
            <div>VIP-Anfrage erkannt - <b>keine Auto-Reply</b> gesendet. Entwurf liegt zur manuellen Freigabe bereit.</div>
            <div className="feed-buttons">
              <button className="btn primary sm" onClick={function(){ go("inquiry", q.id); }}>Entwurf öffnen</button>
              <button className="btn sm" onClick={function(){ go("price", q.id); }}>Preis ansehen</button>
            </div>
          </FeedEvent>
        ) : (
          <FeedEvent avatar="SY" avatarKind="sy" name="Auto-Response" badge="SENT" badgeKind="sent" time={`${t} (+28s)`}>
            <div>Bestätigung an {q.email}: „Vielen Dank für Ihre Anfrage. Ihr maßgeschneidertes Angebot folgt binnen 2 Stunden."</div>
          </FeedEvent>
        )}

        {/* 4. AI pricing — only for non-VIP (VIP shows draft instead) */}
        {!q.vip && (
          <FeedEvent avatar="AI" avatarKind="ai" name="isq7" badge="PRICING" badgeKind="pricing" time={`${t} (+52s)`}>
            <div><b>Empfohlener Preis:</b> €{q.rate}/Nacht · <b>Gesamt:</b> {fmt(totalAmt)}</div>
            <div><b>Markt:</b> Wettbewerber bei €{minPrice}-{maxPrice}</div>
            <div><b>Event:</b> {q.event.name} ({q.event.dates})</div>
          </FeedEvent>
        )}

        {/* 5. PDF generated — only for non-VIP */}
        {!q.vip && q.status === "new" && (
          <FeedEvent avatar="SY" avatarKind="sy" name="PDF generiert" time={`${t} (+58s)`}>
            <div>Angebot <b>{proposalNum}.pdf</b> erstellt (3 Seiten). Bereit zur Freigabe.</div>
            <div className="feed-buttons">
              <button className="btn primary sm" onClick={function(){ setPdfOpen(true); }}>PDF Vorschau</button>
              <button className="btn green sm" onClick={approveAndSend}>Freigeben & Senden</button>
              <button className="btn sm" onClick={function(){ go("price", q.id); }}>Preis anpassen</button>
            </div>
          </FeedEvent>
        )}

        {/* PRICED status: Human is reviewing/adjusting price */}
        {q.status === "priced" && (
          <>
            <FeedEvent avatar="AB" avatarKind="purple" name="Andreas Bauer" badge="REVIEW" badgeKind="parsed" time={`${t} (+3min)`}>
              <div>Hat den AI-Vorschlag geöffnet. Preis von €{q.rate} auf <b>€{q.rate}</b> bestätigt.</div>
              <div style={{marginTop:6, color:"var(--muted)"}}>Anpassungen: keine. PDF wird mit angepassten Werten neu generiert.</div>
            </FeedEvent>
            <FeedEvent avatar="SY" avatarKind="sy" name="PDF aktualisiert" time={`${t} (+4min)`}>
              <div>Angebot <b>{proposalNum}.pdf</b> mit menschlich bestätigtem Preis. Bereit zum Versand.</div>
              <div className="feed-buttons">
                <button className="btn primary sm" onClick={function(){ setPdfOpen(true); }}>PDF Vorschau</button>
                <button className="btn green sm" onClick={approveAndSend}>Freigeben & Senden</button>
                <button className="btn sm" onClick={function(){ go("price", q.id); }}>Erneut anpassen</button>
              </div>
            </FeedEvent>
          </>
        )}

        {/* SENT status: Approved + sent + follow-ups */}
        {q.status === "sent" && (
          <>
            <FeedEvent avatar="AB" avatarKind="purple" name="Andreas Bauer" badge="APPROVED" badgeKind="sent" time={q.sentAt || `${t} (+5min)`}>
              <div>Angebot freigegeben und an {q.email} versendet.</div>
              <div style={{marginTop:6, color:"var(--muted)"}}>Total: <b>{fmt(totalAmt)}</b> · Versendet von {q.sentBy || "Andreas Bauer"}</div>
            </FeedEvent>
            {(q.followUps || []).filter(function(fu){ return fu.done; }).map(function(fu, i){
              return (
                <FeedEvent key={"fu"+i} avatar="SY" avatarKind="sy" name={fu.label} badge={fu.at} badgeKind="sent" time={fu.at}>
                  <div>{fu.label}</div>
                </FeedEvent>
              );
            })}
            <div style={{marginTop:8, padding:"14px 18px", borderRadius:12, background:"color-mix(in srgb,var(--green) 6%,var(--input))", border:"1px solid color-mix(in srgb,var(--green) 22%,var(--panel-border))", fontSize:13.5}}>
              <div style={{fontFamily:"var(--font-m)", fontSize:11, color:"var(--green)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:6}}>Aktueller Stand</div>
              <div>Wartet auf Kundenantwort. Nächster automatischer Touch: {(q.followUps||[]).find(function(fu){ return !fu.done; })?.label || "—"}.</div>
              <div className="feed-buttons">
                <button className="btn primary sm" onClick={function(){ setPdfOpen(true); }}>PDF erneut senden</button>
                <button className="btn sm">Follow-up jetzt</button>
                <button className="btn sm" onClick={function(){ go("sent", q.id); }}>Vollansicht</button>
              </div>
            </div>
          </>
        )}
      </div>
      <PDFPreviewModal q={q} open={pdfOpen} onClose={function(){ setPdfOpen(false); }}/>
    </div>
  );
};

const Inbox = ({ inquiries, go, updateInquiry }) => {
  const visible = ORDER.filter(function(id){ return inquiries[id]; });
  const [selectedId, setSelectedId] = useState(function(){
    var saved = localStorage.getItem("isq7s.dash-id");
    if (saved && inquiries[saved]) return saved;
    return visible.length > 0 ? visible[0] : null;
  });
  useEffect(function(){
    if (selectedId) localStorage.setItem("isq7s.dash-id", selectedId);
  }, [selectedId]);

  const count = visible.length;
  const active = selectedId ? inquiries[selectedId] : null;

  return (
    <div className="dash enter">
      <aside className="dash-side">
        <div className="dash-side-head">HEUTE · {count} ANFRAGEN</div>
        <div className="dash-list">
          {visible.map(function(id){
            const q = inquiries[id];
            const isActive = selectedId === id;
            const pill = STATUS_PILL[q.status] || STATUS_PILL.new;
            const t = timeOf(id);
            return (
              <div
                key={id}
                className={`dash-card ${isActive ? "active" : ""}`}
                onClick={function(){ setSelectedId(id); }}
              >
                <div className="dash-card-co">{q.co}</div>
                <div className="dash-card-sum">{q.summary}</div>
                <div className="dash-card-meta">
                  <span className={`dash-pill ${pill.tone}`}>{pill.label}</span>
                  <span className="dash-card-time">{t}</span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
      <main className="dash-main">
        {active ? <ActivityFeed q={active} go={go} updateInquiry={updateInquiry}/> : (
          <div className="dash-empty">
            <div>Keine Anfrage ausgewählt.</div>
            <div style={{marginTop:6, fontSize:12}}>Wähle eine aus der Liste.</div>
          </div>
        )}
      </main>
    </div>
  );
};

// ---------- 2. Inquiry detail ----------
const InquirySteps = ({ q, go }) => {
  const [open, setOpen] = useState(null);
  const baseSteps = [
    { id:"read",    time:"09:23", done:true,  label:`E-Mail gelesen · ${q.language} + ${q.intent} erkannt`, kind:"email-in" },
    { id:"extract", time:"09:23", done:true,  label:"Strukturierte Daten extrahiert", kind:"extract" },
  ];
  const replyStep = q.vip
    ? { id:"reply", time:"09:23", done:false, label:"VIP erkannt (Regel r3) — KEINE Auto-Reply. Entwurf wartet auf dich.", kind:"email-out-vip" }
    : { id:"reply", time:"09:23", done:true,  label:"Auto-Reply in gleicher Sprache gesendet", kind:"email-out" };
  const steps = [
    ...baseSteps,
    replyStep,
    { id:"market",  time:"09:24", done:true,  label:"Live-Raten von 4 Wiener Mitbewerbern geholt", kind:"market" },
    { id:"event",   time:"09:24", done:true,  label:`${q.event.name}`, kind:"event" },
  ];
  return (
    <div className="steps-v">
      {steps.map((s, i) => {
        const isOpen = open === s.id;
        return (
          <Fragment key={s.id}>
            <div className={`sv ${s.done ? "done" : ""}`} onClick={()=>setOpen(isOpen ? null : s.id)}>
              <div className="c">{s.done ? <Icon n="check" s={12}/> : i+1}</div>
              <div>{s.label}</div>
              <span className="mono" style={{color:"var(--dim)",fontSize:12,display:"flex",alignItems:"center",gap:8}}>
                {s.time}
                <span style={{display:"inline-block",transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0)"}}>›</span>
              </span>
            </div>
            {isOpen && (
              <div className="sv-exp">
                <StepDetail step={s} q={q} go={go}/>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

const StepDetail = ({ step, q, go }) => {
  const k = step.kind;
  if (k === "email-in") return (
    <div className="panel">
      <div className="email-head">
        <span className="l">Von</span><span>{q.from} &lt;{q.email}&gt;</span>
        <span className="l">An</span><span>groups@lakeview-vienna.at</span>
        <span className="l">Betreff</span><span>{q.emailSubject}</span>
        <span className="l">Empfangen</span><span className="mono">Di 09:23 · via IMAP</span>
      </div>
      <div className="email-body">{q.emailBody}</div>
      <div className="chips">
        <span className="pill">Sprache: {q.language}</span>
        <span className="pill">Intent: {q.intent}</span>
        <span className="pill">Confidence: {q.confidence}</span>
      </div>
    </div>
  );
  if (k === "extract") return (
    <div className="panel">
      <div style={{fontSize:12,color:"var(--dim)",fontFamily:"var(--font-m)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>Extrahierte Felder</div>
      {q.extract.map(([kk,vv]) => (
        <div className="kv" key={kk}><span className="k">{kk}</span><span className="v">{vv}</span></div>
      ))}
    </div>
  );
  if (k === "email-out") return (
    <div className="panel">
      <div className="email-head">
        <span className="l">Von</span><span>groups@lakeview-vienna.at</span>
        <span className="l">An</span><span>{q.email}</span>
        <span className="l">Betreff</span><span>Re: {q.emailSubject}</span>
        <span className="l">Gesendet</span><span className="mono">Di 09:23 · +47 s nach Eingang</span>
      </div>
      <div className="email-body">{`Sehr geehrte${q.from.includes("Herr")||q.from.match(/^(Markus|Andreas)/)?"r Herr":" Frau"} ${q.from.split(" ").slice(-1)[0]},

vielen Dank für Ihre Anfrage. Wir prüfen Verfügbarkeit und Raten und senden Ihnen bis heute Nachmittag ein maßgeschneidertes Angebot.

Falls Sie vorab Fragen haben, antworten Sie gerne direkt auf diese E-Mail.

Herzliche Grüße
Andreas Bauer
Group Sales · The Lakeview Vienna`}</div>
      <div className="chips">
        <span className="pill gold">Sprache an Anfrage angepasst</span>
        <span className="pill">Signatur: Andreas Bauer</span>
      </div>
    </div>
  );
  if (k === "market") return (
    <div className="panel">
      <div style={{fontSize:12,color:"var(--dim)",fontFamily:"var(--font-m)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>Live-Raten · Wien</div>
      {q.market.map(m => (
        <div className="comp" key={m.n}><span className="name">{m.n}</span><span className="bar"><span className="f" style={{width:m.w+"%"}}/></span><span className="price">{fmt(m.p)}</span></div>
      ))}
      <div style={{marginTop:10,fontSize:12,color:"var(--dim)",fontFamily:"var(--font-m)"}}>Quelle: Amadeus iHotelier · aktualisiert vor 2 Minuten</div>
    </div>
  );
  if (k === "event") return (
    <div className="panel">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        <span className={`pill ${q.event.tone}`}><span className="dot"/>{q.event.pill}</span>
        <span style={{fontFamily:"var(--font-m)",fontSize:12,color:"var(--dim)"}}>{q.event.dates}</span>
      </div>
      <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>{q.event.name}</div>
      <div style={{color:"var(--muted)",fontSize:14,lineHeight:1.55}}>{q.event.body}</div>
    </div>
  );
  if (k === "email-out-vip") return (
    <div className="panel">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <span className="pill vip"><span className="dot"/>VIP-Modus aktiv</span>
        <span style={{color:"var(--muted)",fontSize:13}}>Keine Auto-Reply gesendet. Du entscheidest.</span>
      </div>
      <div style={{color:"var(--muted)",fontSize:13,lineHeight:1.6}}>
        Die AI hat einen Entwurf vorbereitet und wartet. Du findest ihn unten im Abschnitt <b>„Antwort-Entwurf“</b> — bearbeite ihn direkt oder sag der AI, was du anders haben willst.
      </div>
    </div>
  );
  return null;
};

const VIPDraftReply = ({ q }) => {
  const [draft, setDraft] = useState(q.draftReply || "");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, loading]);

  const instruct = async (userText) => {
    const text = (userText || input).trim();
    if (!text || loading) return;
    const newChat = [...chat, { role:"me", text }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const system = `Du bist ein AI-Sales-Assistent. Der User möchte den Antwort-Entwurf ändern.

Aktueller Entwurf:
"""
${draft}
"""

Der User sagt: "${text}"

Schreibe den KOMPLETT überarbeiteten Entwurf neu. Antworte AUSSCHLIESSLICH als JSON:
{
  "explanation": "Ein kurzer deutscher Satz was du geändert hast.",
  "draft": "Der komplette neue E-Mail-Text."
}`;

    let parsed = null;
    try {
      const raw = await window.claude.complete(system);
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    } catch(e) {}

    if (parsed && parsed.draft) {
      setChat([...newChat, { role:"ai", text: parsed.explanation || "Entwurf aktualisiert." }]);
      setDraft(parsed.draft);
    } else {
      setChat([...newChat, { role:"ai", text:"Konnte die Änderung nicht interpretieren. Formuliere es bitte anders.", error:true }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Persönlicher, weniger formell",
    "Konkretes Datum für den Rückruf anbieten",
    "Diskretion nochmal explizit erwähnen",
    "Kürzer — max. 3 Sätze",
  ];

  const sent = chat.some(m => m.role === "sent");

  return (
    <div className="card" style={{marginTop:12}}>
      <div className="section-head">
        <h3>Antwort-Entwurf · wartet auf dich</h3>
        <span className="note vip-note">VIP · keine Auto-Reply</span>
      </div>
      <div style={{color:"var(--muted)",fontSize:13,lineHeight:1.6,marginBottom:14}}>
        Bearbeite direkt im Feld unten — oder sag der AI, was du anders haben willst.
      </div>

      <textarea
        className="ta"
        rows={10}
        value={draft}
        onChange={e=>setDraft(e.target.value)}
        style={{fontFamily:"var(--font-b)",fontSize:14,lineHeight:1.65}}
      />

      <div style={{marginTop:16,padding:"14px 16px",background:"var(--input)",border:"1px solid var(--panel-border)",borderRadius:12}}>
        <div style={{fontSize:12,color:"var(--dim)",fontFamily:"var(--font-m)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>AI anweisen</div>
        <div className="chat" ref={chatRef} style={{maxHeight:220,overflowY:"auto"}}>
          {chat.length === 0 && (
            <div className="msg ai">Sag mir, was ich am Entwurf ändern soll.</div>
          )}
          {chat.map((m,i) => (
            <div key={i} className={`msg ${m.role} ${m.error?"error":""}`}>{m.text}</div>
          ))}
          {loading && <div className="msg ai thinking">AI schreibt um …</div>}
        </div>
        {chat.length === 0 && (
          <div className="sugg">
            {suggestions.map(s => <button key={s} onClick={()=>instruct(s)}>{s}</button>)}
          </div>
        )}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <textarea
            className="ta"
            rows={2}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); instruct(); } }}
            placeholder="z.B.: Persönlicher, erwähn die letzte Buchung im November."
          />
          <button className="btn primary" onClick={()=>instruct()} disabled={loading || !input.trim()}>
            <Icon n="send" s={14}/>
          </button>
        </div>
      </div>

      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button className="btn green big" style={{flex:1}}
          onClick={()=>setChat([...chat,{role:"sent",text:"Entwurf von dir gesendet um "+new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+"."}])}
          disabled={sent}>
          {sent ? <><Icon n="check" s={14}/> Gesendet</> : <><Icon n="send" s={14}/> So senden</>}
        </button>
      </div>
    </div>
  );
};

const CustomerMemory = ({ q }) => {
  const m = MEMORY[q.id];
  if (!m) return null;
  const [open, setOpen] = useState(false);

  if (m.bookings === 0) {
    return (
      <div className="card" style={{marginTop:12}}>
        <div className="section-head">
          <h3>Kundenprofil</h3>
          <span className="note">Neukunde</span>
        </div>
        <div className="memory-empty">
          <div className="new-badge">NEU</div>
          <div>
            <div style={{fontWeight:500,fontSize:15,marginBottom:4}}>Keine Historie bei The Lakeview</div>
            <div style={{color:"var(--muted)",fontSize:13,lineHeight:1.55}}>{m.notes}</div>
          </div>
        </div>
        <div className="ai-reason">
          <div className="ai-reason-head"><Icon n="spark" s={13}/> Wie die AI damit umgeht</div>
          <div className="ai-reason-body">{m.aiReasoning}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{marginTop:12}}>
      <div className="section-head">
        <h3>Kundenprofil</h3>
        <span className="note">{m.rating === "A+" ? "Schlüsselkunde" : "Bestandskunde"} seit {m.since}</span>
      </div>
      <div className="memory-stats">
        <div><div className="l">Buchungen</div><div className="v mono">{m.bookings}</div></div>
        <div><div className="l">Ø Rabatt historisch</div><div className="v mono">{m.avgDiscount} %</div></div>
        <div><div className="l">Lifetime Value</div><div className="v mono">{fmt(m.lifetimeValue)}</div></div>
        <div><div className="l">Rating</div><div className="v"><span className="pill gold" style={{fontSize:13}}>{m.rating}</span></div></div>
      </div>
      <div style={{color:"var(--muted)",fontSize:13,lineHeight:1.55,marginTop:6,marginBottom:16}}>{m.notes}</div>

      <div className="ai-reason">
        <div className="ai-reason-head"><Icon n="spark" s={13}/> Warum diese Rabatt-Logik</div>
        <div className="ai-reason-body">{m.aiReasoning}</div>
      </div>

      <button className="mem-expand" onClick={()=>setOpen(!open)}>
        <span style={{transition:"transform .2s",display:"inline-block",transform:open?"rotate(90deg)":"rotate(0)"}}>›</span>
        {" "}Buchungshistorie ({m.history.length})
      </button>

      {open && (
        <div className="history">
          {m.history.map((h,i) => (
            <div className="hist-row" key={i}>
              <span className="when mono">{h.when}</span>
              <span className="what">{h.what}</span>
              <span className="mono" style={{color:"var(--muted)"}}>{fmt(h.rate)}/N</span>
              <span className={`pill ${h.disc > 0 ? "gold" : ""}`}>{h.disc > 0 ? `–${h.disc} %` : "kein Rabatt"}</span>
              <span className="reason">{h.reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Inquiry = ({ q, go }) => (
  <div className="wrap enter" style={{maxWidth:720}}>
    <button className="btn" onClick={() => go("inbox")} style={{marginBottom:24}}><Icon n="back" s={14}/> Zurück</button>
    <div className="eyebrow">{q.vip ? "VIP-Anfrage" : "Anfrage"} · {q.co}</div>
    <h1 className="title">{q.title.split("\n").map((l,i) => <Fragment key={i}>{l}{i===0?<br/>:null}</Fragment>)}</h1>
    <p className="lede">Von {q.from} · empfangen 09:23 · in 4 Sekunden geparsed.</p>

    {q.vip && (
      <div className="vip-banner">
        <div className="vip-dot"/>
        <div>
          <div style={{fontWeight:600,fontSize:15,marginBottom:2}}>VIP-Regel (r3) hat gegriffen</div>
          <div style={{color:"var(--muted)",fontSize:13,lineHeight:1.55}}>Die Philharmoniker sind explizit als VIP hinterlegt. Keine Auto-Reply. Die AI hat einen Entwurf vorbereitet — <b>du</b> entscheidest, was rausgeht.</div>
        </div>
      </div>
    )}

    <div className="card" style={{marginTop: q.vip ? 12 : 40}}>
      <div className="section-head">
        <h3>Was die AI gemacht hat</h3>
        <span className="note">in 47 Sekunden</span>
      </div>
      <InquirySteps q={q} go={go}/>
    </div>

    {q.vip && <VIPDraftReply q={q}/>}

    <CustomerMemory q={q}/>

    <div className="card" style={{marginTop:12, textAlign:"center", padding:40}}>
      <div className="eyebrow">Empfohlener Gesamtpreis</div>
      <div className="hero-num">{fmt(total(q))}</div>
      <div className="hero-sub">{fmt(q.rate)} {q.rateHint}</div>
      <button className="btn primary big" style={{marginTop:28}} onClick={() => go("price", q.id)}>
        Angebot prüfen <Icon n="arr" s={14}/>
      </button>
    </div>
  </div>
);

// ---------- 3. Pricing with AI-Adjust ----------
const Pricing = ({ q, go, updateInquiry }) => {
  const [sending, setSending] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, loading]);

  const approve = () => {
    if (sending) return;
    setSending(true);
    setTimeout(() => {
      updateInquiry(q.id, { status:"sent", tag:"Gesendet", tone:"green", sentAt:"Gerade eben", sentBy:"Andreas Bauer",
        followUps: [
          { at:"T+0", label:"Angebot gesendet per E-Response", done:true },
          { at:"T+4h", label:"Öffnungsbestätigung erwartet", done:false },
          { at:"T+24h", label:"Automatische Erinnerung", done:false },
          { at:"T+72h", label:"Eskalation an Sales-Manager", done:false },
        ],
      });
      go("sent");
    }, 1100);
  };

  const applyAdjust = async (userText) => {
    const text = (userText || input).trim();
    if (!text || loading) return;
    const newChat = [...chat, { role:"me", text }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const system = `Du bist ein AI-Sales-Assistent für ein Hotel in Wien. Der User möchte ein Angebot anpassen. 
Aktuelles Angebot:
${q.lines.map(l => `- ${l.k}: ${l.v} EUR`).join("\n")}
Total: ${total(q)} EUR
Zimmer-Rate: ${q.rate} EUR / Nacht

Der User sagt: "${text}"

Antworte AUSSCHLIESSLICH als gültiges JSON in diesem Format (keine Erklärungen außerhalb):
{
  "explanation": "Ein kurzer deutscher Satz was du geändert hast.",
  "lines": [{"k":"Positionstext","v":Zahl_in_EUR}, ...],
  "rate": neue_zimmer_rate_in_EUR
}

Die "lines" müssen die KOMPLETTE neue Aufstellung sein, nicht nur Deltas. Behalte bestehende Positionen bei wenn sie nicht betroffen sind. Neue Positionen hinzufügen ist erlaubt.`;

    let parsed = null;
    try {
      const raw = await window.claude.complete(system);
      // Extract JSON block
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    } catch(e) {
      // fallback to local heuristic
      parsed = localAdjust(text, q);
    }
    if (!parsed) parsed = localAdjust(text, q);

    if (parsed && parsed.lines && parsed.explanation) {
      setChat([...newChat, { role:"ai", text: parsed.explanation }]);
      updateInquiry(q.id, { lines: parsed.lines, rate: parsed.rate || q.rate });
    } else {
      setChat([...newChat, { role:"ai", text:"Konnte die Änderung nicht interpretieren. Formuliere es bitte anders.", error:true }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Gib 10 % Rabatt",
    "Frühstück dazugeben",
    "Deadline um eine Woche verlängern",
    "Premium-F&B-Paket statt Standard",
  ];

  return (
    <div className="wrap enter" style={{maxWidth:720}}>
      <button className="btn" onClick={() => go("inquiry", q.id)} style={{marginBottom:24}}><Icon n="back" s={14}/> Zurück</button>

      <div className="eyebrow">Angebot · {q.co}</div>
      <h1 className="title">Warum {fmt(q.rate)}?</h1>
      <p className="lede">Basiert auf Live-Marktdaten und dem Event-Fenster.</p>

      <div className="card" style={{marginTop:40}}>
        <div className="section-head">
          <h3>Markt-Raten · Wien</h3>
          <span className="note">vor 2 min aktualisiert</span>
        </div>
        {q.market.map(m => (
          <div className="comp" key={m.n}><span className="name">{m.n}</span><span className="bar"><span className="f" style={{width:m.w+"%"}}/></span><span className="price">{fmt(m.p)}</span></div>
        ))}
        <div className="comp ours"><span className="name">The Lakeview (du)</span><span className="bar"><span className="f"/></span><span className="price">{fmt(q.rate)}</span></div>
      </div>

      <div className="card" style={{marginTop:12}}>
        {q.lines.map((l,i) => (
          <div className="kv" key={i}><span className="k">{l.k}</span><span className="v">{fmt(l.v)}</span></div>
        ))}
        <div className="kv" style={{fontWeight:600,fontSize:17,paddingTop:18,borderTop:"1px solid var(--panel-border)",borderBottom:0,marginTop:6}}>
          <span>Total</span><span className="v" style={{color:"var(--gold)"}}>{fmt(total(q))}</span>
        </div>
      </div>

      {adjustOpen && (
        <div className="card" style={{marginTop:12}}>
          <div className="section-head">
            <h3>Mit der AI anpassen</h3>
            <span className="note">versteht Freitext</span>
          </div>
          <div className="chat" ref={chatRef} style={{maxHeight:"40vh",overflowY:"auto"}}>
            {chat.length === 0 && (
              <div className="msg ai">Was möchtest du an diesem Angebot ändern? Beschreibe es einfach in deinen Worten.</div>
            )}
            {chat.map((m,i) => (
              <div key={i} className={`msg ${m.role} ${m.error?"error":""}`}>{m.text}</div>
            ))}
            {loading && <div className="msg ai thinking">AI denkt nach …</div>}
          </div>
          {chat.length === 0 && (
            <div className="sugg">
              {suggestions.map(s => <button key={s} onClick={()=>applyAdjust(s)}>{s}</button>)}
            </div>
          )}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <textarea
              className="ta"
              rows={2}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); applyAdjust(); } }}
              placeholder="z.B.: Gib einen Stammkunden-Rabatt von 10 % und füge Frühstück dazu."
            />
            <button className="btn primary" onClick={()=>applyAdjust()} disabled={loading || !input.trim()}>
              <Icon n="send" s={14}/>
            </button>
          </div>
        </div>
      )}

      <div className="bottom">
        <button className="btn green big" style={{flex:1}} onClick={approve} disabled={sending}>
          {sending ? "Sende …" : <><Icon n="check" s={15}/> Freigeben & senden</>}
        </button>
        <button className="btn big" onClick={()=>setAdjustOpen(!adjustOpen)}>
          <Icon n="spark" s={14}/> {adjustOpen ? "Schließen" : "Anpassen"}
        </button>
      </div>
    </div>
  );
};

// local fallback when AI not available
function localAdjust(text, q) {
  const t = text.toLowerCase();
  const lines = [...q.lines];
  let rate = q.rate;
  let explanation = "Angebot aktualisiert.";
  const discM = t.match(/(\d+)\s*%/);
  if (discM && (t.includes("rabatt") || t.includes("discount") || t.includes("reduz"))) {
    const pct = parseInt(discM[1], 10) / 100;
    for (let i=0;i<lines.length;i++) lines[i] = { ...lines[i], v: Math.round(lines[i].v * (1-pct)) };
    rate = Math.round(rate * (1-pct));
    explanation = `${discM[1]} % Rabatt auf alle Positionen angewendet. Neue Rate: € ${rate}.`;
    return { lines, rate, explanation };
  }
  if (t.includes("frühstück") || t.includes("breakfast")) {
    lines.push({ k:"Frühstücksbuffet", v:Math.round(q.lines[0].v * 0.15) });
    explanation = "Frühstücksbuffet ergänzt.";
    return { lines, rate, explanation };
  }
  if (t.includes("premium") || t.includes("upgrade")) {
    const idx = lines.findIndex(l => /f&b|lunch|dinner/i.test(l.k));
    if (idx >= 0) {
      lines[idx] = { ...lines[idx], k: lines[idx].k + " (Premium)", v: Math.round(lines[idx].v * 1.3) };
    } else {
      lines.push({ k:"Premium-Upgrade", v:800 });
    }
    explanation = "Auf Premium-Paket aufgewertet.";
    return { lines, rate, explanation };
  }
  return { lines, rate, explanation:"Nicht ganz sicher was gemeint war — keine Änderungen gemacht. Formuliere gern anders." };
}

// ---------- 4. Sent ----------
const Sent = ({ q, go }) => {
  const steps = q.followUps || [
    { at:"T+0", label:"Angebot per E-Response gesendet", done:true },
    { at:"T+4h", label:"Öffnungsbestätigung erwartet", done:false },
    { at:"T+24h", label:"Automatische Erinnerung", done:false },
    { at:"T+72h", label:"Eskalation an Sales-Manager", done:false },
  ];

  return (
    <div className="wrap enter" style={{maxWidth:640}}>
      <button className="btn" onClick={() => go("inbox")} style={{marginBottom:24}}><Icon n="back" s={14}/> Zurück</button>

      <div style={{textAlign:"center"}}>
        <div className="big-check"><Icon n="check" s={38}/></div>
        <div className="eyebrow">Angebot gesendet</div>
        <h1 className="title">{q.co}</h1>
        <p className="lede" style={{margin:"14px auto 0"}}>Total {fmt(total(q))} · gesendet {q.sentAt || "gerade eben"} von {q.sentBy || "Andreas Bauer"}.</p>
      </div>

      <div className="card" style={{marginTop:40}}>
        <div className="section-head">
          <h3>E-Mail an {q.from}</h3>
          <span className="note">E-Response · tracked</span>
        </div>
        <div className="email-head">
          <span className="l">Von</span><span>groups@lakeview-vienna.at</span>
          <span className="l">An</span><span>{q.email}</span>
          <span className="l">Betreff</span><span>Ihr Angebot: {q.emailSubject.replace(/^Anfrage:\s*/,"")}</span>
        </div>
        <div className="email-body" style={{fontSize:14}}>{`Sehr geehrte${q.from.match(/^(Markus|Andreas)/)?"r Herr":" Frau"} ${q.from.split(" ").slice(-1)[0]},

anbei unser Angebot für Ihre Anfrage. Die wichtigsten Eckdaten:

${q.lines.map(l => `• ${l.k}: ${fmt(l.v)}`).join("\n")}

Total: ${fmt(total(q))}

Das Angebot ist gültig bis Freitag 18:00. Gerne stehen wir für Rückfragen zur Verfügung.

Herzliche Grüße
Andreas Bauer
Group Sales · The Lakeview Vienna`}</div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="section-head">
          <h3>Follow-up Plan</h3>
          <span className="note">AI orchestriert</span>
        </div>
        {steps.map((s,i) => (
          <div key={i} className={`sv nc ${s.done?"done":""}`} style={{borderBottom: i===steps.length-1 ? 0 : ""}}>
            <div className="c">{s.done ? <Icon n="check" s={12}/> : i+1}</div>
            <div>{s.label}</div>
            <span className="mono" style={{color:"var(--dim)",fontSize:12}}>{s.at}</span>
          </div>
        ))}
      </div>

      <div className="bottom" style={{justifyContent:"center"}}>
        <button className="btn big" onClick={() => go("inbox")}>Zurück zur Inbox</button>
        <button className="btn primary big" onClick={() => go("stats")}>Analytics ansehen <Icon n="arr" s={14}/></button>
      </div>
    </div>
  );
};

// ---------- Archive ----------
const Archive = ({ go, setActiveArchiveId }) => {
  const [filter, setFilter] = useState("all");
  const [detailed, setDetailed] = useState(() => localStorage.getItem("isq7s.arch-detail") === "1");
  useEffect(()=>{ localStorage.setItem("isq7s.arch-detail", detailed ? "1" : "0"); }, [detailed]);

  const filtered = ARCHIVE.filter(a => filter === "all" || a.outcome === filter);
  const stats = {
    total: ARCHIVE.length,
    won: ARCHIVE.filter(a => a.outcome === "won").length,
    lost: ARCHIVE.filter(a => a.outcome === "lost").length,
    revenue: ARCHIVE.filter(a => a.outcome === "won" || a.outcome === "recurring").reduce((s,a) => s + a.value, 0),
  };
  const winRate = Math.round((stats.won / (stats.won + stats.lost)) * 100);

  const OUTCOME = {
    won:       { label:"Gewonnen", tone:"green" },
    lost:      { label:"Verloren", tone:"red" },
    recurring: { label:"Stammkunde", tone:"gold" },
    pending:   { label:"Ausstehend", tone:"blue" },
  };

  const FILTERS = [
    { id:"all",  label:`Alle · ${stats.total}` },
    { id:"won",  label:`Gewonnen · ${stats.won}` },
    { id:"lost", label:`Verloren · ${stats.lost}` },
    { id:"recurring", label:"Stammkunden" },
  ];

  return (
    <div className="wrap enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:20}}>
        <div>
          <div className="eyebrow">Archiv</div>
          <h1 className="title">Abgeschlossene Anfragen.</h1>
          <p className="lede">{stats.total} Anfragen in den letzten 60 Tagen · {winRate} % Win-Rate · {fmt(stats.revenue)} Umsatz.</p>
        </div>
        <button className="more-toggle" onClick={()=>setDetailed(!detailed)}>
          {detailed ? "Weniger Details" : "Mehr Details"}
        </button>
      </div>

      <div className="arch-filters">
        {FILTERS.map(f => (
          <button key={f.id} onClick={()=>setFilter(f.id)} className={`filter-pill ${filter===f.id?"active":""}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="card" style={{marginTop:20, padding:"8px 24px"}}>
        <div className="list">
          {filtered.length === 0 && (
            <div style={{padding:"48px 0",textAlign:"center",color:"var(--dim)"}}>Keine Anfragen in dieser Kategorie.</div>
          )}
          {filtered.map(a => {
            const o = OUTCOME[a.outcome] || OUTCOME.pending;
            return (
              <div className={`row ${detailed?"detailed":""}`} key={a.id} style={{cursor:"pointer"}} onClick={()=>setActiveArchiveId(a.id)}>
                <div className="company-name">
                  <div className="avatar" style={{opacity:.75}}>{a.co.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div className="who">{a.co}</div>
                    <div className="what">{a.summary}</div>
                    {detailed && (
                      <div className="row-meta">
                        <span>{a.from}</span>
                        <span className="sep">·</span>
                        <span>Gesendet {a.sent}</span>
                        <span className="sep">·</span>
                        <span>Reply in {a.replied}</span>
                        <span className="sep">·</span>
                        <span>Bearbeitet von {a.handledBy}</span>
                        {a.lostReason && (<><span className="sep">·</span><span style={{color:"var(--red)"}}>{a.lostReason}</span></>)}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:16}}>
                  {detailed && !a.lostReason && (
                    <div className="row-meta-right"><div>Reply in</div><div className="d">{a.replied}</div></div>
                  )}
                  <span className="mono" style={{fontSize:15, opacity: a.outcome === "lost" ? .6 : 1, textDecoration: a.outcome === "lost" ? "line-through" : "none"}}>{fmt(a.value)}</span>
                  <span className={`pill ${o.tone}`}><span className="dot"/>{o.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{marginTop:24,textAlign:"center",color:"var(--dim)",fontSize:13,fontFamily:"var(--font-m)"}}>
        Ältere Anfragen werden nach 12 Monaten automatisch archiviert. Export nach CSV / Excel verfügbar in den Einstellungen.
      </div>
    </div>
  );
};

// ---------- Archive Detail (full post-mortem for a closed inquiry) ----------
const ArchiveDetail = ({ id, go, setActiveArchiveId }) => {
  const a = ARCHIVE.find(x => x.id === id);
  if (!a) return null;

  const OUTCOME = {
    won:       { label:"Gewonnen", tone:"green", title:"Deal gewonnen.", sub:"Dieser Deal ist abgeschlossen. Hier ist was passiert und was wir daraus gelernt haben." },
    lost:      { label:"Verloren", tone:"red",   title:"Deal verloren.",  sub:"Wir haben diesen Deal nicht gewonnen. Die AI hat die Signale aufgezeichnet und angepasst." },
    recurring: { label:"Stammkunde", tone:"gold", title:"Wiederkehrender Deal.", sub:"Teil eines Rahmenvertrags. Wurde vollautomatisch abgewickelt." },
  };
  const o = OUTCOME[a.outcome];

  const TIMELINE_KIND = {
    in:   { icon:"in",    color:"muted" },
    ai:   { icon:"spark", color:"gold" },
    out:  { icon:"out",   color:"muted" },
    rev:  { icon:"check", color:"blue" },
    send: { icon:"send",  color:"gold" },
    track:{ icon:"check", color:"muted" },
    nego: { icon:"arr",   color:"purple" },
    won:  { icon:"check", color:"green" },
    lost: { icon:"arr",   color:"red" },
  };

  return (
    <div className="wrap enter" style={{maxWidth:720}}>
      <button className="btn" onClick={() => setActiveArchiveId(null)} style={{marginBottom:24}}><Icon n="back" s={14}/> Zurück zum Archiv</button>

      <div style={{display:"flex",alignItems:"flex-start",gap:16,justifyContent:"space-between"}}>
        <div>
          <div className="eyebrow">{a.co} · {a.summary}</div>
          <h1 className="title">{o.title}</h1>
          <p className="lede">{o.sub}</p>
        </div>
        <span className={`pill ${o.tone}`} style={{fontSize:13,flexShrink:0}}><span className="dot"/>{o.label}</span>
      </div>

      {/* Outcome summary */}
      <div className="card" style={{marginTop:40}}>
        <div className="section-head"><h3>Ergebnis</h3><span className="note">{a.sent}</span></div>
        <div className="memory-stats" style={{borderBottom:0}}>
          <div><div className="l">Angebot</div><div className="v mono">{fmt(a.offered)}</div></div>
          <div><div className="l">{a.outcome === "lost" ? "Nicht erzielt" : "Final"}</div><div className="v mono" style={{color: a.outcome === "lost" ? "var(--red)" : (a.value !== a.offered ? "var(--gold)" : undefined)}}>{a.outcome === "lost" ? "—" : fmt(a.value)}</div></div>
          <div><div className="l">Antwortzeit</div><div className="v mono">{a.replied}</div></div>
          <div><div className="l">Bearbeitet von</div><div className="v" style={{fontSize:14}}>{a.handledBy}</div></div>
        </div>
        {a.lostReason && (
          <div className="ai-reason" style={{marginTop:16,background:"color-mix(in srgb,var(--red) 6%,var(--input))",borderColor:"color-mix(in srgb,var(--red) 22%,var(--panel-border))"}}>
            <div className="ai-reason-head" style={{color:"var(--red)"}}>Grund für Absage</div>
            <div className="ai-reason-body">{a.lostReason}</div>
          </div>
        )}
        {a.value !== a.offered && !a.lostReason && (
          <div className="ai-reason" style={{marginTop:16}}>
            <div className="ai-reason-head">Verhandlung</div>
            <div className="ai-reason-body">Von {fmt(a.offered)} auf {fmt(a.value)} nachverhandelt · Differenz {fmt(a.offered - a.value)}.</div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="card" style={{marginTop:12}}>
        <div className="section-head"><h3>Timeline</h3><span className="note">{a.timeline.length} Events</span></div>
        <div className="timeline">
          {a.timeline.map((t,i) => {
            const k = TIMELINE_KIND[t.kind] || TIMELINE_KIND.ai;
            return (
              <div className={`tl-row tl-${k.color}`} key={i}>
                <div className="tl-time mono">{t.t}</div>
                <div className="tl-dot"><Icon n={k.icon} s={11}/></div>
                <div className="tl-label">{t.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sent email */}
      <div className="card" style={{marginTop:12}}>
        <div className="section-head"><h3>Unser Angebot</h3><span className="note">An {a.from} · {a.email}</span></div>
        <pre className="email-body">{a.emailOut}</pre>
      </div>

      {/* Customer response */}
      {a.emailIn && a.emailIn !== "—" && (
        <div className="card" style={{marginTop:12}}>
          <div className="section-head"><h3>Antwort des Kunden</h3><span className="note">Von {a.from}</span></div>
          <pre className="email-body" style={{background:"color-mix(in srgb,var(--blue) 5%,var(--input))",borderColor:"color-mix(in srgb,var(--blue) 18%,var(--panel-border))"}}>{a.emailIn}</pre>
        </div>
      )}

      {/* What AI learned */}
      <div className="card" style={{marginTop:12}}>
        <div className="section-head">
          <h3>Was die AI daraus gelernt hat</h3>
          <span className="note">{a.learnings.length} Lessons</span>
        </div>
        <div className="learnings">
          {a.learnings.map((l,i) => (
            <div key={i} className="learning">
              <div className="learning-num mono">{String(i+1).padStart(2,"0")}</div>
              <div>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- 5. Stats ----------
const Stats = () => (
  <div className="wrap enter">
    <div className="eyebrow">Letzte 30 Tage</div>
    <h1 className="title">Es funktioniert.</h1>
    <p className="lede">31 Gruppen-Buchungen gewonnen. Antwortzeit unter 30 Sekunden im Schnitt.</p>

    <div className="stats4" style={{marginTop:40}}>
      <div className="card stat"><div className="l">Conversion</div><div className="v">12,4 %</div><div className="d pos">+ 2,1 pp</div></div>
      <div className="card stat"><div className="l">Ø Umsatz / Anfrage</div><div className="v">€ 8.420</div><div className="d pos">+ € 640</div></div>
      <div className="card stat"><div className="l">Buchungen gewonnen</div><div className="v">31</div><div className="d">von 247 Anfragen</div></div>
    </div>

    <div className="card" style={{marginTop:24}}>
      <div className="section-head"><h3>Funnel</h3><span className="note">22. März → 22. April</span></div>
      {[
        { l:"Empfangen", n:247, w:100 },
        { l:"Bepreist",  n:247, w:100 },
        { l:"Gesendet",  n:198, w:80  },
        { l:"Gewonnen",  n:31,  w:13, won:true },
      ].map(f => (
        <div key={f.l} className="comp">
          <span className="name" style={{minWidth:110}}>{f.l}</span>
          <span className="bar" style={{flex:3}}>
            <span className="f" style={{width:`${f.w}%`, background: f.won ? "var(--green)" : "var(--gold)"}}/>
          </span>
          <span className="price">{f.n}</span>
        </div>
      ))}
    </div>
  </div>
);

// ---------- 6. Settings (Freitext + Test + Versions) ----------
const DEFAULT_RULES = [
  { id:"r1", cat:"Autorität", text:"Rabatte bis 15 % darfst du autonom geben. Darüber brauchst du eine Freigabe vom General Manager." },
  { id:"r2", cat:"Autorität", text:"Angebote bis € 10.000 darfst du vollautomatisch versenden — wenn keine andere Regel greift und Kunde in gutem Standing ist." },
  { id:"r3", cat:"VIP",       text:"VIP-Kunden bekommen NIE eine automatische Antwort. Die AI bereitet nur einen Entwurf vor, den ich persönlich freigebe. VIP sind: (a) alle mit >5 Buchungen und LTV > € 100.000, (b) die Wiener Philharmoniker, (c) Porsche, (d) jede Anfrage mit dem Wort \u201EProtokoll\u201C oder \u201EVIP\u201C im Betreff." },
  { id:"r4", cat:"Eskalation",text:"Bei Anfragen über 60 Personen oder mehr als 50 Zimmer immer den Sales Manager einbinden — auch wenn die Preis-Logik passt." },
  { id:"r5", cat:"Kontext",   text:"Wenn die Anfrage in einer anderen Sprache kommt, antworte in derselben Sprache." },
  { id:"r6", cat:"Kontext",   text:"Bei Kunden mit Rahmenvertrag den vereinbarten Preis verwenden. Keine Verhandlung, keine Rabatt-Logik — direkt bestätigen." },
  { id:"r7", cat:"Ton",       text:"Schreibe freundlich, aber nie umgangssprachlich. Keine Emojis." },
  { id:"r8", cat:"Event",     text:"Während der Wiener Festwochen (15. Mai – 15. Juni) nie unter € 165 pro Zimmer gehen." },
  { id:"r9", cat:"Event",     text:"Zwischen 27. 12. und 02. 01. (Silvester/Neujahrskonzert) ist Peak-Season: Markt-Preis +40–80 %. Stammkunden-Rabatte gelten trotzdem." },
];
const CATS = ["Autorität","VIP","Eskalation","Kontext","Ton","Event"];
const CAT_HINTS = {
  "Autorität":  "z.B.: Rabatte bis 10 % darfst du autonom geben.",
  "VIP":        "z.B.: VIP-Anfragen bekommen nie eine Auto-Reply, nur einen Entwurf.",
  "Eskalation": "z.B.: Bei Anfragen über 50 Zimmern immer Sales-Manager einbinden.",
  "Kontext":    "z.B.: Antworte immer in der Sprache der Anfrage.",
  "Ton":        "z.B.: Keine Emojis. Freundlich, aber nicht umgangssprachlich.",
  "Event":      "z.B.: Während der Wiener Festwochen nie unter € 165 pro Zimmer.",
};

const Config = () => {
  const [rules, setRules] = useState(() => {
    try { return JSON.parse(localStorage.getItem("isq7s.rules")) || DEFAULT_RULES; }
    catch(e){ return DEFAULT_RULES; }
  });
  const [drafts, setDrafts] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [saved, setSaved] = useState(true);
  const [versions, setVersions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("isq7s.versions")) || []; }
    catch(e){ return []; }
  });
  const [testOpen, setTestOpen] = useState(false);
  const [undoRule, setUndoRule] = useState(null);
  const [versionOpen, setVersionOpen] = useState(false);

  // dirty = current rules differ from last snapshot (or from defaults if no snapshot yet)
  const baseline = versions[0]?.rules || DEFAULT_RULES;
  const dirty = JSON.stringify(rules) !== JSON.stringify(baseline);

  useEffect(()=>{
    localStorage.setItem("isq7s.rules", JSON.stringify(rules));
    setSaved(false);
    const t = setTimeout(()=>setSaved(true), 700);
    return ()=>clearTimeout(t);
  }, [rules]);

  useEffect(()=>{ localStorage.setItem("isq7s.versions", JSON.stringify(versions)); }, [versions]);

  const addRuleForCat = (cat) => {
    const t = (drafts[cat] || "").trim();
    if (!t) return;
    setRules([...rules, { id:"r"+Date.now(), cat, text:t }]);
    setDrafts({ ...drafts, [cat]: "" });
    setActiveCat(null);
  };
  const removeRule = (id) => {
    const r = rules.find(x => x.id === id);
    setRules(rules.filter(x => x.id !== id));
    setUndoRule(r);
    setTimeout(() => setUndoRule(curr => curr && curr.id === r.id ? null : curr), 5000);
  };
  const undoRemove = () => {
    if (!undoRule) return;
    setRules([...rules, undoRule]);
    setUndoRule(null);
  };
  const updateRule = (id, text) => setRules(rules.map(r => r.id === id ? {...r, text} : r));

  const saveVersion = () => {
    const v = { id:"v"+Date.now(), at:new Date().toLocaleString("de-DE"), count:rules.length, rules:[...rules] };
    setVersions([v, ...versions]);
  };
  const rollback = (v) => {
    setRules(v.rules);
    setVersionOpen(false);
  };

  return (
    <div className="wrap enter" style={{maxWidth:760}}>
      <div className="eyebrow">Einstellungen</div>
      <h1 className="title">Sag der AI, wie sie arbeiten soll.</h1>
      <p className="lede">In deinen eigenen Worten. Keine Slider, kein Code. Der Revenue Manager schreibt die Regeln — die AI versteht sie.</p>

      <div className="card" style={{marginTop:40}}>
        <div className="section-head">
          <h3>Neue Regel hinzufügen</h3>
          <span className="note">{saved ? "alle Änderungen gespeichert" : "speichere …"}</span>
        </div>
        <div style={{color:"var(--muted)",fontSize:13,marginBottom:14}}>Wähle eine Kategorie und schreibe die Regel in natürlicher Sprache.</div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {CATS.map(cat => {
            const isOpen = activeCat === cat;
            return (
              <div key={cat} style={{border:"1px solid var(--panel-border)",borderRadius:12,padding:"14px 16px",background:"var(--input)"}}>
                <button
                  onClick={()=>setActiveCat(isOpen ? null : cat)}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",background:"transparent",border:0,color:"var(--text)",fontFamily:"inherit",cursor:"pointer",padding:0,fontSize:14}}>
                  <span style={{display:"flex",alignItems:"center",gap:12}}>
                    <span className={`pill ${isOpen?"gold":""}`}>{cat}</span>
                    <span style={{color:"var(--muted)",fontSize:13}}>{CAT_HINTS[cat]}</span>
                  </span>
                  <span style={{color:"var(--dim)",transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0)"}}>›</span>
                </button>
                {isOpen && (
                  <div style={{marginTop:12,animation:"slide .2s ease-out"}}>
                    <textarea
                      className="ta"
                      rows={3}
                      autoFocus
                      value={drafts[cat] || ""}
                      onChange={e=>setDrafts({ ...drafts, [cat]: e.target.value })}
                      onKeyDown={e=>{ if((e.metaKey||e.ctrlKey) && e.key==="Enter") addRuleForCat(cat); }}
                      placeholder={CAT_HINTS[cat]}
                    />
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                      <span style={{fontSize:12,color:"var(--dim)",fontFamily:"var(--font-m)"}}>⌘/Strg + Enter</span>
                      <button className="btn primary sm" onClick={()=>addRuleForCat(cat)} disabled={!(drafts[cat]||"").trim()}>
                        <Icon n="spark" s={12}/> Hinzufügen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="section-head">
          <h3>Aktive Regeln · {rules.length}</h3>
          <span className="note">klicke eine Regel zum Bearbeiten</span>
        </div>
        {rules.length === 0 && (
          <div style={{padding:"28px 0",textAlign:"center",color:"var(--dim)"}}>Noch keine Regeln. Die AI folgt ihren Default-Richtlinien.</div>
        )}
        {rules.map((r, i) => (
          <div key={r.id} style={{display:"grid",gridTemplateColumns:"90px 1fr auto",gap:16,padding:"18px 0",borderBottom: i === rules.length-1 ? 0 : "1px dashed var(--panel-border)",alignItems:"start"}}>
            <span className="pill" style={{alignSelf:"start",marginTop:2}}>{r.cat}</span>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateRule(r.id, e.currentTarget.textContent)}
              style={{fontSize:15,lineHeight:1.55,outline:"none",borderRadius:6,padding:"4px 6px",margin:"-4px -6px",cursor:"text"}}
              onFocus={e => e.currentTarget.style.background = "var(--hover)"}
              onBlurCapture={e => e.currentTarget.style.background = "transparent"}
            >{r.text}</div>
            <button
              onClick={()=>removeRule(r.id)}
              style={{background:"transparent",border:0,cursor:"pointer",color:"var(--dim)",fontSize:20,padding:"2px 8px",fontFamily:"inherit",lineHeight:1}}
              title="Entfernen"
            >×</button>
          </div>
        ))}
      </div>

      <div className="bottom">
        <button className="btn primary big" style={{flex:1}} onClick={()=>setTestOpen(true)}><Icon n="spark" s={14}/> Mit Beispiel-Anfrage testen</button>
        {dirty && (
          <button className="btn big save-glow" onClick={saveVersion}><Icon n="check" s={14}/> Version speichern</button>
        )}
        <button className="btn big" onClick={()=>setVersionOpen(true)}>Historie ({versions.length})</button>
      </div>

      {undoRule && (
        <div className="toast">
          <span>Regel gelöscht.</span>
          <button onClick={undoRemove}>Rückgängig</button>
        </div>
      )}

      {testOpen && <TestModal rules={rules} onClose={()=>setTestOpen(false)}/>}
      {versionOpen && <VersionModal versions={versions} onClose={()=>setVersionOpen(false)} onRollback={rollback}/>}
    </div>
  );
};

const SAMPLE_INQUIRIES = [
  {
    id:"wed",
    label:"Hochzeit · 120 Personen · Samstag",
    text:`Hallo,

wir möchten unsere Hochzeit am Samstag, 6. Juni bei euch feiern. Wir sind ca. 120 Gäste, davon übernachten ca. 60. Wir hätten gern ein Dinner und einen schönen Saal.

Könnt ihr uns ein Angebot machen?

Anna & Thomas`,
  },
  {
    id:"en",
    label:"Englische Anfrage · Großkonzern",
    text:`Dear Sir or Madam,

we are planning an executive retreat from July 14–16 for 150 participants from our global leadership team. We require 80 rooms, a plenary space and three breakout rooms.

Please send a proposal at your earliest convenience.

Kind regards,
Jennifer Park
Microsoft EMEA`,
  },
  {
    id:"small",
    label:"Kleine Anfrage · Stammkunde",
    text:`Servus Andreas!

Ich bräucht wieder meine 4 Zimmer vom 3. bis 5. Mai, wie immer. Rabatt wär nett, bin ja Stammkunde ;-)

LG
Peter Huber`,
  },
];

const TestModal = ({ rules, onClose }) => {
  const [sampleId, setSampleId] = useState(SAMPLE_INQUIRIES[0].id);
  const [custom, setCustom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const sample = SAMPLE_INQUIRIES.find(s => s.id === sampleId);
  const inquiryText = custom.trim() || sample.text;

  const run = async () => {
    setLoading(true);
    setResult(null);
    const prompt = `Du bist die AI-Engine eines Hotel-Sales-Systems. Du hast folgende Regeln, die dir der Revenue Manager in natürlicher Sprache gegeben hat:

${rules.map((r,i) => `${i+1}. [${r.cat}] ${r.text}`).join("\n")}

Folgende Anfrage kommt rein:

"""
${inquiryText}
"""

Bewerte kurz und konkret:
1. In welcher Sprache antwortest du (und warum)?
2. Welche Regeln greifen bei dieser Anfrage?
3. Darfst du autonom antworten oder muss ein Mensch eingebunden werden? Wenn ja, wer?
4. Welche 2–3 Aktionen würdest du konkret als nächstes machen?

Antworte auf Deutsch, knapp, in maximal 180 Wörtern. Verwende Zwischenüberschriften mit **fett**.`;

    let text = null;
    try {
      text = await window.claude.complete(prompt);
    } catch(e) {
      text = `**Sprache:** vermutlich an die Anfrage angepasst.\n**Regeln die greifen:** ${rules.slice(0,2).map(r=>r.cat).join(", ")}.\n**Autonomie:** Bei kritischen Parametern Human-in-the-Loop.\n**Aktionen:** Auto-Reply senden, Daten extrahieren, Angebot vorbereiten.\n\n_(Offline-Simulation — die echte AI würde hier über die Regeln reasoning machen.)_`;
    }
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="modal-bg" onClick={(e)=>{ if(e.target.classList.contains("modal-bg")) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Regel-Test</div>
            <h2 style={{fontSize:22}}>Beispiel-Anfrage durchspielen</h2>
          </div>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <p style={{color:"var(--muted)",fontSize:14,marginTop:8}}>Die AI liest deine aktiven Regeln und erklärt, wie sie mit dieser Anfrage umgehen würde.</p>

        <div style={{marginTop:20}}>
          <div style={{fontSize:12,color:"var(--dim)",fontFamily:"var(--font-m)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Beispiel wählen</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {SAMPLE_INQUIRIES.map(s => (
              <button key={s.id} onClick={()=>{ setSampleId(s.id); setCustom(""); setResult(null); }}
                className={`pill ${sampleId===s.id && !custom?"gold":""}`}
                style={{cursor:"pointer",border:0,fontFamily:"inherit"}}>
                {s.label}
              </button>
            ))}
          </div>
          <textarea
            className="ta"
            rows={7}
            value={custom || sample.text}
            onChange={e=>setCustom(e.target.value)}
          />
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
          <button className="btn primary" onClick={run} disabled={loading}>
            {loading ? "AI analysiert …" : <><Icon n="spark" s={14}/> Durchlaufen lassen</>}
          </button>
        </div>

        {result && (
          <div style={{marginTop:20,padding:"18px 20px",background:"var(--input)",border:"1px solid var(--panel-border)",borderRadius:14,fontSize:14,lineHeight:1.65,whiteSpace:"pre-wrap"}}
               dangerouslySetInnerHTML={{__html: result.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}} />
        )}
      </div>
    </div>
  );
};

const VersionModal = ({ versions, onClose, onRollback }) => (
  <div className="modal-bg" onClick={(e)=>{ if(e.target.classList.contains("modal-bg")) onClose(); }}>
    <div className="modal">
      <div className="modal-head">
        <div>
          <div className="eyebrow">Versionen</div>
          <h2 style={{fontSize:22}}>Versionshistorie · {versions.length}</h2>
        </div>
        <button className="modal-x" onClick={onClose}>×</button>
      </div>
      <p style={{color:"var(--muted)",fontSize:14,marginTop:8}}>Jede gespeicherte Version kannst du jederzeit wiederherstellen.</p>
      <div style={{marginTop:20}}>
        {versions.length === 0 && (
          <div style={{padding:"36px 0",textAlign:"center",color:"var(--dim)"}}>Noch keine Versionen gespeichert.</div>
        )}
        {versions.map(v => (
          <div key={v.id} className="ver-row">
            <Icon n="check" s={14}/>
            <div>
              <div style={{fontWeight:500}}>Snapshot</div>
              <div className="when">{v.at}</div>
            </div>
            <span className="pill">{v.count} Regeln</span>
            <button className="btn sm" onClick={()=>onRollback(v)}>Wiederherstellen</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
