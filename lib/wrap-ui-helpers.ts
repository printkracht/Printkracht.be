import vehiclesData from './vehicles.json';
import { CoverageLevel, coverageMultipliers } from './settings';

export interface VehicleInfo {
  id: string;
  name: string;
  area: number;
  examples: string;
  complexity: number;
}

export const vehicles: VehicleInfo[] = vehiclesData.vehicles;

export const findVehicle = (id: string) => vehicles.find((vehicle) => vehicle.id === id);

export function estimateInstallHours(area: number, coverage: CoverageLevel, complexity: number) {
  const printableArea = area * coverageMultipliers[coverage];
  const panelHandlingFactor = printableArea / 2.25; // m2 per uur bij kleine panelen
  const prepTime = 2.5; // ontvetten, demontage kleine delen
  return +(prepTime + panelHandlingFactor * complexity).toFixed(1);
}

export function estimateDesignHours(area: number, coverage: CoverageLevel) {
  const printableArea = area * coverageMultipliers[coverage];
  const conceptBlock = coverage === 'lettering' ? 1.5 : 3;
  const refinement = printableArea / 8;
  return +(conceptBlock + refinement).toFixed(1);
}
