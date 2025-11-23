import {
  CoverageLevel,
  RateSettings,
  FinishType,
  MaterialQuality,
  coverageMultipliers,
  finishComplexity,
  qualityMultipliers,
} from './settings';

export interface QuoteRequest {
  area: number;
  coverage: CoverageLevel;
  quality: MaterialQuality;
  finish: FinishType;
  designHours: number;
  installHours: number;
  lamination: boolean;
  windowPerfArea: number;
  letteringMeters: number;
  installComplexity: number;
  rush: boolean;
  includePrepress: boolean;
  margin: number;
}

export interface QuoteBreakdown {
  printableArea: number;
  materialCost: number;
  laminationCost: number;
  designCost: number;
  installCost: number;
  windowPerfCost: number;
  letteringCost: number;
  prepressCost: number;
  rushFee: number;
  marginValue: number;
  subtotal: number;
  total: number;
}

export function calculateQuote(input: QuoteRequest, rates: RateSettings): QuoteBreakdown {
  const printableArea = input.area * coverageMultipliers[input.coverage];

  const materialCost = printableArea * rates.materialRate * qualityMultipliers[input.quality];
  const laminationCost = input.lamination ? printableArea * rates.laminationRate : 0;
  const designCost = input.designHours * rates.designRate;
  const installCost =
    input.installHours * rates.installRate * input.installComplexity * finishComplexity[input.finish];
  const windowPerfCost = input.windowPerfArea * rates.windowPerfRate;
  const letteringCost = input.letteringMeters * rates.letteringRate;
  const prepressCost = input.includePrepress ? rates.prepressFee : 0;

  const subtotal =
    materialCost +
    laminationCost +
    designCost +
    installCost +
    windowPerfCost +
    letteringCost +
    prepressCost;

  const rushFee = input.rush ? subtotal * rates.rushPercentage : 0;
  const marginBase = subtotal + rushFee;
  const marginValue = marginBase * input.margin;
  const total = marginBase + marginValue;

  return {
    printableArea,
    materialCost,
    laminationCost,
    designCost,
    installCost,
    windowPerfCost,
    letteringCost,
    prepressCost,
    rushFee,
    marginValue,
    subtotal,
    total,
  };
}

export const euro = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
