type FormatBalanceProps = {
  amount: number;
  currency: string;
  locale?: string;
  currencyDisplay?: "code" | "symbol" | "narrowSymbol" | "name";
  signDisplay?: "never" | "always" | "auto" | "exceptZero";
  notation?: "compact" | "standard" | "scientific" | "engineering";
  fractionDigits?: number;
};

export function formatCurrency({
  amount,
  currency,
  locale = "es",
  currencyDisplay = "code",
  signDisplay = "auto",
  notation = "standard",
  fractionDigits = 2,
}: FormatBalanceProps) {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    signDisplay: signDisplay,
    notation: notation,
    currencyDisplay: currencyDisplay,
    maximumFractionDigits: 8,
    minimumFractionDigits: 2,
  }).formatToParts(amount);

  let prefix = "";
  let integer = "";
  let decimal = "";
  let isDecimal = false;

  for (const part of parts) {
    switch (part.type) {
      case "currency":
        prefix = " " + part.value + " ";
        break;
      case "minusSign":
      case "plusSign":
        integer += part.value;
        break;
      case "group":
      case "integer":
        integer += part.value;
        break;
      case "decimal":
        decimal += part.value;
        isDecimal = true;
        break;
      case "fraction":
        if (isDecimal) {
          decimal += part.value;
        }
        break;
      default:
        break;
    }
    decimal = decimal.slice(0, fractionDigits + 1);
  }
  return { prefix, integer, decimal };
}

type FormatDateProps = {
  date: Date;
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

export function formatDate({
  date,
  locale = "es",
  dateStyle = "medium",
  timeStyle = "short",
}: FormatDateProps) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle,
    timeStyle: timeStyle,
  }).format(date);
}

type FillMissingDailyBalancesProps = {
  data: {
    date: Date;
    balance: number;
  }[];
  offset: number;
};
export function fillMissingDailyBalances({
  data,
  offset,
}: FillMissingDailyBalancesProps) {
  const result: { date: string; balance: number }[] = [];
  if (data.length === 0) return result;
  const lastDate = new Date(); //data[data.length - 1].date;
  const firstDate = new Date(lastDate.getTime() - offset * 24 * 60 * 60 * 1000);
  const balanceMap = new Map(
    data.map((item) => [item.date.toDateString(), item.balance])
  );
  const prevBalance =
    data.filter((curr) => curr.date < firstDate).at(-1)?.balance ?? 0;
  const dates = [];
  const currentDate = new Date(firstDate);
  while (currentDate <= lastDate) {
    dates.push(currentDate.toDateString());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  for (const date of dates) {
    const balance = balanceMap.get(date);
    if (balance === undefined) {
      const prevDateBalance =
        result.length > 0 ? result[result.length - 1].balance : prevBalance;
      result.push({ date, balance: Number(prevDateBalance) });
    } else {
      result.push({ date, balance: Number(balance) });
    }
  }
  return result;
}

export function getGrowPercentage(dailyBalances: number[]) {
  const lastBalance = dailyBalances[dailyBalances.length - 1];
  const firstBalance = dailyBalances[0];
  if (firstBalance === 0) {
    return 0;
  }
  return ((lastBalance - firstBalance) / firstBalance) * 100;
}

export function formatFormData(values: Record<string, string | Date>) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  return formData;
}
