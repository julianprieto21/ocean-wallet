import { User } from "lucide-react";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";
import { AccountDetails } from "./AccountsDetails";
import { CreateAccount } from "./buttons";
import QuotaDetails from "./QuotaDetails";
import { auth } from "@/auth";
import { getDictionary } from "@/lib/dictionaries";
import {
  getWalletAccountDetails,
  getInvestmentAccountDetails,
  getQuotaDetails,
} from "@/lib/db";
import type { Locale } from "@/i18n/routing";

export default async function Sidebar({ locale }: { locale: Locale }) {
  const session = await auth();
  const dict = await getDictionary(locale);
  const walletAccounts = await getWalletAccountDetails();
  const cryptoAccounts = await getInvestmentAccountDetails();
  const quotas = await getQuotaDetails();

  const image = session?.user.image;
  return (
    <div className="w-[35%] flex-shrink-0 flex flex-col h-full gap-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-6xl text-primary-500 pl-4">OCEAN</h1>
        <div className="rounded-full bg-primary-50 size-12 grid place-content-center text-primary-300 hover:text-primary-400">
          {image ? (
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocL5BpUK7g2Z5kLC7Yqguxe2L8Esu1Foa1IK1dqgyVcyd2OwVXs=s96-c"
              alt=""
              className="rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="size-7" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-4">
        <SearchBar placeholder={dict.navigation.search} />
        <div className="bg-background w-full">
          <NavLinks dict={dict.navigation} />
        </div>
      </div>
      <div className="flex h-full overflow-auto flex-col mt-6">
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-3xl pl-4 pt-2 text-primary-300">
            {dict.navigation.details}
          </h2>
          <CreateAccount dict={dict.actions} />
          <AccountDetails
            type="wallet"
            details={walletAccounts}
            dict={dict.accounts}
          />
          <AccountDetails
            type="crypto"
            details={cryptoAccounts}
            dict={dict.accounts}
          />
        </div>
        <span className="border-t border-primary-300 border-dashed mx-4 my-2"></span>
        <QuotaDetails dict={dict.quotas} details={quotas} />
      </div>
    </div>
  );
}
