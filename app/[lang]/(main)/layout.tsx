import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "../globals.css";
import Provider from "@/components/Provider";
import { Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { UserLoader } from "./components/UserLoader";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ocean Wallet",
  description:
    "Aplicación web para llevar un seguimiento de las finanzas personales. Creada por Julián Prieto.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className={`${kanit.className} antialiased`}>
        <NextIntlClientProvider locale={lang}>
          <Provider>
            <UserLoader />
            <main className="size-full flex flex-row gap-8 relative">
              {children}
            </main>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
