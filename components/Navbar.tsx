import Image from "next/image";

export default function Navbar() {
  return (
    <div className="h-20 flex items-center justify-between px-8 bg-background">
      <Image src="/logo.png" alt="logo" width={100} height={100} className="h-14 w-auto" />
    </div>
  );
}
