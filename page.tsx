"use client";

import { useMemo, useState } from "react";
import vehicles from "@/lib/vehicles.json";
import { estimateWrap, WrapInput, WRAP_SETTINGS, VehicleType } from "@/lib/wrap-ui-helpers";

export default function WrapCalculatorPage() {
  const [form, setForm] = useState<WrapInput>({
    brand: "",
    model: "",
    vehicleType: "compact",
    coverage: "belettering",
    year: undefined,
    color: "",
    isVanClosed: True,
    vanLength: 4.8,
    vanHeight: 2.0,
    complexity: "normaal"
  });

  const detectedType: VehicleType | null = useMemo(() => {
    if (form.brand && form.model) {
      const m = (vehicles as any)[form.brand]?.[form.model];
      if (m) return m;
    }
    return null;
  }, [form.brand, form.model]);

  const [designIncluded, setDesignIncluded] = useState(false);
  const DESIGN_PRICE = 245; // € excl. btw
  const result = useMemo(() => estimateWrap(form, WRAP_SETTINGS), [form]);
  const displayTotal = useMemo(() => result.totalEUR + (designIncluded ? DESIGN_PRICE : 0), [result, designIncluded]);

  return (
    <div className="py-10 space-y-8">
      <h1>Wrap berekenen</h1>
      <p className="text-gray-300">Vul de gegevens in. Je ziet meteen een richtprijs. Voor de finale offerte plannen we een korte intake.</p>

      <div className="grid-two">
        <div className="card space-y-4">
          <div className="grid-two">
            <div>
              <label className="label">Merk</label>
              <input className="input" value={form.brand} onChange={e=>setForm(f=>({...f, brand: e.target.value}))} placeholder="bv. Volkswagen" />
            </div>
            <div>
              <label className="label">Model</label>
              <input className="input" value={form.model} onChange={e=>setForm(f=>({...f, model: e.target.value}))} placeholder="bv. Transporter" />
            </div>
          </div>
          <div className="grid-three">
            <div>
              <label className="label">Bouwjaar</label>
              <input className="input" type="number" value={form.year ?? ""} onChange={e=>setForm(f=>({...f, year: e.target.value ? parseInt(e.target.value) : undefined}))} placeholder="bv. 2021" />
            </div>
            <div>
              <label className="label">Kleur</label>
              <input className="input" value={form.color ?? ""} onChange={e=>setForm(f=>({...f, color: e.target.value}))} placeholder="bv. wit" />
            </div>
            <div>
              <label className="label">Voertuigtype</label>
              <select className="select" value={form.vehicleType} onChange={e=>setForm(f=>({...f, vehicleType: e.target.value as any}))}>
                <option value="compact">Compact</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="van">Camionette/Bestel</option>
              </select>
              {detectedType && <small>Gedetecteerd op basis van model: <b>{detectedType.toUpperCase()}</b> (je kan dit wijzigen)</small>}
            </div>
          </div>

          <div className="grid-three">
            <div>
              <label className="label">Coverage</label>
              <select className="select" value={form.coverage} onChange={e=>setForm(f=>({...f, coverage: e.target.value as any}))}>
                <option value="belettering">Belettering (panelen)</option>
                <option value="semi">Semi (meer zones)</option>
                <option value="full">Full/Near-full</option>
              </select>
            </div>
            <div>
              <label className="label">Complexiteit</label>
              <select className="select" value={form.complexity} onChange={e=>setForm(f=>({...f, complexity: e.target.value as any}))}>
                <option value="makkelijk">Makkelijk</option>
                <option value="normaal">Normaal</option>
                <option value="moeilijk">Moeilijk</option>
              </select>
            </div>
          </div>

          {form.vehicleType === "van" && (
            <div className="grid-three">
              <div>
                <label className="label">Lengte (m)</label>
                <input className="input" type="number" step="0.1" value={form.vanLength ?? 0} onChange={e=>setForm(f=>({...f, vanLength: parseFloat(e.target.value||"0")}))} />
              </div>
              <div>
                <label className="label">Hoogte (m)</label>
                <input className="input" type="number" step="0.1" value={form.vanHeight ?? 0} onChange={e=>setForm(f=>({...f, vanHeight: parseFloat(e.target.value||"0")}))} />
              </div>
              <div>
                <label className="label">Ramen</label>
                <select className="select" value={form.isVanClosed ? "gesloten" : "ramen"} onChange={e=>setForm(f=>({...f, isVanClosed: e.target.value === "gesloten"}))}>
                  <option value="gesloten">Gesloten (geen ramen)</option>
                  <option value="ramen">Met ramen</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <input id="design" type="checkbox" checked={designIncluded} onChange={e=>setDesignIncluded(e.target.checked)} />
            <label htmlFor="design" className="label">Ontwerppakket toevoegen <b>(€ 245 excl. btw)</b> – 3 concepten + 3 aanpassingsrondes</label>
          </div>

          <form action="/api/email" method="post" className="space-y-3" onSubmit={(e)=>{
            const formEl = e.currentTarget;
            const hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = "payload";
            hidden.value = JSON.stringify({ form, result, designIncluded, displayTotal });
            formEl.appendChild(hidden);
          }}>
            <div className="grid-two">
              <div>
                <label className="label">Naam</label>
                <input className="input" name="name" required />
              </div>
              <div>
                <label className="label">E-mail</label>
                <input className="input" type="email" name="email" required />
              </div>
            </div>
            <div>
              <label className="label">Telefoon (optioneel)</label>
              <input className="input" name="phone" />
            </div>
            <button className="btn btn-primary">Vraag offerte (mail)</button>
          </form>
        </div>

        <div className="card space-y-4">
          <h3>Richtprijs</h3>
          <div className="text-gray-300">
            <div>Geschatte oppervlakte (incl. waste): <b>{result.areaM2} m²</b></div>
            <div>Prijs per m² (incl. plaatsing): <b>€ {WRAP_SETTINGS.pricePerM2?.toFixed(0)}</b></div>
            <div>Wastefactor: <b>x {WRAP_SETTINGS.wasteFactor}</b></div>
            {result.labourEUR > 0 ? (<>
              <div>Arbeid: <b>{result.labourHours} u</b> → <b>€ {result.labourEUR}</b></div>
            </>) : null}
            {designIncluded && <div>Ontwerp: <b>€ {DESIGN_PRICE}</b></div>}
            <div className="text-xl font-bold mt-2">Totaal: € {displayTotal}</div>
            <small>Indicatief. Finale prijs na inspectie en exact m².</small>
          </div>
          <div className="grid-two text-sm text-gray-400">
            <div>
              <div>Base area: {result.breakdown.baseArea} m²</div>
              <div>Windows adj.: {result.breakdown.windowsAdjustment} m²</div>
            </div>
            <div>
              <div>Coverage extra: {result.breakdown.coverageExtra} m²</div>
              <div>Waste: {result.breakdown.wasteM2} m²</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Tip: pas instellingen aan in <code>/lib/settings.ts</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
