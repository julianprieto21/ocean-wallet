"use client";

import React from "react";
import { ChevronRight, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useUserStore } from "@/lib/store/userStore";
import { useLocale } from "next-intl";
import { QuotasDict } from "@/lib/types";

function PayQuota() {
  return (
    <button
      title="Pay Quota"
      type="button"
      className="size-7 flex-shrink-0 border border-primary-250 text-primary-250 rounded-full grid place-content-center hover:text-primary-300 hover:border-primary-300 transition-colors duration-75"
    >
      <Plus className="size-5 flex-shrink-0" />
    </button>
  );
}

type DetailProps = {
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

type QuotaDetailsProps = {
  dict: QuotasDict;
  details: DetailProps;
};

export default function QuotaDetails({ dict, details }: QuotaDetailsProps) {
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const preferenceCurrency = useUserStore((state) => state.preferenceCurrency);

  const quotaAmount = details.reduce(
    (acc: number, curr: { orig: number; conv: number }) => acc + curr.conv,
    0
  );
  const quota = formatCurrency({
    amount: quotaAmount,
    currency: preferenceCurrency,
    locale: locale,
  });
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
          <span>{dict.quotas}</span>
          <span>
            {quota.integer}
            {quota.decimal}
            {quota.prefix}
          </span>
        </div>
      </button>
      {open ? <Detail details={details} /> : null}
    </>
  );
}

function Detail({ details }: { details: DetailProps }) {
  return (
    <div className="ml-2 flex flex-col gap-1">
      {details.map((quota: DetailProps[0]) => {
        const { prefix, integer, decimal } = formatCurrency({
          amount: quota.orig,
          currency: quota.currency,
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
