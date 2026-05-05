"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { popularSortOptions, popularSortParser } from "@/features/templates/search-params";
import { useQueryStates } from "nuqs";

export type sortOptionsType = { value: string; label: string }[];

export type TemplateTabsProps = {
  sortOptions: sortOptionsType;
}

export default function TemplateTabs({ sortOptions }: TemplateTabsProps) {
  const [{ sort }, setSort] = useQueryStates(popularSortParser, popularSortOptions);

  return (
    <Tabs
      value={sort}
      onValueChange={(value) => setSort({ sort: value })}
      className="w-full mb-4"
    >
      <TabsList variant="line" >
        {sortOptions.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="text-lg p-4 ">
                {item.label}
            </TabsTrigger>
        ))} 
      </TabsList>
    </Tabs>
  );
}
