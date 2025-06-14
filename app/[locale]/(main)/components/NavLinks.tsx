"use client";
import { Layers, Home } from "lucide-react";
import { usePathname, Link } from "@/i18n/routing";
import { NavigationDict } from "@/lib/types";

export default function NavLinks({ dict }: { dict: NavigationDict }) {
  const links = [
    {
      name: dict.home,
      href: "/",
      icon: Home,
      disabled: false,
    },
    {
      name: dict.transactions,
      href: "/transactions",
      icon: Layers,
      disabled: false,
    },
    // {
    //   name: dict.accounts,
    //   href: "/accounts",
    //   icon: CreditCard,
    //   disabled: true,
    // },
  ];
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-2 justify-between items-center w-full mt-2">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`flex flex-row items-center text-xl text-primary-300 hover:text-primary-400 transition-colors w-full rounded-2xl py-2 px-4 ${
            link.href == pathname
              ? "text-primary-400 bg-primary-50 shadow-md"
              : ""
          }
          ${
            link.disabled
              ? "pointer-events-none opacity-50"
              : "cursor-pointer hover:bg-primary-100"
          }`}
        >
          <link.icon className="size-7" />
          <span className="pl-2">{link.name}</span>
        </Link>
      ))}
    </div>
  );
}
