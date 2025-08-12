"use client";

import { useMemo, useState } from "react";
import vehicles from "@/lib/vehicles.json";
import { estimateWrap, WrapInput, WRAP_SETTINGS, VehicleType } from "@/lib/wrap-ui-helpers";

export default function WrapCalculatorPage() {
  const { t } = require("@/lib/i18n").useI18n();
  const [form, setForm] = useState<WrapInput>({
    brand: "",
    model: "",
    vehicleType: "compact",
    coverage: "belettering",
    year: undefined,
    color: "",
    isVanClosed: true,
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
      <h1>{t('wrapTitle')}</h1>
      <p className="text-gray-300">{t('wrapIntro')}</p>

      <div className="grid-two">
        <div className="card space-y-4">
          <div className="grid-two">
            <div>
              <label className="label">{t("brand")}</label>
              <input className="input" value={form.brand} onChange={e=>setForm(f=>({...f, brand: e.target.value}))} placeholder="bv. Volkswagen" />
            </div>
            <div>
              <label className="label">{t("model")}</label>
              <input className="input" value={form.model} onChange={e=>setForm(f=>({...f, model: e.target.value}))} placeholder="bv. Transporter" />
            </div>
          </div>
          <div className="grid-three">
            <div>
              <label className="label">{t("year")}</label>
              <input className="input" type="number" value={form.year ?? ""} onChange={e=>setForm(f=>({...f, year: e.target.value ? parseInt(e.target.value) : undefined}))} placeholder="bv. 2021" />
            </div>
            <div>
              <label className="label">{t("color")}</label>
              <input className="input" value={form.color ?? ""} onChange={e=>setForm(f=>({...f, color: e.target.value}))} placeholder="bv. wit" />
            </div>
            <div>
              <label className="label">{t("vehicleType")}</label>
              <select className="select" value={form.vehicleType} onChange={e=>setForm(f=>({...f, vehicleType: e.target.value as any}))}>
                <option value="compact">{t("compact")}</option>
                <option value="sedan">{t("sedan")}</option>
                <option value="suv">{t("suv")}</option>
                <option value="van">{t("van")}</option>
              </select>
              {detectedType && <small>Gedetecteerd op basis van model: <b>{detectedType.toUpperCase()}</b> (je kan dit wijzigen)</small>}
            </div>
          </div>

          <div className="grid-three">
            <div>
              <label className="label">{t("coverage")}</label>
              <select className="select" value={form.coverage} onChange={e=>setForm(f=>({...f, coverage: e.target.value as any}))}>
                <option value="belettering">{t("lettering")}</option>
                <option value="semi">{t("semi")}</option>
                <option value="full">{t("full")}</option>
              </select>
            </div>
            <div>
              <label className="label">{t("complexity")}</label>
              <select className="select" value={form.complexity} onChange={e=>setForm(f=>({...f, complexity: e.target.value as any}))}>
                <option value="makkelijk">{t("easy")}</option>
                <option value="normaal">{t("normal")}</option>
                <option value="moeilijk">{t("hard")}</option>
              </select>
            </div>
          </div>

          {form.vehicleType === "van" && (
            <div className="grid-three">
              <div>
                <label className="label">{t("lengthM")}</label>
                <input className="input" type="number" step="0.1" value={form.vanLength ?? 0} onChange={e=>setForm(f=>({...f, vanLength: parseFloat(e.target.value||"0")}))} />
              </div>
              <div>
                <label className="label">{t("heightM")}</label>
                <input className="input" type="number" step="0.1" value={form.vanHeight ?? 0} onChange={e=>setForm(f=>({...f, vanHeight: parseFloat(e.target.value||"0")}))} />
              </div>
              <div>
                <label className="label">{t("windows")}</label>
                <select className="select" value={form.isVanClosed ? "gesloten" : "ramen"} onChange={e=>setForm(f=>({...f, isVanClosed: e.target.value === "gesloten"}))}>
                  <option value="gesloten">{t("closed")}</option>
                  <option value="ramen">{t("withWindows")}</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <input id="design" type="checkbox" checked={designIncluded} onChange={e=>setDesignIncluded(e.target.checked)} />
            <label htmlFor="design" className="label">{t("designPack")}</label>
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
                <label className="label">{t("name")}</label>
                <input className="input" name="name" required />
              </div>
              <div>
                <label className="label">{t("email")}</label>
                <input className="input" type="email" name="email" required />
              </div>
            </div>
            <div>
              <label className="label">{t("phone")}</label>
              <input className="input" name="phone" />
            </div>
            <button className="btn btn-primary">{t("askQuote")}</button>
          </form>
        </div>

        <div className="card space-y-4">
          <h3>{t("estimate")}</h3>
          <div className="text-gray-300">
            <div>{t("estArea")}: <b>{result.areaM2} m²</b></div>
            <div>{t("pricePerM2")}: <b>€ {WRAP_SETTINGS.pricePerM2?.toFixed(0)}</b></div>
            <div>{t("wasteFactor")}: <b>x {WRAP_SETTINGS.wasteFactor}</b></div>
            {result.labourEUR > 0 ? (<>
              <div>{t("labour")}: <b>{result.labourHours} u</b> → <b>€ {result.labourEUR}</b></div>
            </>) : null}
            {designIncluded && <div>Ontwerp: <b>€ {DESIGN_PRICE}</b></div>}
            <div className="text-xl font-bold mt-2">{t("total")}: € {displayTotal}</div>
            <small>{t("indicative")}</small>
          </div>
          <div className="grid-two text-sm text-gray-400">
            <div>
              <div>{t("baseArea")}: {result.breakdown.baseArea} m²</div>
              <div>{t("windowsAdj")}: {result.breakdown.windowsAdjustment} m²</div>
            </div>
            <div>
              <div>{t("coverageExtra")}: {result.breakdown.coverageExtra} m²</div>
              <div>{t("waste")}: {result.breakdown.wasteM2} m²</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {t("tipSettings")}
          </div>
        </div>
      </div>
    </div>
  );
}
