import { estimateWrap as calc, WrapInput as WI } from "./pricing";
export type { WrapInput, VehicleType } from "./pricing";
export { WRAP_SETTINGS } from "./settings";
export const estimateWrap = calc;
export type WrapInput = WI;
