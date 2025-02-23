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
  return (
    <div className="w-full overflow-auto h-3/4 flex-shrink-0">
      <table className="w-full table-fixed bg-primary-50 border-collapse">
        <thead className="bg-primary-200 sticky top-0">
          <tr>
            <td className="text-left py-3 px-2 border-b border-primary-200 text-primary-300 w-[30%]">
              {dict.transactions.description.toUpperCase()}
            </td>
            <td className="text-center py-3 px-2 border-b border-primary-200 text-primary-300 w-[25%]">
              {dict.common_fields.created_at.toUpperCase()}
            </td>
            <td className="text-center py-3 px-2 border-b border-primary-200 text-primary-300 w-[25%]">
              {dict.transactions.category.toUpperCase()}
            </td>
            <td className="text-center py-3 px-2 border-b border-primary-200 text-primary-300">
              {dict.common_fields.amount.toUpperCase()}
            </td>
          </tr>
        </thead>
        <tbody className="bg-primary-100">
          {transactions
            .filter(
              (transaction: TransactionTableProps["transactions"][0]) =>
                transaction.account_type === "transactional" &&
                !transaction.transfer_id
            )
            .slice(0, limit)
            .map((transaction: TransactionTableProps["transactions"][0]) => {
              const tx = formatCurrency({
                amount: transaction.amount,
                currency: transaction.currency_id,
                currencyDisplay: "code",
                locale: locale,
              });
              const date = formatDate({
                date: new Date(transaction.created_at),
              });

              return (
                <tr
                  key={transaction.transaction_id}
                  className="hover:bg-gray-50"
                >
                  <td className="text-left py-3 px-2 truncate border-b border-primary-200 align-middle">
                    <div className="flex items-center gap-2">
                      <img
                        src={`/icons/wallet/${transaction.provider}.svg`}
                        alt=""
                        className="size-5 rounded-full"
                      />
                      {transaction.description}
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 border-b border-primary-200">
                    {date}
                  </td>
                  <td className="text-center py-3 px-2 border-b border-primary-200">
                    {dict.categories[transaction.category as Category]}
                  </td>
                  <td className="text-right py-3 px-2 border-b border-primary-200">
                    {tx.integer}
                    {tx.decimal}
                    <span className="text-sm text-primary-300">
                      {tx.prefix}
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
