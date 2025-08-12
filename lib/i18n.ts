'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'nl' | 'fr';
type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  nl: {
    brandTagline: "Professionele carwrapping, belettering en gebouwfolie.",
    heroTitle: "Val op met een wrap die verkoopt.",
    heroSub: "Supersnel ontworpen met AI, perfect afgewerkt door ons.",
    ctaBook: "Boek intake (€49 – verrekend)",
    ctaViewPackages: "Bekijk pakketten",
    navWrap: "Wrap berekenen",
    navTint: "Zonwerende folie (gebouw)",
    navDesign: "Ontwerp (CAR-SIGNER)",
    badges: "★★★★★ Klanttevredenheid; Premium folies; Bancontact/kaart; Factuur met btw",
    designPackTitle: "Ontwerppakket – € 245 excl. btw",
    designPackBody: "Inclusief 3 verschillende ontwerpen en 3 aanpassingsrondes. Eerste ontwerpen binnen 36u.",
    designCTAStart: "Start ontwerp",
    designCTACalc: "Bereken wrap",
    howItWorks: "Hoe het werkt",
    step1: "Intake & metingen",
    step1Body: "Doel, stijl, budget. We noteren voertuigdata en wensen.",
    step2: "AI-versneld ontwerp",
    step2Body: "We genereren routes en werken jouw favoriet uit tot printklaar.",
    step3: "Print & montage",
    step3Body: "Hoogwaardige folie, nette randen, garantie op hechting en kleur.",
  
    wrapTitle: "Wrap berekenen",
    wrapIntro: "Vul de gegevens in. Je ziet meteen een richtprijs. Voor de finale offerte plannen we een korte intake.",
    brand: "Merk",
    model: "Model",
    year: "Bouwjaar",
    color: "Kleur",
    vehicleType: "Voertuigtype",
    compact: "Compact",
    sedan: "Sedan",
    suv: "SUV",
    van: "Camionette/Bestel",
    coverage: "Coverage",
    lettering: "Belettering (panelen)",
    semi: "Semi (meer zones)",
    full: "Full/Near-full",
    complexity: "Complexiteit",
    easy: "Makkelijk",
    normal: "Normaal",
    hard: "Moeilijk",
    lengthM: "Lengte (m)",
    heightM: "Hoogte (m)",
    windows: "Ramen",
    closed: "Gesloten (geen ramen)",
    withWindows: "Met ramen",
    designPack: "Ontwerppakket toevoegen (€ 245 excl. btw) – 3 concepten + 3 aanpassingsrondes • eerste ontwerpen binnen 36u",
    name: "Naam",
    email: "E-mail",
    phone: "Telefoon (optioneel)",
    askQuote: "Vraag offerte (mail)",
    estimate: "Richtprijs",
    estArea: "Geschatte oppervlakte (incl. waste)",
    pricePerM2: "Prijs per m² (incl. plaatsing)",
    wasteFactor: "Wastefactor",
    labour: "Arbeid",
    total: "Totaal",
    indicative: "Indicatief. Finale prijs na inspectie en exact m².",
    baseArea: "Base area",
    windowsAdj: "Windows adj.",
    coverageExtra: "Coverage extra",
    waste: "Waste",
    tipSettings: "Tip: pas instellingen aan in /lib/settings.ts.",
    tintTitle: "Zonwerende folie voor gebouwen",
    tintIntro: "Minder warmte, minder inkijk en energiebesparing. Bereken meteen een richtprijs op basis van je ruiten.",
    film: "Film",
    standard: "Standard",
    ceramic: "Ceramic",
    addPane: "+ Ruit",
    removeLast: "- Laatste",
    material: "Materiaal",
    buildingLabour: "Arbeid",
    askQuoteShort: "Verstuur",
    widthCm: "Breedte (cm)",
    heightCm: "Hoogte (cm)",
    count: "Aantal",
    },
  fr: {
    brandTagline: "Covering, lettrage et film bâtiment professionnels.",
    heroTitle: "Attirez l’attention avec un covering qui vend.",
    heroSub: "Conçu ultra-rapidement avec l’IA, finition impeccable par nos soins.",
    ctaBook: "Réserver un intake (49€ – déduit)",
    ctaViewPackages: "Voir les forfaits",
    navWrap: "Calculer le covering",
    navTint: "Film solaire (bâtiment)",
    navDesign: "Design (CAR-SIGNER)",
    badges: "★★★★★ Satisfaction; Films premium; Bancontact/carte; Facture TVA",
    designPackTitle: "Pack design – 245€ HTVA",
    designPackBody: "Comprend 3 pistes de design et 3 révisions. Premiers concepts sous 36h.",
    designCTAStart: "Démarrer le design",
    designCTACalc: "Calculer le covering",
    howItWorks: "Comment ça marche",
    step1: "Intake & mesures",
    step1Body: "Objectif, style, budget. Nous notons les données du véhicule et vos souhaits.",
    step2: "Design accéléré par l’IA",
    step2Body: "Nous générons des pistes et finalisons votre préférée pour l’impression.",
    step3: "Impression & pose",
    step3Body: "Films de qualité, bords propres, garantie d’adhérence et de couleur.",
  }
};

const LangContext = createContext<{lang: Lang, setLang: (l: Lang)=>void, t: (k: string)=>string} | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('nl');

  // Hydrate from localStorage or ?lang=
  useEffect(()=>{
    const url = new URL(window.location.href);
    const q = url.searchParams.get('lang');
    const stored = localStorage.getItem('lang') as Lang | null;
    if (q === 'nl' || q === 'fr') {
      setLang(q);
      localStorage.setItem('lang', q);
    } else if (stored === 'nl' || stored === 'fr') {
      setLang(stored);
    }
  }, []);

  const t = (k: string) => {
    const dict = DICTS[lang] || DICTS.nl;
    return dict[k] ?? k;
  };

  const value = useMemo(()=>({ lang, setLang, t }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n must be used inside LangProvider');
  return ctx;
}
