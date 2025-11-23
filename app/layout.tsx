import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quotiflow | Printkracht",
  description:
    "Bereken wrap- en beletteringsprijzen per voertuigtype met Quotiflow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
