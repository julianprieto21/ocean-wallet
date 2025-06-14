import Greetings from "@/components/Greetings";
import { getGrowPercentage } from "@/lib/utils";
// import { DailyBalanceChart } from "@/components/Charts";
import { AccountBalanceChart } from "@/components/Charts";
import { getDictionary } from "@/lib/dictionaries";
import {
  getBalancePerAccount,
  getBalances,
  getDailyBalances,
  getTransactions,
} from "@/lib/db";
import { Dict } from "@/lib/types";
import { TransactionTable } from "./components/TransactionTable";
import {
  // CreateQuota,
  CreateTransaction,
  CreateTransfer,
  TransactionTypeSwitcher,
} from "./components/Buttons";
import { Card } from "./components/Card";
import { BalanceWidget } from "./components/widgets";
import { Locale } from "@/i18n/routing";
import { ToolsBar } from "./components/ToolsBar";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dict;
  const transactions = await getTransactions();
  const balances = await getBalances();
  const accountBalances = await getBalancePerAccount();
  const dailyBalances = await getDailyBalances();
  const growPercentage = getGrowPercentage(dailyBalances.map((d) => d.balance));
  return (
    <main className="flex flex-col gap-2 justify-start items-center size-full">
      <Greetings locale={locale} dict={dict.greetings} />
      <Card className="flex flex-col justify-between h-fit md:h-[380px]">
        <div className="flex flex-col w-full flex-shrink-0 px-4">
          <BalanceWidget
            title={dict.balance}
            balance={balances.balance}
            growPercentage={growPercentage}
            locale={locale}
            size="large"
          />
        </div>
        {/* <DailyBalanceChart dailyBalances={dailyBalances} /> */}
        <div className="flex flex-row justify-between items-start w-full gap-8 flex-shrink-0 px-4">
          <BalanceWidget
            title={dict.incomes}
            balance={balances.income}
            locale={locale}
            color="text-primary-green"
          />
          <BalanceWidget
            title={dict.expenses}
            balance={balances.expense}
            locale={locale}
            color="text-primary-red"
          />
        </div>
      </Card>
      <Card className="mt-6 hidden md:flex flex-col justify-start h-[380px]">
        <AccountBalanceChart data={accountBalances} />
        <div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <TransactionTypeSwitcher />
            </div>
            <div className="flex flex-row justify-end gap-1">
              <CreateTransaction />
              <CreateTransfer />
              {/* <CreateQuota /> */}
            </div>
          </div>
          <TransactionTable dict={dict} transactions={transactions} limit={6} />
        </div>
      </Card>
      <ToolsBar dict={dict} />
    </main>
  );
}
