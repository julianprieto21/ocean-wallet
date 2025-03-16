import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "../globals.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import Sidebar from "@/components/Sidebar";
import Provider from "@/components/Provider";
import Menu from "@/components/Menu";
import { Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { UserLoader } from "@/components/UserLoader";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { getDictionary } from "@/lib/dictionaries";
import { Modal } from "./components/Modal";
import { Dict } from "@/lib/types";
import { getAccounts } from "@/lib/db";

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
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dict;
  const accounts = await getAccounts();

  return (
    <html lang={locale} {...mantineHtmlProps}>
      <body
        className={`${kanit.className} antialiased bg-background text-foreground w-full lg:w-[70%]`}
      >
        <NextIntlClientProvider locale={locale}>
          <Provider>
            <UserLoader />
            <MantineProvider>
              <main className="size-full flex flex-row gap-8 relative">
                <Modal dict={dict} accounts={accounts} />
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
