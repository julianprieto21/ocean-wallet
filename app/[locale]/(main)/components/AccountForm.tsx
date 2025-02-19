"use client";
import { createAccount } from "@/lib/actions";
import { useModalStore } from "@/lib/store/useModal";
import { Dict } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./Buttons";
import { Select, NumberInput, TextInput, Radio, Group } from "@mantine/core";
import { useUserStore } from "@/lib/store/userStore";
import { useForm } from "@mantine/form";
import { PROVIDERS } from "@/lib/providers";
import { CURRENCIES } from "@/lib/currencies";

export function AccountForm({ dict }: { dict: Dict }) {
  const { preferenceCurrency } = useUserStore((state) => state);
  const { setModalOpen } = useModalStore((state) => state);
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

  async function HandleSubmit(formData: FormData) {
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
  return (
    <form
      className="flex flex-col gap-2 mt-4"
      action={HandleSubmit}
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
        disabled={form.values.type == "investment"}
      />
      <Select
        name="currency_id"
        label={dict.common_fields.currency}
        placeholder={dict.common_fields.currency}
        data={CURRENCIES.filter((curr) => curr.type == "fiat")}
        defaultValue={preferenceCurrency}
        checkIconPosition="right"
        {...form.getInputProps("currency_id")}
        required
        disabled={form.values.type == "investment"}
        searchable
      />
      <SubmitButton
        main={`${dict.form.create} ${dict.accounts.account}`}
        loading={`${dict.form.pending}`}
      />
    </form>
  );
}
