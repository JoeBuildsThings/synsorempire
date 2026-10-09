import type { Metadata } from "next";
import { Unbounded, Figtree } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin"],
  variable: "--fontDisplay",
  display: "swap",
});
const body = Figtree({
  subsets: ["latin"],
  variable: "--fontBody",
  display: "swap",
});

const description =
  "Shop corporate wear, formal shoes, sneakers, streetwear, caps, belts, bags and essentials in Ibadan, Ogunpa. Message us on WhatsApp to order.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION },
  title: {
    default: "Synsorempire | Corporate wear, footwear and streetwear",
    template: "%s | Synsorempire",
  },
  description,
  openGraph: {
    title: "Synsorempire | Corporate wear, footwear and streetwear",
    description,
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}