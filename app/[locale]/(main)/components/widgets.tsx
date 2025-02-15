import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type BalanceProps = {
  title: string;
  balance: number;
  preferenceCurrency: string;
  locale: string;
  growPercentage?: number;
  size?: "small" | "medium" | "large";
  color?: "text-primary-green" | "text-primary-red" | "text-primary-500";
};
export const BalanceWidget = ({
  title,
  balance,
  preferenceCurrency,
  locale,
  size = "medium",
  color = "text-primary-500",
  growPercentage,
}: BalanceProps) => {
  const total = formatCurrency({
    amount: balance,
    currency: preferenceCurrency,
    currencyDisplay: "symbol",
    locale: locale,
  });
  let currencySize, totalSize, decimalSize;

  switch (size) {
    case "small":
      totalSize = "text-xl";
      currencySize = "text-2xl";
      decimalSize = "text-lg";
      break;
    case "medium":
      totalSize = "text-3xl";
      currencySize = "text-3xl";
      decimalSize = "text-xl";
      break;
    case "large":
      totalSize = "text-4xl";
      currencySize = "text-3xl";
      decimalSize = "text-2xl";
      break;
  }
  return (
    <div className="flex flex-col w-full">
      <span className="w-1/2 text-xl flex flex-col flex-shrink-0 text-primary-300">
        {title}
        <span className={`${totalSize} ${color}`}>
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
