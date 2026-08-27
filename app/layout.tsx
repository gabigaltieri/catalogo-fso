import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "FSO — Catálogo de Productos";
const description = "Catálogo digital de FSO Productos de Limpieza. Limpieza que brilla en cada rincón.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fso-catalogo.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "FSO Productos de Limpieza",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo-fso.jpg",
        width: 1254,
        height: 1254,
        alt: "FSO Productos de Limpieza",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logo-fso.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${barlowCondensed.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
