"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { estimateTintBuilding, FilmSeries, TINT_SETTINGS } from "@/lib/tint-ui-helpers";

export default function TintCalculatorPage() {
  const { t } = useI18n();
  return (
    <div className="py-10 space-y-8">
      <h1>{t('tintTitle')}</h1>
      <p className="text-gray-300">{t('tintIntro')}</p>
      <BuildingForm />
      <section className="grid-two">
        <div className="card">
          <h3>Filmkeuze</h3>
          <p className="text-gray-300">Kies tussen <strong>{t("standard")}</strong> (betaalbaar, goede warmte-reductie) of <strong>{t("ceramic")}</strong> (maximale hitte-blokkage en signaalvriendelijk). Vraag ons naar de lichtdoorlatingsklassen en garantie per merk.</p>
        </div>
        <div className="card">
          <h3>Plaatsing & garantie</h3>
          <p className="text-gray-300">We werken stofarm, met nette randen en correcte droogtijd. Garantie op hechting en verkleuring volgens specificaties.</p>
        </div>
      </section>
    </div>
  );
}

function BuildingForm() {
  const [film, setFilm] = useState<FilmSeries>("standard");
  const [rows, setRows] = useState([{ widthCm: 120, heightCm: 150, count: 2 }] as {widthCm:number;heightCm:number;count:number;}[]);

  const result = useMemo(() => estimateTintBuilding({ film, panes: rows }, TINT_SETTINGS), [film, rows]);

  return (
    <div className="card space-y-3">
      <div className="grid-two">
        <div>
          <label className="label">{t("film")}</label>
          <select className="select" value={film} onChange={e=>setFilm(e.target.value as FilmSeries)}>
            <option value="standard">{t("standard")}</option>
            <option value="ceramic">{t("ceramic")}</option>
          </select>
        </div>
        <div className="text-sm text-gray-400 flex items-end">Voeg zoveel ruiten toe als nodig.</div>
      </div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={idx} className="grid-three">
            <input className="input" type="number" value={r.widthCm} onChange={e=>{
              const v = [...rows]; v[idx].widthCm = parseFloat(e.target.value||"0"); setRows(v);
            }} placeholder={t("widthCm")} />
            <input className="input" type="number" value={r.heightCm} onChange={e=>{
              const v = [...rows]; v[idx].heightCm = parseFloat(e.target.value||"0"); setRows(v);
            }} placeholder={t("heightCm")} />
            <input className="input" type="number" value={r.count} onChange={e=>{
              const v = [...rows]; v[idx].count = parseInt(e.target.value||"0"); setRows(v);
            }} placeholder={t("count")} />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost" onClick={()=>setRows(r=>[...r, { widthCm: 100, heightCm: 100, count: 1 }])}>{t("addPane")}</button>
          {rows.length>1 && <button type="button" className="btn btn-ghost" onClick={()=>setRows(r=>r.slice(0,-1))}>{t("removeLast")}</button>}
        </div>
      </div>

      <div className="grid-two">
        <div className="card">
          <h3>{t("estimate")}</h3>
          <div className="text-gray-300">
            <div>{t("estArea")}: <b>{result.areaM2} m²</b></div>
            <div>{t("material")}: <b>€ {result.materialsEUR}</b></div>
            <div>{t("buildingLabour")}: <b>€ {result.labourEUR}</b></div>
            <div className="text-xl font-bold mt-2">Totaal: € {result.totalEUR}</div>
          </div>
        </div>
        <form action="/api/email" method="post" className="card" onSubmit={(e)=>{
          const formEl = e.currentTarget;
          const hidden = document.createElement("input");
          hidden.type = "hidden";
          hidden.name = "payload";
          hidden.value = JSON.stringify({ type: "tint-building", film, rows, result });
          formEl.appendChild(hidden);
        }}>
          <h3>Vraag offerte (mail)</h3>
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
          <button className="btn btn-primary mt-3">{t("askQuoteShort")}</button>
        </form>
      </div>
    </div>
  );
}
