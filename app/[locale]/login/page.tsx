import { signIn } from "@/auth";
import { Locale } from "@/i18n/routing";
import { getDictionary } from "@/lib/dictionaries";
import { Dict } from "@/lib/types";
import { Card } from "@/components/Card";

const LoginButton = async ({
  provider,
  text,
  className,
}: {
  provider: string;
  text: string;
  className?: string;
}) => (
  <form
    action={async () => {
      "use server";
      await signIn(provider);
    }}
  >
    <button
      type="submit"
      className={`flex justify-start items-center gap-4 w-full rounded-lg bg-primary-50 p-2 px-10 text-primary-300 hover:bg-primary-100 hover:text-primary-400 transition-colors ${className}`}
    >
      <img
        src={`/icons/loginProviders/${provider}.svg`}
        alt=""
        className="size-8 rounded-full"
      />
      {text}
    </button>
  </form>
);

export default async function SignIn({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dict;
  return (
    <div className="grid place-content-center size-full">
      <Card className="w-full max-w-md p-6 relative h-fit py-4">
        <div className="flex flex-col gap-2 my-4">
          <h1 className="text-xl font-semibold text-primary-400 text-left">
            {dict.login.title}
          </h1>
          <p className="text-md text-primary-300 text-left w-60">
            {dict.login.subtitle}
          </p>
          <div className="flex flex-col gap-4 w-full mt-8">
            <LoginButton provider="google" text={dict.login.google} />
            <LoginButton
              provider="github"
              text={dict.login.github}
              className="pointer-events-none opacity-50"
            />
          </div>
          {/* <div className="border-t border-primary-250 w-full my-1"></div>
              <SubmitButton main="Sign In" loading="Signing In..." /> */}
        </div>
      </Card>
    </div>
  );
}
