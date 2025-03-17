"use client";

import { PROVIDERS } from "@/lib/providers";
import React, { useEffect } from "react";
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
  const [data, setData] = React.useState<{ date: string; balance: number }[]>(
    []
  );
  useEffect(() => {
    setData(
      fillMissingDailyBalances({
        data: dailyBalances,
        offset: offset,
      })
    );
  }, [dailyBalances, offset]);
  return (
    <Sparkline
      className="h-[150px] md:h-[300px]"
      data={data.map((d) => d.balance)}
      curveType="bump"
      trendColors={{ positive: "teal.6", negative: "red.6", neutral: "gray.5" }}
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
          const color = PROVIDERS.filter(
            (provider) => provider.value == acc.provider
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
            <span key={acc.name} className="flex gap-1 items-center">
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
