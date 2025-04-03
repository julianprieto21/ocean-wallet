import { Locale } from "@/i18n/routing";
import { getTransactions } from "@/lib/db";
import { getDictionary } from "@/lib/dictionaries";
import { Dict } from "@/lib/types";
import { TransactionTable } from "../components/TransactionTable";
import { Card } from "../components/Card";

export default async function Transactions({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dict;
  const transactions = await getTransactions();
  return (
    <Card className="mt-10 hidden md:flex flex-col justify-evenly p-6 overflow-auto">
      {transactions && (
        <TransactionTable dict={dict} transactions={transactions} />
      )}
    </Card>
  );
}
