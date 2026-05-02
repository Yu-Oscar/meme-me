import Image from "next/image";
import Link from "next/link";
import { HomePath } from "@/utils/path";
export default function Navbar() {
  return (
    <div className="h-20 flex items-center justify-between px-30 bg-background/50">
      <Link href={HomePath()}>
        <Image src="/logo.png" alt="logo" width={100} height={100} className="h-12 w-auto" />
      </Link>
    </div>
  );
}
