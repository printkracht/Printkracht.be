import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();
  const badges = t('badges').split(';').map(s=>s.trim());
  return (
    <div className="py-12 space-y-12">
      <section className="text-center space-y-6">
        <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
          {t("heroTitle")} <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">{t("brandTagline")}</span>
        </motion.h1>
        <motion.p className="text-gray-300" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15}}>
          {t("heroSub")}
        </motion.p>
        <motion.div className="flex gap-3 justify-center" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25}}>
          <Link href="/wrap-calculator" className="btn btn-primary">{t("ctaBook")}</Link>
          <a href="#pakketten" className="btn btn-ghost">{t("ctaViewPackages")}</a>
        </motion.div>
        <motion.div className="flex flex-wrap justify-center gap-2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}}>
          {badges.map((b, i)=>(
            <span key={i} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-300">{b}</span>
          ))}
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" id="pakketten">
        {[
          { title: "AI-Wrap Start", price: "vanaf €1.199", bullets: ["1 AI-concept + 1 revisie","Basis belettering","Zijpanelen + achter","Print + laminaat"] },
          { title: "AI-Wrap Pro", price: "vanaf €1.799", tag: "meest gekozen", bullets: ["2 AI-concepten + 2 revisies","Uitgebreide belettering/patronen","Zij, achter, motorkap of dakkant","Kleurcorrecte print + laminaat"] },
          { title: "AI-Wrap Elite", price: "vanaf €2.999", bullets: ["3 AI-concepten + onbeperkte proofs","Full/near-full wrap","Premium cast + long-term laminaat","Detailwerk & fotoreportage"] }
        ].map((p, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between">
              <h3>{p.title}</h3>
              {p.tag && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">{p.tag}</span>}
            </div>
            <div className="text-2xl font-bold mt-2">{p.price}</div>
            <ul className="mt-4 space-y-2 text-gray-300">{p.bullets.map((b,i)=><li key={i}>• {b}</li>)}</ul>
            <div className="mt-6"><Link href="/wrap-calculator" className="btn btn-primary w-full">Kies pakket</Link></div>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>{t('designPackTitle')}</h3>
        <p className="text-gray-300">{t("designPackBody")}</p>
        <div className="mt-3 flex gap-3">
          <a href="/design" className="btn btn-primary">{t("designCTAStart")}</a>
          <a href="/wrap-calculator" className="btn btn-ghost">{t("designCTACalc")}</a>
        </div>
      </section>

      <section className="grid-two items-center">
        <div className="space-y-3">
          <h2>{t('howItWorks')}</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li><strong>{t('step1')}</strong> – {t('step1Body')}</li>
            <li><strong>{t('step2')}</strong> – {t('step2Body')}</li>
            <li><strong>{t('step3')}</strong> – {t('step3Body')}</li>
          </ol>
        </div>
        <div className="card">
          <h3>Zonwerende folie (gebouw)</h3>
          <p className="text-gray-300">Betere privacy en minder warmte. Voeg je ruiten toe en krijg direct een richtprijs.</p>
          <a href="/tint-calculator" className="btn btn-ghost mt-4">Bereken gebouw-folie</a>
        </div>
      </section>
    </div>
  );
}
