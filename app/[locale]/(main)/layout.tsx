import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Provider from "@/components/Provider";
import Menu from "@/components/Menu";
import { Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { UserLoader } from "@/components/UserLoader";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const theme = createTheme({});

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
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${kanit.className} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <Provider>
            <UserLoader />
            <MantineProvider theme={theme}>
              <main className="size-full flex flex-row gap-8 relative">
                <Sidebar locale={locale} />
                {children}
                <Menu />
              </main>
            </MantineProvider>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
