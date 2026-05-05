'use client';
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { searchParser } from "@/features/templates/search-params";
import { useEffect, useState } from "react";

export default function TemplateSeachInput() {
  const [search , setSearch] = useQueryState("search", searchParser);
  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);



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
          setSearch(value);
        }
      }}
      className="w-full max-w-md"
    />
  );
}