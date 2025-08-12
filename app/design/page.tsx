const CAR_SIGNER_URL = process.env.NEXT_PUBLIC_CAR_SIGNER_URL || "#";

export default function DesignPage() {
  return (
    <div className="py-10 space-y-6">
      <h1>Ontwerp starten (CAR-SIGNER)</h1>
      <p className="text-gray-300">Open onze CAR-SIGNER omgeving met voertuigtemplates en maak een eerste opzet. Wij ontvangen je ontwerp en nemen contact op voor de verdere uitwerking.</p>
      <a href={CAR_SIGNER_URL} target="_blank" className="btn btn-primary w-fit">Open CAR-SIGNER</a>
      {CAR_SIGNER_URL === "#" && <p className="text-sm text-gray-400">Stel je link in via <code>NEXT_PUBLIC_CAR_SIGNER_URL</code> in je omgeving (Vercel of .env.local).</p>}
      <div className="card">
        <h3>Ontwerppakket (€ 245 excl. btw)</h3>
        <p className="text-gray-300 mb-2"><i>Eerste ontwerpen binnen 36u</i></p>
        <ul className="text-gray-300 list-disc list-inside">
          <li>3 verschillende designroutes</li>
          <li>+ 3 aanpassingsrondes</li>
          <li>Printklare bestanden, klaargemaakt voor productie</li>
        </ul>
      </div>
    </div>
  );
}
