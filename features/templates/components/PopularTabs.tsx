"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { popularSortOptions, popularSortParser } from "@/features/templates/search-params";
import { useQueryStates } from "nuqs";

const PopularSort = [
    { value: "views_last_24h", label: "本日" },
    { value: "views_last_7d", label: "本週" },
    { value: "views_last_30d", label: "本月" },
    { value: "view_count", label: "全部時間" },
  ] as const; 

export default function PopularTabs() {
  const [{ sort }, setSort] = useQueryStates(popularSortParser, popularSortOptions);

  return (
    <Tabs
      value={sort}
      onValueChange={(value) => setSort({ sort: value })}
      className="w-full mb-4"
    >
      <TabsList variant="line" >
        {PopularSort.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="text-lg p-4 ">
                {item.label}
            </TabsTrigger>
        ))} 
      </TabsList>
    </Tabs>
  );
}
