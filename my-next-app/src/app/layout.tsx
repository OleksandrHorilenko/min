import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
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

export const metadata: Metadata = {
  title: "Paws Game Clone",
  description: "Clone of the popular Telegram mini app Paws, developed by Nikandr Surkov.",
};

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
