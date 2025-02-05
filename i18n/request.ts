import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  console.log("locale", locale);
  return {
    locale,
  };
});
