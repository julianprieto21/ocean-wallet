export function formatBalance({
  amount,
  currency,
  locale = "es",
  currencyDisplay = "code",
  signDisplay = "auto",
  notation = "standard",
  fractionDigits = 2,
}: {
  amount: number;
  currency: string;
  locale?: string;
  currencyDisplay?: "code" | "symbol" | "narrowSymbol" | "name";
  signDisplay?: "never" | "always" | "auto" | "exceptZero";
  notation?: "compact" | "standard" | "scientific" | "engineering";
  fractionDigits?: number;
}) {
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
