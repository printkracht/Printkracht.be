export type FoilType = "Wrap" | "Belettering" | "Onbekend" | string;

export interface PricingRow {
  vehicleType: string;
  foilType: FoilType;
  materialPerM2: number;
  laborPerM2: number;
  totalPerM2: number;
}

function parseEuro(value: string): number {
  const normalized = value.replace(/€|\s/g, "").replace(/,/g, ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parsePricingCsv(raw: string): PricingRow[] {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const [, ...dataRows] = lines; // skip header

  return dataRows
    .map((line) => line.split(";").map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({
      vehicleType: cells[0],
      foilType: cells[1],
      materialPerM2: parseEuro(cells[2]),
      laborPerM2: parseEuro(cells[3]),
      totalPerM2: parseEuro(cells[4]),
    }));
}

export function findPrice(
  pricingTable: PricingRow[],
  vehicleType: string,
  foilType: FoilType,
): PricingRow | undefined {
  return pricingTable.find(
    (row) =>
      row.vehicleType.toLowerCase() === vehicleType.toLowerCase() &&
      row.foilType.toLowerCase() === foilType.toLowerCase(),
  );
}

export function uniqueVehicleTypes(pricingTable: PricingRow[]): string[] {
  const seen = new Set<string>();
  pricingTable.forEach((row) => seen.add(row.vehicleType));
  return Array.from(seen);
}
