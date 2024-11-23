import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AbsoluteMenu from "@/components/AbsoluteMenu";
import PlausibleProvider from "next-plausible";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Steven Sarmiento",
  description: "A designer who engineers web and mobile experiences.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <link rel="stylesheet" href="https://use.typekit.net/eom2mzt.css" />
            <PlausibleProvider domain="stevensarmi.com" />
        </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <div className="flex w-full justify-center">
            <AbsoluteMenu />
          </div>
        </body>
      </html>
  );
}
