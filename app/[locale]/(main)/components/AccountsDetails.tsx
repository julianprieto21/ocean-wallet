"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useUserStore } from "@/lib/store/userStore";
import { useLocale } from "next-intl";
import { AccountsDict, AccountType } from "@/lib/types";

type WalletDetailProps = {
  name: string;
  provider: string;
  currency_id: string;
  orig: number;
  conv: number;
}[];

type CryptoDetailProps = {
  name: string;
  image_url: string;
  currency_id: string;
  orig: number;
  conv: number;
}[];

type AccountDetailsProps = {
  type: AccountType;
  details: WalletDetailProps & CryptoDetailProps;
  dict: AccountsDict;
};

export function AccountDetails({ type, details, dict }: AccountDetailsProps) {
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const preferenceCurrency = useUserStore((state) => state.preferenceCurrency);
  const totalBalance = details.reduce(
    (acc: number, curr: { orig: number; conv: number }) => acc + curr.conv,
    0
  );
  const { prefix, integer, decimal } = formatCurrency({
    amount: totalBalance,
    currency: preferenceCurrency,
    locale: locale,
  });
  const Detail = type === "wallet" ? WalletDetail : CryptoDetail;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex flex-row items-center gap-2 text-xl text-primary-300 p-3 rounded-2xl mx-4 hover:bg-primary-250 hover:text-primary-400 transition-colors duration-75 ${
          open ? "bg-primary-250 text-primary-400" : ""
        }`}
      >
        <ChevronRight
          className={`size-7 flex-shrink-0 ${
            open ? "rotate-90" : ""
          } transition-transform duration-75`}
        />
        <div className="w-full flex flex-row justify-between items-center">
          <span>{dict[type]}</span>
          <span>
            {integer}
            {decimal}
            {prefix}
          </span>
        </div>
      </button>
      {open ? <Detail details={details} /> : null}
    </>
  );
}

function WalletDetail({ details }: { details: WalletDetailProps }) {
  const locale = useLocale();
  const preferenceCurrency = useUserStore((state) => state.preferenceCurrency);
  const accounts: {
    name: string;
    provider: string;
    balance: { currency: string; amount: number }[];
  }[] = Object.values(
    details.reduce(
      (
        acc: {
          [key: string]: {
            name: string;
            provider: string;
            balance: { currency: string; amount: number }[];
          };
        },
        item: WalletDetailProps[0]
      ) => {
        const { name, provider, currency_id, orig } = item;

        if (!acc[name]) {
          acc[name] = {
            name,
            provider: provider,
            balance: [],
          };
        }

        acc[name].balance.push({ currency: currency_id, amount: orig });

        return acc;
      },
      {}
    )
  );
  return (
    <div className="w-full flex flex-col gap-1">
      {accounts.map((account) => {
        return (
          <div
            key={account.name}
            className="flex flex-row items-start gap-2 text-xl text-primary-300 p-3 rounded-2xl mx-4 transition-colors duration-75"
          >
            <img
              src={`/icons/wallet/${account.provider}.svg`}
              alt=""
              className="size-7 rounded-full"
            />
            <div className="flex flex-row w-full justify-between items-start">
              <button type="button" className="hover:underline">
                {account.name}
              </button>
              <span className="flex flex-col items-end">
                {account.balance.map((balance) => {
                  const { prefix, integer, decimal } = formatCurrency({
                    amount: balance.amount,
                    currency: balance.currency ?? preferenceCurrency,
                    fractionDigits: 8,
                    locale: locale,
                  });
                  return (
                    <span key={balance.currency} className="pl-2">
                      {integer}
                      {decimal}
                      {prefix}
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CryptoDetail({ details }: { details: CryptoDetailProps }) {
  const locale = useLocale();
  const preferenceCurrency = useUserStore((state) => state.preferenceCurrency);
  return (
    <div className="w-full flex flex-col gap-1">
      {details.map((crypto) => {
        const { integer: integerOrig, decimal: decimalOrig } = formatCurrency({
          amount: crypto.orig,
          currency: preferenceCurrency, // Moneda por defecto, no se muestra realmente.
          locale: locale,
          fractionDigits: 8,
        });
        const {
          prefix: prefixConv,
          integer: integerConv,
          decimal: decimalConv,
        } = formatCurrency({
          amount: crypto.conv,
          currency: preferenceCurrency,
          locale: locale,
          fractionDigits: 8,
        });
        return (
          <div
            key={crypto.name}
            className="flex flex-row items-start gap-2 text-xl text-primary-300 p-3 rounded-2xl mx-4 transition-colors duration-75"
          >
            <img
              src={`/icons/crypto/${crypto.currency_id}.svg`}
              alt=""
              className="size-7 rounded-full"
            />
            <div className="flex flex-row w-full justify-between items-start">
              <button type="button" className="hover:underline">
                {crypto.name}
              </button>
              <span className="flex flex-col items-end">
                <span className="pl-2">
                  {integerOrig}
                  {decimalOrig} {crypto.currency_id.toUpperCase()}
                </span>
                <span className="pl-2">
                  {integerConv}
                  {decimalConv}
                  {prefixConv}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
