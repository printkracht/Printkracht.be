import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Carwrapping & zonwerende folie | Printkracht",
  description: "Professionele carwrapping, belettering en gebouwfolie. Bereken je prijs, ontvang snel een concept en plan je montage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <LangProvider>
        <Header />
        <main className="container">{children}</main>
        <Footer />
              </LangProvider>
      </body>
    </html>
  );
}
