import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PlausibleProvider from "next-plausible";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/geist-vf.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/geist-mono-vf.woff",
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
            {/* <script
              crossOrigin="anonymous"
              src="//unpkg.com/react-scan/dist/auto.global.js"
            /> */}
        </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#171717]`}
      >
        <Providers>{children}</Providers>
        </body>
      </html>
  );
}
