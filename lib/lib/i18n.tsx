'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type Lang = 'nl' | 'fr'

const translations: Record<Lang, Record<string, string>> = {
  nl: {
    hero_title: 'Professionele carwrap & raamfolie',
    hero_subtitle: 'Bereken je prijs, kies een pakket of laat ons je ontwerp maken',
    design_offer: 'Eerste ontwerpen binnen 36u',
    tint_calc: 'Bereken zonwerende folie',
    wrap_calc: 'Bereken carwrap',
    design_calc: 'Bestel ontwerpservice',
    lang_toggle: 'Français',
    instagram: 'Volg ons op Instagram',
  },
  fr: {
    hero_title: 'Covering professionnel & films solaires',
    hero_subtitle: 'Calculez votre prix, choisissez un pack ou laissez-nous concevoir votre wrap',
    design_offer: 'Premiers designs livrés sous 36h',
    tint_calc: 'Calcul film solaire bâtiment',
    wrap_calc: 'Calcul covering véhicule',
    design_calc: 'Commander un design',
    lang_toggle: 'Nederlands',
    instagram: 'Suivez-nous sur Instagram',
  },
}

interface LangContextProps {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextProps>({
  lang: 'nl',
  setLang: () => {},
  t: (key) => key,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('nl')
  const t = (key: string) => translations[lang][key] || key

  const value = useMemo(() => ({ lang, setLang, t }), [lang])

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  )
}

export function useI18n() {
  return useContext(LangContext)
}
