import Link from "next/link";
import CardCompact from "@/components/card-compact";
import { signInPath } from "@/utils/path";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex-1 flex justify-center">
      <CardCompact
        title="Sign Up"
        description="create a new account"
        content={<SignUpForm />}
        className="max-w-[520px] w-[520px] self-center"
        footer={
          <Link href={signInPath()} className="text-sm text-muted-foreground">
            Have a account? Sign In
          </Link>
        }
      />
    </div>
  );
}
