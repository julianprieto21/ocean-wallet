import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

const locales = ["en", "es"];
export type Locale = (typeof locales)[number];
const defaultLocale: Locale = "en";
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,
});
