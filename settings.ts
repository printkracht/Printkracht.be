import { TintSettings, WrapSettings } from "./pricing";

export const WRAP_SETTINGS: WrapSettings = {
  pricePerM2: 120,   // € per m² (geïnstalleerd), excl. btw
  printPerM2: 0,     // niet gebruikt bij flat prijs
  laminatePerM2: 0,  // niet gebruikt bij flat prijs
  labourPerHour: 0,  // inbegrepen
  wasteFactor: 1.10, // 10% waste
  defaultWidthVan: 1.95
};

export const TINT_SETTINGS: TintSettings = {
  filmPricePerM2: { standard: 22, ceramic: 39 },
  building: { installPerM2: 18, calloutMinEUR: 120 }
};
