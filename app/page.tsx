import QuotiflowApp from "@/components/QuotiflowApp";
import { loadPricingTable } from "@/lib/pricingLoader";

export default function HomePage() {
  const pricingTable = loadPricingTable();

  return <QuotiflowApp pricingTable={pricingTable} />;
}
