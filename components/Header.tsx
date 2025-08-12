import Link from "next/link";
import LangToggle from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="border-b border-white/10 sticky top-0 backdrop-blur z-50">
      <div className="container flex items-center gap-6 py-3">
        <Link href="/" className="text-white font-bold text-lg">Printkracht</Link>
        <nav className="ml-auto flex items-center gap-4 text-gray-300">
          <Link href="/wrap-calculator" className="hover:text-white">{t("navWrap")}</Link>
          <Link href="/tint-calculator" className="hover:text-white">{t("navTint")}</Link>
          <Link href="/design" className="hover:text-white">{t("navDesign")}</Link>
          <Link href="/tips" className="hover:text-white">Tips & Tricks</Link>
        </nav>
        <Link href="/wrap-calculator" className="btn btn-primary ml-4">Boek intake</Link>
      </div>
    </header>
  );
}
