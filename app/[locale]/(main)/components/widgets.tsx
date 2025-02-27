"use client";
import { useUserStore } from "@/lib/store/userStore";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type BalanceProps = {
  title: string;
  balance: number;
  locale: string;
  growPercentage?: number;
  size?: "small" | "medium" | "large";
  color?: "text-primary-green" | "text-primary-red" | "text-primary-500";
};
export const BalanceWidget = ({
  title,
  balance,
  locale,
  size = "medium",
  color = "text-primary-500",
  growPercentage,
}: BalanceProps) => {
  const preferenceCurrency = useUserStore((state) => state.preferenceCurrency);
  const total = formatCurrency({
    amount: balance,
    currency: preferenceCurrency,
    currencyDisplay: "symbol",
    locale: locale,
  });
  let currencySize, totalSize, decimalSize;

  switch (size) {
    case "small":
      totalSize = "lg:text-xl";
      currencySize = "lg:text-2xl";
      decimalSize = "lg:text-lg";
      break;
    case "medium":
      totalSize = "text-lg lg:text-3xl";
      currencySize = "text-lg lg:text-3xl";
      decimalSize = "text-lg lg:text-xl";
      break;
    case "large":
      totalSize = "text-2xl md:text-3xl lg:text-4xl";
      currencySize = "text-xl md:text-2xl lg:text-3xl";
      decimalSize = "text-lg md:text-xl lg:text-2xl";
      break;
  }
  return (
    <div className="flex flex-col w-full">
      <span className="w-full text-base md:text-lg lg:text-xl flex flex-col flex-shrink-0 text-primary-300">
        {title}
        <span className={`${totalSize} ${color} w-full`}>
          <span className={`text-primary-300 ${currencySize} font-medium`}>
            {total.prefix}
          </span>
          {total.integer}
          <span className={`text-primary-300 ${decimalSize} font-medium`}>
            {total.decimal}
          </span>
        </span>
      </span>
      {typeof growPercentage === "number" && (
        <span
          className={`flex gap-1 text-sm ${
            growPercentage > 0 ? "text-primary-green" : "text-primary-red"
          }`}
        >
          {growPercentage.toFixed(2)}%
          {growPercentage > 0 ? (
            <TrendingUp className="size-5 text-primary-green" />
          ) : (
            <TrendingDown className="size-5 text-primary-red" />
          )}
        </span>
      )}
    </div>
  );
};
