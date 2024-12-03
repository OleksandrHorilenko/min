'use client';

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Head from "next/head"; // Импорт компонента Head
import Script from "next/script";

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

//export const metadata: Metadata = {
// title: "ECOMINE - application for mining cryptocurrency",
 // description: "Application for mining cryptocurrency from Telegram",
//};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="beforeInteractive"
          />
        </Head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}><TonConnectUIProvider manifestUrl="https://silver-odd-armadillo-313.mypinata.cloud/ipfs/QmY6CVPE42JSChUnTdhbjurb1WCRqhY1dAY26gfkL3vxLh">
          {children}
        
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
