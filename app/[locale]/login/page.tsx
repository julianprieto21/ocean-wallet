import { signIn } from "@/auth";

export default async function SignIn() {
  return (
    <div className="grid place-content-center size-full">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Sign in with Google</button>
      </form>
    </div>
  );
}
