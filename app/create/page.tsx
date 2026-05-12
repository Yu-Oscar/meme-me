import type { Metadata } from "next";
import CreateFromUpload from "@/features/templates/components/CreateFromUpload";

export const metadata: Metadata = {
  title: "上傳製作 Meme - MemeMe",
  description: "上傳圖片或 MP4，在瀏覽器製作 meme",
};

export default function CreatePage() {
  return <CreateFromUpload />;
}