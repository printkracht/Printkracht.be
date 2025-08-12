export type Coverage = "belettering" | "semi" | "full";
export type Complexity = "makkelijk" | "normaal" | "moeilijk";
export type VehicleType = "compact" | "sedan" | "suv" | "van";

export interface WrapSettings {
  /** Flat installed price per m² (materials+labour). If set, labour is considered included. */
  pricePerM2?: number;
  printPerM2: number;
  laminatePerM2: number;
  labourPerHour: number;
  wasteFactor: number;
  defaultWidthVan: number;
}

export interface WrapInput {
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  coverage: Coverage;
  isVanClosed?: boolean;
  vanLength?: number;
  vanHeight?: number;
  complexity: Complexity;
}

export interface WrapResult {
  areaM2: number;
  materialsEUR: number;
  labourHours: number;
  labourEUR: number;
  totalEUR: number;
  breakdown: {
    baseArea: number;
    windowsAdjustment: number;
    coverageExtra: number;
    wasteM2: number;
  }
}

export function estimateWrap(input: WrapInput, settings: WrapSettings): WrapResult {
  const { printPerM2, laminatePerM2, labourPerHour, wasteFactor, defaultWidthVan, pricePerM2 } = settings;

  let baseArea = 0;
  let windowsAdj = 0;
  let coverageExtra = 0;
  const constants = { compact: 18, sedan: 24, suv: 30 };

  if (input.vehicleType === "van") {
    const L = input.vanLength ?? 4.8;
    const H = input.vanHeight ?? 2.0;
    const W = defaultWidthVan;
    const sides = 2 * (L * H);
    const rear = 1.0 * (W * H);
    const front = 0.6 * (W * H);
    baseArea = sides + rear + front;
    if (!input.isVanClosed) windowsAdj = -3.0;
    if (input.coverage === "semi") coverageExtra = 0.15 * baseArea;
    else if (input.coverage === "full") coverageExtra = (L * W) + 0.25 * baseArea;
  } else {
    baseArea = constants[input.vehicleType];
    if (input.coverage === "semi") coverageExtra = 0.25 * baseArea;
    else if (input.coverage === "full") coverageExtra = 0.6 * baseArea;
  }

  const rawArea = Math.max(0, baseArea + windowsAdj + coverageExtra);
  const areaWithWaste = rawArea * wasteFactor;

  let materials = 0;
  let hours = 0;
  let labour = 0;
  if (pricePerM2 && pricePerM2 > 0) {
    materials = areaWithWaste * pricePerM2;
  } else {
    materials = areaWithWaste * (printPerM2 + laminatePerM2);
    let m2PerHour = 2.5;
    if (input.coverage === "semi") m2PerHour = 2.0;
    if (input.coverage === "full") m2PerHour = 1.5;
    let complexityFactor = 1.0;
    if (input.complexity === "makkelijk") complexityFactor = 0.9;
    if (input.complexity === "moeilijk") complexityFactor = 1.25;
    hours = (areaWithWaste / m2PerHour) * complexityFactor;
    labour = hours * labourPerHour;
  }
  const total = materials + labour;

  return {
    areaM2: round2(areaWithWaste),
    materialsEUR: round2(materials),
    labourHours: round2(hours),
    labourEUR: round2(labour),
    totalEUR: round2(total),
    breakdown: {
      baseArea: round2(baseArea),
      windowsAdjustment: round2(windowsAdj),
      coverageExtra: round2(coverageExtra),
      wasteM2: round2(areaWithWaste - rawArea),
    }
  };
}

function round2(n: number) { return Math.round(n * 100) / 100; }

// ---- Building tint only ----
export type FilmSeries = "standard" | "ceramic";

export interface TintSettings {
  filmPricePerM2: Record<FilmSeries, number>;
  building: { installPerM2: number; calloutMinEUR: number; };
}

export interface TintBuildingPane { widthCm: number; heightCm: number; count: number; }
export interface TintBuildingInput { film: FilmSeries; panes: TintBuildingPane[]; }
export interface TintResult { areaM2: number; materialsEUR: number; labourEUR: number; totalEUR: number; }

export function estimateTintBuilding(input: TintBuildingInput, settings: TintSettings): TintResult {
  const area = input.panes.reduce((acc, p) => acc + (p.widthCm/100) * (p.heightCm/100) * p.count, 0);
  const materials = area * settings.filmPricePerM2[input.film];
  const labour = Math.max(settings.building.calloutMinEUR, area * settings.building.installPerM2);
  return { areaM2: round2(area), materialsEUR: round2(materials), labourEUR: round2(labour), totalEUR: round2(materials + labour) };
}
