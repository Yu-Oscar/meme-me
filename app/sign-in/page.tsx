import Link from "next/link";
import CardCompact from "@/components/card-compact";
import { passwordForgotPath, signUpPath } from "@/utils/path";
import SignInForm from "@/features/auth/components/SignInForm";

export default function SignInPage() {
  const footer = (
    <div className="flex items-center w-full justify-between">
      <Link className="text-sm text-muted-foreground" href={signUpPath()}>
        No account yet?
      </Link>
      <Link
        className="text-sm text-muted-foreground"
        href={passwordForgotPath()}
      >
        Forgot Password?
      </Link>
    </div>
  );

  return (
    <div className="flex-1 flex justify-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        content={<SignInForm />}
        className="max-w-[520px] w-[520px] self-center"
        footer={footer}
      />
    </div>
  );
}
