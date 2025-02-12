import Greetings from "@/components/Greetings";
import { AccountBalanceChart } from "@/components/Charts";
import { getDictionary } from "@/lib/dictionaries";
import { getBalancePerAccount, getTransactions } from "@/lib/db";
import { Dict } from "@/lib/types";
import { TransactionTable } from "./components/TransactionTable";
import { CreateTransaction } from "./components/buttons";

export default async function Home({ params }: { params: any }) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dict;
  const transactions = await getTransactions();
  const accountBalances = await getBalancePerAccount();

  return (
    <main className="flex flex-col gap-2 justify-start items-center size-full">
      <Greetings locale={locale} dict={dict.greetings} />
      <div className="bg-primary-50 h-[380px] mt-6 w-full rounded-2xl pb-2 px-6 flex flex-col justify-end">
        <AccountBalanceChart data={accountBalances} />
        <div className="flex flex-row justify-end">
          <CreateTransaction />
        </div>
        <TransactionTable dict={dict} transactions={transactions} limit={5} />
      </div>
    </main>
  );
}
