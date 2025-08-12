import Link from "next/link";

export default function TipsPage() {
  return (
    <div className="py-10 space-y-6">
      <h1>Tips & Tricks</h1>
      <p className="text-gray-300">Korte video's over hoe wij wrappen: voorbereiding, paneeltechnieken, randen afwerken en onderhoud.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Voorbereiding & ontvetten", id: "prep" },
          { title: "Paneelpositionering & spanning", id: "panel" },
          { title: "Snijlijnen & afwerking", id: "finish" },
          { title: "Complexe rondingen & bumpers", id: "curves" },
          { title: "Onderhoud & nazorg", id: "care" },
          { title: "Raamfolie (gebouw): stofarm werken", id: "tint" },
        ].map((v, i)=> (
          <div key={i} className="card">
            <div className="aspect-video bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sm text-gray-400">Video placeholder</div>
            <h3 className="mt-3">{v.title}</h3>
            <p className="text-gray-400 text-sm">Plaats hier je embed (YouTube/Vimeo/Instagram Reels).</p>
          </div>
        ))}
      </div>

      <div className="card flex items-center justify-between">
        <div>
          <h3>Volg ons op Instagram</h3>
          <p className="text-gray-300">@printkracht – behind the scenes, timelapses en voor/na's.</p>
        </div>
        <a href="https://instagram.com/printkracht" target="_blank" className="btn btn-primary">Naar Instagram</a>
      </div>
    </div>
  );
}
