"use client";

import { ACCOUNT_PROVIDERS } from "@/lib/accountProviders";
import React from "react";
import { Sparkline } from "@mantine/charts";
import { fillMissingDailyBalances } from "@/lib/utils";

type DailyBalanceChartProps = {
  dailyBalances: {
    date: Date;
    balance: number;
  }[];
};
export function DailyBalanceChart({ dailyBalances }: DailyBalanceChartProps) {
  const [offset] = React.useState(7);
  const completeData = fillMissingDailyBalances({
    data: dailyBalances,
    offset: offset,
  });
  return (
    <Sparkline
      h={300}
      data={completeData.map((d) => d.balance)}
      curveType="linear" // "bump"
      color="var(--primary-300)"
    />
  );
}

type AccountBalanceChartProps = {
  data: {
    name: string;
    provider: string;
    percent: number;
  }[];
};
export function AccountBalanceChart({ data }: AccountBalanceChartProps) {
  return (
    <div className="w-full flex flex-col items-start justify-end">
      <div id="account-bar-chart" className="w-full h-2 flex ">
        {data.map((acc) => {
          if (!acc.percent || acc.percent <= 0.5) return null; // No mostrar porcentajes demasiado bajos
          const color = ACCOUNT_PROVIDERS.filter(
            (provider) => provider.id == acc.provider
          )[0].color;
          return (
            <div
              key={acc.name}
              style={{ backgroundColor: color, width: acc.percent + "%" }}
              className="h-full"
            ></div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-row gap-2">
        {data.map((acc) => {
          return (
            <span key={acc.name} className="flex gap-1">
              <img
                src={`/icons/wallet/${acc.provider}.svg`}
                alt=""
                className="size-5 rounded-full"
              />
              <span className="text-primary-300">
                {acc.percent ? acc.percent.toFixed(2) : "0.00"}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
