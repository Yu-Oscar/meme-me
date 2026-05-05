'use client';
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplateSeachInput() {
  const [value, setValue] = useState("");
  const router = useRouter();

  return (
    <Input
      type="text"
      placeholder="搜尋主題"
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          router.push(`/search?search=${value}`);
        }
      }}
      className="w-full max-w-md"
    />
  );
}