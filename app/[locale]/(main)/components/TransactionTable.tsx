"use client";
import { CURRENCIES } from "@/lib/currencies";
import { useUISettingsStore } from "@/lib/store/uiSettingsStore";
import { Category, Dict, Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";

type TransactionTableProps = {
  dict: Dict;
  transactions: Array<
    Transaction & { account_type: string; provider: string; name: string }
  >;
  limit?: number;
};

export function TransactionTable({
  dict,
  transactions,
  limit = transactions.length,
}: TransactionTableProps) {
  const locale = useLocale();
  const { transactionType } = useUISettingsStore((state) => state);
  return (
    <div className="w-full overflow-auto flex-shrink-0">
      <table className="w-full table-fixed bg-primary-50 border-collapse">
        <thead className="bg-primary-200 sticky top-0">
          <tr>
            <td className="text-left py-2 px-2 border-b border-primary-200 text-primary-300 w-[30%]">
              {transactionType === "transactional"
                ? dict.transactions.description.toUpperCase()
                : dict.common_fields.currency.toUpperCase()}
            </td>
            <td className="text-center py-2 px-2 border-b border-primary-200 text-primary-300 w-[25%]">
              {dict.transactions.category.toUpperCase()}
            </td>
            <td className="text-center py-2 px-2 border-b border-primary-200 text-primary-300 w-[25%]">
              {dict.common_fields.created_at.toUpperCase()}
            </td>
            <td className="text-center py-2 px-2 border-b border-primary-200 text-primary-300">
              {dict.common_fields.amount.toUpperCase()}
            </td>
          </tr>
        </thead>
        <tbody className="bg-primary-100">
          {transactions
            .filter(
              (transaction: TransactionTableProps["transactions"][0]) =>
                transaction.account_type === transactionType &&
                !transaction.transfer_id
            )
            .slice(0, limit)
            .map((transaction: TransactionTableProps["transactions"][0]) => {
              const tx = formatCurrency({
                amount: transaction.amount,
                currency: "usd",
                signDisplay: "exceptZero",
                locale: locale,
                fractionDigits: 8,
              });
              const date = formatDate({
                date: new Date(transaction.created_at),
                dateStyle: "short",
              });

              return (
                <tr
                  key={transaction.transaction_id}
                  className="hover:bg-gray-50"
                >
                  <td className="text-left py-2 px-2 truncate border-b border-primary-200 align-middle">
                    {transactionType === "transactional" ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={`/icons/wallet/${transaction.provider}.svg`}
                          alt=""
                          className="size-5 rounded-full"
                        />
                        {transaction.description}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <img
                          src={`/icons/crypto/${transaction.currency_id}.svg`}
                          alt=""
                          className="size-5 rounded-full"
                        />
                        {
                          CURRENCIES.find(
                            (curr) => curr.value === transaction.currency_id
                          )?.name
                        }
                      </div>
                    )}
                  </td>
                  <td className="text-center py-2 px-2 border-b border-primary-200">
                    <span
                      id={transaction.category}
                      className="p-1 rounded-full px-2 uppercase text-xs font-medium"
                    >
                      {dict.categories[transaction.category as Category]}
                    </span>
                  </td>
                  <td className="text-center py-2 px-2 border-b border-primary-200">
                    {date}
                  </td>
                  <td className="text-right py-2 px-2 border-b border-primary-200">
                    <span
                      className={`${
                        transaction.type === "expense"
                          ? "text-primary-red"
                          : "text-primary-green"
                      }`}
                    >
                      {tx.integer}
                      {tx.decimal}
                    </span>
                    <span className="text-sm text-primary-300">
                      {" " + transaction.currency_id.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
