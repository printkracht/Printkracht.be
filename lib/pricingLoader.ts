import fs from "fs";
import path from "path";
import { parsePricingCsv, PricingRow } from "./pricing";

const CSV_FILENAME = "Prijzen carwrap calculator 2025.csv";

export function loadPricingTable(): PricingRow[] {
  const csvPath = path.join(process.cwd(), "public", CSV_FILENAME);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV-bestand niet gevonden op ${csvPath}`);
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  return parsePricingCsv(raw);
}
