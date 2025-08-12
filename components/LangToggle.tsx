'use client';
import { useI18n } from '@/lib/i18n';

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-1 border border-white/20 rounded-xl px-2 py-1 text-sm">
      <button
        onClick={()=>{ setLang('nl'); localStorage.setItem('lang','nl'); }}
        className={`px-2 py-0.5 rounded ${lang==='nl' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'}`}
      >
        NL
      </button>
      <button
        onClick={()=>{ setLang('fr'); localStorage.setItem('lang','fr'); }}
        className={`px-2 py-0.5 rounded ${lang==='fr' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'}`}
      >
        FR
      </button>
    </div>
  );
}
