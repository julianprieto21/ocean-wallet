"use client";
import { createTransaction } from "@/lib/actions";
import { useModalStore } from "@/lib/store/useModal";
import { Dict } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./Buttons";
import { Select, NumberInput, TextInput, Group, Radio } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useUserStore } from "@/lib/store/userStore";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currencies";

export function TransactionForm({ dict }: { dict: Dict }) {
  const { preferenceCurrency } = useUserStore((state) => state);
  const { modalOpen, setModalOpen } = useModalStore((state) => state);
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

  useEffect(() => {
    form.setFieldValue("created_at", new Date());
  }, [modalOpen, form]);

  async function HandleSubmit(formData: FormData) {
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

  return (
    <form
      className="flex flex-col gap-2 mt-4"
      action={HandleSubmit}
      onSubmit={form.reset}
    >
      <Select
        name="account_id"
        label={dict.accounts.account}
        placeholder={dict.accounts.account}
        data={[
          { value: "50caeb31-2865-4172-a810-15046fcfe04e", label: "Test" },
        ]}
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
        data={CURRENCIES}
        checkIconPosition="right"
        {...form.getInputProps("currency_id")}
        required
        searchable
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
        main={`${dict.form.create} ${dict.transactions.transaction}`}
        loading={`${dict.form.pending}`}
      />
    </form>
  );
}
