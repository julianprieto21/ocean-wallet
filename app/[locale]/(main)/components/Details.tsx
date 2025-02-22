"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useUserStore } from "@/lib/store/userStore";
import { useLocale } from "next-intl";
import { Dict } from "@/lib/types";
import { PayQuota } from "./Buttons";
import { CURRENCIES } from "@/lib/currencies";

type TransactionalDetailProps = {
  name: string;
  provider: string;
  currency_id: string;
  orig: number;
  conv: number;
}[];

type CryptoDetailProps = {
  currency_id: string;
  orig: number;
  conv: number;
}[];

type QuotaDetailProps = {
  name: string;
  type: string;
  quantity: number;
  current_quantity: number;
  currency: string;
  created_at: string;
  next_payment_date: string;
  orig: number;
  conv: number;
}[];

type AccountDetailsProps = {
  type: "transactional" | "crypto" | "stock" | "quota";
  details: TransactionalDetailProps & CryptoDetailProps & QuotaDetailProps;
  dict: Dict;
};

export function Details({ type, details, dict }: AccountDetailsProps) {
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const preferenceCurrency = useUserStore((state) => state.preferenceCurrency);
  const totalBalance = details.reduce(
    (acc: number, curr: { orig: number; conv: number }) => acc + curr.conv,
    0
  );
  const total = formatCurrency({
    amount: totalBalance,
    currency: type === "crypto" ? "usd" : preferenceCurrency,
    locale: locale,
  });
  const Detail =
    type === "transactional"
      ? TransactionalDetail
      : type === "quota"
      ? QuotaDetail
      : CryptoDetail;
  const title =
    type === "transactional"
      ? dict.accounts.transactional
      : type === "quota"
      ? dict.quotas.quotas
      : dict.accounts.crypto;
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
          <span>{title}</span>
          <span>
            {total.integer}
            {total.decimal}
            {total.prefix}
          </span>
        </div>
      </button>
      {open ? <Detail details={details} /> : null}
    </>
  );
}

function TransactionalDetail({
  details,
}: {
  details: TransactionalDetailProps;
}) {
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
        item: TransactionalDetailProps[0]
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
    <div className="ml-2 flex flex-col gap-1">
      {accounts.map((account) => {
        return (
          <div
            key={account.name}
            className="flex flex-row items-start gap-2 text-lg text-primary-300 p-3 rounded-2xl mx-4 transition-colors duration-75"
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
                  const bal = formatCurrency({
                    amount: balance.amount,
                    currency: balance.currency ?? preferenceCurrency,
                    fractionDigits: 2,
                    locale: locale,
                  });
                  return (
                    <span key={balance.currency} className="pl-2">
                      {bal.integer}
                      {bal.decimal}
                      {bal.prefix}
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
    <div className="ml-2 flex flex-col gap-1">
      {details.map((crypto) => {
        const orig = formatCurrency({
          amount: crypto.orig,
          currency: preferenceCurrency, // Moneda por defecto, no se muestra realmente.
          locale: locale,
          fractionDigits: 8,
        });
        const conv = formatCurrency({
          amount: crypto.conv,
          currency: "usd",
          locale: locale,
          fractionDigits: 2,
        });
        const name = CURRENCIES.find(
          (c) => c.value == crypto.currency_id
        )?.name;
        return (
          <div
            key={name}
            className="flex flex-row items-start gap-2 text-lg text-primary-300 p-3 rounded-2xl mx-4 transition-colors duration-75"
          >
            <img
              src={`/icons/crypto/${crypto.currency_id}.svg`}
              alt=""
              className="size-7 rounded-full"
            />
            <div className="flex flex-row w-full justify-between items-start">
              <button type="button" className="hover:underline">
                {name ?? "?"}
              </button>
              <span className="flex flex-col items-end">
                <span className="pl-2">
                  {orig.integer}
                  {orig.decimal} {crypto.currency_id.toUpperCase()}
                </span>
                <span className="pl-2">
                  {conv.integer}
                  {conv.decimal}
                  {conv.prefix}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuotaDetail({ details }: { details: QuotaDetailProps }) {
  return (
    <div className="ml-2 flex flex-col gap-1">
      {details.map((quota: QuotaDetailProps[0]) => {
        const { prefix, integer, decimal } = formatCurrency({
          amount: quota.orig,
          currency: quota.currency,
          fractionDigits: 2,
        });
        return (
          <div
            key={quota.name}
            className="flex flex-row items-start gap-2 text-lg text-primary-300 p-3 rounded-2xl mx-4 transition-colors duration-75"
          >
            <PayQuota />
            <div className="flex flex-row w-full justify-between items-start">
              <button type="button" className="hover:underline">
                {quota.name}
              </button>
              <span className="flex flex-col items-end">
                <span className="pl-2">
                  {integer}
                  {decimal}
                  {prefix}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
