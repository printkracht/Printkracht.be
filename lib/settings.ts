export type FinishType = 'glans' | 'mat' | 'satin';
export type MaterialQuality = 'economy' | 'standard' | 'premium';
export type CoverageLevel = 'full' | 'partial' | 'lettering';

export interface RateSettings {
  designRate: number;
  installRate: number;
  materialRate: number;
  laminationRate: number;
  windowPerfRate: number;
  letteringRate: number;
  prepressFee: number;
  rushPercentage: number;
}

export const defaultRates: RateSettings = {
  designRate: 78,
  installRate: 65,
  materialRate: 28,
  laminationRate: 9,
  windowPerfRate: 36,
  letteringRate: 22,
  prepressFee: 35,
  rushPercentage: 0.12,
};

export const qualityMultipliers: Record<MaterialQuality, number> = {
  economy: 0.9,
  standard: 1,
  premium: 1.18,
};

export const finishComplexity: Record<FinishType, number> = {
  glans: 1,
  mat: 1.05,
  satin: 1.08,
};

export const coverageMultipliers: Record<CoverageLevel, number> = {
  full: 1,
  partial: 0.65,
  lettering: 0.28,
};

export const finishLabels: Record<FinishType, string> = {
  glans: 'Glans',
  mat: 'Mat',
  satin: 'Satin',
};

export const qualityLabels: Record<MaterialQuality, string> = {
  economy: 'Economy cast',
  standard: 'Standaard (polymeere)',
  premium: 'Premium cast / long term',
};

export const coverageLabels: Record<CoverageLevel, string> = {
  full: 'Full wrap',
  partial: 'Deels wrap (ca. 60-70%)',
  lettering: 'Belettering / striping',
};
