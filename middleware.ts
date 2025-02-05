import { auth } from "@/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";
import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const intlMiddleware = createMiddleware(routing);

function getLocale(request: NextRequest): string {
  const headers = {
    "accept-language": request.headers.get("accept-language") || undefined,
  };
  const negotiator = new Negotiator({ headers });
  const languages: readonly string[] = negotiator.languages() || [];

  return match(languages, routing.locales, routing.defaultLocale);
}

export default auth((req) => {
  const originalUrl = new URL(req.url);
  const pathSegments = originalUrl.pathname.split("/").filter(Boolean);

  const locale = getLocale(req) || routing.defaultLocale;

  if (!locale && pathSegments.length > 0) {
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}/404`, req.url)
    );
  }
  const intlResponse = intlMiddleware(req);
  const rawPath = pathSegments.slice(locale ? 1 : 0).join("/") || "/";

  const isPublicRoute = rawPath === "login";
  const isLoggedIn = !!req.auth?.user;

  if (!isLoggedIn) {
    return rawPath === "/"
      ? NextResponse.redirect(new URL(`/${locale}/login`, req.url))
      : NextResponse.next();
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return intlResponse || NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
