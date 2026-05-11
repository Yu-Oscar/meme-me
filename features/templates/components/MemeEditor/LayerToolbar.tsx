"use client";

import { Button } from "@/components/ui/button";
import {
  LucideCopy,
  LucideMoveDown,
  LucideMoveUp,
  LucidePlus,
  LucideRotateCcw,
  LucideTrash2,
} from "lucide-react";

type Props = {
  hasSelection: boolean;
  onAdd: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReset: () => void;
};

export default function LayerToolbar({
  hasSelection,
  onAdd,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          size="sm"
          variant="default"
          onClick={onAdd}
          aria-label="新增文字"
        >
          <LucidePlus aria-hidden /> 新增文字
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onDuplicate}
          disabled={!hasSelection}
          aria-label="複製"
        >
          <LucideCopy aria-hidden /> 複製文字
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onDelete}
          disabled={!hasSelection}
          aria-label="刪除"
        >
          <LucideTrash2 aria-hidden /> 刪除
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          onClick={onMoveUp}
          disabled={!hasSelection}
          aria-label="上移"
        >
          <LucideMoveUp aria-hidden /> 上移
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onMoveDown}
          disabled={!hasSelection}
          aria-label="下移"
        >
          <LucideMoveDown aria-hidden /> 下移
        </Button>
        <Button size="sm" variant="ghost" onClick={onReset} aria-label="重設">
          <LucideRotateCcw aria-hidden /> 重設
        </Button>
      </div>
    </div>
  );
}
