import Image from "next/image";
import Link from "next/link";
import { HomePath, PopularTemplatesPath, NewestTemplatesPath, TagPath, signUpPath, signInPath, createPath } from "@/utils/path";
import TemplateSeachInput from "@/features/templates/components/TemplateSeachInput";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions/sign-out";
import { Form } from "lucide-react";
import { SubmitButton } from "./form/SubmitButton";
import { getAuth } from "@/features/auth/queries/get-auth";
import AccountDropdown from "./AccountDropdown";

export default async function Navbar() {
  const { session, user } = await getAuth();
  const NavItems = [
    {
      label: "熱門",
      href: PopularTemplatesPath(),
    },
    {
      label: "最新",
      href: NewestTemplatesPath(),
    },
    {
      label: "標籤",
      href: TagPath(),
    },
  ];

  const AuthItems = user ? (
    <>
      <AccountDropdown
        user={user}
      />
    </>
  ) : (
    <>
      <Button asChild variant={"secondary"}>
        <Link href={signUpPath()}>Sign Up</Link>
      </Button>
      <Button asChild variant={"default"}>
        <Link href={signInPath()}>Sign In</Link>
      </Button>
    </>
  );

  return (
    <div className="h-20 flex items-center justify-between px-30 bg-background/50">
      <div className="flex items-center gap-4">
        <Link href={HomePath()}>
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="h-12 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          {NavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Button asChild variant={"default"} size={"sm"}>
            <Link href={createPath()}>自製 meme</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <TemplateSeachInput />
        {AuthItems}
      </div>
    </div>
  );
}
