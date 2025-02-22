"use client";
import {
  createAccount,
  createTransaction,
  updateUserData,
  signOut,
} from "@/lib/actions";
import { useModalStore } from "@/lib/store/useModal";
import { Account, Dict } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./Buttons";
import { Select, NumberInput, TextInput, Radio, Group } from "@mantine/core";
import { useUserStore } from "@/lib/store/userStore";
import { useForm } from "@mantine/form";
import { PROVIDERS } from "@/lib/providers";
import { CURRENCIES } from "@/lib/currencies";
import { DateTimePicker } from "@mantine/dates";
import { CATEGORIES } from "@/lib/categories";
import { useEffect, useState } from "react";

type FormProps = {
  dict: Dict;
  accounts: Account[];
};
export function AccountForm({ dict }: FormProps) {
  const { preferenceCurrency } = useUserStore((state) => state);
  const { setModalOpen } = useModalStore((state) => state);
  const [accountCurrType, setAccountCurrType] = useState<string | undefined>();
  const router = useRouter();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      type: "transactional",
      provider: null,
      initial: "",
      currency_id: preferenceCurrency,
    },
  });

  async function handleSubmit(formData: FormData) {
    try {
      await createAccount(formData);
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    }
  }

  useEffect(() => {
    const type = form.values.type;
    const currType = type == "investment" ? "crypto" : "fiat";
    setAccountCurrType(currType);
    if (currType == "crypto") {
      form.setFieldValue("currency_id", "btc");
    } else {
      form.setFieldValue("currency_id", preferenceCurrency);
    }
  }, [form.values.type]);

  return (
    <form
      className="flex flex-col gap-2 mt-4"
      action={handleSubmit}
      onSubmit={form.reset}
    >
      <TextInput
        name="name"
        label={dict.common_fields.name}
        placeholder={dict.common_fields.name}
        {...form.getInputProps("name")}
        required
      />
      <Radio.Group
        name="type"
        label={dict.common_fields.type}
        {...form.getInputProps("type")}
        required
      >
        <Group>
          <Radio value="transactional" label={dict.accounts.transactional} />
          <Radio value="investment" label={dict.accounts.investment} />
        </Group>
      </Radio.Group>
      <Select
        name="provider"
        label={dict.accounts.provider}
        data={PROVIDERS.filter(
          (provider) => provider.type == form.getValues().type
        )}
        placeholder={dict.accounts.provider}
        checkIconPosition="right"
        {...form.getInputProps("provider")}
        searchable
        required
      />
      <NumberInput
        name="initial"
        label={dict.accounts.initial}
        min={0}
        prefix="$"
        thousandSeparator=","
        {...form.getInputProps("initial")}
        required
        placeholder={dict.accounts.initial}
      />
      <Select
        name="currency_id"
        label={dict.common_fields.currency}
        placeholder={dict.common_fields.currency}
        data={CURRENCIES.filter((curr) => curr.type == accountCurrType)}
        defaultValue={preferenceCurrency}
        checkIconPosition="right"
        {...form.getInputProps("currency_id")}
        required
        // searchable
      />
      <SubmitButton
        main={`${dict.modalMessages.create_account.button}`}
        loading={`${dict.form.pending}`}
      />
    </form>
  );
}

export function TransactionForm({ dict, accounts }: FormProps) {
  const { preferenceCurrency } = useUserStore((state) => state);
  const { modalOpen, setModalOpen } = useModalStore((state) => state);
  const [accountCurrType, setAccountCurrType] = useState<string | undefined>();
  const router = useRouter();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      account_id: null,
      type: "income",
      description: "",
      category: null,
      subcategory: null,
      created_at: new Date(),
      amount: "",
      currency_id: preferenceCurrency,
      transfer_id: "",
      quota_id: "",
    },
  });

  async function handleSubmit(formData: FormData) {
    try {
      await createTransaction(formData);
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
      form.reset();
    }
  }

  useEffect(() => {
    form.setFieldValue("created_at", new Date());
  }, [modalOpen]);

  useEffect(() => {
    const account_id = form.values.account_id;
    const account = accounts.find((acc) => acc.account_id == account_id);
    if (account) {
      const currType = account.type == "investment" ? "crypto" : "fiat";
      setAccountCurrType(currType);
      if (currType == "crypto") {
        form.setFieldValue("currency_id", "btc");
      } else {
        form.setFieldValue("currency_id", preferenceCurrency);
      }
    }
  }, [form.values.account_id, accounts, preferenceCurrency]);

  return (
    <form
      className="flex flex-col gap-2 mt-4"
      action={handleSubmit}
      onSubmit={form.reset}
    >
      <Select
        name="account_id"
        label={dict.accounts.account}
        placeholder={dict.accounts.account}
        checkIconPosition="right"
        data={accounts.map((acc) => ({
          value: acc.account_id,
          label: acc.name,
        }))}
        {...form.getInputProps("account_id")}
        required
      />
      <Radio.Group
        name="type"
        label={dict.common_fields.type}
        {...form.getInputProps("type")}
        required
      >
        <Group>
          <Radio
            value="income"
            color="var(--primary-green)"
            label={dict.transactions.income}
          />
          <Radio
            value="expense"
            color="var(--primary-red)"
            label={dict.transactions.expense}
          />
        </Group>
      </Radio.Group>
      <TextInput
        name="description"
        label={dict.transactions.description}
        placeholder={dict.transactions.description}
        {...form.getInputProps("description")}
        required
      />
      <Select
        name="category"
        label={dict.transactions.category}
        data={CATEGORIES.map((category) => ({
          value: category.id,
          label: dict.categories[category.id as keyof typeof dict.categories],
        }))}
        placeholder={dict.transactions.category}
        checkIconPosition="right"
        {...form.getInputProps("category")}
        required
        searchable
      />
      <Select
        name="subcategory"
        label={dict.transactions.subcategory}
        data={[{ value: "test", label: "Test" }]}
        placeholder={dict.transactions.subcategory}
        checkIconPosition="right"
        {...form.getInputProps("subcategory")}
        searchable
        disabled
      />
      <DateTimePicker
        name="created_at"
        label={dict.common_fields.created_at}
        {...form.getInputProps("created_at")}
        required
        placeholder={dict.common_fields.created_at}
      />
      <NumberInput
        name="amount"
        label={dict.common_fields.amount}
        min={0}
        prefix="$"
        thousandSeparator=","
        placeholder={dict.common_fields.amount}
        {...form.getInputProps("amount")}
        required
      />
      <Select
        name="currency_id"
        label={dict.common_fields.currency}
        placeholder={dict.common_fields.currency}
        data={CURRENCIES.filter(
          (curr) => !accountCurrType || curr.type == accountCurrType
        )}
        checkIconPosition="right"
        {...form.getInputProps("currency_id")}
        required
        // searchable
      />
      <input
        title="transfer_id"
        type="text"
        name="transfer_id"
        className="hidden"
        {...form.getInputProps("transfer_id")}
      />
      <input
        title="quota_id"
        type="text"
        name="quota_id"
        className="hidden"
        {...form.getInputProps("quota_id")}
      />
      <SubmitButton
        main={`${dict.modalMessages.create_transactions.button}`}
        loading={`${dict.form.pending}`}
      />
    </form>
  );
}

export function UserForm({ dict }: { dict: FormProps["dict"] }) {
  const router = useRouter();
  const { setModalOpen } = useModalStore((state) => state);
  const { preferenceCurrency, setPreferenceCurrency, email, username, image } =
    useUserStore((state) => state);

  async function handleSubmit(formData: FormData) {
    try {
      await updateUserData(formData);
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    }
    setPreferenceCurrency(formData.get("preference_currency") as string);
  }
  return (
    <form className="flex flex-col gap-4 w-full" action={handleSubmit}>
      <TextInput
        name="username"
        defaultValue={username}
        label={dict.users.username}
        placeholder={dict.users.username}
        // required
        disabled
      />
      <TextInput
        name="email"
        defaultValue={email}
        label={dict.users.email}
        placeholder={dict.users.email}
        // required
        disabled
      />
      {/* <TextInput
        name="image_url"
        label={dict.common_fields.image_url}
        placeholder={dict.common_fields.image_url}
        defaultValue={image}
        required
      /> */}
      <input
        name="image_url"
        title="image_url"
        type="text"
        defaultValue={image}
        className="hidden"
      ></input>
      <Select
        name="preference_currency"
        label={dict.users.preference_currency}
        placeholder={dict.users.preference_currency}
        defaultValue={preferenceCurrency}
        data={CURRENCIES.filter((curr) => curr.type == "fiat")}
        checkIconPosition="right"
        required
      />
      <SubmitButton
        main={`${dict.modalMessages.menu.button}`}
        loading={`${dict.form.pending}`}
      />
    </form>
  );
}
export function SignOutForm() {
  return (
    <form className="flex flex-col gap-4 w-full" action={signOut}>
      <SubmitButton main="Sign Out" loading="Signing Out" />
    </form>
  );
}
