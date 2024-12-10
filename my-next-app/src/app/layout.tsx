'use client';

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import GlobalHapticFeedback from "@/components/GlobalHapticFeedback";
import CoinsUpdater from '@/components/CoinsUpdater';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Добавляем эффект для вибрации при клике на кнопки
  useEffect(() => {
    const handleButtonClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        if (navigator.vibrate) {
          navigator.vibrate(50); // Вибрация на 50 мс
        }
      }
    };

    document.addEventListener("click", handleButtonClick);

    return () => {
      document.removeEventListener("click", handleButtonClick);
    };
  }, []);

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TonConnectUIProvider manifestUrl="https://min-liard.vercel.app/tonconnect-manifest.json">
        <GlobalHapticFeedback>
          {children}
          <CoinsUpdater />
          </GlobalHapticFeedback>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}

