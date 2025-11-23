'use client';

import { useEffect, useMemo, useState } from 'react';
import { nlCopy } from '@/lib/i18n';
import { calculateQuote, euro } from '@/lib/pricing';
import {
  CoverageLevel,
  FinishType,
  MaterialQuality,
  coverageLabels,
  defaultRates,
  finishLabels,
  qualityLabels,
} from '@/lib/settings';
import { parseNumber, toPercentage } from '@/lib/tint-ui-helpers';
import { estimateDesignHours, estimateInstallHours, findVehicle, vehicles } from '@/lib/wrap-ui-helpers';

export default function Page() {
  const [vehicleId, setVehicleId] = useState(vehicles[0].id);
  const [coverage, setCoverage] = useState<CoverageLevel>('full');
  const [quality, setQuality] = useState<MaterialQuality>('standard');
  const [finish, setFinish] = useState<FinishType>('glans');
  const [lamination, setLamination] = useState(true);
  const [windowPerfArea, setWindowPerfArea] = useState(1);
  const [letteringMeters, setLetteringMeters] = useState(8);
  const [designHours, setDesignHours] = useState(6.5);
  const [installHours, setInstallHours] = useState(12);
  const [installComplexity, setInstallComplexity] = useState(1.05);
  const [margin, setMargin] = useState(0.18);
  const [rush, setRush] = useState(false);
  const [includePrepress, setIncludePrepress] = useState(true);
  const [customArea, setCustomArea] = useState<number>(vehicles[0].area);

  const vehicle = findVehicle(vehicleId) ?? vehicles[0];
  const area = customArea || vehicle.area;

  useEffect(() => {
    const current = findVehicle(vehicleId);
    if (current) {
      setCustomArea(current.area);
      setInstallComplexity(current.complexity);
      setInstallHours(estimateInstallHours(current.area, coverage, current.complexity));
      setDesignHours(estimateDesignHours(current.area, coverage));
    }
  }, [vehicleId]);

  useEffect(() => {
    setInstallHours(estimateInstallHours(area, coverage, installComplexity));
    setDesignHours(estimateDesignHours(area, coverage));
  }, [area, coverage, installComplexity]);

  const breakdown = useMemo(
    () =>
      calculateQuote(
        {
          area,
          coverage,
          quality,
          finish,
          designHours,
          installHours,
          lamination,
          windowPerfArea,
          letteringMeters,
          installComplexity,
          rush,
          includePrepress,
          margin,
        },
        defaultRates,
      ),
    [area, coverage, designHours, finish, includePrepress, installComplexity, installHours, lamination, margin, quality, rush, windowPerfArea, letteringMeters],
  );

  return (
    <div className="grid" id="calculator" style={{ gap: '1.25rem' }}>
      <section className="hero">
        <div>
          <p className="badge">Gemaakt voor creatieven</p>
          <h1>{nlCopy.heroTitle}</h1>
          <p className="hero-blurb">{nlCopy.heroBody}</p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {nlCopy.usp.map((item) => (
              <span key={item} className="badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#a7f3d0' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="panel" style={{ alignSelf: 'stretch' }}>
          <h3>Snapshot</h3>
          <p className="text-small">
            Gebruik de presets om snel een basisprijs neer te zetten. Alle inputs zijn direct te tweaken.
          </p>
          <div className="summary-card" style={{ marginBottom: '1rem' }}>
            <div>
              <div className="text-small">Totaal incl. marge</div>
              <div className="total">{euro(breakdown.total)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-small">Marge</div>
              <strong>{toPercentage(margin)}</strong>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{euro(breakdown.marginValue)}</div>
            </div>
          </div>
          <div className="grid two">
            <div className="field">
              <label>Voertuig</label>
              <select
                className="select"
                value={vehicleId}
                onChange={(event) => setVehicleId(event.target.value)}
              >
                {vehicles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.area} m²)
                  </option>
                ))}
              </select>
              <span className="text-small">{vehicle.examples}</span>
            </div>
            <div className="field">
              <label>Oppervlak (m²)</label>
              <input
                className="number"
                type="number"
                min={12}
                value={area}
                onChange={(event) => setCustomArea(parseNumber(event.target.value, vehicle.area))}
              />
              <span className="text-small">Past automatisch mee met het gekozen voertuig.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setInstallHours(estimateInstallHours(area, coverage, installComplexity));
              setDesignHours(estimateDesignHours(area, coverage));
            }}
            style={{
              marginTop: '0.75rem',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(59, 130, 246, 0.25))',
              color: '#e0f2fe',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Gebruik voorstel-uren voor dit voertuig
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Project-instellingen</h2>
        <div className="grid two" style={{ marginTop: '1rem' }}>
          <div className="field">
            <label>Dekking</label>
            <select className="select" value={coverage} onChange={(e) => setCoverage(e.target.value as CoverageLevel)}>
              {Object.entries(coverageLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-small">Bepaalt direct het aantal meters en uren.</span>
          </div>
          <div className="field">
            <label>Materiaal</label>
            <select className="select" value={quality} onChange={(e) => setQuality(e.target.value as MaterialQuality)}>
              {Object.entries(qualityLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-small">Materiaalprijs gebaseerd op {defaultRates.materialRate} €/m².</span>
          </div>
          <div className="field">
            <label>Afwerking</label>
            <select className="select" value={finish} onChange={(e) => setFinish(e.target.value as FinishType)}>
              {Object.entries(finishLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-small">Afwerking beïnvloedt install-complexiteit.</span>
          </div>
          <div className="field">
            <label>Laminaat</label>
            <div className="switch-row">
              <span>Beschermlaminaat meenemen</span>
              <input type="checkbox" checked={lamination} onChange={(e) => setLamination(e.target.checked)} />
            </div>
            <span className="text-small">Laminaat {lamination ? 'toegevoegd' : 'uit'} in calculatie.</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Uren & marge</h2>
        <div className="grid two" style={{ marginTop: '1rem' }}>
          <div className="field">
            <label>Designuren</label>
            <input
              className="number"
              type="number"
              min={0}
              step={0.5}
              value={designHours}
              onChange={(e) => setDesignHours(parseNumber(e.target.value, designHours))}
            />
            <span className="text-small">Voorstellen: {estimateDesignHours(area, coverage)} uur.</span>
          </div>
          <div className="field">
            <label>Montage-uren</label>
            <input
              className="number"
              type="number"
              min={0}
              step={0.5}
              value={installHours}
              onChange={(e) => setInstallHours(parseNumber(e.target.value, installHours))}
            />
            <span className="text-small">Voorstellen: {estimateInstallHours(area, coverage, installComplexity)} uur.</span>
          </div>
          <div className="field">
            <label>Complexiteit</label>
            <input
              className="number"
              type="number"
              min={0.85}
              max={1.6}
              step={0.05}
              value={installComplexity}
              onChange={(e) => setInstallComplexity(parseNumber(e.target.value, installComplexity))}
            />
            <span className="text-small">Hogere waarde = meer moeilijk bereikbare delen.</span>
          </div>
          <div className="field">
            <label>Marge</label>
            <input
              className="number"
              type="number"
              min={0}
              max={0.6}
              step={0.01}
              value={margin}
              onChange={(e) => setMargin(parseNumber(e.target.value, margin))}
            />
            <span className="text-small">Wordt toegepast na rush/prepress.</span>
          </div>
          <div className="field">
            <label>Windowperf m²</label>
            <input
              className="number"
              type="number"
              min={0}
              value={windowPerfArea}
              onChange={(e) => setWindowPerfArea(parseNumber(e.target.value, windowPerfArea))}
            />
            <span className="text-small">Rate {defaultRates.windowPerfRate} €/m².</span>
          </div>
          <div className="field">
            <label>Belettering meters</label>
            <input
              className="number"
              type="number"
              min={0}
              value={letteringMeters}
              onChange={(e) => setLetteringMeters(parseNumber(e.target.value, letteringMeters))}
            />
            <span className="text-small">Contour/plot kosten {defaultRates.letteringRate} €/m.</span>
          </div>
        </div>
        <div className="grid two" style={{ marginTop: '1rem' }}>
          <div className="switch-row">
            <label>Rush toeslag ({toPercentage(defaultRates.rushPercentage)})</label>
            <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} />
          </div>
          <div className="switch-row">
            <label>Prepress snijmarges ({euro(defaultRates.prepressFee)})</label>
            <input type="checkbox" checked={includePrepress} onChange={(e) => setIncludePrepress(e.target.checked)} />
          </div>
        </div>
      </section>

      <section className="panel" id="uitleg">
        <h2>Resultaat</h2>
        <p className="text-small">
          Printbaar oppervlak: {breakdown.printableArea.toFixed(1)} m² • Materiaal: {qualityLabels[quality]} • Afwerking: {' '}
          {finishLabels[finish]}
        </p>
        <div className="summary-card">
          <div>
            <div className="text-small">Subtotaal</div>
            <strong>{euro(breakdown.subtotal)}</strong>
          </div>
          <div>
            <div className="text-small">Rush</div>
            <strong>{rush ? euro(breakdown.rushFee) : '—'}</strong>
          </div>
          <div>
            <div className="text-small">Marge</div>
            <strong>{euro(breakdown.marginValue)}</strong>
          </div>
          <div>
            <div className="text-small">Totaal</div>
            <div className="total">{euro(breakdown.total)}</div>
          </div>
        </div>
        <hr className="divider" />
        <table className="table">
          <thead>
            <tr>
              <th>Onderdeel</th>
              <th>Bedrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Materiaal ({breakdown.printableArea.toFixed(1)} m²)</td>
              <td>{euro(breakdown.materialCost)}</td>
            </tr>
            <tr>
              <td>Laminaat</td>
              <td>{lamination ? euro(breakdown.laminationCost) : '—'}</td>
            </tr>
            <tr>
              <td>Design ({designHours} uur @ {defaultRates.designRate} €/u)</td>
              <td>{euro(breakdown.designCost)}</td>
            </tr>
            <tr>
              <td>Montage ({installHours} uur @ {defaultRates.installRate} €/u)</td>
              <td>{euro(breakdown.installCost)}</td>
            </tr>
            <tr>
              <td>Windowperf</td>
              <td>{windowPerfArea > 0 ? euro(breakdown.windowPerfCost) : '—'}</td>
            </tr>
            <tr>
              <td>Belettering (plot/print)</td>
              <td>{letteringMeters > 0 ? euro(breakdown.letteringCost) : '—'}</td>
            </tr>
            <tr>
              <td>Prepress</td>
              <td>{includePrepress ? euro(breakdown.prepressCost) : '—'}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Totaal incl. marge</th>
              <th>{euro(breakdown.total)}</th>
            </tr>
          </tfoot>
        </table>
      </section>
    </div>
  );
}
