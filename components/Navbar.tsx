import Image from "next/image";
import Link from "next/link";
import { HomePath, PopularTemplatesPath, NewestTemplatesPath, TagPath } from "@/utils/path";
import TemplateSeachInput from "@/features/templates/components/TemplateSeachInput";

export default function Navbar() {
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
        <Link
            href={PopularTemplatesPath()}
            className="text-zinc-300 hover:text-zinc-100 font-medium transition-colors hidden md:block lg:ml-4"
        >
            熱門
        </Link>
        <Link
            href={NewestTemplatesPath()}
            className="text-zinc-300 hover:text-zinc-100 font-medium transition-colors hidden md:block"
        >
            最新
        </Link>
        <Link
            href={TagPath()}
            className="text-zinc-300 hover:text-zinc-100 font-medium transition-colors hidden md:block"
        >
            標籤
        </Link>
      </div>
      <TemplateSeachInput />
    </div>
  );
}
