import { Kanit } from "next/font/google";
import "../globals.css";
import { Locale } from "@/i18n/routing";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function LoginLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body className={`${kanit.className} antialiased`}>
        <main className="size-full flex flex-row gap-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
