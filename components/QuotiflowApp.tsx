"use client";

import { useMemo, useState } from "react";
import { findPrice, FoilType, PricingRow, uniqueVehicleTypes } from "@/lib/pricing";
import { LayerArea, parseSvgLayers, SvgParseResult } from "@/lib/svgLayers";

interface QuotiflowAppProps {
  pricingTable: PricingRow[];
}

type LayerState = LayerArea & { foilType: FoilType };

type ParseState = SvgParseResult | null;

function formatM2(value: number): string {
  return `${value.toFixed(2)} m²`;
}

export default function QuotiflowApp({ pricingTable }: QuotiflowAppProps) {
  const vehicleOptions = useMemo(() => uniqueVehicleTypes(pricingTable), [pricingTable]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicleOptions[0]);
  const [layers, setLayers] = useState<LayerState[]>([]);
  const [parseState, setParseState] = useState<ParseState>(null);
  const [error, setError] = useState<string | null>(null);

  const priceAvailability = pricingTable.length > 0;

  const totalAreaByFoil = useMemo(() => {
    return layers.reduce<Record<string, number>>((acc, layer) => {
      if (!acc[layer.foilType]) acc[layer.foilType] = 0;
      acc[layer.foilType] += layer.areaM2;
      return acc;
    }, {});
  }, [layers]);

  const totalPrice = useMemo(() => {
    if (!selectedVehicle) return 0;
    return layers.reduce((sum, layer) => {
      const priceRow = findPrice(pricingTable, selectedVehicle, layer.foilType);
      if (!priceRow) return sum;
      return sum + priceRow.totalPerM2 * layer.areaM2;
    }, 0);
  }, [layers, pricingTable, selectedVehicle]);

  const unmatchedLayers = useMemo(
    () =>
      layers.filter(
        (layer) =>
          layer.foilType !== "Onbekend" &&
          !findPrice(pricingTable, selectedVehicle, layer.foilType),
      ),
    [layers, pricingTable, selectedVehicle],
  );

  const handleFile = async (file: File) => {
    const text = await file.text();
    try {
      const parsed = parseSvgLayers(text);
      const mappedLayers: LayerState[] = parsed.layers.map((layer) => ({
        ...layer,
        foilType: layer.suggestedFoil || "Onbekend",
      }));
      setLayers(mappedLayers);
      setParseState(parsed);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setLayers([]);
      setParseState(null);
    }
  };

  const handleLayerFoilUpdate = (layerName: string, foilType: FoilType) => {
    setLayers((prev) => prev.map((layer) => (layer.layerName === layerName ? { ...layer, foilType } : layer)));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <header className="section-card" style={{ padding: "24px" }}>
        <div className="section-title">Quotiflow – Carwrap & belettering</div>
        <h1>Prijsberekening per m²</h1>
        <p className="muted">
          Upload een SVG, kies het voertuigtype en bereken de totale prijs op basis van
          gelaagde oppervlakken en de tarieven uit het csv-bestand.
        </p>
      </header>

      <section className="section-card">
        <div className="section-title">1. Prijzen uit CSV</div>
        {!priceAvailability && <div className="alert">Kon geen prijzen laden.</div>}
        {priceAvailability && (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Voertuigtype</th>
                  <th>Soort folie</th>
                  <th>€ Folie/m²</th>
                  <th>€ Uren/m²</th>
                  <th>Totaal €/m²</th>
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((row) => (
                  <tr key={`${row.vehicleType}-${row.foilType}`}>
                    <td>{row.vehicleType}</td>
                    <td>{row.foilType}</td>
                    <td>€ {row.materialPerM2.toFixed(2)}</td>
                    <td>€ {row.laborPerM2.toFixed(2)}</td>
                    <td>€ {row.totalPerM2.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-title">2. Instellingen</div>
        <div className="input-row">
          <label>
            Voertuigtype
            <br />
            <select
              value={selectedVehicle}
              onChange={(event) => setSelectedVehicle(event.target.value)}
              disabled={!priceAvailability}
            >
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle} value={vehicle}>
                  {vehicle}
                </option>
              ))}
            </select>
          </label>

          <label>
            SVG-bestand
            <br />
            <input
              type="file"
              accept="image/svg+xml"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleFile(file);
                }
              }}
            />
          </label>
        </div>
        <p className="muted">
          Laagnaam met "wrap" of "letter" wordt automatisch gelinkt aan de juiste foliesoort.
        </p>
        {error && <div className="alert">{error}</div>}
        {parseState?.warnings.map((warning) => (
          <div className="alert" key={warning}>
            {warning}
          </div>
        ))}
      </section>

      {layers.length > 0 && (
        <section className="section-card">
          <div className="section-title">3. Oppervlakte per laag</div>
          <div className="layer-grid">
            {layers.map((layer) => (
              <div key={layer.layerName} className="summary-card">
                <div>
                  <strong>{layer.layerName}</strong>
                  <div className="muted">{formatM2(layer.areaM2)}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div className="muted">Folie</div>
                  <select
                    value={layer.foilType}
                    onChange={(event) =>
                      handleLayerFoilUpdate(layer.layerName, event.target.value as FoilType)
                    }
                  >
                    <option value="Wrap">Wrap</option>
                    <option value="Belettering">Belettering</option>
                    <option value="Onbekend">Onbekend</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="section-title" style={{ marginBottom: 6 }}>
              Samenvatting
            </div>
            <div className="layer-grid">
              {Object.entries(totalAreaByFoil).map(([foil, area]) => (
                <div key={foil} className="summary-card">
                  <div>
                    <strong>{foil}</strong>
                    <div className="muted">{formatM2(area)}</div>
                  </div>
                  <span className="badge">Oppervlakte</span>
                </div>
              ))}
              <div className="summary-card">
                <div>
                  <strong>Totaal</strong>
                  <div className="muted">{formatM2(parseState?.totalAreaM2 ?? 0)}</div>
                </div>
                <span className="badge">Alles</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {layers.length > 0 && (
        <section className="section-card">
          <div className="section-title">4. Berekening</div>
          {!selectedVehicle && <div className="alert">Kies een voertuigtype.</div>}

          {unmatchedLayers.length > 0 && (
            <div className="alert">
              Voor {unmatchedLayers.map((l) => l.layerName).join(", ")} ontbreekt een prijslijn voor
              "{selectedVehicle}".
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            {layers.map((layer) => {
              const priceRow = findPrice(pricingTable, selectedVehicle, layer.foilType);
              if (!priceRow) return null;
              const layerPrice = priceRow.totalPerM2 * layer.areaM2;
              return (
                <div key={`${layer.layerName}-calc`} className="summary-card">
                  <div>
                    <strong>{layer.layerName}</strong>
                    <div className="muted">
                      {layer.foilType} · {formatM2(layer.areaM2)} · € {priceRow.totalPerM2.toFixed(2)} / m²
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>€ {layerPrice.toFixed(2)}</div>
                </div>
              );
            })}

            <div className="summary-card" style={{ borderColor: "rgba(127, 209, 255, 0.6)" }}>
              <div>
                <strong>Totaalprijs</strong>
                <div className="muted">Inclusief folie + werk</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>€ {totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </section>
      )}

      <footer className="footer">Quotiflow • powered by Printkracht</footer>
    </div>
  );
}
